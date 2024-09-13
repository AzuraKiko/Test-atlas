// xmlProcessor.js
const xml2js = require('xml2js');
const fs = require('fs');

async function processXmlResponse(xmlData) {
    try {
        // Parse XML data
        const result = await xml2js.parseStringPromise(xmlData);

        // Extract and validate the data
        const envelope = result['soap:Envelope'];
        if (!envelope) throw new Error('Envelope not found in XML');

        const body = envelope['soap:Body'];
        if (!body || body.length === 0) throw new Error('Body not found in XML');

        const response = body[0].PricingWatchListGetResponse;
        if (!response || response.length === 0) throw new Error('Response not found in XML');

        const output = response[0].Output;
        if (!output || output.length === 0) throw new Error('Output not found in XML');

        const resultOutput = output[0].Result;
        if (!resultOutput || resultOutput.length === 0) throw new Error('Result Output not found in XML');

        const dataRows = resultOutput[0].DataRows;
        if (!dataRows || dataRows.length === 0) throw new Error('DataRows not found in XML');

        const dataRow = dataRows[0].DataRow;
        if (!dataRow) throw new Error('DataRow not found in XML');

        // Extract relevant fields from the data row
        const symbol_codes = dataRow.map(row => row.SecurityCode?.[0] || null).filter(Boolean);
        const last_prices = dataRow.map(row => row.Quote?.[0]?.LastPrice?.[0] || null).filter(Boolean);
        const company_names = dataRow.map(row => row.SecInfo?.[0]?.IssuerName?.[0] || null).filter(Boolean);
        const movements = dataRow.map(row => row.Quote?.[0]?.Movement?.[0] || null).filter(Boolean);
        const movement_percentages = dataRow.map(row => row.Quote?.[0]?.MovementPercentage?.[0] || null).filter(Boolean);
        const total_volumes = dataRow.map(row => row.Quote?.[0]?.TotalVolume?.[0] || null).filter(Boolean);

        const extractedData = {
            symbol_codes,
            last_prices,
            company_names,
            movements,
            movement_percentages,
            total_volumes
        };

        return extractedData; // Trả về dữ liệu đã trích xuất

    } catch (err) {
        console.error('Error parsing XML:', err.message || err);
        return null; // Trả về null nếu có lỗi
    }
}

module.exports = processXmlResponse;
