import Link from 'next/link';

export default function FAQPage() {
  const faqCategories = [
    {
      id: 'booking',
      title: '訂票與付款',
      questions: [
        {
          question: '如何查詢最優惠的機票價格？',
          answer: '黃色航空提供靈活的機票價格查詢功能。您可以使用我們的"價格日曆"功能查看不同日期的票價，或訂閱我們的電子郵件以獲得特價機票通知。通常提前訂票和選擇非高峰時段飛行可以獲得更優惠的價格。'
        },
        {
          question: '取消或更改預訂需要手續費嗎？',
          answer: '這取決於您購買的票種和取消/更改的時間。經濟艙基本票價可能不允許退款，但可以支付手續費進行更改。靈活票價和商務艙通常提供更寬鬆的變更政策。請在預訂時查看具體的票價規則，或聯繫我們的客服以獲取幫助。'
        },
        {
          question: '我可以為其他人預訂機票嗎？',
          answer: '是的，您可以為家人、朋友或同事預訂機票。在預訂過程中，您需要提供每位乘客的詳細信息，包括姓名（需與護照上的姓名完全一致）、出生日期和聯繫方式。'
        },
        {
          question: '我在哪裡可以找到我的預訂確認？',
          answer: '預訂完成後，我們會發送確認郵件到您提供的電子郵件地址。您也可以登錄我們的網站或應用程序，在"我的預訂"部分查看您的行程詳情。'
        }
      ]
    },
    {
      id: 'baggage',
      title: '行李規定',
      questions: [
        {
          question: '不同機票類型的行李限額是多少？',
          answer: '行李限額因航線和票種而異。一般來說，經濟艙基本票價包括7kg手提行李，經濟艙靈活票價和商務艙通常包括23kg或32kg的托運行李額度。您可以在預訂時或我們網站的行李規定頁面查看具體限額。'
        },
        {
          question: '如何購買額外的行李額度？',
          answer: '您可以在預訂時或通過登錄您的帳戶在線購買額外的行李額度。提前在線購買比在機場購買更經濟。您也可以聯繫我們的客服協助您完成此操作。'
        },
        {
          question: '特殊行李（如運動器材、樂器等）如何處理？',
          answer: '特殊行李需要提前申請。大多數運動器材（如高爾夫球桿、滑雪設備）可作為標準托運行李，但可能需要額外費用。樂器視大小可能作為手提或托運行李，或需購買額外座位。請提前48小時聯繫我們的客服以獲取特殊行李的具體指導。'
        }
      ]
    },
    {
      id: 'checkin',
      title: '登機與機上服務',
      questions: [
        {
          question: '網上辦理登機手續何時開放？',
          answer: '網上辦理登機手續通常在航班起飛前24小時開放，並在起飛前60分鐘關閉。我們建議儘早辦理登機手續以選擇您偏好的座位。'
        },
        {
          question: '如果我錯過了航班怎麼辦？',
          answer: '如果您錯過了航班，請立即聯繫我們的客服或前往機場的黃色航空服務櫃台。根據您的票種和具體情況，我們將協助您更改到下一個可用航班，但可能需要支付變更費用。'
        },
        {
          question: '黃色航空提供哪些特殊餐食選項？',
          answer: '我們提供多種特殊餐食選項，包括素食、清真食品、無麩質、無乳糖等。請在航班起飛前至少48小時通過您的預訂或聯繫客服申請特殊餐食。'
        },
        {
          question: '機上是否提供WiFi服務？',
          answer: '是的，我們大部分航班都提供機上WiFi服務。部分短途航班可能免費提供基本瀏覽，而長途航班通常提供多種上網套餐供選擇。具體價格和可用性取決於您的航線。'
        }
      ]
    },
    {
      id: 'special',
      title: '特殊服務',
      questions: [
        {
          question: '如何為有特殊需求的乘客安排協助？',
          answer: '我們致力於為所有乘客提供便利的旅行體驗。如需輪椅服務、協助登機或其他特殊協助，請在預訂時或至少航班起飛前48小時聯繫我們的客服。機場工作人員將為有需要的乘客提供全程協助。'
        },
        {
          question: '孕婦是否可以乘坐黃色航空的航班？',
          answer: '孕婦通常可以乘坐我們的航班，但有一些限制。懷孕28週以下的乘客無需醫療證明。懷孕28-36週的乘客需提供醫生簽發的適飛證明。懷孕36週以上的乘客出於安全考慮通常不建議飛行。請在預訂前諮詢您的醫生並聯繫我們的客服。'
        },
        {
          question: '兒童單獨旅行需要什麼安排？',
          answer: '5-12歲的兒童可以使用我們的"無人陪伴未成年人"服務單獨旅行。此服務需要提前預訂並支付額外費用。我們的工作人員將全程照顧兒童的安全，從機場出發直到目的地與指定接機人會合。12-16歲的未成年人可選擇此服務。'
        },
        {
          question: '我可以攜帶寵物旅行嗎？',
          answer: '小型寵物（貓、小型犬）可在符合條件的航班上以手提行李形式帶入客艙，需使用符合航空要求的寵物箱。較大的寵物需要托運。所有寵物運輸都需要提前申請並支付費用。請注意，服務動物遵循不同的規定。詳情請提前聯繫我們的客服。'
        }
      ]
    },
    {
      id: 'rewards',
      title: '會員與獎勵',
      questions: [
        {
          question: '如何加入黃色航空的常旅客計劃？',
          answer: '您可以在我們的網站或應用程序上免費註冊成為黃色航空的"Yellow Miles"會員。註冊過程簡單，只需提供基本個人信息和聯繫方式。成為會員後，您的每次飛行都將累積里程，可用於兌換免費機票和其他獎勵。'
        },
        {
          question: '里程點數有效期是多久？',
          answer: '標準會員的里程點數有效期為2年。銀卡會員的里程點數有效期為3年，金卡和白金卡會員的里程點數無到期日期。任何賬戶活動（飛行或兌換）都會重置里程的有效期。'
        },
        {
          question: '如何查看我的里程餘額？',
          answer: '您可以登錄我們的網站或應用程序，在會員中心查看您的里程餘額、活動歷史和即將到期的里程。您也可以在每次飛行後收到的郵件中查看更新的里程信息。'
        }
      ]
    }
  ];

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">常見問題</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          找到您關於黃色航空服務的問題解答
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 側邊類別選單 */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 sticky top-20">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">問題類別</h2>
            <nav className="space-y-2">
              {faqCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/faq#${category.id}`}
                  className="block w-full text-left px-4 py-2 rounded hover:bg-yellow-100 text-gray-700"
                >
                  {category.title}
                </Link>
              ))}
            </nav>
            
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">需要更多幫助？</h3>
              <p className="text-sm text-gray-600 mb-4">
                如果您沒有找到所需的答案，請聯繫我們的客戶服務團隊。
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                聯繫我們
              </Link>
            </div>
          </div>
        </div>

        {/* 問題列表 */}
        <div className="lg:col-span-3">
          {faqCategories.map((category) => (
            <div
              id={category.id}
              key={category.id}
              className="mb-8 scroll-mt-24"
            >
              <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200">
                {category.title}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <details key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <summary className="px-6 py-4 flex justify-between items-center cursor-pointer focus:outline-none">
                      <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                    </summary>
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 