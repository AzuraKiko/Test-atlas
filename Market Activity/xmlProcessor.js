const xml2js = require('xml2js');
const fs = require('fs');
// const {EXCHANGE, MARKET_FILTER, SORT_TYPE} = require('./config');

async function processXmlResponse(xmlData) {
    try {
        // Log raw XML data for initial inspection
        // console.log('Raw XML Data:', xmlData);

        // Parse XML data
        const result = await xml2js.parseStringPromise(xmlData);

        // Log the entire parsed result for debugging
        // console.log('Parsed XML Result:', JSON.stringify(result, null, 2));

        // Extract and validate the data
        const envelope = result['soap:Envelope'];
        if (!envelope) throw new Error('Envelope not found in XML');

        const body = envelope['soap:Body'];
        if (!body || body.length === 0) throw new Error('Body not found in XML');

        const response = body[0].MarketActivityGetResponse;
        if (!response || response.length === 0) throw new Error('Response not found in XML');

        const output = response[0].Output;
        if (!output || output.length === 0) throw new Error('Output not found in XML');

        const input = output[0]['ns0:Input'];
        if (!input || input.length === 0) throw new Error('Input not found in XML');

        const header = input[0]['ns0:Header'];
        if (!header || header.length === 0) throw new Error('Header not found in XML');

        const parameters = input[0]['ns0:Parameters'];
        if (!parameters || parameters.length === 0) throw new Error('Parameters not found in XML');

        const resultOutput = output[0].Result;
        if (!resultOutput || resultOutput.length === 0) throw new Error('Result Output not found in XML');

        const resultHeader = resultOutput[0].Header;
        if (!resultHeader || resultHeader.length === 0) throw new Error('Result Header not found in XML');

        const headerRow = resultOutput[0].HeaderRow;
        if (!headerRow || headerRow.length === 0) throw new Error('HeaderRow not found in XML');

        const dataRows = resultOutput[0].DataRows;
        if (!dataRows || dataRows.length === 0) throw new Error('DataRows not found in XML');

        const dataRow = dataRows[0].DataRow;
        if (!dataRow) throw new Error('DataRow not found in XML');


        // Extract relevant fields from the data row
        const symbol_codes = dataRow.length > 0 ? dataRow.map(row => row.SecurityCode?.[0] || null).filter(Boolean) : [];
        const company_names = dataRow.length > 0 ? dataRow.map(row => row.SecurityDescription?.[0] || null).filter(Boolean) : [];
        const movements = dataRow.length > 0 ? dataRow.map(row => row.MovementPoints?.[0] || null).filter(Boolean) : [];
        const movement_percentages = dataRow.length > 0 ? dataRow.map(row => row.MovementPercent?.[0] || null).filter(Boolean) : [];
        const total_volumes = dataRow.length > 0 ? dataRow.map(row => row.TotalVolume?.[0] || null).filter(Boolean) : [];

       const extractedData = {
           symbol_codes,
           company_names,
           movements,
           movement_percentages,
           total_volumes
       };

       // Ghi dữ liệu tạm thời vào tệp JSON mỗi lần xử lý
       fs.writeFileSync('iressData.json', JSON.stringify(extractedData, null, 2));

       return extractedData; // Trả về dữ liệu đã trích xuất

   } catch (err) {
       console.error('Error parsing XML:', err.message || err);
       return null; // Trả về null nếu có lỗi
   }
}
module.exports = processXmlResponse;

// const xml2js = require('xml2js');
// const fs = require('fs');

// async function processXmlResponse(xmlData, exchange, marketFilter, sortType) {
//     try {
//         const result = await xml2js.parseStringPromise(xmlData);
        
//         const dataRows = result['soap:Envelope']['soap:Body'][0]
//             .MarketActivityGetResponse[0].Output[0].Result[0].DataRows[0].DataRow;

//         if (!dataRows) throw new Error('DataRows not found in XML');

//         const processedData = dataRows.map(row => {
//             // Process each row as needed
//             return {
//                 // Example: adjust these based on your actual data structure
//                 symbol: row.Symbol[0],
//                 lastPrice: row.LastPrice[0],
//                 change: row.Change[0],
//                 // ... other fields
//             };
//         });

//         // Save processed data to a file
//         const fileName = `${exchange}_${marketFilter}_${sortType}.json`;
//         fs.writeFileSync(fileName, JSON.stringify(processedData, null, 2));
//         console.log(`Data saved to ${fileName}`);

//         return processedData;
//     } catch (err) {
//         console.error('Error processing XML:', err.message || err);
//         throw err;
//     }
// }

// module.exports = processXmlResponse;