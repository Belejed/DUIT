"use client";

import React, { useState } from "react";
import { X, CalendarPlus, Coins } from "lucide-react";

interface AddPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMonthlyAmount: number;
  onAddPeriod: (monthName: string, shortCode: string, dueDate: string, targetAmount: number) => void;
}

export const AddPeriodModal: React.FC<AddPeriodModalProps> = ({
  isOpen,
  onClose,
  defaultMonthlyAmount,
  onAddPeriod,
}) => {
  const [monthName, setMonthName] = useState("Januari 2027");
  const [shortCode, setShortCode] = useState("Jan");
  const [dueDate, setDueDate] = useState("2027-01-15");
  const [targetAmount, setTargetAmount] = useState(defaultMonthlyAmount);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monthName.trim() || !dueDate) return;

    onAddPeriod(
      monthName.trim(),
      shortCode.trim() || monthName.trim().slice(0, 3),
      dueDate,
      Number(targetAmount) || defaultMonthlyAmount
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white border border-[#E2E8F0] p-6 shadow-2xl font-sans">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full hover:bg-[#F1F5F9]"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2 mb-1">
          <CalendarPlus className="w-5 h-5 text-emerald-600" />
          <span>Tambah Bulan Kas Baru</span>
        </h3>
        <p className="text-xs text-[#64748B] mb-4">
          Buat kolom tagihan kas bulanan baru untuk kelas.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1">
              Nama Bulan & Tahun
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Januari 2027"
              value={monthName}
              onChange={(e) => {
                setMonthName(e.target.value);
                if (!shortCode || shortCode.length <= 3) {
                  setShortCode(e.target.value.slice(0, 3));
                }
              }}
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">
                Kode Singkat
              </label>
              <input
                type="text"
                required
                maxLength={4}
                placeholder="Jan"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">
                Batas Waktu Bayar
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1">
              Nominal Iuran Bulanan (Rp)
            </label>
            <input
              type="number"
              required
              min={0}
              step={1000}
              value={targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs"
            >
              Tambah Bulan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
