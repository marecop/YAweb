import Image from 'next/image';

export const metadata = {
  title: '機隊資訊 | 黃色航空 Yellow Airlines',
  description: '黃色航空的機隊資訊，包括各種機型和設備細節',
};

export default function FleetPage() {
  // 機隊資料
  const fleetData = [
    {
      id: 1,
      model: 'Boeing 787-9 Dreamliner',
      count: 10,
      image: '/images/fleet/787.jpg',
      description: '波音787夢幻客機採用最先進的技術和設計，提供卓越的乘客體驗。寬敞的客艙、大窗戶和改善的空氣品質，讓您的旅程更加舒適。',
      specs: {
        capacity: '290人',
        range: '14,140公里',
        cruiseSpeed: '900 km/h',
        introduced: '2019年'
      }
    },
    {
      id: 2,
      model: 'Airbus A350-900',
      count: 8,
      image: '/images/fleet/a350.jpg',
      description: '空中巴士A350採用創新技術和高效能設計，提供安靜、舒適的客艙環境和出色的燃油效率。',
      specs: {
        capacity: '325人',
        range: '15,000公里',
        cruiseSpeed: '910 km/h',
        introduced: '2020年'
      }
    },
    {
      id: 3,
      model: 'Airbus A320neo',
      count: 15,
      image: '/images/fleet/a320neo.jpg',
      description: 'A320neo是我們區域航線的主力機型，提供高效的短程飛行體驗，先進的燃油節省技術減少了環境影響。',
      specs: {
        capacity: '180人',
        range: '6,500公里',
        cruiseSpeed: '840 km/h',
        introduced: '2021年'
      }
    }
  ];

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">我們的機隊</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          黃色航空擁有現代化且高效的機隊，致力於提供安全、舒適的飛行體驗。
        </p>
      </div>

      <div className="mb-16">
        <div className="bg-yellow-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">機隊概況</h2>
          <p className="text-lg mb-6">
            截至2024年，黃色航空擁有33架飛機，平均機齡不超過5年，是亞太地區最年輕的機隊之一。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-yellow-500 mb-2">33</div>
              <div className="text-gray-600">飛機總數</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-yellow-500 mb-2">&lt;5</div>
              <div className="text-gray-600">平均機齡（年）</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-yellow-500 mb-2">3</div>
              <div className="text-gray-600">機型種類</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {fleetData.map((aircraft) => (
          <div key={aircraft.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                {/* 注意：請確保有這些圖片，或替換為實際存在的圖片 */}
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">飛機圖片</span>
                </div>
              </div>
              <div className="p-6 lg:p-8">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-gray-900">{aircraft.model}</h3>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {aircraft.count} 架
                  </span>
                </div>
                <p className="mt-4 text-gray-600">{aircraft.description}</p>
                
                <div className="mt-6">
                  <h4 className="font-semibold text-lg mb-3 text-gray-900">技術規格</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">載客量</div>
                      <div className="font-medium">{aircraft.specs.capacity}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">航程</div>
                      <div className="font-medium">{aircraft.specs.range}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">巡航速度</div>
                      <div className="font-medium">{aircraft.specs.cruiseSpeed}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">引進時間</div>
                      <div className="font-medium">{aircraft.specs.introduced}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">機隊發展計劃</h2>
        <p className="text-lg mb-4">
          黃色航空正在積極擴展我們的機隊，預計在未來五年內：
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>引進5架新波音787-9夢幻客機</li>
          <li>增加10架空中巴士A320neo提升區域航線密度</li>
          <li>評估引進空中巴士A321XLR以開拓更多長程航線</li>
          <li>持續更新機內設備，提升乘客體驗</li>
        </ul>
      </div>
    </main>
  );
} 