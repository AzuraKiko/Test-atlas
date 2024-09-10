const axios = require('axios');
const token = require('./token');

// Dữ liệu mặc định cho yêu cầu
const defaultRequestData = {};

// Danh sách các test case
const testCases = [
    {
        description: "Only education_qualification",
        payload: { education_qualification: ["A"] },
        expectedStatusCode: 200,
        expectedError: null,
        expectedErrorCode: null
    }
];

const tokenCallback = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwYXJ0bmVyLWNnc2lAbm92dXMtZmludGVjaC5jb20iLCJzdWIiOiJDR1MiLCJ0eXBlIjoiRVdFIiwiZXhwIjoxNzUzNzgzMTc5LCJpYXQiOjE3MDI5NTkyMDR9.ogfC4jje99zvi0pHNOjPkVBZU8HwmFcsdZGD5giGqYWmht4kO7bh6Jpz3DgP3uLMHvDQnuCVEVor_o8FcQ-np4qjfhmpiHYjv3bN9RzaomN9kzq--SctBbTbuFiLRJR0QPE_oUdRSALtTzWs3TradxZecvHH6oTDQhFqwJ1SHEtY2McwlCyehiEVB9BqchSQ6JGGT8nDcGo7em6YcJgbPjWBTjs0XfDgI3ZZ_rPWiCVjhtvVNHHOjSQJ-r2HrsjTIpOZ-JwFvUHnULYzE6Db6Gt1acneGydeg1nR1ooMfPE4LlDPV7vdvm5DcQfBnuwi3KaOehn9nK_FUgL1GcI0yw";

async function callCallbackAPI() {
    const sixtyDaysAgo = Math.floor(Date.now() / 1000) - (60 * 24 * 60 * 60);
    const now = Math.floor(Date.now() / 1000);
    try {
        const response = await axios.post('https://atlas-dev-api.equix.app/v1/external/cka-car/callback', {
            party_id: "113900",
            request_uid: "3423sdfsdfsd",
            risk_preference: "string",
            client_grouping: "string",
            car: {
                status: true,
                car_expiry_date: sixtyDaysAgo // Timestamp 60 ngày trước
            }
        }, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenCallback}`
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else {
            throw error;
        }
    }
}

async function runTestCases() {
    for (const testCase of testCases) {
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

        try {
            // Gửi yêu cầu API chính
            const mainResponse = await axios.post('https://atlas-dev-api.equix.app/v1/client/cka-car', requestData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Gọi API callback ngay sau khi gửi yêu cầu API chính
            const callbackResponse = await callCallbackAPI(requestData);

            // Kiểm tra phản hồi từ callback
            if (callbackResponse.status === 200) {
                console.log(`Test Case: ${testCase.description} - Callback thành công`);
            } else {
                console.log(`Test Case: ${testCase.description} - Callback thất bại`);
                console.log(`Mã trạng thái phản hồi callback: ${callbackResponse.status}`);
                console.log(`Dữ liệu phản hồi callback: ${JSON.stringify(callbackResponse.data)}`);
            }

        } catch (error) {
            console.log(`Test Case: ${testCase.description}`);
            console.log('Dữ liệu yêu cầu:', requestData);

            if (error.response) {
                console.log('Mã trạng thái phản hồi:', error.response.status);
                console.log('Dữ liệu phản hồi:', error.response.data);

                if (error.response.status === 400 && error.response.data.error === 100007) {
                    console.log(`Token đã hết hạn. Vui lòng làm mới token.`);
                }
            } else {
                console.log('Thông báo lỗi:', error.message);
            }

            // Dù API chính thành công hay thất bại, vẫn gọi API callback
            const callbackResponse = await callCallbackAPI(requestData);

            if (callbackResponse.status === 200) {
                console.log(`Test Case: ${testCase.description} - Callback thành công sau lỗi`);
            } else {
                console.log(`Test Case: ${testCase.description} - Callback thất bại sau lỗi`);
                console.log(`Mã trạng thái phản hồi callback: ${callbackResponse.status}`);
                console.log(`Dữ liệu phản hồi callback: ${JSON.stringify(callbackResponse.data)}`);
            }
        }

        console.log(''); // Thêm một dòng trống để cải thiện khả năng đọc giữa các test case
    }
}

console.log(`Chạy ${testCases.length} test case...`);
runTestCases();
