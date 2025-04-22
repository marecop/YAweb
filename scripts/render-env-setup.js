/** 此腳本專門為Render部署設置環境變數 */
const fs = require('fs'); const path = require('path');
console.log('=========================='); console.log('設置Render環境變數...'); console.log('==========================');
// 設置MongoDB連接變數
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yelluser:yell2024pass@cluster0.atvupvb.mongodb.net/yellairlines?retryWrites=true&w=majority';
const USE_MOCK_DB = process.env.USE_MOCK_DB || 'false'; const JWT_SECRET = process.env.JWT_SECRET || 'yellow_airlines_jwt_secret_key_2024';
// 處理.env.local文件
const envLocalPath = path.join(process.cwd(), '.env.local');
const envLocalContent = '# 自動生成的Render環境配置
MONGODB_URI=' + MONGODB_URI + '
USE_MOCK_DB=' + USE_MOCK_DB + '
JWT_SECRET=' + JWT_SECRET + '
NEXT_DISABLE_CACHE=1';
console.log('寫入.env.local文件...'); fs.writeFileSync(envLocalPath, envLocalContent, 'utf8');
console.log('============================'); console.log('Render環境變數設置完成'); console.log('============================');
