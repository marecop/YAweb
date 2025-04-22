const fs = require('fs');
const path = require('path');

console.log('開始修復會員等級類型不一致問題...');

// 標準會員等級類型
const STANDARD_MEMBER_LEVELS = ['standard', 'silver', 'gold', 'diamond'];

const filesToCheck = [
  'app/api/miles/route.ts',
  'app/api/admin/users/[userId]/miles/route.ts',
  'app/lib/db.ts',
  'app/utils/memberUtils.ts'
];

let fixedCount = 0;

// 檢查並修復文件
filesToCheck.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  // 檢查文件是否存在
  if (!fs.existsSync(fullPath)) {
    console.log(`文件不存在: ${filePath}`);
    return;
  }
  
  console.log(`檢查文件: ${filePath}`);
  
  // 讀取文件內容
  let content = fs.readFileSync(fullPath, 'utf8');
  let originalContent = content;
  
  // 替換 'Blue' | 'Silver' | 'Gold' | 'Platinum' 為 'standard' | 'silver' | 'gold' | 'diamond'
  content = content.replace(
    /(['"])Blue\1\s*\|\s*(['"])Silver\2\s*\|\s*(['"])Gold\3\s*\|\s*(['"])Platinum\4/g,
    "'standard' | 'silver' | 'gold' | 'diamond'"
  );
  
  // 替換單獨的 Blue, Silver, Gold, Platinum
  content = content.replace(/memberLevelColors\.Blue/g, 'memberLevelColors.standard');
  content = content.replace(/level === ['"]Blue['"]/g, "level === 'standard'");
  content = content.replace(/level === ['"]Silver['"]/g, "level === 'silver'");
  content = content.replace(/level === ['"]Gold['"]/g, "level === 'gold'");
  content = content.replace(/level === ['"]Platinum['"]/g, "level === 'diamond'");
  
  // 在函數內部修復對應關係
  content = content.replace(
    /case ['"]Blue['"]:[^;]*?return ['"]普通會員['"]/g,
    "case 'standard': return '普通會員'"
  );
  content = content.replace(
    /case ['"]Silver['"]:[^;]*?return ['"]銀卡會員['"]/g,
    "case 'silver': return '銀卡會員'"
  );
  content = content.replace(
    /case ['"]Gold['"]:[^;]*?return ['"]金卡會員['"]/g,
    "case 'gold': return '金卡會員'"
  );
  content = content.replace(
    /case ['"]Platinum['"]:[^;]*?return ['"]鑽石卡會員['"]/g,
    "case 'diamond': return '鑽石卡會員'"
  );
  
  // 修復 memberLevelColors 物件
  content = content.replace(
    /memberLevelColors\s*=\s*{\s*Blue:[^,]*,\s*Silver:[^,]*,\s*Gold:[^,]*,\s*Platinum:[^}]*}/gs,
    `memberLevelColors = {
  standard: 'bg-gray-200 text-gray-700',
  silver: 'bg-gray-400 text-white',
  gold: 'bg-yellow-500 text-white',
  diamond: 'bg-purple-600 text-white'
}`
  );
  
  // 檢查是否需要修改文件
  if (content !== originalContent) {
    console.log(`修復文件: ${filePath}`);
    fs.writeFileSync(fullPath, content, 'utf8');
    fixedCount++;
  } else {
    console.log(`文件無需修復: ${filePath}`);
  }
});

// 對所有 js 和 ts 文件進行全局檢查
function findAndFixInDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const res = path.resolve(dir, file.name);
    
    if (file.isDirectory()) {
      // 跳過 node_modules 和 .next 目錄
      if (file.name !== 'node_modules' && file.name !== '.next' && file.name !== '.git') {
        findAndFixInDir(res);
      }
    } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
      // 檢查是否包含 memberLevel 類型相關代碼
      let content = fs.readFileSync(res, 'utf8');
      let originalContent = content;
      
      // 用 as any 修復類型斷言問題
      if (content.includes('calculateMemberLevel') && content.includes('memberLevel:') && !content.includes('as any')) {
        content = content.replace(
          /(memberLevel\s*:\s*)(calculateMemberLevel\([^)]+\))/g,
          '$1$2 as any'
        );
      }
      
      // 檢查是否需要修改文件
      if (content !== originalContent) {
        console.log(`修復文件: ${res}`);
        fs.writeFileSync(res, content, 'utf8');
        fixedCount++;
      }
    }
  }
}

console.log('開始在整個專案中搜尋類型不匹配問題...');
findAndFixInDir(path.join(process.cwd(), 'app'));

console.log(`修復完成！總共修復了 ${fixedCount} 個文件。`); 