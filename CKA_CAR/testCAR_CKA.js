// education_qualification: ["A"],
// // [ A, AS, B, CM, COMM, CF, ECO, FIN, FE, FP, I ]
// professional_qualification: ["CFAUSA"],
// // [ CFAUSA, CETE, ACCA, AWPUSA, CFP, CFRMUSA, CAIAUSA, CFCUSA ]
// work_experience: ["DIP"],
// // [ DIP, MIP, SIP, RIP, PTIP, A ]
// cka_investment_experience: ["CFD"],
// // [ CFD, FX, SP, UT ]
// car_investment_experience: ["ETF"],
// // [ ETF, OPTS, FUT, DLC ]

const axios = require('axios');

const token = require('./CKA_CAR/token');
//  function generateRequestUid() {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';
//     for (let i = 0; i < 12; i++) {
//         result += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return result;
// }

// // Sử dụng hàm để cập nhật defaultRequestData
// const defaultRequestData = {
//     request_uid: generateRequestUid()
// };

// console.log(defaultRequestData.request_uid); // In ra request_uid ngẫu nhiên


// Dữ liệu mặc định cho yêu cầu
const defaultRequestData = {};

// Danh sách các test case
const testCases = [
    {
        description: "Only education_qualification",
        payload: {
            education_qualification: ["A"]
        },
        expectedStatusCode: 200,
        expectedError: null,
        expectedErrorCode: null
    },
    {
        description: "Only professional_qualification",
        payload: { professional_qualification: ["CFAUSA"] },
        expectedStatusCode: 200,
        expectedError: null,
        expectedErrorCode: null
    },
    {
        description: "Additional fields with cmfas_6a and cmfas_refused",
        payload: {
            professional_qualification: ["CFAUSA"],
            cmfas_6a: true,
            cmfas_6a_score: [0],
            cmfas_refused: true,
            cmfas_refused_times: 0
        },
        expectedStatusCode: 200,
        expectedError: null,
        expectedErrorCode: null
    },
    {
        description: "Complete with various scores and cmfas_refused set to False",
        payload: {
            professional_qualification: ["CFAUSA"],
            cmfas_6a: true,
            cmfas_6a_score: [99],
            cmfas_8a: true,
            cmfas_8a_score: [99, 10, 20, 11, 30, 12, 14, 15, 15, 1],
            cmfas_refused: false
        },
        expectedStatusCode: 200,
        expectedError: null,
        expectedErrorCode: null
    },
    {
        description: "Only work_experience",
        payload: { work_experience: ["DIP"] },
        expectedStatusCode: 200,
        expectedError: null,
        expectedErrorCode: null
    },
    {
        description: "Only cka_investment_experience",
        payload: { cka_investment_experience: ["CFD"] },
        expectedStatusCode: 200,
        expectedError: null,
        expectedErrorCode: null
    },
    {
        description: "Only car_investment_experience",
        payload: { car_investment_experience: ["ETF"] },
        expectedStatusCode: 200,
        expectedError: null,
        expectedErrorCode: null
    },
    {
        description: "Additional fields with cka_cfd and cka_refused",
        payload: {
            cka_cfd: true,
            cka_cfd_scores: [0],
            cka_refused: true,
            cka_refused_times: 0
        },
        expectedStatusCode: 200,
        expectedError: null,
        expectedErrorCode: null
    },
    {
        description: "Additional fields with cka_cfd and cka_refused set to False",
        payload: {
            cka_cfd: true,
            cka_cfd_scores: [99],
            cka_refused: false
        },
        expectedStatusCode: 200,
        expectedError: null,
        expectedErrorCode: null
    },
    {
        description: "Additional fields with car_learning and car_refused",
        payload: {
            car_learning: true,
            car_learning_score: [0],
            car_refused: true,
            car_refused_times: 0
        },
        expectedStatusCode: 200,
        expectedError: null,
        expectedErrorCode: null
    },
    {
        description: "Additional fields with car_learning and car_refused set to False",
        payload: {
            car_learning: true,
            car_learning_score: [99, 10, 20, 11, 30, 12, 14, 15, 15, 1],
            car_refused: false
        },
        expectedStatusCode: 200,
        expectedError: null,
        expectedErrorCode: null
    }
];

// function delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function runTestCases() {
//     for (let i = 0; i < testCases.length; i++) {
//         const testCase = testCases[i];

//         // Thực hiện test case
//         await runSingleTestCase(testCase);

//         // Nếu không phải test case cuối cùng, chờ 1 phút
//         if (i < testCases.length - 1) {
//             console.log('Waiting 1 minute before next test case...');
//             await delay(60000); // 60000 ms = 1 phút
//         }
//     }
// }

// async function runSingleTestCase(testCase) {
//     // for (const testCase of testCases) {
//         let requestData = { ...defaultRequestData
//             // request_uid: generateRequestUid()
//          };

//         // Xóa các key cần bỏ
//         if (testCase.omitKeys) {
//             testCase.omitKeys.forEach(key => {
//                 delete requestData[key];
//             });
//         }

//         // Thêm các trường bổ sung
//         if (testCase.payload) {
//             Object.assign(requestData, testCase.payload);
//         }
//         const startTime = Date.now();
//         try {
//             const response = await axios.post('https://atlas-dev-api.equix.app/v1/client/cka-car', requestData, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             const endTime = Date.now();
//             const duration = (endTime - startTime) / 1000;
//             console.log(`Duration: ${duration} seconds`); // Sửa đổi ở đây
//             // Log response details
//             console.log(`Test Case: ${testCase.description}`);
//             console.log('Request Data:', requestData);
//             console.log('Response Status:', response.status);
//             console.log('Response Data:', response.data);

//             const expectedResponse = {
//                 data: {
//                   processing: true
//                 },
//                 statusCode: 200
//               };

//             // Kiểm tra mã trạng thái phản hồi và dữ liệu trả về
//             if (
//                 response.status === testCase.expectedStatusCode &&
//                 JSON.stringify(response.data) === JSON.stringify(expectedResponse)
//             ) {
//                 console.log(`${testCase.description}: Passed`);
//             } else {
//                 console.log(`${testCase.description}: Failed`);
//                 console.log(`Expected status code ${testCase.expectedStatusCode}, got ${response.status}`);
//                 console.log(`Expected response ${JSON.stringify(testCase.expectedResponse)}, got ${JSON.stringify(response.data)}`);
//             }
//         } catch (error) {
//             const endTime = Date.now();
//             const duration = (endTime - startTime) / 1000;
//             console.log(`Duration: ${duration} seconds`); // Sửa đổi ở đây
//             console.log(`Test Case: ${testCase.description}`);
//             console.log('Request Data:', requestData);

//             if (error.response) {
//                 // Log response details in case of an error
//                 console.log('Response Status:', error.response.status);
//                 console.log('Response Data:', error.response.data);

//                 if (error.response.status === 400 && error.response.data.error === 100007) {
//                     console.log(`Token has expired. Please refresh the token.`);
//                 } else if (error.response.status === testCase.expectedStatusCode) {
//                     console.log(`${testCase.description}: Passed`);
//                 } else {
//                     console.log(`${testCase.description}: Failed`);
//                     console.log(`Expected status code ${testCase.expectedStatusCode}, got ${error.response.status}`);
//                 }
//             } else {
//                 // Log error details if no response is available
//                 console.log('Error Message:', error.message);
//                 console.log(`${testCase.description}: Failed`);
//             }
//         // }

//         console.log(''); // Add an empty line for better readability between test cases
//     }
// }

// console.log(`Running ${testCases.length} test cases...`);
// runTestCases();

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTestCases() {
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const testNumber = i + 1; // Số thứ tự của test case

        // Thực hiện test case
        await runSingleTestCase(testCase, testNumber);

        // Nếu không phải test case cuối cùng, chờ 1 phút
        if (i < testCases.length - 1) {
            console.log(`Waiting 1 minute before next test case (${testNumber + 1}/${testCases.length})...`);
            await delay(60000); // 60000 ms = 1 phút
        }
    }
}
async function callTradingProfileAPI() {
    try {
        const response = await axios.get('https://atlas-dev-api.equix.app/v1/client/trading-profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else {
            throw error;
        }
    }
}

async function runSingleTestCase(testCase, testNumber) {
    let requestData = { ...defaultRequestData };

    // Xóa các key cần bỏ
    if (testCase.omitKeys) {
        testCase.omitKeys.forEach(key => {
            delete requestData[key];
        });
    }

    // Thêm các trường bổ sung
    if (testCase.payload) {
        Object.assign(requestData, testCase.payload);
    }

    const startTime = Date.now();
    try {
        const response = await axios.post('https://atlas-dev-api.equix.app/v1/client/cka-car', requestData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        console.log(`Test Case ${testNumber}/${testCases.length}: ${testCase.description}`);
        console.log(`Duration: ${duration} seconds`);
        console.log('Request Data:', requestData);
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);

        const expectedResponse = {
            data: {
                processing: true
            },
            statusCode: 200
        };

        if (
            response.status === testCase.expectedStatusCode &&
            JSON.stringify(response.data) === JSON.stringify(expectedResponse)
        ) {
            console.log(`Test Case ${testNumber}: Passed`);
        } else {
            console.log(`Test Case ${testNumber}: Failed`);
            console.log(`Expected status code ${testCase.expectedStatusCode}, got ${response.status}`);
            console.log(`Expected response ${JSON.stringify(expectedResponse)}, got ${JSON.stringify(response.data)}`);
        }

        // Gọi API trading-profile sau khi test case hoàn thành
        console.log('Calling Trading Profile API...');
        const tradingProfileData = await callTradingProfileAPI();
        console.log('Trading Profile Data:', JSON.stringify(tradingProfileData, null, 2));

    } catch (error) {
        console.log(`Test Case ${testNumber}/${testCases.length}: ${testCase.description}`);
        console.log('Request Data:', requestData);

        if (error.response) {
            console.log('Response Status:', error.response.status);
            console.log('Response Data:', error.response.data);

            if (error.response.status === 400 && error.response.data.error === 100007) {
                console.log(`Token has expired. Please refresh the token.`);
            } else if (error.response.status === testCase.expectedStatusCode) {
                console.log(`Test Case ${testNumber}: Passed`);
            } else {
                console.log(`Test Case ${testNumber}: Failed`);
                console.log(`Expected status code ${testCase.expectedStatusCode}, got ${error.response.status}`);
            }
        } else {
            console.log('Error Message:', error.message);
            console.log(`Test Case ${testNumber}: Failed`);
        }
        // Gọi API trading-profile ngay cả khi test case thất bại
        console.log('Calling Trading Profile API...');
        const tradingProfileData = await callTradingProfileAPI();
        console.log('Trading Profile Data:', JSON.stringify(tradingProfileData, null, 2));
    }

    console.log(''); // Add an empty line for better readability between test cases
}

async function runTestCases() {
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const testNumber = i + 1;

        await runSingleTestCase(testCase, testNumber);

        if (i < testCases.length - 1) {
            console.log(`Waiting 1 minute before next test case (${testNumber + 1}/${testCases.length})...`);
            await delay(60000);
        }
    }
}

console.log(`Running ${testCases.length} test cases...`);
runTestCases();