const axios = require('axios');
const fs = require('fs');
const token = require('../valuation/token');

const fetchData = async () => {
    const config = {
        method: 'get',
        url: 'https://atlas-dev-api.equix.app/v1/symbol/fundamental/indicators?symbol=T82U.SGX&period_type=QUARTERLY&number_of_year=5',
        headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
        }
    };

    try {
        const response = await axios(config);
        const jsonData = response.data.data.data;

        let startDates = [];
        let endDates = [];
        let currencies = [];
        let disclosureDates = [];
        const uniqueCurrencies = new Set();

        if (jsonData) {
            jsonData.forEach(row => {
                const startDate = row.start_date.split('T')[0];
                startDates.push(startDate);
                const endDate = row.end_date.split('T')[0];
                endDates.push(endDate);

                const currency = row.report_currency;
                if (currency && !uniqueCurrencies.has(currency)) {
                    uniqueCurrencies.add(currency);
                    currencies.push(currency);
                }

                const disclosureDate = row.disclosure_date.split('T')[0];
                disclosureDates.push(disclosureDate);
            });

            const atlasData = {
                startDates,
                endDates,
                currencies,
                disclosureDates
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

fetchData();