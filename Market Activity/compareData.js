const fs = require('fs');
const eql = require('deep-equal');

const compareData = () => {
    let atlasData, iressData;

    try {
        atlasData = JSON.parse(fs.readFileSync('atlasData.json', 'utf-8'));
        iressData = JSON.parse(fs.readFileSync('iressData.json', 'utf-8'));
    } catch (error) {
        console.error('Error reading JSON files:', error);
        return;
    }

    // Ensure both datasets are arrays
    if (!Array.isArray(atlasData) || !Array.isArray(iressData)) {
        console.error('Error: One or both datasets are not arrays');
        return;
    }

    // Create a map for faster lookup of Iress data
    const iressMap = new Map(iressData.map(item => [
        `${item.exchange}-${item.marketFilter}-${item.sortType}`,
        item
    ]));

    atlasData.forEach(atlasItem => {
        const key = `${atlasItem.exchange}-${atlasItem.marketFilter}-${atlasItem.sortType}`;
        const iressItem = iressMap.get(key);

        if (!iressItem) {
            console.log(`\nNo matching Iress data for: ${key}`);
            return;
        }

        console.log(`\nComparing data for: ${key}`);

        // Compare result object
        const resultKeys = ['symbol_codes'];
        resultKeys.forEach(resultKey => {
            if (eql(atlasItem.result[resultKey], iressItem.result[resultKey])) {
                console.log(`result.${resultKey} matches.`);
            } else {
                console.log(`result.${resultKey} mismatch:`);
                console.log(`Atlas: ${JSON.stringify(atlasItem.result[resultKey])}`);
                console.log(`Iress: ${JSON.stringify(iressItem.result[resultKey])}`);
            }
        });
    });

    // Check for Iress items not in Atlas data
    iressData.forEach(iressItem => {
        const key = `${iressItem.exchange}-${iressItem.marketFilter}-${iressItem.sortType}`;
        if (!atlasData.some(item => 
            item.exchange === iressItem.exchange && 
            item.marketFilter === iressItem.marketFilter && 
            item.sortType === iressItem.sortType
        )) {
            console.log(`\nNo matching Atlas data for: ${key}`);
        }
    });
};

compareData();