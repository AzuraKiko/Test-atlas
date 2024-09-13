const sendSoapRequest = require('./soapRequest');
const processXmlResponse = require('./xmlProcessor');
const fs = require('fs');
const { MARKET_FILTER, SORT_TYPE } = require('./config');

// Utility function to introduce a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processCombination(marketFilter, sortType) {
    try {
        console.log(`Processing: ${marketFilter}`);
        const xmlData = await sendSoapRequest(marketFilter); // Pass the original marketFilter value
        const result = await processXmlResponse(xmlData);

        // Check if result and result.total_volume exist
        if (result && result.total_volume) {
            // Split the marketFilter into exchange and filter parts
            const [exchange, filter] = marketFilter.split('/');

            // Sort the results based on the provided sortType
            if (sortType === SORT_TYPE.VOLUME) {
                result.total_volume.sort((a, b) => b - a); // Sort by volume descending
            } else if (sortType === SORT_TYPE.POINTS_UP) {
                result.movement.sort((a, b) => b - a); // Sort movements by points up
            } else if (sortType === SORT_TYPE.POINTS_DOWN) {
                result.movement.sort((a, b) => a - b); // Sort movements by points down
            } else if (sortType === SORT_TYPE.PERCENT_UP) {
                result.movement_percentage.sort((a, b) => b - a); // Sort percentage up
            } else if (sortType === SORT_TYPE.PERCENT_DOWN) {
                result.movement_percentage.sort((a, b) => a - b); // Sort percentage down
            }

            return {
                exchange, // Store the exchange extracted from the marketFilter
                marketFilter: filter, // Store the remaining filter part
                sortType,
                result
            };
        } else {
            console.error(`No result for marketFilter: ${marketFilter}`);
            return null;
        }

    } catch (error) {
        console.error(`Error processing ${marketFilter}:`, error.message || error);
        return null;
    }
}

async function main() {
    const allResults = []; // Array to store all the results
    const sortType = SORT_TYPE.VOLUME; // Adjust the sort type based on your need

        for (const marketFilter of Object.values(MARKET_FILTER)) {
        const result = await processCombination(marketFilter);
        if (result) {
            allResults.push(result);

            // Save results after each processCombination
            fs.writeFileSync('iressData.json', JSON.stringify(allResults, null, 2));
            console.log('Data saved to iressData.json');
        }

        // Wait 500ms before processing the next marketFilter
        await delay(500);
    }
}

main().catch(error => {
    console.error("An unexpected error occurred:", error.message || error);
});
