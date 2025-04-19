'use client'

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Image 
                src="/images/logoremovebkgnd.png" 
                alt="黃色航空標誌"
                width={40}
                height={40}
                className="h-8 w-auto mr-2"
              />
              <h3 className="text-lg font-semibold">黃色航空 | Yellow Airlines</h3>
            </div>
            <p className="text-gray-300">
              打造獨特的飛行體驗，連接世界各地
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">關於我們</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  公司簡介
                </Link>
              </li>
              <li>
                <Link href="/fleet" className="text-gray-300 hover:text-white">
                  機隊資訊
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white">
                  工作機會
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">乘客服務</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/baggage" className="text-gray-300 hover:text-white">
                  行李規定
                </Link>
              </li>
              <li>
                <Link href="/special-assistance" className="text-gray-300 hover:text-white">
                  特殊協助
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white">
                  常見問題
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">聯絡我們</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">客服電話: +86 181 2231 7910</li>
              <li className="text-gray-300">郵箱: yellowaircontact@flaps1f.com</li>
              <li className="flex space-x-4 mt-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <FaFacebook size={24} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <FaInstagram size={24} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <FaTwitter size={24} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <FaLinkedin size={24} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  <span className="sr-only">YouTube</span>
                  <FaYoutube size={24} />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300">© 2024 黃色航空 Yellow Airlines. 版權所有。</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-gray-300 hover:text-white">
              服務條款
            </Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white">
              隱私政策
            </Link>
            <Link href="/legal" className="text-gray-300 hover:text-white">
              法律聲明
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 