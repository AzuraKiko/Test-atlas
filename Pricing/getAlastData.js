const axios = require('axios');
const fs = require('fs');
const token = require('../global/token');
const config = require('./config');

// Helper function to create a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to map market filter values
// const mapMarketFilter = (filter) => {
//     switch (filter) {
//         case 'BIG_CAP': return 'TOP';
//         case 'MID_CAP': return 'MID';
//         case 'SMALL_CAP': return 'BOT';
//         default: return filter;
//     }
// };

const fetchData = async (exchange, marketFilter, sortType) => {
    const baseUrl = 'https://atlas-dev-api.equix.app/v1/watchlist/system';

    const params = new URLSearchParams({
        asset_class: config.ASSET_CLASS.EQUITIES,
        exchange: exchange,
        sort_type: sortType,
        market_filter: marketFilter
    });

    const axiosConfig = {
        method: 'get',
        url: `${baseUrl}?${params.toString()}`,
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };


    try {
        const response = await axios(axiosConfig);
        const jsonData = response.data.data.data;

        if (jsonData) {
            const formattedData = {
                exchange: exchange,
                marketFilter: marketFilter,
                sortType: sortType,
                result: {
                    symbol_codes: [],
                    company_names: [],
                    movements: [],
                    movement_percentages: [],
                    total_volumes: []
                }
            };

            // Chỉ gán giá trị nếu có dữ liệu
            if (jsonData.length > 0) {
                formattedData.result.symbol_codes = jsonData.map(row => row.symbol_code);
                formattedData.result.company_names = jsonData.map(row => row.company_name);
            
                // Chuyển movement sang chuỗi và kiểm tra null
                formattedData.result.movements = jsonData.map(row => row.movement !== null ? row.movement.toString() : "0");
            
                // Chuyển movement_percentage sang chuỗi và kiểm tra null
                formattedData.result.movement_percentages = jsonData.map(row => row.movement_percentage !== null ? row.movement_percentage.toString() : "0");
            
                // Chuyển total_volume sang chuỗi và kiểm tra null
                formattedData.result.total_volumes = jsonData.map(row => row.total_volume !== null ? row.total_volume.toString() : "0");
            }

            return formattedData;
        } else {
            console.error("Data object is missing in response JSON");
            return null;
        }
    } catch (error) {
        console.error(`Error fetching data for ${exchange}, ${marketFilter}, ${sortType}:`, error.message);
        return null;
    }
};

const fetchAllCombinations = async () => {
    const results = [];

    for (const exchange of Object.values(config.EXCHANGE)) {
        for (const marketFilter of Object.values(config.MARKET_FILTER1)) {
            for (const sortType of Object.values(config.SORT_TYPE)) {
                const result = await fetchData(exchange, marketFilter, sortType);
                if (result) {
                    results.push(result);
                    console.log(`Fetched data for ${exchange}, ${result.marketFilter}, ${sortType}`);


                    // Save the data to a JSON file
                    fs.writeFileSync('atlasData.json', JSON.stringify(results, null, 2));
                    console.log('Data saved to atlasData.json');
                    
                }
                // Wait for 10 seconds before the next request
                // await delay(10);
            }
        }
    }
};

// Call the function to fetch all combinations
fetchAllCombinations();
