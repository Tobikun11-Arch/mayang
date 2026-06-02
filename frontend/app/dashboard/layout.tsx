'use client';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Home, Settings, LogOut, ChevronLeft, ChevronRight, Contact, MessageCircleWarning} from 'lucide-react';
import {useState} from 'react';
import {ReportProvider} from '@/features/reports/ReportContent';

const TABS = [
  {label: 'Community', tab: null, icon: Home, href: '/dashboard'},
  {label: 'Reports', tab: 'reports', icon: MessageCircleWarning, href: '/dashboard?tab=reports'},
  {label: 'Family', tab: 'family', icon: Contact, href: '/dashboard?tab=family'},
  {label: 'Settings', tab: 'settings', icon: Settings, href: '/dashboard?tab=settings'}
];

type DashboardLayoutProps = {
  children: React.ReactNode;
  home?: React.ReactNode;
  report?: React.ReactNode;
  family?: React.ReactNode;
  settings?: React.ReactNode;
};

export default function DashboardLayout({
  children,
  home,
  report,
  family,
  settings
}: DashboardLayoutProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const slotByTab: Record<string, React.ReactNode | undefined> = {
    reports: report, 
    family,
    settings
  };

  const handleLogout = async () => router.replace('/sign-in');

  const isActive = (itemTab: string | null) =>
    itemTab === null ? !tab : tab === itemTab;

  const content = tab && slotByTab[tab] ? slotByTab[tab] : home ?? children;

  return (
    <div className="flex h-screen cursor-default bg-white overflow-hidden"> 
      <aside
        className={`
          hidden md:flex flex-col min-h-screen border-r border-gray-100
          bg-white shadow-sm z-40 transition-all duration-300 ease-in-out 
          ${collapsed ? 'w-[68px]' : 'w-56'} overflow-x-hidden
        `}
      >
        <div
          className={`flex items-center h-14 px-3 border-b border-gray-100 ${
            collapsed ? 'justify-center' : 'justify-end'
          }`}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"  
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-0.5 px-2 py-3 overflow-y-auto">
          {TABS.map(item => {
            const Icon = item.icon;
            const active = isActive(item.tab);
            return (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    text-sm font-medium transition-all duration-200
                    ${collapsed ? 'justify-center' : ''}
                    ${
                      active
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                  )}
                </Link>

                {collapsed && (
                  <div
                    className="
                    fixed left-full top-1/2 -translate-y-1/2 ml-2.5
                    px-2.5 py-1.5 rounded-md bg-gray-900 text-white text-xs font-medium
                    whitespace-nowrap pointer-events-none
                    opacity-0 group-hover:opacity-100
                    translate-x-1 group-hover:translate-x-0
                    transition-all duration-150 z-50
                  "
                  >
                    {item.label}
                    <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className={`px-2 pb-4 pt-2 border-t border-gray-100`}>
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-sm font-medium text-gray-400
                hover:bg-red-50 hover:text-red-500
                transition-all duration-200
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <LogOut size={18} className="shrink-0" />
              {!collapsed && <span>Logout</span>}
            </button>

            {collapsed && (
              <div
                className="
                absolute left-full top-1/2 -translate-y-1/2 ml-2.5
                px-2.5 py-1.5 rounded-md bg-gray-900 text-white text-xs font-medium
                whitespace-nowrap pointer-events-none
                opacity-0 group-hover:opacity-100
                translate-x-1 group-hover:translate-x-0
                transition-all duration-150 z-50
              "
              >
                Logout
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-white pb-24 md:pb-0">
        <ReportProvider>
          <div className="h-full">{content}</div>
        </ReportProvider>
      </main>

      <nav
        className="
        md:hidden fixed bottom-0 left-0 right-0 z-50
        bg-white border-t border-gray-100
        flex items-center justify-around
        px-2 pt-2 pb-[env(safe-area-inset-bottom,10px)]
      "
      >
        {TABS.map(item => {
          const Icon = item.icon;
          const active = isActive(item.tab);
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center gap-1 px-3 py-1 min-w-[48px] transition-all duration-200"
            >
              <Icon
                size={20}
                className={`transition-colors duration-200 ${
                  active ? 'text-gray-900' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-[10px] font-medium leading-none ${
                  active ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
              <span
                className={`
                mt-0.5 h-0.5 w-4 rounded-full bg-gray-900
                transition-all duration-300 ease-out
                ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
              `}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
