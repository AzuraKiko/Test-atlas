// const fs = require('fs');

// const compareData = () => {
//     let atlasData, iressData;

//     // Load Atlas Dev data
//     try {
//         atlasData = JSON.parse(fs.readFileSync('atlasData.json', 'utf-8'));
//     } catch (error) {
//         console.error('Error reading atlasData.json:', error);
//         return;
//     }

//     // Load Iress data
//     try {
//         iressData = JSON.parse(fs.readFileSync('iressData.json', 'utf-8'));
//     } catch (error) {
//         console.error('Error reading iressData.json:', error);
//         return;
//     }

//     // console.log('atlasData:', atlasData);
//     // console.log('iressData:', iressData);

//     const compareArrays = (arr1, arr2, key) => {
//         if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
//             console.error(`Error: ${key} is not an array in one or both datasets`);
//             console.log(`atlasData[${key}]:`, arr1);
//             console.log(`iressData[${key}]:`, arr2);
//             return;
//         }

//         const lengthMismatch = arr1.length !== arr2.length;
//         const diff = arr1.filter(item => !arr2.includes(item));

//         if (lengthMismatch || diff.length > 0) {
//             console.log(`${key} mismatch:`);
//             console.log(`Expected: ${JSON.stringify(arr2)}`);
//             console.log(`Found: ${JSON.stringify(arr1)}`);
//             if (lengthMismatch) {
//                 console.log(`Length mismatch: ${arr1.length} vs ${arr2.length}`);
//             }
//             if (diff.length > 0) {
//                 console.log(`Differences: ${JSON.stringify(diff)}`);
//             }
//         } else {
//             console.log(`${key} matches.`);
//         }
//     };

//     // Compare and log discrepancies for each key
//     const keysToCompare = ['StartDates', 'EndDates', 'currencies', 'DisclosureDates'];
//     keysToCompare.forEach(key => {
//         if (atlasData[key] && iressData[key]) {
//             compareArrays(atlasData[key], iressData[key], key);
//         } else {
//             console.error(`Error: ${key} is missing in one or both datasets`);
//             console.log(`atlasData[${key}]:`, atlasData[key]);
//             console.log(`iressData[${key}]:`, iressData[key]);
//         }
//     });
// };

// compareData();

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

    const keysToCompare = ['StartDates', 'EndDates', 'currencies', 'DisclosureDates'];

    keysToCompare.forEach(key => {
        if (atlasData[key] && iressData[key]) {
            if (eql(atlasData[key], iressData[key])) {
                console.log(`${key} matches.`);
            } else {
                console.log(`${key} mismatch:`);
                console.log(`Atlas: ${JSON.stringify(atlasData[key])}`);
                console.log(`Iress: ${JSON.stringify(iressData[key])}`);
            }
        } else {
            console.error(`Error: ${key} is missing in one or both datasets`);
        }
    });
};

compareData();