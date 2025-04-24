console.log('修復開始');

const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app/bookings/[bookingId]/page.tsx');

if (fs.existsSync(filePath)) {
  console.log('找到檔案，開始修復');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 修改所有 isLoading 為 loading
  content = content.replace(/isLoading/g, 'loading');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('修復完成');
} else {
  console.error('找不到檔案');
}
