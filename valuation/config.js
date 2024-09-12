const getIRESSSessionKey = require('./sessionkey');

module.exports = {
    SOAP_URL: 'https://webservicestest.iress.com.sg/v4/soap.aspx',
    session_key: async () => await getIRESSSessionKey(),  // Gọi hàm async để lấy session key
    SECURITY_CODE: 'APP',
    EXCHANGE: 'NAS',
    FINANCIAL_DATA_PERIOD_TYPE_NUMBER: 2,
    CURRENCY: 'USD',  
    PERIOD_TYPE: 'QUARTERLY'
};

