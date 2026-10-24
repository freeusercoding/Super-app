import React from 'react';
import { Phone, Globe, Shield, MapPin, Heart, Clock } from 'lucide-react';
import contentData from '../data/contentData.json';

export const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-white mt-16 border-t-4 border-[#005596]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Bank info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white">VietinBank</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-600 text-white font-bold">
                Chi nhánh KCN Trảng Bàng
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {contentData.brand.fullName} - {contentData.brand.slogan}. Ứng dụng kiosk thông minh phục vụ Quý khách hàng tại quầy giao dịch nhanh chóng, chính xác và tiện lợi.
            </p>
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Bảo mật chuẩn quốc tế PCI-DSS & ISO 27001</span>
            </div>
          </div>

          {/* Col 2: Quick Features */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-sky-400 mb-3">
              Tiện ích nổi bật
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors">
                  1. Giải đáp thắc mắc iPay
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ipay')} className="hover:text-white transition-colors">
                  2. Cài đặt App VietinBank iPay
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('game')} className="hover:text-white text-amber-300 font-bold transition-colors">
                  3. Mini-game nhận Voucher xăng
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('savings')} className="hover:text-white transition-colors">
                  4. Bảng tính lãi tiết kiệm
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('loan')} className="hover:text-white transition-colors">
                  5. Bảng tính lịch trả nợ vay
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Support contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-sky-400 mb-3">
              Hỗ trợ khách hàng
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p>
                <strong>Hotline CSKH:</strong>{' '}
                <a href={`tel:${contentData.brand.hotline.replace(/\s+/g, '')}`} className="text-amber-400 font-bold">
                  {contentData.brand.hotline}
                </a>
              </p>
              <p>
                <strong>Chuyên viên iPay:</strong>{' '}
                <a href={`tel:${contentData.brand.advisorThanh.phone}`} className="text-sky-300 font-bold">
                  {contentData.brand.advisorThanh.phone}
                </a>
              </p>
              <p>
                <strong>Tư vấn tín dụng:</strong>{' '}
                <a href={`tel:${contentData.brand.advisorTrung.phone}`} className="text-sky-300 font-bold">
                  {contentData.brand.advisorTrung.phone}
                </a>
              </p>
              <p className="text-[11px] text-slate-500 pt-2">
                Giờ làm việc: 7h30 - 11h30 & 13h00 - 16h30 (T2 - T6)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 Ngân hàng TMCP Công Thương Việt Nam (VietinBank). Bản quyền thuộc về VietinBank.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('home')} className="hover:text-slate-300">
              Trang chủ
            </button>
            <button onClick={() => onNavigate('branches')} className="hover:text-slate-300">
              Mạng lưới PGD
            </button>
            <a href="https://www.vietinbank.vn" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 flex items-center gap-1">
              <span>vietinbank.vn</span>
              <Globe className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
