import React, { useState } from 'react';
import { 
  HelpCircle, ChevronRight, ArrowLeft, Youtube, Phone, CheckCircle2, 
  XCircle, ThumbsUp, ThumbsDown, MessageSquareX, Sparkles, Image as ImageIcon,
  ExternalLink, ZoomIn, X
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface StepItem {
  step: number;
  text: string;
  image: string;
}

interface FaqCategory {
  id: string;
  title: string;
  description: string;
  badge: string;
  videoUrl: string;
  steps: StepItem[];
}

export const FaqSection: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'NONE' | 'SATISFIED' | 'UNSATISFIED' | 'ENDED'>('NONE');

  const categories = contentData.faq.categories as FaqCategory[];

  const handleSelectCategory = (cat: FaqCategory) => {
    setSelectedCategory(cat);
    setCurrentStepIdx(0);
    setFeedbackStatus('NONE');
  };

  const handleResetToCategoryList = () => {
    setSelectedCategory(null);
    setCurrentStepIdx(0);
    setFeedbackStatus('NONE');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      {/* If No Category Selected: Display Question and 4+ Cards */}
      {!selectedCategory ? (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-[#005596] mb-3">
              <HelpCircle className="w-4 h-4 text-[#005596]" />
              Trung tâm hỗ trợ khách hàng tại quầy
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {contentData.faq.question}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Chạm vào tình huống quý khách cần trợ giúp để xem từng bước minh họa chi tiết.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className="group relative bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-[#005596] border border-sky-100">
                      {cat.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-[#005596] transition-colors">
                      {cat.steps.length} bước
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#005596] transition-colors">
                    {idx + 1}. {cat.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#005596]">
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    Xem hướng dẫn từng bước
                  </span>
                  <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-[#005596] group-hover:bg-[#005596] group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Detailed Step-by-Step Viewer for Selected Category */
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header of Detail */}
          <div className="bg-gradient-to-r from-[#005596] to-[#0072ce] text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetToCategoryList}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
                title="Quay lại danh sách câu hỏi"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-sky-200 block">
                  Hướng dẫn chi tiết
                </span>
                <h3 className="text-lg sm:text-xl font-black">
                  {selectedCategory.title}
                </h3>
              </div>
            </div>

            {selectedCategory.videoUrl && (
              <a
                href={selectedCategory.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-transform active:scale-95"
              >
                <Youtube className="w-4 h-4 fill-white" />
                <span>Xem Video hướng dẫn YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
              </a>
            )}
          </div>

          {/* Stepper Navigation bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 overflow-x-auto flex items-center gap-2">
            {selectedCategory.steps.map((st, i) => (
              <button
                key={i}
                onClick={() => setCurrentStepIdx(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  currentStepIdx === i
                    ? 'bg-[#005596] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Bước {st.step}
              </button>
            ))}
          </div>

          {/* Step Body */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Step Text & Controls */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-sky-100 text-[#005596]">
                  <span>Bước {selectedCategory.steps[currentStepIdx]?.step} / {selectedCategory.steps.length}</span>
                </div>

                <div className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed whitespace-pre-line bg-sky-50/40 p-5 rounded-2xl border border-sky-100">
                  {selectedCategory.steps[currentStepIdx]?.text}
                </div>

                {/* Step controls */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    disabled={currentStepIdx === 0}
                    onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                      currentStepIdx === 0
                        ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 active:scale-95'
                    }`}
                  >
                    Bước trước
                  </button>

                  <button
                    disabled={currentStepIdx === selectedCategory.steps.length - 1}
                    onClick={() => setCurrentStepIdx((prev) => Math.min(selectedCategory.steps.length - 1, prev + 1))}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white transition-all ${
                      currentStepIdx === selectedCategory.steps.length - 1
                        ? 'opacity-40 cursor-not-allowed bg-slate-400'
                        : 'bg-[#005596] hover:bg-[#004077] active:scale-95 shadow-md shadow-blue-500/20'
                    }`}
                  >
                    Bước tiếp theo
                  </button>
                </div>
              </div>

              {/* Step Screenshot Image with click-to-zoom */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <div 
                  onClick={() => setPreviewImage(selectedCategory.steps[currentStepIdx]?.image)}
                  className="relative group cursor-pointer max-w-sm w-full bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md hover:shadow-xl transition-all"
                >
                  <img
                    src={selectedCategory.steps[currentStepIdx]?.image}
                    alt={`Minh họa bước ${selectedCategory.steps[currentStepIdx]?.step}`}
                    className="w-full h-auto max-h-[380px] object-contain mx-auto bg-slate-100"
                    onError={(e) => {
                      (e.target as HTMLElement).setAttribute('src', 'https://raw.githubusercontent.com/giadinhbanker/Anh-CN3/main/1.1.png');
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold text-xs backdrop-blur-xs">
                    <ZoomIn className="w-5 h-5" />
                    <span>Nhấn để phóng to ảnh</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 text-center">
                  🔍 Chạm vào ảnh chụp màn hình để xem kích thước lớn
                </span>
              </div>
            </div>

            {/* Satisfaction / Feedback Section as required in Document */}
            <div className="mt-10 pt-8 border-t border-slate-200">
              {feedbackStatus === 'NONE' && (
                <div className="bg-sky-50/70 rounded-2xl p-6 text-center max-w-xl mx-auto border border-sky-100">
                  <h4 className="text-base sm:text-lg font-bold text-slate-800">
                    Anh/chị thực hiện ổn hay chưa?
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    VietinBank luôn sẵn sàng đồng hành và hỗ trợ quý khách thực hiện giao dịch thuận tiện nhất.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => setFeedbackStatus('SATISFIED')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-sm transition-all"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Đã ổn, tôi làm được rồi</span>
                    </button>

                    <button
                      onClick={() => setFeedbackStatus('UNSATISFIED')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-rose-50 hover:text-rose-600 border border-slate-200 active:scale-95 shadow-sm transition-all"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>Chưa ổn, cần hỗ trợ</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Case 1: Satisfied Feedback */}
              {feedbackStatus === 'SATISFIED' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-900">
                    Tuyệt vời! Cảm ơn Quý khách đã tin tưởng VietinBank.
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Quý khách có thể quay lại menu chính để khám phá thêm các tính năng hữu ích khác.
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={handleResetToCategoryList}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#005596] bg-white border border-sky-200 hover:bg-sky-50 shadow-sm"
                    >
                      Quay lại menu chính
                    </button>
                    <button
                      onClick={() => setFeedbackStatus('ENDED')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                    >
                      Kết thúc cuộc trò chuyện
                    </button>
                  </div>
                </div>
              )}

              {/* Case 2: Unsatisfied Feedback - EXACT TEXT FROM SPEC */}
              {feedbackStatus === 'UNSATISFIED' && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 max-w-xl mx-auto space-y-4 text-center">
                  <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="text-sm font-semibold text-slate-800 leading-relaxed">
                    “ Cảm ơn Quý khách đã phản hồi. Quý khách có thể liên hệ Chuyên viên tư vấn{' '}
                    <strong className="text-[#005596] font-bold">
                      {contentData.brand.advisorThanh.name}
                    </strong>{' '}
                    – số điện thoại:{' '}
                    <a
                      href={`tel:${contentData.brand.advisorThanh.phone}`}
                      className="text-[#ed1c24] font-black underline"
                    >
                      {contentData.brand.advisorThanh.phone}
                    </a>{' '}
                    để hỗ trợ trực tiếp. Em sẽ cố gắng cải thiện để phục vụ Quý khách tốt hơn! ”
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-3">
                    <a
                      href={`tel:${contentData.brand.advisorThanh.phone}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#ed1c24] hover:bg-[#c81017] shadow-md shadow-red-500/20 active:scale-95"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Gọi ngay {contentData.brand.advisorThanh.phone}</span>
                    </a>
                    <button
                      onClick={handleResetToCategoryList}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
                    >
                      Quay lại menu chính
                    </button>
                    <button
                      onClick={() => setFeedbackStatus('ENDED')}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700"
                    >
                      Kết thúc cuộc trò chuyện
                    </button>
                  </div>
                </div>
              )}

              {/* Case 3: Ended Conversation - EXACT TEXT FROM SPEC */}
              {feedbackStatus === 'ENDED' && (
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-4">
                  <div className="w-12 h-12 bg-sky-100 text-[#005596] rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-[#005596]">
                    "Cảm ơn Quý khách đã sử dụng dịch vụ của VietinBank. Chúc Quý khách một ngày tốt lành!"
                  </h4>
                  <div className="pt-2">
                    <button
                      onClick={handleResetToCategoryList}
                      className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#005596] hover:bg-[#004077] shadow-md transition-all active:scale-95"
                    >
                      Bắt đầu cuộc trò chuyện mới
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Modal for Screenshots */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Screenshot phóng to"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
