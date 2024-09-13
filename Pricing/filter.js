const axios = require('axios');
const fs = require('fs');
const token = require('../global/token');
const config = require('./config');

// Helper function to create a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

            // Only assign values if data exists
            if (jsonData.length > 0) {
                formattedData.result.symbol_codes = jsonData.map(row => row.symbol_code);
                formattedData.result.company_names = jsonData.map(row => row.company_name);
                formattedData.result.movements = jsonData.map(row => row.movement !== null ? row.movement.toString() : "0");
                formattedData.result.movement_percentages = jsonData.map(row => row.movement_percentage !== null ? row.movement_percentage.toString() : "0");
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
const fetchMarketFilters = async (exchange) => {
    const baseUrl = 'https://atlas-dev-api.equix.app/v1/watchlist/market-filters'; // Update this URL if needed

    const axiosConfig = {
        method: 'get',
        url: `${baseUrl}?exchange=${exchange}`,
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios(axiosConfig);
        const marketFilters = response.data.data.market_filter;

        if (marketFilters) {
            return marketFilters;
        } else {
            console.error(`No market filter data for exchange: ${exchange}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching market filters for exchange ${exchange}:`, error.message);
        return null;
    }
};

// Fetch and save market filters for all exchanges
const fetchAndSaveMarketFilters = async () => {
    const allFilters = {};

    for (const exchange of Object.values(config.EXCHANGE)) {
        const filters = await fetchMarketFilters(exchange);
        if (filters) {
            allFilters[exchange] = filters;

            // Save the market filter data to a separate JSON file
            fs.writeFileSync(`marketFilters_${exchange}.json`, JSON.stringify(filters, null, 2));
            console.log(`Market filters saved to marketFilters_${exchange}.json`);
        }

        // Wait for 10 seconds before the next request
        await delay(10000);
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
                await delay(10000);
            }
        }
    }
};

// Call the functions
fetchAndSaveMarketFilters().then(() => fetchAllCombinations());
