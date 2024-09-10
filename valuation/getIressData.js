const sendSoapRequest = require('./soapRequest');
const processXmlResponse = require('./xmlProcessor');
const { SECURITY_CODE, EXCHANGE, FINANCIAL_DATA_PERIOD_TYPE_NUMBER } = require('./config');

async function main() {
    try {
        const xmlData = await sendSoapRequest(SECURITY_CODE, EXCHANGE, FINANCIAL_DATA_PERIOD_TYPE_NUMBER);
        await processXmlResponse(xmlData, SECURITY_CODE, EXCHANGE, FINANCIAL_DATA_PERIOD_TYPE_NUMBER);
    } catch (error) {
        console.error("An error occurred:", error.message || error);
    }
}

main();
