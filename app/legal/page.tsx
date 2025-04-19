'use client';

import React from 'react';

export default function LegalPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">黃色航空（Yellow Airlines）法律聲明</h1>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                請仔細閱讀本法律聲明，了解您在使用本網站時的權利和責任。
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-8">最後更新日期：2024年4月15日</p>
        
        <div className="prose prose-yellow max-w-none space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">1. 信息與數據</h2>
            <p>
              黃色航空（Yellow Airlines）網站（以下簡稱「本網站」）及其所有內容均為黃色航空所有，受中華人民共和國著作權法、商標法及其他知識產權法律法規的保護。未經黃色航空書面許可，任何單位及個人不得以任何方式或理由對本網站的任何部分進行使用、複製、修改、傳播、展示或發行。
            </p>
            <p>
              本網站所提供的信息僅供參考，我們將盡力確保網站內容的準確性，但不對信息的準確性、完整性、及時性作出任何保證。黃色航空保留隨時更改網站內容和產品信息的權利，且無需另行通知。
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">2. 免責聲明</h2>
            <p>
              在法律允許的最大範圍內，黃色航空不承擔任何因使用或無法使用本網站而引起的直接、間接、附帶、特殊、衍生性或懲罰性損害賠償責任，包括但不限於利潤損失、數據丟失或業務中斷。
            </p>
            <p>
              對於因不可抗力（包括但不限於自然災害、政府行為、罷工、戰爭、傳染病等）或其他不可歸責於黃色航空的原因導致的任何延誤、取消、行李損失或其他損失，黃色航空不承擔責任。
            </p>
            <p>
              使用本網站進行預訂航班或購買服務時，您應當仔細閱讀並同意相關條款和條件。黃色航空不對因用戶違反條款和條件而產生的損失承擔責任。
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">3. 第三方連結</h2>
            <p>
              本網站可能包含指向第三方網站的連結，這些連結僅為方便用戶而提供。黃色航空不對任何第三方網站的內容、準確性或可用性負責，也不對您因訪問或使用這些第三方網站而遭受的任何損失承擔責任。
            </p>
            <p>
              訪問任何第三方網站是您自己的選擇，風險由您自行承擔。我們建議您查閱第三方網站的相關條款和隱私政策。
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">4. 知識產權</h2>
            <p>
              本網站的所有內容，包括但不限於文字、圖片、標誌、音頻、視頻、軟件、代碼及其組合，均受中華人民共和國著作權法和國際著作權法的保護。未經黃色航空明確書面許可，任何人不得以任何形式或通過任何方式複製、修改、傳輸、展示或使用這些內容。
            </p>
            <p>
              「黃色航空」和「Yellow Airlines」及相關標誌均為黃色航空的商標或註冊商標，受中華人民共和國商標法和國際商標法的保護。未經黃色航空書面許可，任何單位或個人不得以任何方式使用這些商標。
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">5. 個人信息保護</h2>
            <p>
              黃色航空重視您的個人信息保護。我們會按照《中華人民共和國個人信息保護法》等相關法律法規和我們的《私隱政策》收集、使用、存儲和保護您的個人信息。請在使用本網站前仔細閱讀我們的《私隱政策》。
            </p>
            <p>
              如您對我們的個人信息處理有任何疑問，可通過本聲明底部的聯繫方式與我們聯繫。
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">6. 用戶行為規範</h2>
            <p>
              您在使用本網站時，必須遵守中華人民共和國的法律法規及其他相關法規，並尊重網絡道德。您不得使用本網站從事任何違法活動，包括但不限於：
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>發布、傳輸或存儲任何違反國家法律法規的信息</li>
              <li>侵犯他人知識產權、商業機密或其他合法權益</li>
              <li>破壞網站的正常運行，未經授權訪問網站服務器</li>
              <li>故意傳播電腦病毒或其他破壞性程序</li>
              <li>冒充他人或機構進行虛假活動</li>
            </ul>
            <p className="mt-2">
              如發現違反上述規定的行為，黃色航空有權立即終止向您提供服務，並保留追究法律責任的權利。
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">7. 適用法律及爭議解決</h2>
            <p>
              本法律聲明的解釋、效力及爭議解決均適用中華人民共和國法律（不包括其衝突法規則）。
            </p>
            <p>
              因使用本網站而引起的或與本網站有關的任何爭議，雙方應友好協商解決。協商不成的，任何一方均可向黃色航空所在地有管轄權的人民法院提起訴訟。
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">8. 信息安全</h2>
            <p>
              我們採取行業標準的措施保護您的個人信息安全。然而，互聯網傳輸不能保證絕對安全，我們無法保證通過本網站傳輸的任何信息的安全性。
            </p>
            <p>
              您使用本網站並傳輸信息的風險由您自行承擔。我們建議您在使用網站時採取適當的預防措施，保護您的個人信息。
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">9. 聲明修改</h2>
            <p>
              黃色航空保留隨時修改本法律聲明的權利。修改後的法律聲明一經在本網站公佈即生效，繼續使用本網站即表示您接受修改後的法律聲明。
            </p>
            <p>
              我們建議您定期查閱本法律聲明，以了解任何變更。
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">10. 版權聲明</h2>
            <p>
              本網站的所有內容版權均屬於黃色航空或其內容提供者所有，受中華人民共和國著作權法和國際著作權條約保護。
            </p>
            <p>
              未經黃色航空事先書面許可，您不得以任何形式使用本網站的內容，包括但不限於複製、修改、傳播、展示、出版、銷售、授權或創建衍生作品。
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">11. 企業資質</h2>
            <p>
              黃色航空是根據中華人民共和國法律註冊成立的企業，擁有合法的營業執照和航空運營資質。
            </p>
            <p>
              營業執照註冊號：X123456789
            </p>
            <p>
              公共航空運輸企業經營許可證編號：民航運企字X123號
            </p>
            <p>
              如需核實企業資質，請聯繫我們的客戶服務部門。
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">12. 聯繫方式</h2>
            <p>
              如您對本法律聲明有任何疑問，或需要與我們聯繫，請通過以下方式：
            </p>
            <p>
              公司名稱：黃色航空有限公司（Yellow Airlines Co., Ltd.）
            </p>
            <p>
              郵寄地址：廣州市南沙區偉立路廣州優聯國際學校
            </p>
            <p>
              電子郵箱：legal@yellowairlines.com
            </p>
            <p>
              電話：+86 181 2231 7910（工作日 9:00-18:00）
            </p>
          </div>
          
          <div className="mt-12">
            <p className="text-sm text-gray-500 italic">
              注：本網站為教育示例，非真實航空公司網站。所有內容純屬虛構，僅供展示用途，不代表任何真實企業或服務。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 