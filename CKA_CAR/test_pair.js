const axios = require('axios');
const token = require('./token');
const partyId = "114100";

const sixtyDaysAgo = Math.floor(Date.now() / 1000) - (60 * 24 * 60 * 60);

const tokenCallback = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwYXJ0bmVyLWNnc2lAbm92dXMtZmludGVjaC5jb20iLCJzdWIiOiJDR1MiLCJ0eXBlIjoiRVdFIiwiZXhwIjoxNzUzNzgzMTc5LCJpYXQiOjE3MDI5NTkyMDR9.ogfC4jje99zvi0pHNOjPkVBZU8HwmFcsdZGD5giGqYWmht4kO7bh6Jpz3DgP3uLMHvDQnuCVEVor_o8FcQ-np4qjfhmpiHYjv3bN9RzaomN9kzq--SctBbTbuFiLRJR0QPE_oUdRSALtTzWs3TradxZecvHH6oTDQhFqwJ1SHEtY2McwlCyehiEVB9BqchSQ6JGGT8nDcGo7em6YcJgbPjWBTjs0XfDgI3ZZ_rPWiCVjhtvVNHHOjSQJ-r2HrsjTIpOZ-JwFvUHnULYzE6Db6Gt1acneGydeg1nR1ooMfPE4LlDPV7vdvm5DcQfBnuwi3KaOehn9nK_FUgL1GcI0yw";

const RequestUid = 'abc123456789' + new Date().getHours()+ new Date().getMinutes();


// Default request data
const defaultRequestData = {};

// Test cases with corresponding callback scenarios
const testCases = [
    {
        description: "Only education_qualification",
        payload: { education_qualification: ["A"] },
        expectedStatusCode: 200,
        expectedError: null,
        expectedErrorCode: null,
        callbackData: {
            request_uid: RequestUid,
            party_id: partyId,
            risk_preference: "string",
            client_grouping: "string",
            CAR: {
                status: true,
                car_expiry_date: sixtyDaysAgo // 60 days ago
            }
        }
    },
    {
        description: "Only cka_investment_experience",
        payload: { cka_investment_experience: ["CFD"] },
        expectedStatusCode: 200,
        expectedError: null,
        expectedErrorCode: null,
        callbackData: {
            request_uid: RequestUid,
            party_id: partyId,
            risk_preference: "string",
            client_grouping: "string",
            CKA: {
                status: true,
                cka_cfd_expiry_date: sixtyDaysAgo // 60 days ago
            }
        }
    }
];

async function callCallbackAPI(callbackData) {
    try {
        const requestDataCallback = {
            ...callbackData
        };

        console.log('Callback Request Data:', JSON.stringify(requestDataCallback, null, 2));

        const response = await axios.post('https://atlas-dev-api.equix.app/v1/external/cka-car/callback', requestDataCallback, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenCallback}`
            }
        });

        console.log('Callback Response Status:', response.status);
        console.log('Callback Response Data:', JSON.stringify(response.data, null, 2));

        return response;
    } catch (error) {
        if (error.response) {
            console.log('Callback Error Response Status:', error.response.status);
            console.log('Callback Error Response Data:', JSON.stringify(error.response.data, null, 2));
            return error.response;
        } else {
            console.log('Callback Error:', error.message);
            throw error;
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

async function runTestCases() {
    for (const testCase of testCases) {
        let requestData = { ...defaultRequestData };

        // Add custom payload to the request data
        if (testCase.payload) {
            Object.assign(requestData, testCase.payload);
        }

        let callbackResponse;
        const startTime = Date.now(); // Ghi lại thời gian bắt đầu
        try {
            // Send the main API request
            const response = await axios.post('https://atlas-dev-api.equix.app/v1/client/cka-car', requestData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            // Ghi lại thời gian hoàn thành
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;
            console.log(`Time taken for API request: ${duration} seconds`);


            // Log callback request data
            console.log('Callback Request Data:', JSON.stringify(testCase.callbackData, null, 2));

            // Call the callback API with the corresponding callbackData
            callbackResponse = await callCallbackAPI(testCase.callbackData);

            // Gọi thêm API trading-profile để kiểm tra trạng thái
            const tradingProfileData = await callTradingProfileAPI();
            console.log('Trading Profile Data:', JSON.stringify(tradingProfileData, null, 2));

        } catch (error) {
            console.log(`Test Case: ${testCase.description}`);
            console.log('Request Data:', requestData);

            if (error.response) {
                console.log('Response Status:', error.response.status);
                console.log('Response Data:', error.response.data);

                if (error.response.status === 400 && error.response.data.error === 100007) {
                    console.log(`Token has expired. Please refresh the token.`);
                }

                // Log callback request data even in case of error
                console.log('Callback Request Data:', JSON.stringify(testCase.callbackData, null, 2));

                // Gọi thêm API trading-profile để kiểm tra trạng thái
                const tradingProfileData = await callTradingProfileAPI();
                console.log('Trading Profile Data:', JSON.stringify(tradingProfileData, null, 2));
            } else {
                console.log('Error Message:', error.message);
            }
        }

        if (callbackResponse) {
            console.log(`Callback Response Status: ${callbackResponse.status}`);
            console.log(`Callback Response Data: ${JSON.stringify(callbackResponse.data)}`);
        }

        console.log(''); // Add a blank line for readability between test cases
    }
}

console.log(`Running ${testCases.length} test case(s)...`);
runTestCases();
