import React, { useState } from 'react';
import { 
  Smartphone, Apple, PlayCircle, QrCode, Shield, Zap, Sparkles, 
  CheckCircle, ArrowRight, Share2, Copy, Check
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const IpayDownloadSection: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopyLink = (url: string, platform: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(platform);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Title & Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-[#005596] mb-3">
          <Smartphone className="w-4 h-4 text-[#005596]" />
          Ngân hàng số thông minh VietinBank iPay
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {contentData.ipayDownload.title}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          {contentData.ipayDownload.subtitle}
        </p>
      </div>

      {/* Two Platform Download Cards with Live QR codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* iOS Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/80 shadow-md hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                  <Apple className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Dành cho iPhone / iPad
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Apple App Store
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                iOS 13.0+
              </span>
            </div>

            {/* QR Code Container */}
            <div className="bg-slate-50 rounded-2xl p-6 my-6 border border-slate-100 flex flex-col items-center text-center">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
                <img
                  src={contentData.ipayDownload.ios.qr}
                  alt="QR Code Tải iPay iOS"
                  className="w-44 h-44 object-contain rounded-lg"
                />
              </div>
              <span className="mt-3 text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#005596]" />
                Mở camera điện thoại quét mã để tải ngay
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={contentData.ipayDownload.ios.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Apple className="w-5 h-5" />
              <span>Tải từ Apple App Store</span>
            </a>

            <button
              onClick={() => handleCopyLink(contentData.ipayDownload.ios.url, 'ios')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#005596] bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center gap-1.5 transition-all"
            >
              {copiedLink === 'ios' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink === 'ios' ? 'Đã sao chép liên kết tải!' : 'Sao chép đường dẫn tải App'}</span>
            </button>
          </div>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/80 shadow-md hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <PlayCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Dành cho Android
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Google Play Store (Samsung, Oppo, Xiaomi...)
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                Android 7.0+
              </span>
            </div>

            {/* QR Code Container */}
            <div className="bg-slate-50 rounded-2xl p-6 my-6 border border-slate-100 flex flex-col items-center text-center">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
                <img
                  src={contentData.ipayDownload.android.qr}
                  alt="QR Code Tải iPay Android"
                  className="w-44 h-44 object-contain rounded-lg"
                />
              </div>
              <span className="mt-3 text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-600" />
                Mở camera quét mã hoặc mở ứng dụng Google Play
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={contentData.ipayDownload.android.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Tải từ Google Play Store</span>
            </a>

            <button
              onClick={() => handleCopyLink(contentData.ipayDownload.android.url, 'android')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center gap-1.5 transition-all"
            >
              {copiedLink === 'android' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink === 'android' ? 'Đã sao chép liên kết tải!' : 'Sao chép đường dẫn tải App'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Benefits & Key Features */}
      <div className="bg-gradient-to-br from-[#005596] to-[#00386b] rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-black tracking-wider uppercase text-amber-300">
            Trải nghiệm vượt trội
          </span>
          <h3 className="text-xl sm:text-2xl font-black mt-1">
            Vì sao nên cài đặt VietinBank iPay Mobile ngay hôm nay?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {contentData.ipayDownload.features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex items-start gap-3 hover:bg-white/15 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-sky-50 leading-relaxed">
                {feat}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
