const getIRESSSessionKey = require('./sessionkey');

//Define an async function for retrieving the session key
const SessionKey = async () => {
    return await getIRESSSessionKey();
};

module.exports = {
    SOAP_URL: 'https://webservicestest.iress.com.sg/v4/soap.aspx',
    session_key: SessionKey,
    EXCHANGE: {
        SGX: 'SGX',
        HKE: 'HKE',
        KLS: 'KLS',
        IDX: 'IDX',
        AME: 'AME',
        NAS: 'NAS',
        NYS: 'NYS',
        ASX: 'ASX',
        SHG: 'SHG',
        SHE: 'SHE',
        BKK: 'BKK'
    },
    MARKET_FILTER: {
        TOP: 'TOP',
        MID: 'MID',
        BOT: 'BOT'
    },
    SORT_TYPE: {
        // POPULARITY: 'VOLUME',
        VOLUME: 'VOLUME',
        POINTS_UP: 'POINTS_UP',
        PERCENT_UP: 'PERCENT_UP',
        POINTS_DOWN: 'POINTS_DOWN',
        PERCENT_DOWN: 'PERCENT_DOWN'
    }
};
