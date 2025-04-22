const fs = require('fs');
const path = require('path');

console.log('開始修復登入返回類型問題...');

const authContextPath = path.resolve(__dirname, '../app/contexts/AuthContext.tsx');

// 檢查檔案是否存在
if (!fs.existsSync(authContextPath)) {
  console.error(`找不到檔案: ${authContextPath}`);
  process.exit(1);
}

// 讀取檔案內容
let authContextContent = fs.readFileSync(authContextPath, 'utf8');

// 修正登入函數的返回類型
// 1. 確保 login 函數返回正確的 Promise<AuthResponse> 類型
authContextContent = authContextContent.replace(
  /async function handleLogin\([^)]*\)\s*{/,
  `async function handleLogin(email: string, password: string): Promise<AuthResponse> {`
);

// 2. 確保 register 函數返回正確的 Promise<AuthResponse> 類型
authContextContent = authContextContent.replace(
  /async function handleRegister\([^)]*\)\s*{/,
  `async function handleRegister(params: RegisterParams): Promise<AuthResponse> {`
);

// 確保正確引入類型
if (!authContextContent.includes('import { AuthResponse, RegisterParams')) {
  authContextContent = authContextContent.replace(
    /import {([^}]*)} from ['"]\.\.\/lib\/auth['"];/,
    `import {$1, AuthResponse, RegisterParams} from '../lib/auth';`
  );
}

// 寫入修改後的檔案
fs.writeFileSync(authContextPath, authContextContent);

console.log('AuthContext.tsx 檔案已成功修復登入返回類型!');

// 檢查並修改 app/auth/login/page.tsx 檔案
const loginPagePath = path.resolve(__dirname, '../app/auth/login/page.tsx');

if (fs.existsSync(loginPagePath)) {
  let loginPageContent = fs.readFileSync(loginPagePath, 'utf8');
  
  // 更新 handleSubmit 函數，正確處理登入回應
  loginPageContent = loginPageContent.replace(
    /const handleSubmit = async \(e: React\.FormEvent\) => {[^}]*const response = await login\(email, password\);[^}]*}/s,
    `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await login(email, password);
      if (response.success && response.user) {
        router.push('/member');
      } else {
        setError(response.message || '登入失敗，請檢查您的憑證。');
      }
    } catch (error) {
      setError('登入過程中發生錯誤，請稍後再試。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }`
  );
  
  fs.writeFileSync(loginPagePath, loginPageContent);
  console.log('app/auth/login/page.tsx 檔案已成功更新!');
}

// 檢查並修改 app/auth/register/page.tsx 檔案
const registerPagePath = path.resolve(__dirname, '../app/auth/register/page.tsx');

if (fs.existsSync(registerPagePath)) {
  let registerPageContent = fs.readFileSync(registerPagePath, 'utf8');
  
  // 更新註冊頁面中的提交處理
  registerPageContent = registerPageContent.replace(
    /const handleSubmit = async \(e: React\.FormEvent\) => {[^}]*const response = await register\([^)]*\);[^}]*}/s,
    `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (password !== confirmPassword) {
      setError('密碼與確認密碼不符，請重新輸入。');
      setLoading(false);
      return;
    }
    
    try {
      const response = await register({
        firstName,
        lastName,
        email,
        password
      });
      
      if (response.success && response.user) {
        router.push('/member');
      } else {
        setError(response.message || '註冊失敗，請稍後再試。');
      }
    } catch (error) {
      setError('註冊過程中發生錯誤，請稍後再試。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }`
  );
  
  fs.writeFileSync(registerPagePath, registerPageContent);
  console.log('app/auth/register/page.tsx 檔案已成功更新!');
}

console.log('登入返回類型修復已完成！'); 