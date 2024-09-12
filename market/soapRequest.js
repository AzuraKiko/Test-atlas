const axios = require('axios');
const { SOAP_URL, session_key } = require('./config');
console.log(session_key)

async function sendSoapRequest(exchange, marketFilter, sortType) {
    const xmlBody = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
    <soap-env:Body>
        <ns0:MarketActivityGet xmlns:ns0="http://webservices.iress.com.au/v4/">
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
                   <ns0:Exchange>${exchange}</ns0:Exchange>
                   <ns0:Group>${marketFilter}</ns0:Group>
                   <ns0:Mode>${sortType}</ns0:Mode>
                </ns0:Parameters>
            </ns0:Input>
        </ns0:MarketActivityGet>
    </soap-env:Body>
    </soap-env:Envelope>
    `;

    try {
        const response = await axios.post(SOAP_URL, xmlBody, {
            headers: { 'Content-Type': 'text/xml' }
        });
        return response.data;
    } catch (error) {
        console.error('Error sending SOAP request:', error.message || error);
        throw error;
    }
}

module.exports = sendSoapRequest;