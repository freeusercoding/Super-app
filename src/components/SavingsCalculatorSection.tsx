import React, { useState, useMemo } from 'react';
import { 
  PiggyBank, Calculator, ExternalLink, ArrowRight, ShieldCheck, 
  Sparkles, AlertCircle, RefreshCw, HelpCircle, Video
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const SavingsCalculatorSection: React.FC = () => {
  // States
  const [depositAmountStr, setDepositAmountStr] = useState<string>('100,000,000');
  const [selectedMonths, setSelectedMonths] = useState<number>(12);
  const [customRate, setCustomRate] = useState<string>('5.0');
  const [amountError, setAmountError] = useState<string | null>(null);
  const [termError, setTermError] = useState<string | null>(null);
  const [rateError, setRateError] = useState<string | null>(null);

  const terms = contentData.savingsConfig.terms;

  // Format currency helpers
  const parseFormattedNumber = (str: string): number => {
    const cleanStr = str.replace(/[^\d]/g, '');
    return cleanStr ? parseInt(cleanStr, 10) : 0;
  };

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('vi-VN').format(val);
  };

  // When term changes, update default interest rate
  const handleTermChange = (months: number) => {
    setSelectedMonths(months);
    setTermError(null);
    const matched = terms.find((t) => t.months === months);
    if (matched) {
      setCustomRate(matched.rate.toString());
      setRateError(null);
    }
  };

  // Handle amount input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    if (!rawValue) {
      setDepositAmountStr('');
      setAmountError('Vui lòng nhập số tiền gửi hợp lệ.');
      return;
    }
    const num = parseInt(rawValue, 10);
    setDepositAmountStr(formatCurrency(num));

    if (num <= 0) {
      setAmountError('Vui lòng nhập số tiền gửi hợp lệ.');
    } else if (num < 1000000) {
      setAmountError('Số tiền gửi tối thiểu tại quầy là 1.000.000 VND.');
    } else {
      setAmountError(null);
    }
  };

  // Handle rate input
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomRate(val);
    const num = parseFloat(val);
    if (isNaN(num) || num < 0 || num > 20) {
      setRateError('Vui lòng nhập lãi suất hợp lệ.');
    } else {
      setRateError(null);
    }
  };

  // Quick preset buttons (+10tr, +50tr, +100tr, +500tr)
  const addAmountPreset = (added: number) => {
    const current = parseFormattedNumber(depositAmountStr);
    const updated = current + added;
    setDepositAmountStr(formatCurrency(updated));
    setAmountError(null);
  };

  // Calculate Interest and Maturity Amount
  const { principal, interest, totalAmount, isValid } = useMemo(() => {
    const p = parseFormattedNumber(depositAmountStr);
    const r = parseFloat(customRate);
    const m = selectedMonths;

    const valid = p > 0 && !isNaN(r) && r >= 0 && m > 0;
    if (!valid) {
      return { principal: 0, interest: 0, totalAmount: 0, isValid: false };
    }

    // Tiền lãi = (Số tiền gửi * Lãi suất %/năm * Số tháng) / 12
    const calcInterest = Math.round((p * (r / 100) * m) / 12);
    const calcTotal = p + calcInterest;

    return {
      principal: p,
      interest: calcInterest,
      totalAmount: calcTotal,
      isValid: true
    };
  }, [depositAmountStr, customRate, selectedMonths]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-3">
          <PiggyBank className="w-4 h-4 text-emerald-700" />
          Tiết kiệm sinh lời an toàn & uy tín
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {contentData.savingsConfig.title}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {contentData.savingsConfig.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#005596]" />
              <span>Thông tin tính lãi dự kiến</span>
            </h3>
            <span className="text-xs text-slate-400">Đơn vị: VND</span>
          </div>

          {/* Input 1: Tiền gửi dự tính */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tiền gửi dự tính (Tổng tiền gửi) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-semibold text-[#005596]">VND</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={depositAmountStr}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền gửi (ví dụ: 100,000,000)"
                className={`w-full px-4 py-3.5 rounded-xl text-lg font-bold text-slate-900 border transition-all ${
                  amountError
                    ? 'border-red-400 bg-red-50/50 focus:ring-red-400'
                    : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#005596] focus:ring-2 focus:ring-blue-100'
                }`}
              />
            </div>
            {amountError && (
              <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{amountError}</span>
              </p>
            )}

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs text-slate-400 font-medium">Chọn nhanh:</span>
              {[10000000, 50000000, 100000000, 500000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setDepositAmountStr(formatCurrency(val));
                    setAmountError(null);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-sky-50 hover:text-[#005596] border border-slate-200 transition-colors"
                >
                  +{formatCurrency(val / 1000000)} triệu
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Kỳ hạn gửi */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kỳ hạn gửi <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-500 font-medium">Theo biểu lãi suất VietinBank</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {terms.map((t) => (
                <button
                  key={t.months}
                  type="button"
                  onClick={() => handleTermChange(t.months)}
                  className={`relative p-3 rounded-xl border text-center transition-all ${
                    selectedMonths === t.months
                      ? 'bg-[#005596] text-white border-[#005596] shadow-sm font-bold'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {t.isPopular && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-red-500 text-white">
                      Hot
                    </span>
                  )}
                  <div className="text-xs font-bold">{t.label}</div>
                  <div className={`text-[11px] mt-0.5 ${selectedMonths === t.months ? 'text-sky-200' : 'text-slate-400'}`}>
                    {t.rate}%/năm
                  </div>
                </button>
              ))}
            </div>
            {termError && (
              <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{termError}</span>
              </p>
            )}
          </div>

          {/* Input 3: Lãi suất */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Lãi suất (% / Năm) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-400">Có thể điều chỉnh linh hoạt</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={customRate}
                onChange={handleRateChange}
                className={`w-full px-4 py-3 rounded-xl text-base font-bold text-slate-900 border transition-all ${
                  rateError
                    ? 'border-red-400 bg-red-50/50'
                    : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#005596]'
                }`}
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                %/năm
              </span>
            </div>
            {rateError && (
              <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{rateError}</span>
              </p>
            )}
          </div>
        </div>

        {/* Output Panel: Result Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#005596] to-[#00386b] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/15">
              <span className="text-xs uppercase font-extrabold tracking-wider text-sky-200">
                Kết quả dự tính
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white">
                Trả lãi cuối kỳ
              </span>
            </div>

            {/* Interest Result */}
            <div className="mt-6">
              <span className="text-xs text-sky-200 block">Tiền lãi dự tính</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight mt-1">
                {isValid ? `${formatCurrency(interest)} VND` : '0 VND'}
              </div>
            </div>

            {/* Total Maturity Result */}
            <div className="mt-6 pt-5 border-t border-white/15">
              <span className="text-xs text-sky-200 block">Tổng tiền nhận khi đáo hạn (Gốc + Lãi)</span>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                {isValid ? `${formatCurrency(totalAmount)} VND` : '0 VND'}
              </div>
            </div>

            {/* Breakdown Mini Bar */}
            {isValid && principal > 0 && (
              <div className="mt-6 bg-white/10 p-3.5 rounded-2xl">
                <div className="flex justify-between text-[11px] font-semibold text-sky-100 mb-1.5">
                  <span>Tiền gốc: {formatCurrency(principal)} VND</span>
                  <span className="text-amber-300">+{((interest / principal) * 100).toFixed(2)}%</span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-sky-300" 
                    style={{ width: `${(principal / totalAmount) * 100}%` }}
                    title="Tiền gốc"
                  />
                  <div 
                    className="h-full bg-amber-400" 
                    style={{ width: `${(interest / totalAmount) * 100}%` }}
                    title="Tiền lãi"
                  />
                </div>
              </div>
            )}

            <div className="mt-6 text-[11px] text-sky-200/80 leading-relaxed">
              * Lãi suất và tiền lãi thực tế có thể thay đổi tùy thuộc vào chính sách ưu đãi của VietinBank tại thời điểm gửi tiền thực tế.
            </div>
          </div>

          {/* TikTok Video Guide Box as specified in PDF 2 */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Video className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  Video hướng dẫn gửi tiết kiệm
                </h4>
                <p className="text-[11px] text-slate-500">
                  Xem clip ngắn hướng dẫn thao tác gửi tiết kiệm online
                </p>
              </div>
            </div>

            <a
              href={contentData.savingsConfig.tiktokVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shrink-0 transition-transform active:scale-95 shadow-sm"
            >
              <span>Xem TikTok</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
