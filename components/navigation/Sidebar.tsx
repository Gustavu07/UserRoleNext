'use client';

import { useSidebar } from './sidebar-context';
import { cn } from '@/utils/utils';
import { sidebarNavigation } from '@/utils/constants/sidebarLinks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export function Sidebar() {
  const { collapsed, setCollapsed, setHovered, isOpen } = useSidebar();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <aside
      className={cn(
        'group/sidebar relative z-30 h-screen bg-white dark:bg-gray-900 dark:text-white border-r dark:border-gray-800 transition-all duration-300 flex flex-col overflow-hidden',
        collapsed ? 'w-[60px]' : 'w-64'
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* HEADER */}
      <div
        className={cn(
          'flex items-center transition-all duration-300 h-14',
          collapsed ? 'justify-center' : 'justify-between px-4'
        )}
      >
        {!collapsed && <span className="text-lg font-bold">AeroCentro</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="px-2 overflow-y-auto flex-1">
        {sidebarNavigation.map((section, i) => (
          <div key={i} className="mb-4">
            {!collapsed && (
              <h4 className="text-xs text-gray-400 dark:text-gray-500 uppercase px-2 mb-2">
                {section.title}
              </h4>
            )}
            <ul className="space-y-1">
              {section.items.map((item, j) => {
                const Icon = item.icon;
                const active = !item.isAction && pathname === item.href;

                const content = (
                  <div
                    className={cn(
                      'flex items-center gap-3 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition overflow-hidden',
                      active && 'bg-gray-200 dark:bg-gray-700 font-medium'
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span
                      className={cn(
                        'whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-200',
                        !isOpen && 'opacity-0 hidden'
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                );

                return (
                  <li key={j}>
                    {item.isAction ? (
                      <form action={item.action}>
                        <button type="submit" className="w-full text-left">
                          {content}
                        </button>
                      </form>
                    ) : (
                      <Link href={item.href} className="block">
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* DARK MODE TOGGLE */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 px-2">
          {collapsed ? (
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center justify-center w-full h-10 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? (
                <SunIcon className="w-5 h-5 text-yellow-500" />
              ) : (
                <MoonIcon className="w-5 h-5 text-blue-600" />
              )}
            </button>
          ) : (
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center w-full px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                {darkMode ? (
                  <SunIcon className="w-5 h-5 text-yellow-500 shrink-0" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-blue-600 shrink-0" />
                )}
                <span className="whitespace-nowrap">
                  {darkMode ? 'Modo claro' : 'Modo oscuro'}
                </span>
              </div>

              <div
                className={cn(
                  'w-10 h-5 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition',
                  darkMode ? 'justify-end' : 'justify-start'
                )}
              >
                <div className="w-3 h-3 bg-white rounded-full shadow-md transition-transform" />
              </div>
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
}
