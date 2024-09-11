const fs = require('fs');

const compareData = () => {
    // Load Atlas Dev data
    const atlasData = JSON.parse(fs.readFileSync('atlasData.json', 'utf-8'));

    // Load Iress data
    const iressData = JSON.parse(fs.readFileSync('iressData.json', 'utf-8'));

    console.log('atlasData:', atlasData);
    console.log('iressData:', iressData);

    const compareArrays = (arr1, arr2, key) => {
        const lengthMismatch = arr1.length !== arr2.length;
        const diff = arr1.filter(item => !arr2.includes(item));

        if (lengthMismatch || diff.length > 0) {
            console.log(`${key} mismatch:`);
            console.log(`Expected: ${JSON.stringify(arr2)}`);
            console.log(`Found: ${JSON.stringify(arr1)}`);
            if (lengthMismatch) {
                console.log(`Length mismatch: ${arr1.length} vs ${arr2.length}`);
            }
            if (diff.length > 0) {
                console.log(`Differences: ${JSON.stringify(diff)}`);
            }
        } else {
            console.log(`${key} matches.`);
        }
    };

    // Compare and log discrepancies for each key
    compareArrays(atlasData.startDates, iressData.startDates, 'Start Dates');
    compareArrays(atlasData.endDates, iressData.endDates, 'End Dates');
    compareArrays(atlasData.currencies, iressData.currencies, 'Currencies');
    compareArrays(atlasData.disclosureDates, iressData.disclosureDates, 'Disclosure Dates');
};

compareData();
