'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MdDashboard, 
  MdPerson, 
  MdFlight, 
  MdCardMembership,
  MdAttachMoney,
  MdExpandMore,
  MdExpandLess,
  MdHistory
} from 'react-icons/md';

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>({
    '/admin/users': true
  });
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const toggleExpand = (path: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const menuItems = [
    { 
      path: '/admin', 
      label: '儀表板', 
      icon: <MdDashboard className="h-5 w-5" />,
      exact: true
    },
    { 
      path: '/admin/users', 
      label: '會員管理', 
      icon: <MdPerson className="h-5 w-5" />,
      exact: false,
      hasChildren: true,
      children: [
        { 
          path: '/admin/users/levels', 
          label: '會員等級', 
          icon: <MdCardMembership className="h-5 w-5" />,
          exact: true
        },
        { 
          path: '/admin/users/miles', 
          label: '用戶里程', 
          icon: <MdAttachMoney className="h-5 w-5" />,
          exact: false
        },
        { 
          path: '/admin/users/miles/history', 
          label: '里程歷史', 
          icon: <MdHistory className="h-5 w-5" />,
          exact: true
        }
      ]
    },
    { 
      path: '/admin/flights', 
      label: '航班管理', 
      icon: <MdFlight className="h-5 w-5" />,
      exact: false
    }
  ];

  return (
    <nav className="flex-1 py-4 overflow-y-auto">
      <ul className="space-y-1 px-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            {item.hasChildren ? (
              <div>
                <button
                  onClick={() => toggleExpand(item.path)}
                  className={`
                    flex items-center justify-between w-full px-4 py-2 rounded-md transition-colors
                    ${isActive(item.path) 
                      ? 'bg-yellow-500 text-white'
                      : 'text-gray-700 hover:bg-yellow-100'}
                  `}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {expandedItems[item.path] ? (
                    <MdExpandLess className="h-5 w-5" />
                  ) : (
                    <MdExpandMore className="h-5 w-5" />
                  )}
                </button>
                
                {expandedItems[item.path] && item.children && (
                  <ul className="mt-1 ml-4 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.path}>
                        <Link
                          href={child.path}
                          className={`
                            flex items-center px-4 py-2 rounded-md transition-colors
                            ${isActive(child.path) && (!child.exact || pathname === child.path)
                              ? 'bg-yellow-400 text-white'
                              : 'text-gray-700 hover:bg-yellow-100'}
                          `}
                          onClick={onClose}
                        >
                          <span className="mr-3">{child.icon}</span>
                          <span>{child.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                href={item.path}
                className={`
                  flex items-center px-4 py-2 rounded-md transition-colors
                  ${isActive(item.path) && (!item.exact || pathname === item.path)
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-700 hover:bg-yellow-100'}
                `}
                onClick={onClose}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
} 