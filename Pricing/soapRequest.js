const axios = require('axios');
const { SOAP_URL, session_key } = require('./config');
console.log(session_key)

async function sendSoapRequest(marketFilter) {
    const xmlBody = `
<soap-env:Envelope
	xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
    <soap-env:Body>
        <ns0:PricingWatchListGet xmlns:ns0="http://webservices.iress.com.au/v4/">
            <ns0:Input>
                <ns0:Header>
                    <ns0:SessionKey>${session_key}</ns0:SessionKey>
                    <ns0:Updates>true</ns0:Updates>
                    <ns0:Timeout>25</ns0:Timeout>
                    <ns0:PageSize>100</ns0:PageSize>
                    <ns0:WaitForResponse>true</ns0:WaitForResponse>
                    <ns0:PagingBookmark xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true"/>
                    <ns0:PagingDirection>0</ns0:PagingDirection>
                    <ns0:RequestID></ns0:RequestID>
                </ns0:Header> 
                <ns0:Parameters>
                    <ns0:SecurityCode>${marketFilter}</ns0:SecurityCode>
                    <ns0:Exchange></ns0:Exchange>
                    <ns0:Board></ns0:Board>
                     <ns0:ColumnGroup>Quote</ns0:ColumnGroup>
                     <ns0:ColumnGroup>Extra</ns0:ColumnGroup>
                     <ns0:ColumnGroup>SecInfo</ns0:ColumnGroup>
                     <ns0:ColumnGroup>SecInfoEx</ns0:ColumnGroup>
                     <ns0:ColumnGroup>SecurityExtra</ns0:ColumnGroup>
                    <ns0:ColumnGroup>FinancialData </ns0:ColumnGroup>   
                     <ns0:ColumnGroup>TradeHistory </ns0:ColumnGroup>                                   
                </ns0:Parameters>
            </ns0:Input>
        </ns0:PricingWatchListGet>
    </soap-env:Body>
</soap-env:Envelope>
    `;

    try {
        const response = await axios.post(SOAP_URL, xmlBody, {
            headers: { 'Content-Type': 'text/xml' }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // console.error('Error response data:', error.response.data);
            console.error('Error status:', error.response.status);
        } else {
            console.error('Error sending SOAP request:', error.message || error);
        }
        throw error;
    }
}

module.exports = sendSoapRequest;