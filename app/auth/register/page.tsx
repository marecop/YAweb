'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RegisterParams } from '@/app/lib/auth';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterParams>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    general?: string;
  }>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // 驗證名字
    if (!formData.firstName.trim()) {
      newErrors.firstName = '請輸入名字';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = '請輸入姓氏';
    }
    
    // 驗證郵箱
    if (!formData.email) {
      newErrors.email = '請輸入電子郵件地址';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件地址';
    }
    
    // 驗證密碼
    if (!formData.password) {
      newErrors.password = '請輸入密碼';
    } else if (formData.password.length < 6) {
      newErrors.password = '密碼至少需要6個字符';
    }
    
    // 確認密碼匹配
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = '密碼不匹配';
    }
    
    // 驗證條款同意
    if (!agreeToTerms) {
      newErrors.general = '您必須同意條款和條件才能註冊';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else if (name === 'agreeToTerms') {
      setAgreeToTerms(checked);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      console.log('發送註冊請求:', formData);
      const result = await register(formData);
      console.log('註冊結果:', result);
      
      if (result) {
        // 短暫延遲再重定向，確保狀態已完全更新
        setTimeout(() => {
          // 註冊成功，導航到首頁
          router.push('/');
        }, 300);
      } else {
        // 註冊失敗，顯示錯誤信息
        setErrors({ general: '註冊失敗，請稍後再試' });
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('註冊過程中發生錯誤:', error);
      setErrors({ general: '註冊過程中發生錯誤，請稍後再試' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          創建您的帳戶
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          已有帳戶？{' '}
          <Link href="/auth/login" className="font-medium text-ya-yellow-600 hover:text-ya-yellow-500">
            立即登入
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.general}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  名字
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm`}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  姓氏
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm`}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                電子郵件
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密碼
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                確認密碼
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm`}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-ya-yellow-600 focus:ring-ya-yellow-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                我同意 
                <button 
                  type="button" 
                  onClick={() => setShowTerms(true)} 
                  className="text-ya-yellow-600 hover:text-ya-yellow-500 font-medium underline mx-1"
                >
                  條款和條件
                </button>
                和
                <button 
                  type="button" 
                  onClick={() => setShowPrivacy(true)} 
                  className="text-ya-yellow-600 hover:text-ya-yellow-500 font-medium underline mx-1"
                >
                  隱私政策
                </button>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500 disabled:opacity-50"
              >
                {isLoading ? '註冊中...' : '註冊'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或通過以下方式註冊</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">使用Google註冊</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">使用Facebook註冊</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 條款和條件對話框 */}
      {showTerms && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    黃色航空（Yellow Airlines）用戶條款與協議
                  </h3>
                  <div className="mt-4 max-h-96 overflow-y-auto text-sm text-gray-700 space-y-3 pr-2">
                    <p className="text-gray-500 text-xs">最後更新日期：2025年4月15日</p>
                    <div>
                      <h4 className="font-medium">1. 接受條款</h4>
                      <p>1.1 使用黃色航空官方網站（www.yellowairlines.com）或流動應用程式（以下統稱為「平台」），即表示您同意遵守本條款與協議（以下簡稱「條款」）。</p>
                      <p>1.2 如您不同意本條款，請即時停止使用本平台。</p>
                    </div>
                    <div>
                      <h4 className="font-medium">2. 服務說明</h4>
                      <p>2.1 黃色航空透過平台提供航班搜尋、預訂、付款、網上辦理登機手續及相關旅遊服務（以下簡稱「服務」）。</p>
                      <p>2.2 航班時間、票價及艙位供應情況可能隨時變動，最終以出票時確認為準。</p>
                    </div>
                    <div>
                      <h4 className="font-medium">3. 帳戶與預訂</h4>
                      <p>3.1 您須提供真實、準確的個人資料以完成預訂。如因資料錯誤導致損失，須由用戶自行承擔。</p>
                      <p>3.2 您有責任妥善保管帳戶密碼，對未經授權使用所造成的損失，黃色航空概不負責。</p>
                    </div>
                    <div>
                      <h4 className="font-medium">4. 票價與付款</h4>
                      <p>4.1 票價可能因匯率、稅費或推廣活動有所調整，最終價格以付款頁面所示為準。</p>
                      <p>4.2 成功付款後如航班取消，您可選擇退款或改期（根據票價規則辦理）。</p>
                    </div>
                    <div>
                      <h4 className="font-medium">5. 更改與退款政策</h4>
                      <p>5.1 經濟艙／商務艙／頭等艙之更改及退款條款將於預訂時清楚列明，部分特惠票不設更改或退款。</p>
                      <p>5.2 退款將於7至15個工作天內處理，實際到帳時間視乎銀行或支付機構而定。</p>
                    </div>
                    <div>
                      <h4 className="font-medium">6. 行李政策</h4>
                      <p>6.1 免費寄艙行李額因艙等及航線而異，詳情請參閱《行李規定》。</p>
                      <p>6.2 超額行李須額外收費，收費標準以機場櫃位公佈為準。</p>
                    </div>
                    <div>
                      <h4 className="font-medium">7. 責任限制</h4>
                      <p>7.1 因不可抗力（如天氣、罷工、戰爭等）導致航班延誤或取消，黃色航空不承擔賠償責任，但將協助乘客安排改期或退款。</p>
                      <p>7.2 對於由第三方提供的服務（如酒店、租車等）之質素問題，黃色航空不承擔任何責任。</p>
                    </div>
                    <div>
                      <h4 className="font-medium">8. 私隱政策</h4>
                      <p>8.1 您的個人資料僅用於預訂、登機及符合法律要求的用途，詳情請參閱《私隱政策》。</p>
                      <p>8.2 我們可能會使用Cookies提升用戶體驗，您可透過瀏覽器設定選擇停用。</p>
                    </div>
                    <div>
                      <h4 className="font-medium">9. 知識產權</h4>
                      <p>9.1 平台上的所有內容（包括商標、航班資料、介面設計等）均屬黃色航空擁有，未經授權不得複製、爬取或作商業用途。</p>
                    </div>
                    <div>
                      <h4 className="font-medium">10. 條款修改與帳戶終止</h4>
                      <p>10.1 黃色航空有權更新本條款，修改後將透過平台公告或電郵通知用戶。</p>
                      <p>10.2 如用戶違反本條款，我們有權暫停或終止其帳戶。</p>
                    </div>
                    <div>
                      <h4 className="font-medium">11. 適用法律</h4>
                      <p>11.1 本條款受中華人民共和國法律管轄，任何爭議應先以友好協商解決，協商不成時提交青城法院處理。</p>
                    </div>
                    <div>
                      <h4 className="font-medium">12. 聲明</h4>
                      <p>本網站所有資訊屬虛構內容，請勿對號入座或帶入現實情境。</p>
                    </div>
                    <div>
                      <h4 className="font-medium">聯絡資料</h4>
                      <p>如有查詢，請聯絡黃色航空客戶服務：</p>
                      <p>電郵：yellowsupport@flaps1f.com</p>
                      <p>電話：+86 181 2231 7910</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowTerms(false)}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-ya-yellow-600 text-base font-medium text-white hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500 sm:text-sm"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 隱私政策對話框 */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    黃色航空（Yellow Airlines）私隱政策
                  </h3>
                  <div className="mt-4 max-h-96 overflow-y-auto text-sm text-gray-700 space-y-3 pr-2">
                    <p className="text-gray-500 text-xs">最後更新日期：2023年XX月XX日</p>
                    
                    <div>
                      <h4 className="font-medium">1. 簡介</h4>
                      <p>歡迎查閱黃色航空（Yellow Airlines）的私隱政策。我們深明個人資料的重要性，並致力保障您的私隱。本政策說明當您使用我們的網站、流動應用程式或服務時，我們如何收集、使用、披露及保障您的個人資料。</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">2. 我們收集的資料</h4>
                      <div className="pl-4">
                        <h5 className="font-medium">2.1 您提供的資料</h5>
                        <p>預訂資料：姓名、聯絡方式、出生日期、護照／身份證號碼、付款資料</p>
                        <p>帳戶資料：用戶名稱、密碼、個人資料</p>
                        <p>偏好設定：座位偏好、餐飲選擇、常旅客資訊</p>
                        <p>通訊資料：您與我們客戶服務團隊的互動紀錄</p>

                        <h5 className="font-medium mt-2">2.2 自動收集的資料</h5>
                        <p>裝置資料：IP位址、瀏覽器類型、作業系統</p>
                        <p>使用數據：瀏覽的頁面、點擊的連結、搜尋紀錄</p>
                        <p>位置資料：當您使用我們的流動應用程式時（須獲您同意）</p>

                        <h5 className="font-medium mt-2">2.3 從第三方獲取的資料</h5>
                        <p>由旅行社或合作夥伴提供的預訂資訊</p>
                        <p>社交媒體平台（當您透過該等平台登入時）</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium">3. 我們如何使用您的資料</h4>
                      <p>我們只會在以下合法基礎上使用您的個人資料：</p>
                      <ul className="list-disc pl-5">
                        <li>履行合約：處理您的預訂及提供您所要求的服務</li>
                        <li>符合法律責任：遵守航空安全、海關及入境要求</li>
                        <li>合法利益：改善服務、防止詐騙</li>
                        <li>經您同意：用於市場推廣（您可隨時撤回同意）</li>
                      </ul>
                      <p className="mt-2">具體用途包括：</p>
                      <ul className="list-disc pl-5">
                        <li>完成及管理您的航班預訂</li>
                        <li>提供客戶支援與服務</li>
                        <li>改善我們的網站及服務</li>
                        <li>發送重要通知（例如航班更改）</li>
                        <li>進行市場研究與分析</li>
                        <li>防止及偵測詐騙行為</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium">4. 資料共享與披露</h4>
                      <p>我們僅在以下情況下共享您的資料：</p>
                      <ul className="list-disc pl-5">
                        <li>服務供應商：付款處理、資訊科技服務、客戶支援等</li>
                        <li>航空合作夥伴：共享航班、聯程服務等</li>
                        <li>政府機構：根據法律要求（如海關或入境處）</li>
                        <li>商業轉移：如公司合併、收購或資產出售</li>
                      </ul>
                      <p className="mt-2">我們不會將您的個人資料出售給任何第三方作市場推廣用途。</p>
                    </div>

                    <div>
                      <h4 className="font-medium">5. 資料保留</h4>
                      <p>我們只會在實現本政策所述目的所需的期間內保留您的個人資料，或根據法律要求保留。例如：</p>
                      <ul className="list-disc pl-5">
                        <li>預訂紀錄：保留7年（稅務及法律原因）</li>
                        <li>網站使用數據：保留2年</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium">6. 您的權利</h4>
                      <p>根據適用法律，您可能擁有以下權利：</p>
                      <ul className="list-disc pl-5">
                        <li>查閱我們所持有您的個人資料</li>
                        <li>更正不準確或不完整的資料</li>
                        <li>在特定情況下要求刪除您的資料</li>
                        <li>限制或反對我們處理您的資料</li>
                        <li>要求獲得您的資料的可攜版本</li>
                        <li>撤回同意（不影響撤回前的合法處理）</li>
                      </ul>
                      <p className="mt-2">如欲行使上述權利，請聯絡我們的資料保障主任：privacy@yellowairlines.com</p>
                    </div>

                    <div>
                      <h4 className="font-medium">7. 跨境資料傳輸</h4>
                      <p>由於航空業的全球性質，您的資料可能會被傳送至您所在司法管轄區以外的伺服器，這些地區的資料保障法例或有所不同。我們會採取適當的保障措施來保護您的個人資料。</p>
                    </div>

                    <div>
                      <h4 className="font-medium">8. 安全措施</h4>
                      <p>我們採取適當的技術及管理措施保障您的資料安全，包括：</p>
                      <ul className="list-disc pl-5">
                        <li>加密敏感資料</li>
                        <li>定期進行安全審計</li>
                        <li>員工私隱培訓</li>
                        <li>訪問權限控制</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium">9. Cookie及追蹤技術</h4>
                      <p>我們使用Cookie及類似技術以：</p>
                      <ul className="list-disc pl-5">
                        <li>記住您的偏好設定</li>
                        <li>分析網站使用情況</li>
                        <li>提供個人化內容</li>
                      </ul>
                      <p className="mt-2">您可透過瀏覽器設定管理Cookie偏好。</p>
                    </div>

                    <div>
                      <h4 className="font-medium">10. 兒童私隱</h4>
                      <p>我們的服務並不針對16歲以下的兒童。如我們不慎收集到兒童資料，將會儘快刪除。</p>
                    </div>

                    <div>
                      <h4 className="font-medium">11. 政策變更</h4>
                      <p>我們可能會不時更新本私隱政策。如有重大變更，將透過電郵或網站公告通知您。</p>
                    </div>

                    <div>
                      <h4 className="font-medium">12. 聯絡我們</h4>
                      <p>如對本政策有任何疑問，或欲行使您的資料權利，請聯絡：</p>
                      <p>黃色航空資料保障主任</p>
                      <p>電郵：yellowairprivacy@flaps1f.com</p>
                      <p>電話：+86 181 2231 7910</p>
                      <p>郵寄地址：廣州市南沙區偉立路廣州優聯國際學校</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowPrivacy(false)}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-ya-yellow-600 text-base font-medium text-white hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500 sm:text-sm"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 