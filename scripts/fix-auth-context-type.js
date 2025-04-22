/**
 * 此腳本用於修復AuthContextType類型定義中isLoading/loading屬性的問題
 */

const fs = require('fs');
const path = require('path');

console.log('開始修復AuthContext中的類型定義...');

// 定義要修改的文件路徑
const authContextPath = path.join(process.cwd(), 'app/contexts/AuthContext.tsx');

if (fs.existsSync(authContextPath)) {
  console.log(`找到AuthContext文件：${authContextPath}`);
  
  // 讀取文件內容
  let content = fs.readFileSync(authContextPath, 'utf8');
  let modified = false;
  
  // 檢查AuthContextType接口中是否有isLoading屬性
  const authContextTypeMatch = content.match(/export\s+interface\s+AuthContextType\s*{([\s\S]*?)}/);
  if (authContextTypeMatch) {
    const authContextTypeContent = authContextTypeMatch[1];
    
    // 檢查接口內容是否已經包含isLoading
    if (!authContextTypeContent.includes('isLoading:')) {
      console.log('AuthContextType接口中缺少isLoading屬性，進行添加...');
      
      // 替換接口定義，添加isLoading屬性
      const newInterface = `export interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateUser: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
  clearError: () => void;
}`;
      
      content = content.replace(/export\s+interface\s+AuthContextType\s*{[\s\S]*?}/, newInterface);
      modified = true;
    } else {
      console.log('AuthContextType接口已包含isLoading屬性，無需修改');
    }
  }
  
  // 確保contextValue中使用isLoading而不是loading
  const contextValueMatch = content.match(/const\s+contextValue\s*=\s*{([\s\S]*?)};/);
  if (contextValueMatch) {
    const contextValueContent = contextValueMatch[1];
    
    // 檢查contextValue是否已經使用了isLoading
    if (contextValueContent.includes('loading,') || contextValueContent.includes('loading:')) {
      console.log('contextValue中使用了loading屬性，修改為isLoading...');
      
      // 替換contextValue中的loading為isLoading
      content = content.replace(
        /(\s*)(loading)(\s*)(,|:)/g,
        '$1isLoading$3$4'
      );
      
      modified = true;
    }
  }
  
  // 檢查組件中的loading變量聲明
  if (content.includes('const [loading, setLoading]') || 
      content.includes('loading, setLoading')) {
    console.log('找到loading狀態聲明，修改為isLoading...');
    
    // 修改狀態聲明
    content = content.replace(
      /const\s*\[\s*loading\s*,\s*setLoading\s*\]\s*=\s*useState/g,
      'const [isLoading, setIsLoading] = useState'
    );
    
    // 修改setLoading的使用
    content = content.replace(/setLoading\s*\(/g, 'setIsLoading(');
    
    modified = true;
  }
  
  // 檢查並修改所有獨立引用的loading變量為isLoading
  if (modified) {
    // 將所有獨立的loading引用改為isLoading
    const lines = content.split('\n');
    let updatedContent = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 跳過已處理過的行或不適合處理的行
      if (line.includes('setIsLoading') || 
          line.includes('isLoading,') || 
          line.includes('isLoading =') ||
          line.includes('isLoading:') ||
          line.includes('= isLoading') ||
          line.includes('AuthContextType')) {
        updatedContent += line + '\n';
        continue;
      }
      
      // 替換loading為isLoading，但要避免替換變量聲明等
      const updatedLine = line.replace(/\bloading\b(?!\s*[,.:=])/g, 'isLoading');
      updatedContent += updatedLine + '\n';
    }
    
    content = updatedContent.trim();
  }
  
  if (modified) {
    // 寫入修改後的內容
    fs.writeFileSync(authContextPath, content, 'utf8');
    console.log('✅ 已修復AuthContext中的類型定義問題');
  } else {
    console.log('⚠️ 未找到需要修復的類型定義問題');
  }
} else {
  console.error(`❌ 找不到AuthContext文件：${authContextPath}`);
}

console.log('AuthContext類型定義修復完成'); 