import React, { useState, useMemo } from 'react';
import { 
  Calculator, Table, Download, Printer, Calendar, ShieldCheck, 
  ChevronRight, X, ArrowUpDown, FileText, Info, CheckCircle2
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface ScheduleRow {
  period: number;
  paymentDateStr: string;
  openingPrincipal: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  closingPrincipal: number;
}

export const LoanScheduleSection: React.FC = () => {
  // Input States (Form fields)
  const [propertyValueStr, setPropertyValueStr] = useState<string>('1,000,000,000');
  const [loanAmountStr, setLoanAmountStr] = useState<string>('500,000,000');
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60);
  const [annualRateStr, setAnnualRateStr] = useState<string>('8.5');
  const [disbursementDate, setDisbursementDate] = useState<string>('2026-01-10');
  const [paymentCycle, setPaymentCycle] = useState<'monthly' | 'quarterly' | 'half_year' | 'yearly'>('monthly');
  const [paymentDay, setPaymentDay] = useState<number>(25);
  const [roundingUnit, setRoundingUnit] = useState<number>(1000); // 1 for dong, 1000 for thousand dong

  // Detailed modal view
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Helper formatters
  const parseFormattedNumber = (str: string): number => {
    const cleanStr = str.replace(/[^\d]/g, '');
    return cleanStr ? parseInt(cleanStr, 10) : 0;
  };

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(val));
  };

  // Convert annual rate to period rate based on selected cycle
  const getCycleDetails = useMemo(() => {
    switch (paymentCycle) {
      case 'quarterly':
        return { label: 'Hằng quý', monthStep: 3, divisor: 4 };
      case 'half_year':
        return { label: '6 tháng', monthStep: 6, divisor: 2 };
      case 'yearly':
        return { label: 'Hằng năm', monthStep: 12, divisor: 1 };
      case 'monthly':
      default:
        return { label: 'Hằng tháng', monthStep: 1, divisor: 12 };
    }
  }, [paymentCycle]);

  // Generate Amortization Schedule (Reducing Balance)
  const { schedule, summary } = useMemo(() => {
    const loanAmount = parseFormattedNumber(loanAmountStr);
    const annualRate = parseFloat(annualRateStr) || 0;
    const termMonths = loanTermMonths || 12;
    const { monthStep, divisor } = getCycleDetails;

    const totalPeriods = Math.max(1, Math.floor(termMonths / monthStep));
    const periodRate = (annualRate / 100) / divisor;

    // Base principal payment per period
    const rawPrincipalPerPeriod = loanAmount / totalPeriods;
    let basePrincipal = roundingUnit === 1000 
      ? Math.round(rawPrincipalPerPeriod / 1000) * 1000 
      : Math.round(rawPrincipalPerPeriod);

    let currentPrincipal = loanAmount;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;
    const rows: ScheduleRow[] = [];

    // Parse disbursement date
    const [dYear, dMonth, dDay] = disbursementDate.split('-').map(Number);
    let curDate = new Date(dYear, dMonth - 1, dDay || 1);

    for (let i = 1; i <= totalPeriods; i++) {
      // Calculate payment date: advance by monthStep months and set to designated paymentDay
      let nextMonth = curDate.getMonth() + monthStep;
      let nextYear = curDate.getFullYear() + Math.floor(nextMonth / 12);
      nextMonth = nextMonth % 12;

      // Handle day of month
      const daysInTargetMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
      const actualDay = Math.min(paymentDay, daysInTargetMonth);
      const targetDate = new Date(nextYear, nextMonth, actualDay);
      curDate = targetDate;

      const dateStr = `${String(targetDate.getDate()).padStart(2, '0')}/${String(targetDate.getMonth() + 1).padStart(2, '0')}/${targetDate.getFullYear()}`;

      // Calculate interest on remaining balance
      let interest = currentPrincipal * periodRate;
      if (roundingUnit === 1000) {
        interest = Math.round(interest / 1000) * 1000;
      } else {
        interest = Math.round(interest);
      }

      // Principal payment: adjust last period to ensure exact match with loanAmount
      let principal = basePrincipal;
      if (i === totalPeriods) {
        principal = currentPrincipal; // exact remaining
      }

      const total = principal + interest;
      const closing = Math.max(0, currentPrincipal - principal);

      rows.push({
        period: i,
        paymentDateStr: dateStr,
        openingPrincipal: currentPrincipal,
        principalPayment: principal,
        interestPayment: interest,
        totalPayment: total,
        closingPrincipal: closing
      });

      totalPrincipalPaid += principal;
      totalInterestPaid += interest;
      currentPrincipal = closing;
    }

    const firstPeriodTotal = rows.length > 0 ? rows[0].totalPayment : 0;
    const lastPeriodTotal = rows.length > 0 ? rows[rows.length - 1].totalPayment : 0;
    const totalPayment = totalPrincipalPaid + totalInterestPaid;

    return {
      schedule: rows,
      summary: {
        totalPeriods,
        firstPeriodTotal,
        lastPeriodTotal,
        totalPrincipalPaid,
        totalInterestPaid,
        totalPayment
      }
    };
  }, [loanAmountStr, annualRateStr, loanTermMonths, getCycleDetails, disbursementDate, paymentDay, roundingUnit]);

  // Export schedule to CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Ky,Ngay tra no,So goc con lai,Goc tra,Lai tra,Tong goc va lai\n';
    schedule.forEach((row) => {
      csvContent += `${row.period},${row.paymentDateStr},${row.openingPrincipal},${row.principalPayment},${row.interestPayment},${row.totalPayment}\n`;
    });
    csvContent += `TONG CONG,,${summary.totalPrincipalPaid},${summary.totalInterestPaid},${summary.totalPayment}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lich_tra_no_VietinBank_${disbursementDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 mb-3">
          <Calculator className="w-4 h-4 text-indigo-700" />
          Công cụ tính toán tài chính tín dụng
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {contentData.loanConfig.title}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {contentData.loanConfig.subtitle}
        </p>
      </div>

      {/* Step 1: Input Information (Redesigned as typed inputs, not sliders) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs Panel */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#005596] block">
                Bước 1
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Nhập thông tin khoản vay
              </h3>
            </div>
            <span className="text-xs text-slate-400">Đơn vị: VND</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Input: Giá trị bất động sản / TSBĐ (Tùy chọn) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Giá trị bất động sản / TSBĐ (VND)
              </label>
              <input
                type="text"
                value={propertyValueStr}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^\d]/g, '');
                  setPropertyValueStr(val ? formatCurrency(parseInt(val, 10)) : '');
                }}
                placeholder="Ví dụ: 1,000,000,000"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#005596]"
              />
            </div>

            {/* Input: Số tiền vay (Dạng nhập, không kéo thả theo yêu cầu) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Số tiền vay <span className="text-red-500">*</span> (VND)
              </label>
              <input
                type="text"
                value={loanAmountStr}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^\d]/g, '');
                  setLoanAmountStr(val ? formatCurrency(parseInt(val, 10)) : '');
                }}
                placeholder="Ví dụ: 500,000,000"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#005596] border border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#005596]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Input: Thời gian vay (Tháng) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Thời gian vay (Tháng) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="420"
                  value={loanTermMonths}
                  onChange={(e) => setLoanTermMonths(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-bold border border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#005596]"
                />
                <select
                  value={loanTermMonths}
                  onChange={(e) => setLoanTermMonths(parseInt(e.target.value, 10))}
                  className="px-2 py-2 text-xs font-semibold bg-slate-100 rounded-xl border border-slate-300"
                >
                  <option value={12}>1 năm (12T)</option>
                  <option value={24}>2 năm (24T)</option>
                  <option value={36}>3 năm (36T)</option>
                  <option value={60}>5 năm (60T)</option>
                  <option value={120}>10 năm (120T)</option>
                  <option value={180}>15 năm (180T)</option>
                  <option value={240}>20 năm (240T)</option>
                </select>
              </div>
            </div>

            {/* Input: Lãi suất năm */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Lãi suất (% / Năm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="30"
                value={annualRateStr}
                onChange={(e) => setAnnualRateStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm font-bold border border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#005596]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Input: Ngày giải ngân */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Ngày giải ngân <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 bg-slate-50/50 focus:bg-white"
              />
            </div>

            {/* Input: Chu kỳ trả nợ */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Chu kỳ trả nợ <span className="text-red-500">*</span>
              </label>
              <select
                value={paymentCycle}
                onChange={(e) => setPaymentCycle(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 bg-slate-50/50 focus:bg-white"
              >
                {contentData.loanConfig.cycles.map((cy) => (
                  <option key={cy.id} value={cy.id}>
                    {cy.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Input: Ngày trả nợ định kỳ */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Ngày trả nợ định kỳ
              </label>
              <select
                value={paymentDay}
                onChange={(e) => setPaymentDay(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 bg-slate-50/50 focus:bg-white"
              >
                {[5, 10, 15, 20, 25, 28].map((d) => (
                  <option key={d} value={d}>
                    Ngày {d} hằng tháng
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quy tắc làm tròn */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>Quy tắc làm tròn:</span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="rounding"
                  checked={roundingUnit === 1000}
                  onChange={() => setRoundingUnit(1000)}
                  className="text-[#005596]"
                />
                <span>Làm tròn 1.000 đồng</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="rounding"
                  checked={roundingUnit === 1}
                  onChange={() => setRoundingUnit(1)}
                  className="text-[#005596]"
                />
                <span>Đơn vị đồng</span>
              </label>
            </div>
          </div>
        </div>

        {/* Step 2: Summary Card & Action Button to View Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#00386b] via-[#005596] to-[#0284c7] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <span className="text-[11px] uppercase font-extrabold tracking-wider text-sky-200 block">
              Tóm tắt khoản vay
            </span>
            <h3 className="text-xl font-black mt-1">
              Số tiền trả tháng đầu & tháng cuối
            </h3>

            <div className="grid grid-cols-2 gap-4 mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
              <div>
                <span className="text-[11px] text-sky-200 block">Số tiền trả tháng đầu</span>
                <span className="text-lg sm:text-xl font-black text-amber-300 block mt-0.5">
                  {formatCurrency(summary.firstPeriodTotal)} đ
                </span>
                <span className="text-[10px] text-sky-100">Kỳ cao nhất</span>
              </div>
              <div>
                <span className="text-[11px] text-sky-200 block">Số tiền trả tháng cuối</span>
                <span className="text-lg sm:text-xl font-black text-emerald-300 block mt-0.5">
                  {formatCurrency(summary.lastPeriodTotal)} đ
                </span>
                <span className="text-[10px] text-sky-100">Kỳ thấp nhất</span>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-sky-200">Tổng tiền vay (Gốc):</span>
                <span className="font-bold">{formatCurrency(summary.totalPrincipalPaid)} VND</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-sky-200">Tổng lãi phải trả:</span>
                <span className="font-bold text-amber-300">{formatCurrency(summary.totalInterestPaid)} VND</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10 text-sm">
                <span className="font-bold text-white">Tổng tiền trả (Gốc + Lãi):</span>
                <span className="font-black text-white">{formatCurrency(summary.totalPayment)} VND</span>
              </div>
            </div>

            {/* Button: "Xem chi tiết" as specified in PDF 3 */}
            <button
              onClick={() => setShowDetailModal(true)}
              className="mt-6 w-full py-3.5 px-6 rounded-2xl font-black text-sm text-[#005596] bg-white hover:bg-sky-50 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Table className="w-4 h-4" />
              <span>Xem chi tiết lịch trả nợ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#005596] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-800">Phương thức dư nợ giảm dần:</strong> Gốc được chia đều cho tất cả các kỳ ({summary.totalPeriods} kỳ). Tiền lãi được tính trên dư nợ thực tế còn lại, do đó số tiền phải trả giảm dần theo thời gian.
            </div>
          </div>
        </div>
      </div>

      {/* Step 2 Modal: Full Amortization Table */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#005596] to-[#0072ce] text-white p-5 sm:p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-black">
                  Bảng tính lịch trả nợ với dư nợ giảm dần
                </h3>
                <p className="text-xs text-sky-100 mt-1">
                  Khoản vay: {loanAmountStr} VND | Kỳ hạn: {loanTermMonths} tháng | Lãi suất: {annualRateStr}%/năm
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất CSV</span>
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Table Content */}
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-black uppercase tracking-wider sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 text-center">Kỳ</th>
                    <th className="py-3 px-3">Kỳ trả nợ</th>
                    <th className="py-3 px-3 text-right">Số gốc còn lại</th>
                    <th className="py-3 px-3 text-right">Gốc</th>
                    <th className="py-3 px-3 text-right">Lãi</th>
                    <th className="py-3 px-3 text-right">Tổng Gốc + Lãi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Initial row 0 */}
                  <tr className="bg-slate-50/50 text-slate-500 font-semibold">
                    <td className="py-2.5 px-3 text-center">0</td>
                    <td className="py-2.5 px-3">{disbursementDate.split('-').reverse().join('/')}</td>
                    <td className="py-2.5 px-3 text-right">{formatCurrency(parseFormattedNumber(loanAmountStr))}</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                  </tr>

                  {schedule.map((row) => (
                    <tr key={row.period} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">{row.period}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">{row.paymentDateStr}</td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-600">{formatCurrency(row.openingPrincipal)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-800">{formatCurrency(row.principalPayment)}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-amber-700">{formatCurrency(row.interestPayment)}</td>
                      <td className="py-2.5 px-3 text-right font-black text-[#005596]">{formatCurrency(row.totalPayment)}</td>
                    </tr>
                  ))}
                </tbody>
                {/* Total row as specified in PDF 3 */}
                <tfoot className="bg-[#005596] text-white font-black sticky bottom-0">
                  <tr>
                    <td colSpan={3} className="py-3 px-3 text-center uppercase tracking-wider">
                      TỔNG CỘNG
                    </td>
                    <td className="py-3 px-3 text-right">
                      {formatCurrency(summary.totalPrincipalPaid)}
                    </td>
                    <td className="py-3 px-3 text-right text-amber-300">
                      {formatCurrency(summary.totalInterestPaid)}
                    </td>
                    <td className="py-3 px-3 text-right text-yellow-300">
                      {formatCurrency(summary.totalPayment)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                * Sai lệch do làm tròn được tự động điều chỉnh vào kỳ trả nợ cuối cùng.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleExportCSV}
                  className="sm:hidden px-4 py-2 rounded-xl text-xs font-bold bg-[#005596] text-white"
                >
                  Xuất file CSV
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-all"
                >
                  Đóng lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
