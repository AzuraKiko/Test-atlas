const axios = require('axios');
const fs = require('fs');
const path = require('path');

let token = null;

async function refreshToken(refreshToken) {
    try {
        const response = await axios.post(
            'https://atlas-dev-api.equix.app/v1/auth/refresh',
            { refresh_token: refreshToken },
            {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        );

        // Log cấu trúc của response.data để kiểm tra
        console.log('Response data:', response.data);

        const { access_token } = response.data.data;

        if (!access_token) {
            throw new Error('Access token not found in response');
        }

        token = access_token; // Lưu token vào biến toàn cục
        await updateTokenFile(access_token); // Update token in a file if needed
        return access_token;
    } catch (error) {
        if (error.response) {
            console.error('Error refreshing token:', error.response.data);
        } else {
            console.error('Error refreshing token:', error.message);
        }
        throw error;
    }
}


async function updateTokenFile(newToken) {
    const filePath = path.resolve(__dirname, 'token.js');
    const content = `const token = '${newToken}';\nmodule.exports = token;\n`;
    fs.writeFileSync(filePath, content, 'utf8');
}

const refreshTokenValue = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJDTSMwMDAwMDAwMzY4IiwicGFydHlfaWQiOiIxMDAwMDUiLCJ0eXBlIjoiQ0xJRU5UIiwiZW1haWwiOiJjdW9uZy5uZ3V5ZW5Abm92dXMtZmludGVjaC5jb20iLCJwaG9uZV9udW1iZXIiOiIrODQzNTk2MzM0OTYiLCJzZXNzaW9uIjoiODExMjVmYTItZmU2Mi00ZjM4LWI2NTAtMzMxNzQ2MDhiMjZkIiwiZGV2aWNlX2lkIjoiOWNkNjhkNjMtOTE5Yy00ZDQ4LWFmZGEtNjc4NzY3MGM5YTRhIiwicGxhdGZvcm0iOiJ3ZWIiLCJva3RhX2luZm8iOnsidXNlcm5hbWUiOiJjdW9uZy5uZ3V5ZW4iLCJjb21wYW55X25hbWUiOiJDR1NTSVQifSwiZnVsbF9uYW1lIjoiQ3VvbmcuTmd1eWVuIiwiaWF0IjoxNzI1NDYwMjI0LCJleHAiOjE3MjU0NjEwNjR9.ewkupeHYnYYbKvhqUIM6nGLMNh4uFNmn2LkS4fpYtUCbOXJsuuCHFoDXuP3utl66apgxi1X_MWl8Efy10n6vkjM-zcMElNTATCrSWluMs-0kB36q1p8hjHpimPe8CsJrqu2i0a6aZ8OCM9MTr7S_Wx4NBzov5PjayiapUSJtkLEdjxFzHwxE_zTMSztpJp8HoEvO7pl3ecTd06gEIgxcIWUpxi4bYtx4qMmwlZzbMYpk6-LlJ6ib4dBQh-bXzpMoYn8mn9jDuwHDKLmbzibmru5jKjs4_Cd7Sn-zKgEzE_JsI5tusRWP6ubkfmWol2RE6FaQlwBciXWPE7AABNdmgw';

refreshToken(refreshTokenValue)
    .then(() => {
        console.log('Token refreshed successfully:', token);
    })
    .catch(err => {
        console.error('Failed to refresh token:', err);
    });
