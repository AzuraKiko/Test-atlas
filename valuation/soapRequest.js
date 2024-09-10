const axios = require('axios');
const { SOAP_URL, session_key } = require('./config');

async function sendSoapRequest(securityCode, exchange, financialDataPeriodTypeNumber) {
    const xmlBody = `
        <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
            <soap-env:Body>
                <ns0:SecurityFinancialDataValueGet2 xmlns:ns0="https://webservicestest.iress.com.sg/v4/">
                    <ns0:Input>
                        <ns0:Header>
                            <ns0:SessionKey>${session_key}</ns0:SessionKey>
                            <ns0:Updates>false</ns0:Updates>
                            <ns0:Timeout>25</ns0:Timeout>
                            <ns0:PageSize>0</ns0:PageSize>
                            <ns0:WaitForResponse>true</ns0:WaitForResponse>
                            <ns0:PagingBookmark xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true"/>
                            <ns0:PagingDirection>0</ns0:PagingDirection>
                        </ns0:Header>
                        <ns0:Parameters>
                            <ns0:SecurityCode>${securityCode}</ns0:SecurityCode>
                            <ns0:Exchange>${exchange}</ns0:Exchange>
                            <ns0:FinancialDataPeriodTypeNumber>${financialDataPeriodTypeNumber}</ns0:FinancialDataPeriodTypeNumber>
                        </ns0:Parameters>
                    </ns0:Input>
                </ns0:SecurityFinancialDataValueGet2>
            </soap-env:Body>
        </soap-env:Envelope>
    `;

    try {
        const response = await axios.post(SOAP_URL, xmlBody, {
            headers: {
                'Content-Type': 'text/xml'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error sending SOAP request:', error.message || error);
        throw error;
    }
}

module.exports = sendSoapRequest;