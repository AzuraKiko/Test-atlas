const sessionKey = require('../global/sessionkey');
// console.log(sessionKey)

module.exports = {
    SOAP_URL: 'https://webservicestest.iress.com.sg/v4/soap.aspx',
    session_key: sessionKey,
    EXCHANGE: {
        // SGX: 'SGX',
        // HKE: 'HKE',
        // KLS: 'KLS',
        // IDX: 'IDX',
        // AME: 'AME',
        NAS: 'NAS',
        // NYS: 'NYS',
        // ASX: 'ASX',
        // SHG: 'SHG',
        // SHE: 'SHE',
        // BKK: 'BKK'
    },
    MARKET_FILTER: {
        // BOARD_LOT_SGX: '/SGXEQ',
        // // ODD_LOT: '/SGXEQ|U',
        // // BUY_IN: '/SGXBUYIN',
        // ETF_SGX: '/SGXETF',
        // // ADR: '/SGXADR',
        // SIP_SGX: '/SGXSIP',
        // CPF: '/SGXCPF',
        // SHARIAH_SGX: '/SGXSHARIAH',

        // BOARD_LOT_HKE: '/HKEEQ',
        // ETF_HKE: '/HKEETF',
        // SIP_HKE: '/HKESIP',
        // SHARIAH_HKE: '/HKESHARIAH',

        // BOARD_LOT_KLS: '/KLSEQ',
        // ETF_KLS: '/KLSETF',
        // SIP_KLS: '/KLSSIP',
        // SHARIAH_KLS: '/KLSSHARIAH',

        // BOARD_LOT_IDX: '/IDXEQ',
        // ETF_IDX: '/IDXETF',
        // SIP_IDX: '/IDXSIP',
        // SHARIAH_IDX: '/IDXSHARIAH',

        // BOARD_LOT_AME: '/AMEEQ',
        // ETF_AME: '/AMEETF',
        // SIP_AME: '/AMESIP',
        // SHARIAH_AME: '/AMESHARIAH',

        BOARD_LOT_NAS: '/NASEQ',
        ETF_NAS: '/NASETF',
        SIP_NAS: '/NASSIP',
        SHARIAH_NAS: '/NASSHARIAH',

        // BOARD_LOT_NYS: '/NYSEQ',
        // ETF_NYS: '/NYSETF',
        // SIP_NYS: '/NYSSIP',
        // SHARIAH_NYS: '/NYSSHARIAH',


        // BOARD_LOT_ASX: '/ASXEQ',
        // ETF_ASX: '/ASXETF',
        // SIP_ASX: '/ASXSIP',
        // SHARIAH_ASX: '/ASXSHARIAH',

        // BOARD_LOT_SHG: '/SHGEQ',
        // ETF_SHG: '/SHGETF',
        // SIP_SHG: '/SHGSIP',

        // BOARD_LOT_SHE: '/SHEEQ',
        // ETF_SHE: '/SHEETF',
        // SIP_SHE: '/SHESIP',

        // BOARD_LOT_BKK: '/BKKEQ',
        // ETF_BKK: '/BKKETF',
        // SIP_BKK: '/BKKSIP',
        // SHARIAH_BKK: '/BKKSHARIAH',

    },
    MARKET_FILTER1: {
        SGX: {
            BOARD_LOT: 'BOARD_LOT',
            ODD_LOT: 'ODD_LOT',
            BUY_IN: 'BUY_IN',
            ETF: 'ETF',
            ADR: 'ADR',
            SIP: 'SIP',
            CPF: 'CPF',
            SHARIAH: 'SHARIAH'
        },
        OTHER_EXCHANGES: {
            BOARD_LOT: 'BOARD_LOT',
            ETF: 'ETF',
            SIP: 'SIP',
            SHARIAH: 'SHARIAH'
        }
    },
    SORT_TYPE: {
        // POPULARITY: 'VOLUME',
        VOLUME: 'VOLUME',
        POINTS_UP: 'POINTS_UP',
        PERCENT_UP: 'PERCENT_UP',
        POINTS_DOWN: 'POINTS_DOWN',
        PERCENT_DOWN: 'PERCENT_DOWN'
    },
    ASSET_CLASS: {
        EQUITIES: 'EQUITIES',
        INDICES: 'INDICES',
        FX: 'FX',
        CRYPTO: 'CRYPTO'
    }
};
