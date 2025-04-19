import Link from 'next/link';

export const metadata = {
  title: '工作機會 | 黃色航空 Yellow Airlines',
  description: '探索黃色航空的職業發展機會，了解我們的企業文化和福利',
};

export default function CareersPage() {
  const jobCategories = [
    {
      id: 'flight',
      title: '飛行運營',
      positions: [
        { id: 1, title: '機師', location: '多地點', type: '全職' },
        { id: 2, title: '機長', location: '多地點', type: '全職' },
        { id: 3, title: '空服員', location: '多地點', type: '全職' },
        { id: 4, title: '地勤人員', location: '多地點', type: '全職' },
      ]
    },
    {
      id: 'technical',
      title: '技術與維修',
      positions: [
        { id: 5, title: '飛機維修技師', location: '廣州', type: '全職' },
        { id: 6, title: '航空電子技師', location: '廣州', type: '全職' },
        { id: 7, title: '品質保證專員', location: '廣州', type: '全職' },
      ]
    },
    {
      id: 'business',
      title: '商業與管理',
      positions: [
        { id: 8, title: '航線規劃經理', location: '廣州', type: '全職' },
        { id: 9, title: '市場營銷專員', location: '多地點', type: '全職' },
        { id: 10, title: '客戶服務主管', location: '多地點', type: '全職' },
        { id: 11, title: '財務分析師', location: '多地點', type: '全職' },
      ]
    },
    {
      id: 'digital',
      title: '數位與技術',
      positions: [
        { id: 12, title: '軟體工程師', location: '廣州', type: '全職/遠端' },
        { id: 13, title: 'UI/UX 設計師', location: '廣州', type: '全職/遠端' },
        { id: 14, title: '數據分析師', location: '廣州', type: '全職' },
        { id: 15, title: 'IT 支持專員', location: '多地點', type: '全職' },
      ]
    }
  ];

  const benefits = [
    { title: '優惠機票', description: '員工及家屬享有優惠的機票價格' },
    { title: '全面醫療保障', description: '完善的醫療保險和健康檢查計劃' },
    { title: '職業發展計劃', description: '豐富的培訓課程和職業發展規劃' },
    { title: '彈性工作安排', description: '部分職位提供遠程和彈性工作選項' },
    { title: '退休計劃', description: '有競爭力的退休金計劃和福利' },
    { title: '國際工作環境', description: '多元文化的工作環境和全球發展機會' },
  ];

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">加入黃色航空</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          我們致力於提供卓越的飛行體驗，歡迎有熱情、有才華的人才加入我們的團隊。
        </p>
      </div>

      <div className="bg-yellow-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">我們的企業文化</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-yellow-600">創新精神</h3>
            <p>我們鼓勵員工思考創新，不斷尋求改進和優化服務的方法。</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-yellow-600">團隊合作</h3>
            <p>我們相信通過團隊合作，可以實現更大的成就並提供更好的服務。</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-yellow-600">多元包容</h3>
            <p>我們尊重並珍視每個人的獨特背景和觀點，創造一個包容的工作環境。</p>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">職位空缺</h2>
        
        <div className="space-y-12">
          {jobCategories.map((category) => (
            <div key={category.id}>
              <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">
                {category.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.positions.map((job) => (
                  <div key={job.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        {job.type}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">地點: {job.location}</p>
                    <div className="mt-4">
                      <Link href={`/careers/job/${job.id}`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                        查看詳情
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">員工福利</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">加入我們的步驟</h2>
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-gray-50 text-lg font-medium text-gray-900">應聘流程</span>
            </div>
          </div>
          
          <div className="mt-8 space-y-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                  1
                </div>
              </div>
              <div className="ml-4 text-left">
                <h3 className="text-lg font-medium">線上申請</h3>
                <p className="mt-1 text-gray-600">瀏覽我們的職位列表，找到適合您的職位並提交申請</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                  2
                </div>
              </div>
              <div className="ml-4 text-left">
                <h3 className="text-lg font-medium">初步篩選</h3>
                <p className="mt-1 text-gray-600">我們的招聘團隊將審核您的申請並聯繫合適的候選人</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                  3
                </div>
              </div>
              <div className="ml-4 text-left">
                <h3 className="text-lg font-medium">面試階段</h3>
                <p className="mt-1 text-gray-600">根據職位不同，可能包括電話面試、視頻面試和現場面試</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                  4
                </div>
              </div>
              <div className="ml-4 text-left">
                <h3 className="text-lg font-medium">錄用及入職</h3>
                <p className="mt-1 text-gray-600">成功通過面試後，我們將發出錄用通知並協助您完成入職流程</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10">
          <Link href="/careers/apply" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
            立即申請
          </Link>
        </div>
      </div>
    </main>
  );
} 