'use client'

import { useState } from 'react';
import Link from 'next/link';

type Question = {
  question: string;
  answer: string;
};

type Category = {
  id: string;
  title: string;
  questions: Question[];
};

interface FAQContentProps {
  categories: Category[];
}

export function FAQContent({ categories }: FAQContentProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');
  const [openQuestions, setOpenQuestions] = useState<{[key: string]: boolean}>({});

  const toggleQuestion = (categoryId: string, index: number) => {
    const questionKey = `${categoryId}-${index}`;
    setOpenQuestions(prev => ({
      ...prev,
      [questionKey]: !prev[questionKey]
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* 側邊類別選單 */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 rounded-lg p-4 sticky top-20">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">問題類別</h2>
          <nav className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`block w-full text-left px-4 py-2 rounded ${
                  activeCategory === category.id
                    ? 'bg-yellow-500 text-white'
                    : 'hover:bg-yellow-100 text-gray-700'
                }`}
              >
                {category.title}
              </button>
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
        {categories.map((category) => (
          <div
            key={category.id}
            className={`${activeCategory === category.id ? 'block' : 'hidden'}`}
          >
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200">
              {category.title}
            </h2>
            
            <div className="space-y-4">
              {category.questions.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => toggleQuestion(category.id, index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                  >
                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                    <span className="ml-6 flex-shrink-0">
                      <svg
                        className={`h-6 w-6 transform ${
                          openQuestions[`${category.id}-${index}`] ? 'rotate-180' : ''
                        } text-gray-500`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </button>
                  
                  {openQuestions[`${category.id}-${index}`] && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 