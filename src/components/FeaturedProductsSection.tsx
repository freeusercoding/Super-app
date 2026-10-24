import React, { useState } from 'react';
import { 
  Sparkles, Star, Gift, Phone, CheckCircle2, ChevronRight, 
  ExternalLink, X, Heart, ShieldCheck, Tag
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface ProductItem {
  id: string;
  category: string;
  categoryLabel: string;
  name: string;
  tag: string;
  image: string;
  description: string;
  benefits: string[];
}

export const FeaturedProductsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProductForInterest, setSelectedProductForInterest] = useState<ProductItem | null>(null);
  const [previewPoster, setPreviewPoster] = useState<string | null>(null);

  const categories = contentData.featuredProducts.categories;
  const items = contentData.featuredProducts.items as ProductItem[];

  // Filter items
  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter((item) => item.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-[#ed1c24] mb-3">
          <Sparkles className="w-4 h-4 text-[#ed1c24]" />
          Ưu đãi & Tiện ích đặc quyền VietinBank
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {contentData.featuredProducts.title}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {contentData.featuredProducts.description}
        </p>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 justify-start sm:justify-center scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-[#005596] text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Poster Grid & Carousel Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((prod) => (
          <div
            key={prod.id}
            className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Poster Image Area */}
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setPreviewPoster(prod.image)}>
              <img
                src={prod.image}
                alt={prod.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute('src', 'https://raw.githubusercontent.com/giadinhbanker/anh-super-app-bac-phu-tho/main/Ch%E1%BA%A1m%20POS%20r%C3%BAt%20ti%E1%BB%81n.png');
                }}
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ed1c24] text-white shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  {prod.tag}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                Chạm để xem ảnh lớn
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#005596] uppercase tracking-wider block mb-1">
                  {prod.categoryLabel}
                </span>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-[#005596] transition-colors leading-snug">
                  {prod.name}
                </h3>
                <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {prod.description}
                </p>

                {/* Benefits List */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  {prod.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#005596]" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button: "Tôi quan tâm" as specified in PDF 5 */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedProductForInterest(prod)}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#005596] to-[#0072ce] hover:from-[#004077] hover:to-[#005da8] shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>Tôi quan tâm</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal on click "Tôi quan tâm" with Exact Text from PDF 5 */}
      {selectedProductForInterest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedProductForInterest(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#005596] border border-sky-200 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#005596]" />
            </div>

            <h3 className="text-xl font-black text-slate-900">
              {contentData.featuredProducts.modalNotice.title}
            </h3>

            <div className="my-4 p-4 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed text-left">
              <p className="mb-3">
                {contentData.featuredProducts.modalNotice.message}
              </p>
              <p className="font-bold text-[#005596] pt-2 border-t border-sky-200/60">
                {contentData.featuredProducts.modalNotice.advisorText}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={`tel:${contentData.brand.advisorTrung.phone}`}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#ed1c24] hover:bg-[#c81017] shadow-md shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 animate-bounce" />
                <span>Gọi ngay {contentData.brand.advisorTrung.phone}</span>
              </a>

              <button
                onClick={() => setSelectedProductForInterest(null)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Poster Lightbox */}
      {previewPoster && (
        <div 
          onClick={() => setPreviewPoster(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewPoster(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewPoster}
              alt="Poster quảng bá"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
