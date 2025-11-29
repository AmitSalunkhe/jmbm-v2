import SunCalc from 'suncalc';

/**
 * Calculate Tithi based on Moon phase
 * Tithi is the lunar day in Hindu calendar (1-30)
 * @param {Date} date - The date for which to calculate Tithi
 * @param {Object} location - Location coordinates {latitude, longitude}
 * @returns {Promise<{tithi: string, success: boolean}>}
 */
export const getTithi = async (date = new Date(), location = { latitude: 19.2056, longitude: 72.8347 }) => {
    try {
        // Get moon illumination data
        const moonData = SunCalc.getMoonIllumination(date);

        // Moon phase ranges from 0 to 1 (0 = New Moon, 0.5 = Full Moon, 1 = New Moon again)
        const phase = moonData.phase;

        // Calculate Tithi number (1-30)
        // Each Tithi is 12 degrees of Moon's elongation from Sun
        // 30 Tithis in a lunar month
        const tithiNumber = Math.floor(phase * 30) + 1;

        // Determine Paksha (Shukla or Krishna)
        const isShukla = phase < 0.5;
        const paksha = isShukla ? 'शुद्ध' : 'कृष्ण';

        // Get Tithi name
        const tithiName = getTithiName(tithiNumber, isShukla);

        // Get current Hindu month (approximate based on Gregorian month)
        const monthMarathi = getApproximateHinduMonth(date);

        const tithiMarathi = `${monthMarathi} ${paksha} ${tithiName}`;

        return {
            success: true,
            tithi: tithiMarathi,
            rawData: { phase, tithiNumber, paksha, month: monthMarathi }
        };

    } catch (error) {
        console.error('Error calculating Tithi:', error);
        return {
            success: false,
            tithi: null,
            error: error.message
        };
    }
};

/**
 * Get Tithi name in Marathi from Tithi number
 */
const getTithiName = (tithiNumber, isShukla) => {
    const tithiNames = [
        'प्रतिपदा',    // 1
        'द्वितीया',    // 2
        'तृतीया',      // 3
        'चतुर्थी',     // 4
        'पंचमी',       // 5
        'षष्ठी',       // 6
        'सप्तमी',      // 7
        'अष्टमी',      // 8
        'नवमी',        // 9
        'दशमी',        // 10
        'एकादशी',      // 11
        'द्वादशी',     // 12
        'त्रयोदशी',    // 13
        'चतुर्दशी',    // 14
        'पौर्णिमा'     // 15 (Shukla Paksha)
    ];

    // For Shukla Paksha: Tithi 1-15
    // For Krishna Paksha: Tithi 16-30 (but we show as 1-15 with Krishna label)
    const index = isShukla ? tithiNumber - 1 : tithiNumber - 16;

    // Special case for 15th tithi
    if (index === 14) {
        return isShukla ? 'पौर्णिमा' : 'अमावस्या';
    }

    return tithiNames[index] || tithiNames[0];
};

/**
 * Get approximate Hindu month based on Gregorian date
 * This is a simplified mapping
 */
const getApproximateHinduMonth = (date) => {
    const month = date.getMonth(); // 0-11
    const day = date.getDate();

    // Approximate Hindu month mapping
    // Each Hindu month roughly starts mid-Gregorian month
    const monthMap = [
        { start: { month: 0, day: 14 }, name: 'माघ' },        // Jan 14 - Feb 13
        { start: { month: 1, day: 13 }, name: 'फाल्गुन' },    // Feb 13 - Mar 14
        { start: { month: 2, day: 14 }, name: 'चैत्र' },      // Mar 14 - Apr 13
        { start: { month: 3, day: 13 }, name: 'वैशाख' },      // Apr 13 - May 14
        { start: { month: 4, day: 14 }, name: 'ज्येष्ठ' },    // May 14 - Jun 14
        { start: { month: 5, day: 14 }, name: 'आषाढ' },       // Jun 14 - Jul 15
        { start: { month: 6, day: 15 }, name: 'श्रावण' },     // Jul 15 - Aug 15
        { start: { month: 7, day: 15 }, name: 'भाद्रपद' },    // Aug 15 - Sep 15
        { start: { month: 8, day: 15 }, name: 'आश्विन' },     // Sep 15 - Oct 15
        { start: { month: 9, day: 15 }, name: 'कार्तिक' },    // Oct 15 - Nov 14
        { start: { month: 10, day: 14 }, name: 'मार्गशीर्ष' }, // Nov 14 - Dec 14
        { start: { month: 11, day: 14 }, name: 'पौष' }        // Dec 14 - Jan 14
    ];

    // Find the appropriate month
    for (let i = 0; i < monthMap.length; i++) {
        const current = monthMap[i];
        const next = monthMap[(i + 1) % monthMap.length];

        if (month === current.start.month && day >= current.start.day) {
            return current.name;
        }
        if (month === next.start.month && day < next.start.day) {
            return current.name;
        }
    }

    return 'मार्गशीर्ष'; // Default
};

/**
 * Get current Hindu month in Marathi
 */
export const getHinduMonth = async (date = new Date()) => {
    return getApproximateHinduMonth(date);
};
