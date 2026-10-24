import React from 'react';
import { 
  Home, HelpCircle, Smartphone, Gamepad2, PiggyBank, Calculator, 
  Sparkles, MapPin 
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'faq', label: 'Giải đáp', icon: HelpCircle },
    { id: 'ipay', label: 'Tải iPay', icon: Smartphone },
    { id: 'game', label: 'Game nhận quà', icon: Gamepad2, badge: 'Hot' },
    { id: 'savings', label: 'Tính lãi gửi', icon: PiggyBank },
    { id: 'loan', label: 'Lịch trả nợ', icon: Calculator },
    { id: 'products', label: 'Sản phẩm', icon: Sparkles },
    { id: 'branches', label: 'Điểm GD', icon: MapPin },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-[#005596] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#005596] hover:bg-sky-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#005596]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase ${
                    isActive ? 'bg-amber-300 text-slate-900' : 'bg-red-500 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
