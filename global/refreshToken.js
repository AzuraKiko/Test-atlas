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

const refreshTokenValue = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJDTSMwMDAwMDAwMzU2IiwicGFydHlfaWQiOiIxMDAwMDMiLCJ0eXBlIjoiQ0xJRU5UIiwiZW1haWwiOiJ0dS5uZ3V5ZW5Abm92dXMtZmludGVjaC5jb20iLCJwaG9uZV9udW1iZXIiOiIrODQzMzIxMTg4OTQiLCJzZXNzaW9uIjoiYTE4ZmIyOTktZDM3My00NDcwLTkzNDYtM2I3ZmEyMWNiMjY2IiwiZGV2aWNlX2lkIjoiZGVjNzA3NWMtMGRlYS00NThkLWIyZmUtNGQwZDExYWFiZGE5IiwicGxhdGZvcm0iOiJ3ZWIiLCJva3RhX2luZm8iOnsidXNlcm5hbWUiOiJ0dS5uZ3V5ZW4iLCJjb21wYW55X25hbWUiOiJDR1NTSVQifSwiZnVsbF9uYW1lIjoiVHUgTmd1eWVuIiwiaWF0IjoxNzI2MTU5MDUwLCJleHAiOjE3MjYxNTk4OTB9.U_wvnv0PUa-IB27b8GC5HarZMq9VcNCM-QhtILZ04cyPNW2HJ1S1y4wF35d6Dz47rbmLmmH0QnkM0uoHvWQdWFFJGFkgLx0S5Sahdr3MbJDm-QQKrrAuxhRZWg-D2inLr1OFpACPOXD7phXXuvkMEPG8sPnX50uE7HEf4Q_lXIMLMc3nps0PeUkwlVwPDpjkWBGFSw34TlWnTQ6ldlAZ_QEU6Z5HolzOFoGqc4LtUmCI-5nZQ35AefqkSUf3AKo4PXkmBgIqRHfnFK69O__WmYbaSDQvB-vG4fPUPwl-e0SyVgO0tVQ4k2AjZ_GYz_iO6yPgWszVZwx4rRchXvBUTQ';

refreshToken(refreshTokenValue)
    .then(() => {
        console.log('Token refreshed successfully:', token);
    })
    .catch(err => {
        console.error('Failed to refresh token:', err);
    });
