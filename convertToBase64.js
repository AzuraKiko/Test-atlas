// const fs = require('fs');

// // Hàm để chuyển đổi file thành base64 và kiểm tra kích thước
// function convertFileToBase64(filePath) {
//     try {
//         // Lấy thông tin file bao gồm kích thước
//         const stats = fs.statSync(filePath);
//         const fileSizeInBytes = stats.size;
//         const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

//         console.log(`File: ${filePath}`);
//         console.log(`File size: ${fileSizeInMB.toFixed(2)} MB`);

//         // Đọc nội dung file dưới dạng buffer
//         const fileBuffer = fs.readFileSync(filePath);

//         // Chuyển đổi buffer thành chuỗi base64
//         const base64Data = fileBuffer.toString('base64');

//         return base64Data;
//     } catch (error) {
//         console.error(`Error converting file to base64 for file ${filePath}:`, error);
//         return null;
//     }
// }
// module.exports = convertFileToBase64;

// // // Đường dẫn tới các file cần chuyển đổi
// // const filePath1 = './1mb.png';
// // const filePath2 = './2mb.jpg';
// // const filePath3 = './300KB.jpg';

// // // Chuyển đổi các file và lưu vào các biến khác nhau
// // const base64String_1 = convertFileToBase64(filePath1);
// // const base64String_2 = convertFileToBase64(filePath2);
// // const base64String_3 = convertFileToBase64(filePath3);

// // // In ra kết quả
// // if (base64String_1) {
// //     console.log('Base64 String 1:', base64String_1.substring(0, 100) + '...');
// // }
// // if (base64String_2) {
// //     console.log('Base64 String 2:', base64String_2.substring(0, 100) + '...');
// // }
// // if (base64String_3) {
// //     console.log('Base64 String 3:', base64String_3.substring(0, 100) + '...');
// // }

