import React from 'react';
import { Phone, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import contentData from '../data/contentData.json';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Bank Identity */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative overflow-hidden rounded-xl bg-white p-1 shadow-sm border border-slate-100 transition-transform group-hover:scale-105">
              <img
                src={contentData.brand.logo}
                alt="VietinBank Logo"
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  // Fallback logo if image link has network blockage
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#005596]">
                  VietinBank
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-[#ed1c24]">
                  Kiosk Quầy Giao Dịch
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {contentData.brand.slogan} • Trợ lý phục vụ thông minh
              </p>
            </div>
          </div>

          {/* Quick Info & Hotline */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 bg-sky-50/80 px-3 py-1.5 rounded-lg border border-sky-100">
              <Clock className="w-3.5 h-3.5 text-[#005596]" />
              <span>T2 - T6: 7h30 - 11h30 | 13h00 - 16h30</span>
            </div>

            <a
              href={`tel:${contentData.brand.hotline.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#005596] to-[#0072ce] hover:from-[#004077] hover:to-[#005da8] shadow-sm transition-all shadow-blue-500/20 active:scale-95"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span className="hidden xs:inline">Hotline:</span>
              <span>{contentData.brand.hotline}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
