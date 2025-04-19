'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">黃色航空（Yellow Airlines）私隱政策</h1>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                本政策說明當您使用我們的網站、流動應用程式或服務時，我們如何收集、使用、披露及保障您的個人資料。
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-8">最後更新日期：2024年4月15日</p>
        
        <div className="prose prose-yellow max-w-none space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">1. 簡介</h2>
            <p>歡迎查閱黃色航空（Yellow Airlines）的私隱政策。我們深明個人資料的重要性，並致力保障您的私隱。本政策說明當您使用我們的網站、流動應用程式或服務時，我們如何收集、使用、披露及保障您的個人資料。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">2. 我們收集的資料</h2>
            <div className="pl-4">
              <h3 className="text-lg font-semibold text-gray-800">2.1 您提供的資料</h3>
              <p>預訂資料：姓名、聯絡方式、出生日期、護照／身份證號碼、付款資料</p>
              <p>帳戶資料：用戶名稱、密碼、個人資料</p>
              <p>偏好設定：座位偏好、餐飲選擇、常旅客資訊</p>
              <p>通訊資料：您與我們客戶服務團隊的互動紀錄</p>

              <h3 className="text-lg font-semibold text-gray-800 mt-4">2.2 自動收集的資料</h3>
              <p>裝置資料：IP位址、瀏覽器類型、作業系統</p>
              <p>使用數據：瀏覽的頁面、點擊的連結、搜尋紀錄</p>
              <p>位置資料：當您使用我們的流動應用程式時（須獲您同意）</p>

              <h3 className="text-lg font-semibold text-gray-800 mt-4">2.3 從第三方獲取的資料</h3>
              <p>由旅行社或合作夥伴提供的預訂資訊</p>
              <p>社交媒體平台（當您透過該等平台登入時）</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">3. 我們如何使用您的資料</h2>
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
            <h2 className="text-xl font-semibold text-gray-900">4. 資料共享與披露</h2>
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
            <h2 className="text-xl font-semibold text-gray-900">5. 資料保留</h2>
            <p>我們只會在實現本政策所述目的所需的期間內保留您的個人資料，或根據法律要求保留。例如：</p>
            <ul className="list-disc pl-5">
              <li>預訂紀錄：保留7年（稅務及法律原因）</li>
              <li>網站使用數據：保留2年</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">6. 您的權利</h2>
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
            <h2 className="text-xl font-semibold text-gray-900">7. 跨境資料傳輸</h2>
            <p>由於航空業的全球性質，您的資料可能會被傳送至您所在司法管轄區以外的伺服器，這些地區的資料保障法例或有所不同。我們會採取適當的保障措施來保護您的個人資料。</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">8. 安全措施</h2>
            <p>我們採取適當的技術及管理措施保障您的資料安全，包括：</p>
            <ul className="list-disc pl-5">
              <li>加密敏感資料</li>
              <li>定期進行安全審計</li>
              <li>員工私隱培訓</li>
              <li>訪問權限控制</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">9. Cookie及追蹤技術</h2>
            <p>我們使用Cookie及類似技術以：</p>
            <ul className="list-disc pl-5">
              <li>記住您的偏好設定</li>
              <li>分析網站使用情況</li>
              <li>提供個人化內容</li>
            </ul>
            <p className="mt-2">您可透過瀏覽器設定管理Cookie偏好。</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">10. 兒童私隱</h2>
            <p>我們的服務並不針對16歲以下的兒童。如我們不慎收集到兒童資料，將會儘快刪除。</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">11. 政策變更</h2>
            <p>我們可能會不時更新本私隱政策。如有重大變更，將透過電郵或網站公告通知您。</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">12. 聯絡我們</h2>
            <p>如對本政策有任何疑問，或欲行使您的資料權利，請聯絡：</p>
            <p>黃色航空資料保障主任</p>
            <p>電郵：yellowairprivacy@flaps1f.com</p>
            <p>電話：+86 181 2231 7910</p>
            <p>郵寄地址：廣州市南沙區偉立路廣州優聯國際學校</p>
          </div>
        </div>
      </div>
    </div>
  );
} 