const xml2js = require('xml2js');
const fs = require('fs');
const { CURRENCY, SECURITY_CODE, EXCHANGE, FINANCIAL_DATA_PERIOD_TYPE_NUMBER } = require('./config'); // Import CURRENCY and other variables

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

        const response = body[0].SecurityFinancialDataValueGet2Response;
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

        console.log('Data Row:', dataRow);

        // Filter and process the data
        const filteredDataRows = dataRow.filter(row => {
            const securityCodeMatch = row.SecurityCode[0] === SECURITY_CODE;
            const exchangeMatch = row.Exchange[0] === EXCHANGE;
            const curryCodeMatch = row.TradingCurrencyCode[0] === CURRENCY;
            const intervalTypeMatch = row.FinancialDataPeriodTypeNumber[0] === FINANCIAL_DATA_PERIOD_TYPE_NUMBER.toString();
            const templateId = row.FinancialDataTemplateId[0] !== '1';
            return securityCodeMatch && exchangeMatch && intervalTypeMatch && curryCodeMatch && templateId;
        });

        const filteredDataRows1 = dataRow.filter(row => {
            const securityCodeMatch = row.SecurityCode[0] === SECURITY_CODE;
            const exchangeMatch = row.Exchange[0] === EXCHANGE;
            const curryCodeMatch = row.TradingCurrencyCode[0] === CURRENCY;
            const intervalTypeMatch = row.FinancialDataPeriodTypeNumber[0] === FINANCIAL_DATA_PERIOD_TYPE_NUMBER.toString();
            const templateId = row.FinancialDataTemplateId[0] === '1';
            return securityCodeMatch && exchangeMatch && intervalTypeMatch && curryCodeMatch && templateId;
        });

        if (filteredDataRows.length > 0 || filteredDataRows1.lengh >0) {
            const uniqueDates = new Set();
            const uniqueCurrencies = new Set();
            const dateRanges = {};
            let startDates = [];
            let endDates = [];
            let currencies = [];
            let disclosureDates = [];
            let endDateQuarters = [];
            let overallLatestDisclosureDate = "";
            let overallLatestDisclosureIndex = -1;

            for (let i = 0; i < filteredDataRows.length; i++) {
                const financialDataDate = filteredDataRows[i].FinancialDataDate[0] || "";
                const disclosureDate = filteredDataRows[i].FinancialDataFilingDate[0] || "";

                const currency = filteredDataRows[i].CurrencyCode[0] || "";
                if (currency && !uniqueCurrencies.has(currency)) {
                    uniqueCurrencies.add(currency);
                    currencies.push(currency);
                }

                let startDate = "";
                let endDate = "";
                if (financialDataDate) {
                    const date = new Date(financialDataDate);
                    if (!isNaN(date.getTime())) {
                        const quarter = Math.floor((date.getMonth() + 3) / 3);
                        const year = date.getFullYear();

                        switch (quarter) {
                            case 1:
                                startDate = `${year}-01-01`;
                                endDate = financialDataDate;
                                break;
                            case 2:
                                startDate = `${year}-04-01`;
                                endDate = financialDataDate;
                                break;
                            case 3:
                                startDate = `${year}-07-01`;
                                endDate = financialDataDate;
                                break;
                            case 4:
                                startDate = `${year}-10-01`;
                                endDate = financialDataDate;
                                break;
                        }
                    } else {
                        console.warn(`Invalid date format for financialDataDate: ${financialDataDate}`);
                    }
                }

                if (startDate && !uniqueDates.has(startDate)) {
                    uniqueDates.add(startDate);
                    startDates.push(startDate);
                }
                if (endDate && !uniqueDates.has(endDate)) {
                    uniqueDates.add(endDate);
                    endDates.push(endDate);
                    const year = new Date(endDate).getFullYear();
                    const quarter = Math.floor((new Date(endDate).getMonth() + 3) / 3);
                    endDateQuarters.push({ year, quarter });
                }

                if (startDate) {
                    if (!dateRanges[startDate]) {
                        dateRanges[startDate] = {
                            endDate: endDate || "",
                            latestDisclosureDate: "",
                            latestDisclosureIndex: -1
                        };
                    }
                }

                for (const [start, range] of Object.entries(dateRanges)) {
                    if (financialDataDate && financialDataDate >= start && financialDataDate <= range.endDate) {
                        if (!range.latestDisclosureDate || disclosureDate > range.latestDisclosureDate) {
                            range.latestDisclosureDate = disclosureDate;
                            range.latestDisclosureIndex = i;
                        }
                    }
                }

                if (!overallLatestDisclosureDate || disclosureDate > overallLatestDisclosureDate) {
                    overallLatestDisclosureDate = disclosureDate;
                    overallLatestDisclosureIndex = i;
                }
            }

            for (const [start, range] of Object.entries(dateRanges)) {
                if (range.latestDisclosureIndex !== -1) {
                    disclosureDates.push(range.latestDisclosureDate);
                }
            }

            if (overallLatestDisclosureIndex !== -1) {
                console.log(`Overall Latest DisclosureDate_${overallLatestDisclosureIndex}:`, overallLatestDisclosureDate);
            }

            function getLatestQuarters(data, n) {
                data.sort((a, b) => {
                    if (a.year === b.year) {
                        return b.quarter - a.quarter;
                    }
                    return b.year - a.year;
                });
                return data.slice(0, n);
            }

            function getLatestDate(dates, n) {
                dates.sort((a, b) => {
                    return new Date(b) - new Date(a);
                });
                return dates.slice(0, n);
            }

            function getLatestDatesByIndex(dates, n) {
                const indexedDates = dates.map((date, index) => ({ date, index }));
                indexedDates.sort((a, b) => b.index - a.index);
                const result = indexedDates.slice(0, n).map(item => item.date);

                return result;
            }

            const latestQuarters = getLatestQuarters(endDateQuarters, 20);
            const latestStartDates = getLatestDate(startDates, 20);
            const latestEndDates = getLatestDate(endDates, 20);
            const latestDisclosureDates = getLatestDatesByIndex(disclosureDates, 20);

            console.log('IressStartDates', latestStartDates);
            console.log('IressEndDates', latestEndDates);
            console.log('IressCurrencies', currencies);
            console.log('IressDisclosureDates', latestDisclosureDates);
            console.log('EndDateQuarters', JSON.stringify(latestQuarters));

            fs.writeFileSync('iressData.json', JSON.stringify({
                latestStartDates,
                latestEndDates,
                currencies,
                latestDisclosureDates,
                endDateQuarters: latest6Quarters
            }, null, 2));
        } else {
            console.error('No matching data rows found in XML response');
        }
    } catch (err) {
        console.error('Error parsing XML:', err.message || err);
        // Uncomment below line to log raw XML if needed for further debugging
        // console.log('XML Data:', xmlData);
    }
}

module.exports = processXmlResponse;


// if (filteredDataRows.length > 0 || filteredDataRows1.length > 0) {
//     const uniqueDates = new Set();
//     const uniqueCurrencies = new Set();
//     const dateRanges = {};
//     let startDates = [];
//     let endDates = [];
//     let currencies = [];
//     let disclosureDates = [];
//     let endDateQuarters = [];
//     let overallLatestDisclosureDate = "";
//     let overallLatestDisclosureIndex = -1;

//     // Loop over filteredDataRows first
//     for (let i = 0; i < filteredDataRows.length; i++) {
//         let financialDataDate = filteredDataRows[i].FinancialDataDate[0] || "";
//         let disclosureDate = filteredDataRows[i].FinancialDataFilingDate[0] || "";

//         let currency = filteredDataRows[i].CurrencyCode[0] || "";
//         if (currency && !uniqueCurrencies.has(currency)) {
//             uniqueCurrencies.add(currency);
//             currencies.push(currency);
//         }

//         // Nếu không có data, sử dụng dữ liệu từ filteredDataRows1
//         if (!financialDataDate || !disclosureDate || !currency) {
//             for (let j = 0; j < filteredDataRows1.length; j++) {
//                 financialDataDate = financialDataDate || filteredDataRows1[j].FinancialDataDate[0] || "";
//                 disclosureDate = disclosureDate || filteredDataRows1[j].FinancialDataFilingDate[0] || "";
//                 currency = currency || filteredDataRows1[j].CurrencyCode[0] || "";
                
//                 // Cập nhật currency nếu không tồn tại trước đó
//                 if (currency && !uniqueCurrencies.has(currency)) {
//                     uniqueCurrencies.add(currency);
//                     currencies.push(currency);
//                 }
//             }
//         }

//         // Xử lý các giá trị khác nếu cần
//         if (financialDataDate) {
//             // Ví dụ: xử lý financialDataDate
//         }
//         if (disclosureDate) {
//             // Ví dụ: xử lý disclosureDate
//         }
//     }
// }

