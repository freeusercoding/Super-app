import React, { useState } from 'react';
import { 
  MapPin, Phone, Clock, Navigation, ExternalLink, Building2, 
  Search, Shield, CheckCircle2, ChevronRight, X, Image as ImageIcon
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface OfficeItem {
  id: string;
  branchId: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  image: string;
  mapUrl: string;
}

export const BranchLocatorSection: React.FC = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('kcn-trang-bang');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const branches = contentData.branchNetwork.availableBranches;
  const offices = contentData.branchNetwork.offices as OfficeItem[];

  // Filter offices by selected branch or search
  const filteredOffices = offices.filter((item) => {
    const matchesBranch = item.branchId === selectedBranchId;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-[#005596] mb-3">
          <MapPin className="w-4 h-4 text-[#005596]" />
          Hệ thống mạng lưới quầy giao dịch
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {contentData.branchNetwork.title}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {contentData.branchNetwork.subtitle}
        </p>
      </div>

      {/* Working Hours Announcement Banner from PDF 4 */}
      <div className="bg-gradient-to-r from-[#005596] to-[#0072ce] rounded-3xl p-6 sm:p-7 text-white shadow-lg mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <Clock className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-sky-200">
              Khung giờ phục vụ khách hàng
            </span>
            <h3 className="text-lg sm:text-xl font-black">
              Thời gian giao dịch tại chi nhánh & PGD
            </h3>
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-xs sm:text-sm font-medium space-y-1.5 border border-white/15 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <strong>Thứ 2 đến thứ 6:</strong> Sáng 07:30 - 11:30 | Chiều 13:00 - 16:30
          </div>
          <div className="flex items-center gap-2 text-sky-200">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <strong>Thứ 7 - Chủ nhật:</strong> Nghỉ giao dịch
          </div>
        </div>
      </div>

      {/* Branch Selector & Search Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
              Chọn chi nhánh:
            </span>
            {branches.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBranchId(b.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedBranchId === b.id
                    ? 'bg-[#005596] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên PGD hoặc địa chỉ..."
              className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:border-[#005596] bg-slate-50/50 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Offices Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOffices.map((office, idx) => (
          <div
            key={office.id}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Photo */}
              <div 
                onClick={() => setPreviewImage(office.image)}
                className="relative aspect-[16/9] bg-slate-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={office.image}
                  alt={office.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLElement).setAttribute('src', 'https://raw.githubusercontent.com/giadinhbanker/File_anh/refs/heads/main/Hoi-so.jfif');
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black bg-[#005596] text-white shadow-md">
                    {office.type}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-white backdrop-blur-xs">
                  Xem ảnh chi nhánh
                </div>
              </div>

              {/* Information */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#005596] transition-colors">
                    {office.name}
                  </h3>
                </div>

                <div className="space-y-3 mt-4 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{office.address}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#005596] shrink-0" />
                    <span>Số điện thoại: </span>
                    <a
                      href={`tel:${office.phone.replace(/[^\d]/g, '')}`}
                      className="font-bold text-[#005596] hover:underline"
                    >
                      {office.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar with Google Maps Link & Call Now */}
            <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex flex-wrap gap-2">
              <a
                href={office.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs text-[#005596] bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Xem Google Maps</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
              </a>

              <a
                href={`tel:${office.phone.replace(/[^\d]/g, '')}`}
                className="py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-[#ed1c24] hover:bg-[#c81017] shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi hotline</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox for office image */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Ảnh phòng giao dịch"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
