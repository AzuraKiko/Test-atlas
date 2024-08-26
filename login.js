// const axios = require('axios');

// async function login(oktaCode, cgsCode) {
//   try {
//     const response = await axios.post(
//       'https://atlas-dev-api.equix.app/v1/auth/login',
//       { okta_code: oktaCode, cgs_code: cgsCode },
//       {
//         headers: {
//           'Accept': 'application/json, text/plain, */*',
//           'Content-Type': 'application/json'
//         }
//       }
//     );
//     // Giả sử phản hồi chứa refresh_token và access_token
//     const { refresh_token, access_token } = response.data;
//     return { refreshToken: refresh_token, accessToken: access_token };
//   } catch (error) {
//     console.error('Login failed:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// }

// // Ví dụ gọi hàm đăng nhập
// login('48BbgBZajLYqifeVIMm9C_NMF-lnIkSzx94v_3HObyE', 'c2fe5514-80f6-46c1-99b2-a66a10d426cc.b0574d0d-dac1-4662-b97a-5c2b8c639942.3ef55347-460e-4780-b481-a80fc2881de8')
//   .then(tokens => {
//     console.log('Logged in successfully. Refresh Token:', tokens.refreshToken);
//     // Lưu tokens.refreshToken để sử dụng cho việc làm mới token sau này
//   })
//   .catch(err => {
//     console.error('Login failed:', err);
//   });
