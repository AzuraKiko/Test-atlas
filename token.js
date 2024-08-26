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

const refreshTokenValue = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJDTSMwMDAwMDAwMzUwIiwicGFydHlfaWQiOiIxMTQyMDAiLCJ0eXBlIjoiQ0xJRU5UIiwiZW1haWwiOiJ2YW4ubmd1eWVuQG5vdnVzLWZpbnRlY2guY29tIiwicGhvbmVfbnVtYmVyIjoiKzg0OTY4NzczODE5Iiwic2Vzc2lvbiI6IjgxMTQ3MzFhLTE2NGItNDg3Yy04NTVkLTI4YWE3NTRhZjI5ZiIsImRldmljZV9pZCI6IjE5Yjc5ZTQ1LTJlOTgtNGExZS1hMDcxLTY3ZDExZjMwNzUxMCIsInBsYXRmb3JtIjoid2ViIiwib2t0YV9pbmZvIjp7InVzZXJuYW1lIjoidmFuLm5ndXllbiIsImNvbXBhbnlfbmFtZSI6IkNHU1NJVCJ9LCJmdWxsX25hbWUiOiJWYW4gTmd1eWVuIiwiaWF0IjoxNzI0NjA1Nzg1LCJleHAiOjE3MjUyMTA1ODV9.IUHQ_dDvOo2M0Zm5ONvbaeTp1fRXYCNUfwFqk99ahxcQMX8DjSXFUyg3ub-vAfzz7DDpxGkIgUuDAdX2ngyLdRyQN8oPxf71geuXfRGEb67t5cRhrldi_dUhzWFcK01z0FDoDaZxxdhs4svqDG3QgRIl5F1uQFBCPz_jwpmTWq2qF-C1-vuQ5Hd7N2J61HHjyRHM9LuARQV5nvVREHxSH-9d9VfdR4IYDEzbF7HhAPUkcRfXrQlXxjwDJjO-4iyRmAV0rvqazR7c3SQiSP3LY94QZxBXohlel5xdk42lgpjiY93D-P2HL7ihrqDy9Q5sRk7x9eUwgVvAUXhi4wDYQg';

refreshToken(refreshTokenValue)
    .then(() => {
        console.log('Token refreshed successfully:', token);
    })
    .catch(err => {
        console.error('Failed to refresh token:', err);
    });
