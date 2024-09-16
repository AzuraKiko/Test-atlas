const sessionKey = require('../global/sessionkey');

module.exports = {
    SOAP_URL: 'https://webservicestest.iress.com.sg/v4/soap.aspx',
    session_key: sessionKey,
    EXCHANGE: {
        SGX: 'SGX',
        // HKE: 'HKE',
        // KLS: 'KLS',
        // IDX: 'IDX',
        // AME: 'AME',
        // NAS: 'NAS',
        // NYS: 'NYS',
        // ASX: 'ASX',
        // SHG: 'SHG',
        // SHE: 'SHE',
        // BKK: 'BKK'
    },
    MARKET_FILTER: {
        TOP: 'TOP',
        MID: 'MID',
        BOT: 'BOT'
    },
    MARKET_FILTER1: {
        BIG_CAP: 'BIG_CAP',
        MID_CAP: 'MID_CAP',
        SMALL_CAP: 'SMALL_CAP'
    },
    SORT_TYPE: {
        POPULARITY: 'VOLUME',
        // VOLUME: 'VOLUME',
        // POINTS_UP: 'POINTS_UP',
        // PERCENT_UP: 'PERCENT_UP',
        // POINTS_DOWN: 'POINTS_DOWN',
        // PERCENT_DOWN: 'PERCENT_DOWN'
    },
    ASSET_CLASS: {
        EQUITIES: 'EQUITIES',
        INDICES: 'INDICES',
        FX: 'FX',
        CRYPTO: 'CRYPTO'
    }
};
