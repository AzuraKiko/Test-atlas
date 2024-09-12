const axios = require('axios');
const fs = require('fs');
const token = require('../global/token');
const { EXCHANGE, MARKET_FILTER, SORT_TYPE } = require('./config');

const fetchData = async (symbol, periodType, numberOfYears) => {
    const baseUrl = 'https://atlas-dev-api.equix.app/v1/symbol/fundamental/indicators';

    const params = new URLSearchParams({
        symbol: symbol,
        period_type: periodType,
        number_of_year: numberOfYears
    });

    const config = {
        method: 'get',
        url: `${baseUrl}?${params.toString()}`,
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    console.log(config);

    try {
        const response = await axios(config);
        const jsonData = response.data.data.data;

        let StartDates = [];
        let EndDates = [];
        let currencies = [];
        let DisclosureDates = [];
        const uniqueCurrencies = new Set();

        if (jsonData) {
            jsonData.forEach(row => {
                const startDate = row.start_date.split('T')[0];
                StartDates.push(startDate);
                const endDate = row.end_date.split('T')[0];
                EndDates.push(endDate);

                const currency = row.report_currency;
                if (currency && !uniqueCurrencies.has(currency)) {
                    uniqueCurrencies.add(currency);
                    currencies.push(currency);
                }

                const disclosureDate = row.disclosure_date.split('T')[0];
                DisclosureDates.push(disclosureDate);
            });

            const atlasData = {
                StartDates,
                EndDates,
                currencies,
                DisclosureDates
            };

            // Save the data to a JSON file
            fs.writeFileSync('atlasData.json', JSON.stringify(atlasData, null, 2));
            console.log('Data saved to atlasData.json');
        } else {
            console.error("Data object is missing in response JSON");
        }
    } catch (error) {
        console.error(error);
    }
};
const SYMBOL = `${SECURITY_CODE}.${EXCHANGE}`;
// Call the function with the desired parameters
fetchData(SYMBOL, PERIOD_TYPE, 5);