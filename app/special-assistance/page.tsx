import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: '特殊協助 | 黃色航空 Yellow Airlines',
  description: '黃色航空為有特殊需求的乘客提供全方位的協助服務，包括行動不便、視聽障礙、醫療需求、孕婦及兒童等服務',
};

export default function SpecialAssistancePage() {
  const assistanceTypes = [
    {
      id: 'mobility',
      title: '行動不便乘客',
      icon: '♿',
      content: '黃色航空致力於為行動不便的乘客提供無障礙的旅行體驗。我們提供輪椅服務、專人協助登機及下機，以及機場內的全程協助。無論您需要臨時協助還是全程服務，我們的專業團隊都將確保您的旅程順暢舒適。',
      services: [
        '機場輪椅服務',
        '優先登機安排',
        '機艙內特殊座位安排',
        '協助攜帶必要的醫療設備',
        '專人引導服務'
      ]
    },
    {
      id: 'visual-hearing',
      title: '視聽障礙乘客',
      icon: '👁️👂',
      content: '對於視力或聽力受損的乘客，我們提供專門的協助服務，確保您能獲得所有必要的飛行信息並享受安全、舒適的旅程。我們的機組人員受過特殊培訓，能夠以適當的方式進行溝通並提供必要的協助。',
      services: [
        '提供點字版安全說明',
        '允許導盲犬隨行（需提前申請）',
        '機組人員特殊溝通協助',
        '優先登機安排',
        '專人引導服務'
      ]
    },
    {
      id: 'medical',
      title: '醫療需求乘客',
      icon: '🏥',
      content: '如果您有特殊醫療需求，例如需要攜帶醫療設備、藥物或需要特殊飲食安排，我們可以提供相應的協助。對於某些醫療狀況，我們可能需要醫生證明以確保您適合飛行。',
      services: [
        '醫療氧氣供應（需提前申請）',
        '允許攜帶必要的醫療設備',
        '特殊醫療膳食安排',
        '需要醫療協助時的座位安排',
        '必要時機組人員提供協助'
      ]
    },
    {
      id: 'pregnancy',
      title: '孕婦乘客',
      icon: '🤰',
      content: '黃色航空歡迎孕婦乘客，並為其提供舒適的飛行體驗。根據妊娠週數的不同，我們有相應的政策和協助措施。請注意，懷孕36週以上的乘客可能需要醫生證明或可能不建議乘坐飛機。',
      services: [
        '優先登機安排',
        '舒適座位安排',
        '額外的枕頭和毯子',
        '特殊餐飲需求',
        '機組人員特別關注'
      ]
    },
    {
      id: 'children',
      title: '兒童及幼兒',
      icon: '👶',
      content: '我們為攜帶嬰兒和兒童的家庭提供多項服務，包括優先登機、嬰兒搖籃（適用於長途航班）、兒童餐食等。此外，我們還提供無人陪伴未成年人的特別護送服務。',
      services: [
        '優先登機安排',
        '嬰兒搖籃（需提前預訂，僅限特定航班）',
        '兒童餐食選項',
        '無人陪伴未成年人服務',
        '尿布台及其他設施'
      ]
    },
    {
      id: 'elderly',
      title: '年長乘客',
      icon: '👴👵',
      content: '我們尊重並關心年長乘客的需求，提供從機場報到到抵達目的地的全程協助。無論是行李搬運、輪椅服務還是登機協助，我們都能為您提供周到的服務。',
      services: [
        '優先登機安排',
        '行李搬運協助',
        '輪椅服務（如需要）',
        '機場內專人引導',
        '機組人員特別關注'
      ]
    }
  ];

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">特殊協助服務</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          黃色航空致力於為所有乘客提供舒適、安全的飛行體驗，特別是有特殊需求的乘客。
        </p>
      </div>

      <div className="bg-yellow-50 rounded-lg p-8 mb-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center">如何申請特殊協助</h2>
          <p className="mb-6">
            為了確保您獲得所需的協助，我們建議您在預訂機票時或至少在航班起飛前48小時通知我們您的特殊需求。您可以通過以下方式申請特殊協助：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-yellow-600">預訂時申請</h3>
              <p>在線預訂機票時，您可以在乘客信息頁面選擇所需的特殊協助類型。或者，您可以致電我們的預訂中心，我們的客服人員將協助您完成預訂並記錄您的特殊需求。</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-yellow-600">預訂後申請</h3>
              <p>如果您已經完成預訂，可以登錄您的賬戶，在"管理預訂"頁面添加特殊協助請求。您也可以聯繫我們的客服中心，提供您的預訂號碼和所需協助類型。</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/contact" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
              聯繫客服中心
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {assistanceTypes.map((type) => (
          <div key={type.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{type.icon}</span>
                <h2 className="text-2xl font-bold text-gray-900">{type.title}</h2>
              </div>
              <p className="text-gray-600 mb-6">{type.content}</p>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">我們提供的服務</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  {type.services.map((service, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">重要注意事項</h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>某些特殊協助服務需要提前至少48小時申請，特別是醫療氧氣供應和導盲犬隨行等服務。</p>
          </div>
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>對於某些醫療狀況，我們可能需要您提供醫生開具的適合飛行證明（Fit to Fly Certificate）。</p>
          </div>
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>無人陪伴未成年人服務需要支付額外費用，並且必須在預訂時或預訂後至少72小時申請。</p>
          </div>
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>雖然我們盡力滿足所有特殊協助需求，但某些服務可能受到航班類型、機型或目的地機場設施的限制。</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">如有任何疑問或需要更多信息，請隨時聯繫我們</p>
          <Link href="/contact" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
            聯繫我們
          </Link>
        </div>
      </div>
    </main>
  );
} 