'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">黃色航空（Yellow Airlines）用戶條款與協議</h1>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                使用黃色航空服務即表示您同意並接受以下條款。請仔細閱讀。
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-8">最後更新日期：2024年4月15日</p>
        
        <div className="prose prose-yellow max-w-none space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">1. 接受條款</h2>
            <p>1.1 使用黃色航空官方網站（www.yellowairlines.com）或流動應用程式（以下統稱為「平台」），即表示您同意遵守本條款與協議（以下簡稱「條款」）。</p>
            <p>1.2 如您不同意本條款，請即時停止使用本平台。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">2. 服務說明</h2>
            <p>2.1 黃色航空透過平台提供航班搜尋、預訂、付款、網上辦理登機手續及相關旅遊服務（以下簡稱「服務」）。</p>
            <p>2.2 航班時間、票價及艙位供應情況可能隨時變動，最終以出票時確認為準。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">3. 帳戶與預訂</h2>
            <p>3.1 您須提供真實、準確的個人資料以完成預訂。如因資料錯誤導致損失，須由用戶自行承擔。</p>
            <p>3.2 您有責任妥善保管帳戶密碼，對未經授權使用所造成的損失，黃色航空概不負責。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">4. 票價與付款</h2>
            <p>4.1 票價可能因匯率、稅費或推廣活動有所調整，最終價格以付款頁面所示為準。</p>
            <p>4.2 成功付款後如航班取消，您可選擇退款或改期（根據票價規則辦理）。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">5. 更改與退款政策</h2>
            <p>5.1 經濟艙／商務艙／頭等艙之更改及退款條款將於預訂時清楚列明，部分特惠票不設更改或退款。</p>
            <p>5.2 退款將於7至15個工作天內處理，實際到帳時間視乎銀行或支付機構而定。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">6. 行李政策</h2>
            <p>6.1 免費寄艙行李額因艙等及航線而異，詳情請參閱《行李規定》。</p>
            <p>6.2 超額行李須額外收費，收費標準以機場櫃位公佈為準。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">7. 責任限制</h2>
            <p>7.1 因不可抗力（如天氣、罷工、戰爭等）導致航班延誤或取消，黃色航空不承擔賠償責任，但將協助乘客安排改期或退款。</p>
            <p>7.2 對於由第三方提供的服務（如酒店、租車等）之質素問題，黃色航空不承擔任何責任。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">8. 私隱政策</h2>
            <p>8.1 您的個人資料僅用於預訂、登機及符合法律要求的用途，詳情請參閱《私隱政策》。</p>
            <p>8.2 我們可能會使用Cookies提升用戶體驗，您可透過瀏覽器設定選擇停用。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">9. 知識產權</h2>
            <p>9.1 平台上的所有內容（包括商標、航班資料、介面設計等）均屬黃色航空擁有，未經授權不得複製、爬取或作商業用途。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">10. 條款修改與帳戶終止</h2>
            <p>10.1 黃色航空有權更新本條款，修改後將透過平台公告或電郵通知用戶。</p>
            <p>10.2 如用戶違反本條款，我們有權暫停或終止其帳戶。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">11. 適用法律</h2>
            <p>11.1 本條款受中華人民共和國法律管轄，任何爭議應先以友好協商解決，協商不成時提交青城法院處理。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">12. 聲明</h2>
            <p>本網站所有資訊屬虛構內容，請勿對號入座或帶入現實情境。</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">聯絡資料</h2>
            <p>如有查詢，請聯絡黃色航空客戶服務：</p>
            <p>電郵：yellowsupport@flaps1f.com</p>
            <p>電話：+86 181 2231 7910</p>
          </div>
        </div>
      </div>
    </div>
  );
} 