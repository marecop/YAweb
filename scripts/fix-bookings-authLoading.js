/**
 * 此腳本用於修復預訂詳情頁面中的authLoading命名問題
 */

const fs = require('fs');
const path = require('path');

console.log('開始修復預訂詳情頁面中的authLoading命名問題...');

// 定義要修改的文件路徑
const bookingDetailPagePath = path.join(process.cwd(), 'app/bookings/[bookingId]/page.tsx');

if (fs.existsSync(bookingDetailPagePath)) {
  console.log(`找到預訂詳情頁面：${bookingDetailPagePath}`);
  
  // 讀取文件內容
  let content = fs.readFileSync(bookingDetailPagePath, 'utf8');
  let modified = false;
  
  // 首先處理本地的isLoading狀態變量，避免命名衝突
  if (content.match(/const\s*\[\s*isLoading\s*,\s*setLoading\s*\]\s*=\s*useState/)) {
    console.log('發現本地isLoading狀態變量，將其重命名為pageLoading...');
    
    // 修改useState部分
    content = content.replace(
      /const\s*\[\s*isLoading\s*,\s*setLoading\s*\]\s*=\s*useState/g,
      'const [pageLoading, setPageLoading] = useState'
    );
    
    // 修改所有對setLoading的引用
    content = content.replace(/setLoading\s*\(/g, 'setPageLoading(');
    
    // 修改所有對本地isLoading的引用
    // 先處理if條件內的完整單詞匹配
    content = content.replace(/if\s*\(\s*isLoading\s*\)/g, 'if (pageLoading)');
    content = content.replace(/if\s*\(\s*!\s*isLoading\s*\)/g, 'if (!pageLoading)');
    
    // 處理JSX中的使用
    content = content.replace(
      /{isLoading(\s*\?[^:]+:[^}]+)}/g,
      '{pageLoading$1}'
    );
    
    // 處理其他單獨使用isLoading的場景，但要小心避免修改從useAuth解構出來的isLoading
    const lines = content.split('\n');
    const updatedLines = lines.map(line => {
      // 如果行包含"useAuth"，跳過處理
      if (line.includes('useAuth')) {
        return line;
      }
      
      // 對不包含useAuth的行，替換獨立的isLoading變量
      return line.replace(/\bisLoading\b(?!\s*[.:=}])/g, 'pageLoading');
    });
    
    content = updatedLines.join('\n');
    modified = true;
  }
  
  // 處理AuthContext的解構賦值
  if (content.includes('loading: authLoading') || 
      content.includes('loading,') || 
      content.includes('loading }')) {
    console.log('修復AuthContext解構賦值...');
    
    // 替換loading為isLoading
    content = content.replace(
      /const\s*{\s*([^}]*)\bloading\b([^}]*)\}\s*=\s*useAuth\(\)/g,
      'const {$1isLoading$2} = useAuth()'
    );
    
    // 替換別名寫法，如果存在
    content = content.replace(
      /const\s*{\s*([^}]*)isLoggedIn\s*,\s*user\s*,\s*loading\s*:\s*authLoading\s*([^}]*)\}\s*=\s*useAuth\(\)/g,
      'const {$1isLoggedIn, user, isLoading$2} = useAuth()'
    );
    
    // 處理authLoading的引用
    content = content.replace(/\bauthLoading\b/g, 'isLoading');
    
    modified = true;
  }
  
  // 處理可能出現的isLoading: authLoading情況
  if (content.includes('isLoading: authLoading')) {
    console.log('修復isLoading別名...');
    
    content = content.replace(
      /const\s*{\s*([^}]*)isLoading\s*:\s*authLoading\s*([^}]*)\}\s*=\s*useAuth\(\)/g,
      'const {$1isLoading$2} = useAuth()'
    );
    
    // 處理authLoading的引用
    content = content.replace(/\bauthLoading\b/g, 'isLoading');
    
    modified = true;
  }
  
  // 確保代碼中對loading的所有引用都被替換成isLoading或pageLoading
  if (content.match(/\bloading\b(?!\s*[.:=])/) && 
      !content.match(/const\s*{\s*[^}]*\bloading\b[^}]*}\s*=/)) {
    console.log('處理剩餘的loading引用...');
    
    // 處理在if條件等位置的loading引用
    content = content.replace(/\bloading\b(?!\s*[.:=}])/g, 'isLoading');
    
    modified = true;
  }
  
  // 仔細檢查是否有重複定義isLoading的情況
  if (content.match(/const\s*{\s*[^}]*isLoading[^}]*}\s*=\s*useAuth\(\)/) && 
      content.match(/const\s*\[\s*isLoading\s*,/)) {
    console.log('檢測到嚴重的命名衝突！強制修復...');
    
    // 強制使用pageLoading
    content = content.replace(
      /const\s*\[\s*isLoading\s*,\s*setLoading\s*\]\s*=\s*useState/g,
      'const [pageLoading, setPageLoading] = useState'
    );
    
    // 確保引用也被修改
    const lines = content.split('\n');
    const updatedLines = lines.map(line => {
      // 如果行已經包含"pageLoading"或包含"useAuth"，跳過處理
      if (line.includes('pageLoading') || line.includes('useAuth')) {
        return line;
      }
      
      // 對其他行，替換isLoading為pageLoading（除非是在參數、屬性或其他不應修改的上下文中）
      if (line.includes('isLoading') && 
          !line.includes('isLoading:') && 
          !line.includes('isLoading =') && 
          !line.includes('isLoading}')) {
        return line.replace(/\bisLoading\b(?!\s*[.:=}])/g, 'pageLoading');
      }
      
      return line;
    });
    
    content = updatedLines.join('\n');
    
    // 替換setLoading引用
    content = content.replace(/setLoading\s*\(/g, 'setPageLoading(');
    
    modified = true;
  }
  
  // 最終檢查是否仍然有重複定義isLoading的情況
  if (content.match(/const\s*{\s*[^}]*isLoading[^}]*}\s*=\s*useAuth\(\)/) && 
      content.match(/const\s*\[\s*isLoading\s*,/)) {
    console.log('警告：仍然存在命名衝突！執行最後的修復手段...');
    
    // 直接替換整行，修改所有useState部分
    content = content.replace(
      /const\s*\[\s*isLoading\s*,\s*setLoading\s*\]\s*=\s*useState\((.*?)\)/g,
      'const [pageLoading, setPageLoading] = useState($1)'
    );
    
    modified = true;
  }
  
  if (modified) {
    // 寫入修改後的內容
    fs.writeFileSync(bookingDetailPagePath, content, 'utf8');
    console.log('✅ 已修復預訂詳情頁面中的變量命名問題');
  } else {
    console.log('⚠️ 未找到需要修復的問題');
  }
} else {
  console.error(`❌ 找不到預訂詳情頁面：${bookingDetailPagePath}`);
}

console.log('預訂詳情頁面修復完成'); 