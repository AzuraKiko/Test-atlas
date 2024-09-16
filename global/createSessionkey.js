const axios = require('axios');
const xml2js = require('xml2js');
const path = require('path');
const fs = require('fs');

// Hàm gửi yêu cầu SOAP và lấy IRESSSessionKey
async function getIRESSSessionKey() {
  const soapRequest = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
      <soap-env:Body>
        <ns0:IRESSSessionStart xmlns:ns0="https://webservicestest.iress.com.sg/v4/">
          <ns0:Input>
            <ns0:Header>
              <ns0:SessionKey xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true"/>
              <ns0:Updates>false</ns0:Updates>
              <ns0:Timeout>25</ns0:Timeout>
              <ns0:PageSize>0</ns0:PageSize>
              <ns0:WaitForResponse>true</ns0:WaitForResponse>
              <ns0:PagingBookmark xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true"/>
              <ns0:PagingDirection>0</ns0:PagingDirection>
            </ns0:Header>
            <ns0:Parameters>
              <ns0:UserName>sso.test3</ns0:UserName>
              <ns0:CompanyName>CGSSIT</ns0:CompanyName>
              <ns0:Password>Password1</ns0:Password>
              <ns0:ApplicationID>postman</ns0:ApplicationID>
              <ns0:SessionNumberToKick>-2</ns0:SessionNumberToKick>
              <ns0:KickLikeSessions>false</ns0:KickLikeSessions>
            </ns0:Parameters>
          </ns0:Input>
        </ns0:IRESSSessionStart>
      </soap-env:Body>
    </soap-env:Envelope>`;

  try {
    // Gửi yêu cầu SOAP với axios
    const response = await axios.post('https://webservicestest.iress.com.sg/v4/soap.aspx', soapRequest, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });

    // Ghi log phản hồi để kiểm tra
    // console.log('Raw response data:', response.data);

    // Phân tích XML phản hồi thành JSON
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);

    // Ghi log kết quả JSON sau khi phân tích
    // console.log('Parsed JSON result:', JSON.stringify(result, null, 2));

    // Kiểm tra đường dẫn để lấy IRESSSessionKey
    const envelope = result['soap:Envelope'];
    const body = envelope['soap:Body'][0];
    const sessionResponse = body['IRESSSessionStartResponse'][0];
    const resultData = sessionResponse['Output'][0]['Result'][0];

    // Trích xuất IRESSSessionKey từ DataRows > DataRow
    const dataRows = resultData['DataRows'][0]['DataRow'][0];
    const sessionKey = dataRows['IRESSSessionKey'][0];

    // console.log('IRESSSessionKey:', sessionKey);
    
    // Trả về sessionKey để sử dụng trong file khác
    return sessionKey;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function updateSessionFile(newKey) {
  const filePath = path.resolve(__dirname, 'sessionkey.js');
  const content = `const sessionKey = '${newKey}';\nmodule.exports = sessionKey;\n`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Session key updated in file: sessionkey.js');
}

// Main execution
(async () => {
  try {
    const key = await getIRESSSessionKey();
    if (key) {
      console.log('Session Key:', key);
      await updateSessionFile(key);
    } else {
      console.log('Failed to retrieve session key');
    }
  } catch (error) {
    console.error('Error in main execution:', error);
  }
})();


