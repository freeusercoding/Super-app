import React from 'react';
import { 
  HelpCircle, Smartphone, Gamepad2, PiggyBank, Calculator, 
  Sparkles, MapPin, ArrowRight, ShieldCheck, Star, Gift, Fuel,
  Phone, Clock, Users, Award
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface HomeHubProps {
  onSelectFeature: (featureId: string) => void;
}

export const HomeHub: React.FC<HomeHubProps> = ({ onSelectFeature }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HelpCircle':
        return <HelpCircle className="w-7 h-7 text-white" />;
      case 'Smartphone':
        return <Smartphone className="w-7 h-7 text-white" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-7 h-7 text-white" />;
      case 'PiggyBank':
        return <PiggyBank className="w-7 h-7 text-white" />;
      case 'Calculator':
        return <Calculator className="w-7 h-7 text-white" />;
      case 'Sparkles':
        return <Sparkles className="w-7 h-7 text-white" />;
      case 'MapPin':
        return <MapPin className="w-7 h-7 text-white" />;
      default:
        return <Star className="w-7 h-7 text-white" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#00386b] via-[#005596] to-[#0072ce] text-white p-6 sm:p-10 shadow-xl mb-10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-sky-100 border border-white/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Kiosk Tương Tác Khách Hàng Tại Quầy Giao Dịch</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Chào mừng Quý khách đến với VietinBank!
          </h1>

          <p className="mt-3 text-sm sm:text-base text-sky-100/90 leading-relaxed">
            Hân hạnh phục vụ Quý khách. Vui lòng chọn tiện ích hoặc thử thách mini-game nhận quà trong lúc chờ giao dịch viên hỗ trợ.
          </p>

          {/* Quick CTA Pills */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => onSelectFeature('game')}
              className="px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm text-[#005596] bg-amber-300 hover:bg-amber-200 shadow-md flex items-center gap-2 transition-transform active:scale-95"
            >
              <Fuel className="w-4 h-4 text-[#ed1c24]" />
              <span>Chơi Game nhận Voucher xăng</span>
            </button>

            <button
              onClick={() => onSelectFeature('ipay')}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/15 hover:bg-white/25 border border-white/20 transition-all flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Tải App iPay Mobile</span>
            </button>
          </div>
        </div>

        {/* Decorative graphic elements */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:flex items-center justify-end pr-10 opacity-20 pointer-events-none">
          <Building2Icon className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* 7 Feature Cards Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Danh mục tính năng & tiện ích phục vụ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Chạm vào bất kỳ ô nào để trải nghiệm tức thì
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {contentData.features.map((feature, idx) => (
            <div
              key={feature.id}
              onClick={() => onSelectFeature(feature.id)}
              className="group relative bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Badge if present */}
              {feature.badge && (
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-[#ed1c24] border border-red-200">
                    {feature.badge}
                  </span>
                </div>
              )}

              <div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {getIcon(feature.icon)}
                </div>

                <div className="text-xs font-bold text-slate-400 mb-1">
                  Mục 0{idx + 1}
                </div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-[#005596] transition-colors leading-snug">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  {feature.subtitle}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#005596]">
                <span>Khám phá ngay</span>
                <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-[#005596] group-hover:bg-[#005596] group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advisory & Branch Fast Support Strip */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="flex items-center gap-4 pt-4 md:pt-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#005596] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Hỗ trợ kỹ thuật iPay</span>
              <div className="font-bold text-sm text-slate-900">{contentData.brand.advisorThanh.name}</div>
              <a href={`tel:${contentData.brand.advisorThanh.phone}`} className="text-xs font-black text-[#ed1c24] hover:underline">
                {contentData.brand.advisorThanh.phone}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Tư vấn sản phẩm & gói vay</span>
              <div className="font-bold text-sm text-slate-900">{contentData.brand.advisorTrung.name}</div>
              <a href={`tel:${contentData.brand.advisorTrung.phone}`} className="text-xs font-black text-[#ed1c24] hover:underline">
                {contentData.brand.advisorTrung.phone}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Tổng đài 24/7</span>
              <div className="font-bold text-sm text-slate-900">CSKH VietinBank Toàn Quốc</div>
              <a href={`tel:${contentData.brand.hotline.replace(/\s+/g, '')}`} className="text-xs font-black text-[#005596] hover:underline">
                {contentData.brand.hotline}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Building2Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v8h4" />
    <path d="M18 9h2a2 2 0 0 1 2 2v11h-4" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </svg>
);
