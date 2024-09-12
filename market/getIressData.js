const sendSoapRequest = require('./soapRequest');
const processXmlResponse = require('./xmlProcessor');
const fs = require('fs');
const { EXCHANGE, MARKET_FILTER, SORT_TYPE } = require('./config');

async function processCombination(exchange, marketFilter, sortType, allResults) {
    try {
        console.log(`Processing: ${exchange} - ${marketFilter} - ${sortType}`);
        const xmlData = await sendSoapRequest(exchange, marketFilter, sortType);
        const result = await processXmlResponse(xmlData, exchange, marketFilter, sortType);

        // Lưu kết quả của mỗi lần xử lý vào mảng allResults
        allResults.push({
            exchange,
            marketFilter,
            sortType,
            result
        });

    } catch (error) {
        console.error(`Error processing ${exchange} - ${marketFilter} - ${sortType}:`, error.message || error);
    }
}

async function main() {
    const allResults = []; // Tạo một mảng để lưu tất cả kết quả

    for (const exchange of Object.values(EXCHANGE)) {
        for (const marketFilter of Object.values(MARKET_FILTER)) {
            for (const sortType of Object.values(SORT_TYPE)) {
                await processCombination(exchange, marketFilter, sortType, allResults);
            }
        }
    }

    // Ghi tất cả kết quả vào file iressData.json sau khi hoàn tất xử lý
    fs.writeFileSync('iressData.json', JSON.stringify(allResults, null, 2));
    console.log('All data saved to iressData.json');
}

main().catch(error => {
    console.error("An unexpected error occurred:", error.message || error);
});
