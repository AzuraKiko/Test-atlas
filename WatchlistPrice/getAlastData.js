const axios = require("axios");
const fs = require("fs");
const token = require("../global/token");
const config = require("./config");

// Helper function to create a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const getMarketFilter = (exchange) => {
//   return exchange === "SGX"
//     ? Object.values(config.MARKET_FILTER1.SGX) // Lấy danh sách các giá trị cho SGX
//     : Object.values(config.MARKET_FILTER1.OTHER_EXCHANGES); // Lấy danh sách các giá trị cho các sàn giao dịch khác
// };
const getMarketFilter = (exchange) => {
  return exchange === "SGX"
    ? config.MARKET_FILTER1.SGX // Lấy danh sách các giá trị cho SGX
    : config.MARKET_FILTER1.OTHER_EXCHANGES; // Lấy danh sách các giá trị cho các sàn giao dịch khác
};

const fetchData = async (exchange, marketFilter, sortType) => {
  const baseUrl = "https://atlas-dev-api.equix.app/v1/watchlist/system";

  const params = new URLSearchParams({
    asset_class: config.ASSET_CLASS.EQUITIES,
    exchange: exchange,
    sort_type: sortType,
    market_filter: marketFilter,
  });

  const fullUrl = `${baseUrl}?${params.toString()}`;
  // console.log(`Request URL: ${fullUrl}`); // Thêm log URL để kiểm tra

  const axiosConfig = {
    method: "get",
    url: fullUrl,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios(axiosConfig);
    const jsonData = response.data.data.data;
    const marketFiltersData = response.data.data.market_filter; // Lấy dữ liệu market_filter từ response  \
    // Log the marketFiltersData
    // console.log("marketFiltersData:", marketFiltersData);

    if (jsonData && marketFiltersData) {
      const formattedData = {
        exchange: exchange,
        marketFilter: marketFilter,
        sortType: sortType,
        result: {
          symbol_codes: [],
          company_names: [],
          movements: [],
          movement_percentages: [],
          total_volumes: [],
          // fitler_group: [],
          // filter_options: [],
        },
      };

      // Gán giá trị nếu có dữ liệu
      if (jsonData.length > 0 && marketFiltersData.length > 0) {
        formattedData.result.symbol_codes = jsonData.map(
          (row) => row.symbol_code
        );
        formattedData.result.company_names = jsonData.map(
          (row) => row.company_name
        );
        formattedData.result.movements = jsonData.map((row) =>
          row.movement !== null ? row.movement.toString() : ""
        );
        formattedData.result.movement_percentages = jsonData.map((row) =>
          row.movement_percentage !== null
            ? row.movement_percentage.toString()
            : ""
        );
        formattedData.result.total_volumes = jsonData.map((row) =>
          row.total_volume !== null ? row.total_volume.toString() : ""
        );

        // formattedData.result.fitler_group = marketFiltersData.map(
        //   (row) => row.fitler_group
        // );

        // formattedData.result.filter_options = marketFiltersData.map(
        //   (row) => row.filter_options
        // );
      }
      return formattedData;
    } else {
      console.error("Data object is missing in response JSON");
      return null;
    }
  } catch (error) {
    console.error(
      `Error fetching data for ${exchange}, ${marketFilter}, ${sortType}: ${error.message}`
    );
    if (error.response) {
      console.error(`Response data: ${JSON.stringify(error.response.data)}`);
      console.error(`Response status: ${error.response.status}`);
      // console.error(
      //   `Response headers: ${JSON.stringify(error.response.headers)}`
      // );
    }
    return null;
  }
};

// Fetch and save data for all exchanges
// const fetchAndSaveAllData = async () => {
//   const allAtlasResults = [];
//   const allFilters = {};

//   for (const exchange of Object.values(config.EXCHANGE)) {
//     let marketFilters = getMarketFilter(exchange);

//     // Kiểm tra nếu marketFilters không phải là mảng, thì chuyển thành mảng
//     if (!Array.isArray(marketFilters)) {
//       marketFilters = [marketFilters];
//     }

//     // Fetch data for all market filters and sort types in parallel
//     const dataPromises = marketFilters.map((marketFilter) =>
//       Promise.all(
//         Object.values(config.SORT_TYPE).map((sortType) =>
//           fetchData(exchange, sortType) // Đúng thứ tự: exchange, sortType
//         )
//       )
//     );

//     const filterPromise = fetchMarketFilters(exchange);

//     // Wait for all promises to resolve
//     const [atlasResults, filters] = await Promise.all([
//       Promise.all(dataPromises),
//       filterPromise,
//     ]);

//     // Flatten atlas results array and push results to final array
//     atlasResults.flat().forEach((result) => {
//       if (result) {
//         allAtlasResults.push(result);
//       }
//     });

//     // Save filters to the final filters object
//     if (filters) {
//       allFilters[exchange] = filters;
//     }

//     // Delay between requests
//     await delay(10);
//   }

//   // Save all atlas data to a JSON file
//   fs.writeFileSync("atlasData.json", JSON.stringify(allAtlasResults, null, 2));
//   console.log("All data saved to atlasData.json");

//   // Save all market filters to a JSON file
//   fs.writeFileSync("marketFilter.json", JSON.stringify(allFilters, null, 2));
//   console.log("All market filters saved to marketFilter.json");
// };

// // Fetch and save data for all exchanges
// fetchAndSaveAllData();
const fetchAllCombinations = async () => {
  const allResults = [];
  for (const exchange of Object.values(config.EXCHANGE)) {
    // Ensure marketFilters is always an array
    let marketFilters = getMarketFilter(exchange);
    // if (!Array.isArray(marketFilters)) {
    //   marketFilters = [marketFilters];
    // }

    for (const marketFilter of Object.values(marketFilters)) {
      for (const sortType of Object.values(config.SORT_TYPE)) {
        const result = await fetchData(exchange, marketFilter, sortType);
        if (result) {
          allResults.push(result);
          console.log(
            `Fetched data for ${exchange}, ${marketFilter}, ${sortType}`
          );
          // Save the data to a JSON file once
          fs.writeFileSync(
            "atlasData.json",
            JSON.stringify(allResults, null, 2)
          );
          // Delay between each request
          await delay(200);
          console.log("Data saved to atlasData.json");
        }
      }
    }
  }
};

// Call the function
fetchAllCombinations();
