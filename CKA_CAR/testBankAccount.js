const axios = require('axios');
// const convertFileToBase64 = require('./convertToBase64');
const tokenBank = require('./tokenBank');
const token = require('./token');

// // Đường dẫn tới các file cần chuyển đổi
// const filePath1 = './1mb.png';
// const filePath2 = './2mb.jpg';
// const filePath3 = './2mb.pdf';

// // Chuyển đổi các file thành base64
// const base64String_1 = convertFileToBase64(filePath1);
// const base64String_2 = convertFileToBase64(filePath2);
// const base64String_3 = convertFileToBase64(filePath3);

const testCases = [
    {
        description: "Missing token",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        omitKeys: ["token"]
    },
    {
        description: "Missing account_holder_name",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        omitKeys: ["account_holder_name"]
    },
    {
        description: "Missing bank_name",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        omitKeys: ["bank_name"]
    },
    {
        description: "Missing currency_code",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        omitKeys: ["currency_code"]
    },
    {
        description: "Missing transfer_type",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        omitKeys: ["transfer_type"]
    },
    {
        description: "Missing bank_account_number",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        omitKeys: ["bank_account_number"]
    },
    {
        description: "Missing BSB Number (AUD currency)",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        omitKeys: ["bsb_number"],
        additionalFields: {
            "currency_code": "AUD"
        }
    },
    {
        description: "Missing swift_code",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        omitKeys: ["swift_code"]
    },
    // {
    //     description: "Missing file_name when file is present",
    //     expectedStatusCode: 400,
    //     expectedError: "Invalid Parameters",
    //     expectedErrorCode: 100001,
    //     additionalFields: {
    //         "files": [
    //             {
    //                 "file_type": "png",
    //                 "file_content": base64String_1
    //             }
    //         ]
    //     }
    // },
    // {
    //     description: "Missing file_type when file is present",
    //     expectedStatusCode: 400,
    //     expectedError: "Invalid Parameters",
    //     expectedErrorCode: 100001,
    //     additionalFields: {
    //         "files": [
    //             {
    //                 "file_name": "1mb.png",
    //                 "file_content": base64String_1
    //             }
    //         ]
    //     }
    // },
    // {
    //     description: "Missing file_content when file is present",
    //     expectedStatusCode: 400,
    //     expectedError: "Invalid Parameters",
    //     expectedErrorCode: 100001,
    //     additionalFields: {
    //         "files": [
    //             {
    //                 "file_name": "1mb.png",
    //                 "file_type": "png"
    //             }
    //         ]
    //     }
    // },
    {
        description: "Missing correspondence_bank_name when correspondence_bank is present",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        additionalFields: {
            "correspondence_bank": [
                {
                    "swift_code": "TESTSWIFT11"
                }
            ]
        }
    },
    {
        description: "Missing correspondence_bank_swift_code when correspondence_bank is present",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        additionalFields: {
            "correspondence_bank": [
                {
                    "bank_name": "Test Bank"
                }
            ]
        }
    },
    {
        description: "Missing BSB Number for correspondence_bank when currency is AUD",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        additionalFields: {
            "currency_code": "AUD",
            "correspondence_bank": [
                {
                    "bank_name": "Test Bank",
                    "swift_code": "TESTSWIFT11"
                }
            ]
        }
    },
    {
        description: "Invalid Bank Account Number format",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        additionalFields: {
            "bank_account_number": "1234567890123456789012345678901"
        }
    },
    {
        description: "Invalid Bank Name format",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        additionalFields: {
            "bank_name": "ThisBankNameIsWayTooLongAndShouldFa9"
        }
    },
    {
        description: "Invalid SWIFT Code format",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        additionalFields: {
            "swift_code": "1234567890"
        }
    },
    {
        description: "Invalid BSB Number format (6 numeric)",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        additionalFields: {
            "bsb_number": "1234jdkdkd"
        }
    },
    {
        description: "Invalid Sort code format (6 numeric)",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        additionalFields: {
            "sort_code": "1234jdkdkd"
        }
    },
    {
        description: "Invalid ABA number format (9 numeric)",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        additionalFields: {
            "aba_number": "123432324"
        }
    },
    {
        description: "Invalid BSB Number format 10 chars",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        additionalFields: {
            "bsb_number": "1234567890"
        }
    },
    {
        description: "Invalid Sort code format 10 chars",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        additionalFields: {
            "sort_code": "1234567890"
        }
    },
    {
        description: "Invalid ABA number format 13 chars",
        expectedStatusCode: 400,
        expectedError: "Invalid Parameters",
        expectedErrorCode: 100001,
        additionalFields: {
            "aba_number": "12345678903233"
        }
    }
];

const defaultRequestData = {
    token: tokenBank,
    account_type: "Cash",
    account_number: "0223344",
    account_holder_name: "Tu Nguyen",
    transfer_type: "FAST",
    currency_code: "SGD",
    bank_name: "SCB",
    bank_account_number: "453434325",
    swift_code: "SCBLSGSG",
    // bsb_number: "123456",
    // sort_code: "123456",
    // aba_number: "123456789",
    // file_count: 3,
    // files: [
    //     {
    //         file_name: "1mb.png",
    //         file_type: "png",
    //         file_content: base64String_1
    //     },
    //     {
    //         file_name: "2mb.jpg",
    //         file_type: "jpg",
    //         file_content: base64String_2
    //     },
    //     {
    //         file_name: "2mb.pdf",
    //         file_type: "pdf",
    //         file_content: base64String_3
    //     }
    // ],
    correspondence_bank: [
        {
            bank_name: "Correspondence Bank",
            swift_code: "CBAUS6S",
            bank_address_1: "123 Main St",
            bank_address_2: "Suite 100",
            bank_address_3: "City, Country",
            // bsb_number: "123456",
            // sort_code: "123456",
            // aba_number: "123456789",
            receiver_info: "John Doe",
            message: "Payment for services"
        }
    ]
};

// async function runTestCases() {
//     for (const testCase of testCases) {
//         let requestData = { ...defaultRequestData };

//         // Xóa các key cần bỏ
//         if (testCase.omitKeys) {
//             testCase.omitKeys.forEach(key => {
//                 delete requestData[key];
//             });
//         }
//         if (testCase.additionalFields) {
//             Object.assign(requestData, testCase.additionalFields);
//         }

//         try {
//             const response = await axios.post('https://atlas-dev-api.equix.app/v1/bank-account', requestData, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 }
//             });

//             // Kiểm tra mã trạng thái phản hồi và dữ liệu trả về
//             if (
//                 response.status === testCase.expectedStatusCode &&
//                 response.data.error === testCase.expectedErrorCode &&
//                 response.data.message === testCase.expectedError
//             ) {
//                 console.log(`${testCase.description}: Passed`);

//                 // // Success
//                 // console.log(`Status code is ${response.status}`);
//                 // if (response.status === 200) {
//                 //     const jsonData = response.data;
//                 //     if (jsonData.data && jsonData.data.pi_reference_id) {
//                 //         console.log("Response contains pi_reference_id");
//                 //     } else {
//                 //         console.log("Response does not contain pi_reference_id");
//                 //     }
//                 // }

//             } else {
//                 console.log(`${testCase.description}: Failed - Expected status code ${testCase.expectedStatusCode}, got ${response.status}`);
//                 console.log(`Expected error code ${testCase.expectedErrorCode}, got ${response.data.error}`);
//                 console.log(`Expected error message "${testCase.expectedError}", got "${response.data.message}"`);
//             }
//         } catch (error) {
//             if (error.response && error.response.status === testCase.expectedStatusCode) {
//                 console.log(`${testCase.description}: Passed`);
//             } else {
//                 console.log(`${testCase.description}: Failed - ${error.message}`);
//             }
//         }
//     }
// }

async function runTestCases() {
    for (const testCase of testCases) {
        let requestData = { ...defaultRequestData };

        // Xóa các key cần bỏ
        if (testCase.omitKeys) {
            testCase.omitKeys.forEach(key => {
                delete requestData[key];
            });
        }
        if (testCase.additionalFields) {
            Object.assign(requestData, testCase.additionalFields);
        }

        try {
            const response = await axios.post('https://atlas-dev-api.equix.app/v1/bank-account', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            // Log response details
            console.log(`Test Case: ${testCase.description}`);
            console.log('Request Data:', requestData);
            console.log('Response Status:', response.status);
            console.log('Response Data:', response.data);

            // Kiểm tra mã trạng thái phản hồi và dữ liệu trả về
            if (
                response.status === testCase.expectedStatusCode &&
                response.data.error === testCase.expectedErrorCode &&
                response.data.message === testCase.expectedError
            ) {
                console.log(`${testCase.description}: Passed`);
            } else {
                console.log(`${testCase.description}: Failed`);
                console.log(`Expected status code ${testCase.expectedStatusCode}, got ${response.status}`);
                console.log(`Expected error code ${testCase.expectedErrorCode}, got ${response.data.error}`);
                console.log(`Expected error message "${testCase.expectedError}", got "${response.data.message}"`);
            }
        } catch (error) {
            console.log(`Test Case: ${testCase.description}`);
            console.log('Request Data:', requestData);
            
            if (error.response) {
                // Log response details in case of an error
                console.log('Response Status:', error.response.status);
                console.log('Response Data:', error.response.data);
                
                // Check for token expiry error separately
                if (error.response.status === 400 && error.response.data.error === 100007) {
                    console.log(`Token has expired. Please refresh the token.`);
                } else if (error.response.status === testCase.expectedStatusCode) {
                    console.log(`${testCase.description}: Passed`);
                } else {
                    console.log(`${testCase.description}: Failed`);
                    console.log(`Expected status code ${testCase.expectedStatusCode}, got ${error.response.status}`);
                }
            } else {
                // Log error details if no response is available
                console.log('Error Message:', error.message);
                console.log(`${testCase.description}: Failed`);
            }
        }

        console.log(''); // Add an empty line for better readability between test cases
    }
}

console.log(`Running ${testCases.length} test cases...`);
runTestCases();