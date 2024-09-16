const sendSoapRequest = require("./soapRequest");
const processXmlResponse = require("./xmlProcessor");
const fs = require("fs");
const { EXCHANGE, MARKET_FILTER, SORT_TYPE } = require("./config");

// Utility function to introduce a delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to normalize numbers by converting exponential notation to decimal notation
function normalizeNumbers(arr) {
  return arr.map((value) => {
    // Check if the value contains 'e' or 'E' which indicates scientific notation
    if (/e|E/.test(value)) {
      return parseFloat(value); // Convert to a fixed-point number with 12 decimal places
    }
    return value; // Return the value as is if it does not contain 'E'
  });
}

// Map for converting remaining characters to market filters
const marketFilterMap = {
  EQ: "BOARD_LOT",
  "EQ|U": "ODD_LOT",
  BUYIN: "BUY_IN",
  ETF: "ETF",
  ADR: "ADR",
  SIP: "SIP",
  CPF: "CPF",
  SHARIAH: "SHARIAH",
};

// Function to extract exchange and market filter, and remove leading '/' if present
function extractExchangeAndMarketFilter(marketFilterStr) {
  if (marketFilterStr.startsWith("/")) {
    marketFilterStr = marketFilterStr.substring(1);
  }

  const exchange = marketFilterStr.substring(0, 3); // First 3 characters for exchange
  const remainingFilter = marketFilterStr.substring(3); // Remaining part for market filter

  const marketFilter = marketFilterMap[remainingFilter] || remainingFilter; // Map remainingFilter or use as is

  return { exchange, marketFilter };
}

function replaceNullWithZero(value) {
  return value === null ? "" : value;
}

// Sorting helper: sort all arrays within the result together
function sortResultsByType(result, sortType) {
  const combined = result.symbol_codes.map((code, index) => ({
    symbol_code: code,
    company_name: result.company_names[index],
    last_price: replaceNullWithZero(result.last_prices[index]),
    movement: replaceNullWithZero(result.movements[index]),
    movement_percentage: replaceNullWithZero(result.movement_percentages[index]),
    total_volume: replaceNullWithZero(result.total_volumes[index]),
  }));

  // if (sortType === SORT_TYPE.VOLUME) {
  //   combined.sort((a, b) => b.total_volume - a.total_volume);
  // } else if (sortType === SORT_TYPE.POINTS_UP) {
  //   combined.sort((a, b) => b.movement - a.movement);
  // } else if (sortType === SORT_TYPE.POINTS_DOWN) {
  //   combined.sort((a, b) => a.movement - b.movement);
  // } else if (sortType === SORT_TYPE.PERCENT_UP) {
  //   combined.sort((a, b) => b.movement_percentage - a.movement_percentage);
  // } else if (sortType === SORT_TYPE.PERCENT_DOWN) {
  //   combined.sort((a, b) => a.movement_percentage - b.movement_percentage);
  // }
  const handleSorting = (a, b, sortType) => {
    // Helper function to get the value with proper handling of empty strings
    // const getValue = (item, key) => {
    //   if (item[key] === "") return sortType.includes("DOWN") ? Infinity : -Infinity;
    //   return parseFloat(item[key]);
    // };

    const getValue = (item, key) => {
      if (item[key] === "") return - Infinity; 
      return parseFloat(item[key]);
    };
  
    if (sortType === SORT_TYPE.VOLUME) {
      return getValue(b, 'total_volume') - getValue(a, 'total_volume');
    } else if (sortType === SORT_TYPE.POINTS_UP) {
      return getValue(b, 'movement') - getValue(a, 'movement');
    } else if (sortType === SORT_TYPE.POINTS_DOWN) {
      return getValue(a, 'movement') - getValue(b, 'movement');
    } else if (sortType === SORT_TYPE.PERCENT_UP) {
      return getValue(b, 'movement_percentage') - getValue(a, 'movement_percentage');
    } else if (sortType === SORT_TYPE.PERCENT_DOWN) {
      return getValue(a, 'movement_percentage') - getValue(b, 'movement_percentage');
    }
  };
  
  // Sort the combined array based on the sort type
  combined.sort((a, b) => handleSorting(a, b, sortType));
  

  // Reassign the sorted data back to the result object
  result.symbol_codes = combined.map((item) => item.symbol_code);
  result.company_names = combined.map((item) => item.company_name);
  result.last_prices = combined.map((item) => item.last_price);
  result.movements = combined.map((item) => item.movement);
  result.movement_percentages = combined.map(
    (item) => item.movement_percentage
  );
  result.total_volumes = combined.map((item) => item.total_volume);
}

async function processCombination(marketFilterStr, allResults, sortType) {
  try {
    console.log(`Processing: ${marketFilterStr} with sortType: ${sortType}`);

    // Extract exchange and market filter
    const { exchange, marketFilter } =
      extractExchangeAndMarketFilter(marketFilterStr);

    // Send SOAP request and process the response
    const xmlData = await sendSoapRequest(marketFilterStr);
    let result = await processXmlResponse(xmlData, marketFilterStr); // Keep original sortType for output

    // Check and replace any {"$":{"xsi:nil":"true"}} values with null
    function replaceNilWithNull(obj) {
      if (Array.isArray(obj)) {
        return obj.map(replaceNilWithNull);
      } else if (typeof obj === "object" && obj !== null) {
        if (obj.$ && obj.$["xsi:nil"] === "true") {
          return null;
        }
        for (let key in obj) {
          obj[key] = replaceNilWithNull(obj[key]);
        }
      }
      return obj;
    }

    // Apply the function to the result object
    result = replaceNilWithNull(result);

    // Normalize numbers
    result.last_prices = normalizeNumbers(result.last_prices);
    result.movements = normalizeNumbers(result.movements);
    result.movement_percentages = normalizeNumbers(result.movement_percentages);

    // Sort the entire result object by the selected sortType
    sortResultsByType(result, sortType);

    // Save the sorted result of each combination
    allResults.push({
      exchange,
      marketFilter,
      sortType, // Include sortType in the result
      result,
    });
  } catch (error) {
    console.error(
      `Error processing ${marketFilterStr} with sortType ${sortType}:`,
      error.message || error
    );
  }
}

async function main() {
  const allResults = []; // Tạo một mảng để lưu tất cả kết quả

  for (const marketFilterStr of Object.values(MARKET_FILTER)) {
    // Loop through all sort types
    for (const sortType of Object.values(SORT_TYPE)) {
      await processCombination(marketFilterStr, allResults, sortType);
    }
  }

  // Ghi tất cả kết quả vào file iressData.json sau khi hoàn tất xử lý
  fs.writeFileSync("iressData.json", JSON.stringify(allResults, null, 2));
  console.log("Data saved to iressData.json");

  // Wait 500ms before processing the next marketFilter
  await delay(200);
}

main().catch((error) => {
  console.error("An unexpected error occurred:", error.message || error);
});
