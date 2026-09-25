"use client";

import React, { useState } from "react";
import { ClassProfile, MonthlyPeriod, Student } from "@/types";
import { formatRupiah, generateWhatsAppPaymentConfirmation } from "@/lib/dataStore";
import confetti from "canvas-confetti";
import {
  Coins,
  QrCode,
  CreditCard,
  Banknote,
  Copy,
  Check,
  MessageCircle,
  X,
  Sparkles,
  Download,
  AlertCircle,
} from "lucide-react";

interface CollectCashModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ClassProfile;
  students: Student[];
  periods: MonthlyPeriod[];
  currentPeriodId: string;
  isTreasurer: boolean;
  onRecordPayment: (studentId: string, periodIds: string[]) => void;
}

export const CollectCashModal: React.FC<CollectCashModalProps> = ({
  isOpen,
  onClose,
  profile,
  students,
  periods,
  currentPeriodId,
  isTreasurer,
  onRecordPayment,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(
    students[0]?.id || ""
  );
  const [selectedPeriodIds, setSelectedPeriodIds] = useState<string[]>([
    currentPeriodId,
  ]);
  const [activePaymentMethod, setActivePaymentMethod] = useState<
    "QRIS" | "TRANSFER" | "CASH"
  >("QRIS");
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);

  if (!isOpen) return null;

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const totalAmount = selectedPeriodIds.reduce((sum, pId) => {
    const period = periods.find((p) => p.id === pId);
    return sum + (period?.target_amount || profile.monthly_due_amount);
  }, 0);

  const togglePeriodSelection = (periodId: string) => {
    if (selectedPeriodIds.includes(periodId)) {
      if (selectedPeriodIds.length > 1) {
        setSelectedPeriodIds(selectedPeriodIds.filter((id) => id !== periodId));
      }
    } else {
      setSelectedPeriodIds([...selectedPeriodIds, periodId]);
    }
  };

  const selectAllPeriods = () => {
    setSelectedPeriodIds(periods.map((p) => p.id));
  };

  const selectCurrentOnly = () => {
    setSelectedPeriodIds([currentPeriodId]);
  };

  const handleCopyAccount = () => {
    if (!profile.bank_account_number) return;
    navigator.clipboard.writeText(profile.bank_account_number);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleSendWAConfirmation = () => {
    if (!selectedStudent) return;
    const selectedMonthNames = selectedPeriodIds.map((pId) => {
      const p = periods.find((item) => item.id === pId);
      return p?.month_name || "Bulan ini";
    });

    const encoded = generateWhatsAppPaymentConfirmation(
      selectedStudent.name,
      selectedMonthNames,
      totalAmount,
      activePaymentMethod,
      profile.class_name
    );

    const treasurerPhone = profile.treasurer_phone.replace(/^0/, "62");
    window.open(`https://wa.me/${treasurerPhone}?text=${encoded}`, "_blank");
  };

  const handleTreasurerRecordDirectly = () => {
    if (!selectedStudentId || selectedPeriodIds.length === 0) return;

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#10b981", "#14b8a6", "#3b82f6", "#f59e0b"],
      });
    } catch (e) {
      // ignore
    }

    onRecordPayment(selectedStudentId, selectedPeriodIds);
    setSuccessSaved(true);
    setTimeout(() => {
      setSuccessSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-[#E2E8F0] shadow-2xl p-5 sm:p-7 space-y-5 font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full hover:bg-[#F1F5F9] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center p-1 shrink-0">
            <img src="/logo.jpg" alt="DUIT by classy" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                Kumpulin Kas Kelas
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Bulanan
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Bayar atau catat iuran kas {profile.class_name} dengan cepat & transparan.
            </p>
          </div>
        </div>

        {/* 1. Pilih Siswa */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
            1. Pilih Siswa Pembayar
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            {students
              .filter((s) => s.is_active)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  No. {s.attendance_number} — {s.name} ({s.gender})
                </option>
              ))}
          </select>
        </div>

        {/* 2. Pilih Bulan Tagihan */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#475569]">
              2. Pilih Bulan yang Dibayar
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectCurrentOnly}
                className="text-[11px] font-semibold text-emerald-600 hover:underline"
              >
                Bulan Ini Saja
              </button>
              <span className="text-zinc-300">•</span>
              <button
                type="button"
                onClick={selectAllPeriods}
                className="text-[11px] font-semibold text-emerald-600 hover:underline"
              >
                1 Semester (6 Bulan)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {periods.map((period) => {
              const isSelected = selectedPeriodIds.includes(period.id);
              return (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => togglePeriodSelection(period.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs"
                      : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{period.short_code}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono mt-0.5 text-slate-500">
                    {formatRupiah(period.target_amount)}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Total Counter Card */}
          <div className="mt-3 p-3.5 rounded-2xl bg-[#0F172A] text-white flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">
                Total Tagihan ({selectedPeriodIds.length} Bulan):
              </span>
              <span className="text-lg sm:text-xl font-black text-emerald-400">
                {formatRupiah(totalAmount)}
              </span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
              @{formatRupiah(profile.monthly_due_amount)} / bln
            </span>
          </div>
        </div>

        {/* 3. Metode Pembayaran Tabs */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
            3. Metode Pembayaran
          </label>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] mb-3">
            <button
              type="button"
              onClick={() => setActivePaymentMethod("QRIS")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activePaymentMethod === "QRIS"
                  ? "bg-white text-[#0F172A] shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>QRIS Kelas</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePaymentMethod("TRANSFER")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activePaymentMethod === "TRANSFER"
                  ? "bg-white text-[#0F172A] shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Transfer Bank</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePaymentMethod("CASH")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activePaymentMethod === "CASH"
                  ? "bg-white text-[#0F172A] shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <Banknote className="w-4 h-4 text-amber-600" />
              <span>Tunai (Cash)</span>
            </button>
          </div>

          {/* Method 1: QRIS Display */}
          {activePaymentMethod === "QRIS" && (
            <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] text-center space-y-3">
              <div className="inline-block p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
                <img
                  src={profile.qris_image_url}
                  alt="QRIS Kas Kelas"
                  className="w-44 h-44 object-contain mx-auto rounded-lg"
                />
              </div>
              <p className="text-xs text-[#475569] max-w-sm mx-auto">
                Scan QRIS di atas melalui GoPay, OVO, Dana, ShopeePay, atau Mobile Banking apa saja sebesar{" "}
                <strong className="text-emerald-600">{formatRupiah(totalAmount)}</strong>.
              </p>
            </div>
          )}

          {/* Method 2: Transfer Bank / E-Wallet */}
          {activePaymentMethod === "TRANSFER" && (
            <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Bank / E-Wallet
                  </span>
                  <span className="text-sm font-bold text-[#0F172A]">
                    {profile.bank_name || "BCA / DANA"}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  a.n. {profile.bank_account_holder}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] text-slate-400 block">Nomor Rekening:</span>
                  <span className="font-mono text-base font-black text-[#0F172A] tracking-wider">
                    {profile.bank_account_number}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-bold text-[#0F172A] transition-colors"
                >
                  {copiedAccount ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Salin No.</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Method 3: Tunai */}
          {activePaymentMethod === "CASH" && (
            <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 text-xs text-[#475569]">
              <p className="font-semibold text-[#0F172A]">
                Pembayaran Tunai ke Bendahara Kelas:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Temui bendahara kelas (<strong>{profile.treasurer_name}</strong>) saat jam istirahat.</li>
                <li>Siapkan uang pas sebesar <strong>{formatRupiah(totalAmount)}</strong>.</li>
                <li>Pastikan bendahara langsung mencentang status lunas di aplikasi ini.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
          {/* Siswa: Kirim Konfirmasi WhatsApp */}
          <button
            type="button"
            onClick={handleSendWAConfirmation}
            className="w-full py-3 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim Bukti Pembayaran ke WA Bendahara</span>
          </button>

          {/* Bendahara: Tandai Lunas Langsung */}
          {isTreasurer && (
            <button
              type="button"
              onClick={handleTreasurerRecordDirectly}
              className="w-full py-2.5 rounded-2xl text-xs font-bold bg-[#0F172A] hover:bg-slate-800 text-white transition-all flex items-center justify-center gap-1.5"
            >
              {successSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Berhasil Dicatat Lunas!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>Aksi Bendahara: Langsung Tandai Lunas</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
