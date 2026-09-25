"use client";

import React, { useState } from "react";
import { MonthlyPeriod, Student, StudentPayment } from "@/types";
import {
  formatRupiah,
  generateWhatsAppClassBroadcast,
  generateWhatsAppSingleReminder,
} from "@/lib/dataStore";
import confetti from "canvas-confetti";
import {
  Search,
  MessageCircle,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Coins,
  ArrowUpDown,
  TableProperties,
} from "lucide-react";

interface PaymentMatrixProps {
  periods: MonthlyPeriod[];
  currentPeriodId: string;
  onSelectPeriod: (id: string) => void;
  students: Student[];
  payments: StudentPayment[];
  isTreasurer: boolean;
  monthlyDueAmount: number;
  classNameTitle: string;
  onTogglePayment: (studentId: string, periodId: string) => void;
  onMarkAllPaid: (periodId: string) => void;
  onOpenCollectCash: () => void;
  onAddPeriodModal: () => void;
}

export const PaymentMatrix: React.FC<PaymentMatrixProps> = ({
  periods,
  currentPeriodId,
  onSelectPeriod,
  students,
  payments,
  isTreasurer,
  monthlyDueAmount,
  classNameTitle,
  onTogglePayment,
  onMarkAllPaid,
  onOpenCollectCash,
  onAddPeriodModal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UNPAID" | "PAID">("ALL");
  const [viewMode, setViewMode] = useState<"SINGLE_MONTH" | "ALL_SEMESTER">("SINGLE_MONTH");

  const currentPeriod = periods.find((p) => p.id === currentPeriodId) || periods[0];
  const targetAmount = currentPeriod?.target_amount || monthlyDueAmount;

  // Single month row mapping
  const studentRows = students
    .filter((s) => s.is_active)
    .map((student) => {
      const payment = payments.find(
        (p) => p.student_id === student.id && p.period_id === currentPeriod?.id
      );
      const isPaid = payment?.status === "LUNAS";
      return {
        student,
        payment,
        isPaid,
      };
    });

  // Filtered rows
  const filteredRows = studentRows.filter(({ student, isPaid }) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.attendance_number.toString().includes(searchQuery);

    if (!matchesSearch) return false;
    if (statusFilter === "PAID") return isPaid;
    if (statusFilter === "UNPAID") return !isPaid;
    return true;
  });

  const unpaidStudents = studentRows
    .filter((r) => !r.isPaid)
    .map((r) => ({
      name: r.student.name,
      attendance_number: r.student.attendance_number,
    }));

  const handleToggle = (studentId: string, periodId: string, currentPaid: boolean) => {
    if (!isTreasurer) return;

    if (!currentPaid) {
      try {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.8 },
          colors: ["#10b981", "#14b8a6", "#3b82f6"],
        });
      } catch (err) {}
    }

    onTogglePayment(studentId, periodId);
  };

  const handleBroadcastWA = () => {
    if (unpaidStudents.length === 0) {
      alert("Luar biasa! Seluruh siswa sudah lunas untuk bulan ini! 🎉");
      return;
    }
    const encoded = generateWhatsAppClassBroadcast(
      unpaidStudents,
      currentPeriod?.month_name || "Bulan Ini",
      targetAmount,
      classNameTitle
    );
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  const handleSingleWA = (student: Student) => {
    const encoded = generateWhatsAppSingleReminder(
      student,
      currentPeriod?.month_name || "Bulan Ini",
      targetAmount,
      classNameTitle
    );
    const phone = student.phone_number ? student.phone_number.replace(/^0/, "62") : "";
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
    } else {
      window.open(`https://wa.me/?text=${encoded}`, "_blank");
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Month Selection Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {periods.map((period) => {
            const isSelected = period.id === currentPeriod?.id && viewMode === "SINGLE_MONTH";
            return (
              <button
                key={period.id}
                onClick={() => {
                  onSelectPeriod(period.id);
                  setViewMode("SINGLE_MONTH");
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-[#0F172A] text-white shadow-2xs"
                    : "bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2E8F0]"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{period.month_name}</span>
              </button>
            );
          })}

          {/* Toggle Semester Table View */}
          <button
            onClick={() => setViewMode(viewMode === "ALL_SEMESTER" ? "SINGLE_MONTH" : "ALL_SEMESTER")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              viewMode === "ALL_SEMESTER"
                ? "bg-[#0F172A] text-white shadow-2xs"
                : "bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <TableProperties className="w-3.5 h-3.5" />
            <span>Rekap 1 Semester</span>
          </button>

          {isTreasurer && (
            <button
              onClick={onAddPeriodModal}
              className="flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Bulan</span>
            </button>
          )}
        </div>
      </div>

      {/* Control Bar: Search & Action Buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs">
        {/* Search & Filter pills */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau nomor absen siswa..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {viewMode === "SINGLE_MONTH" && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0]">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "ALL"
                    ? "bg-white text-[#0F172A] shadow-2xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                Semua ({studentRows.length})
              </button>
              <button
                onClick={() => setStatusFilter("UNPAID")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "UNPAID"
                    ? "bg-white text-rose-600 shadow-2xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                Nunggak ({unpaidStudents.length})
              </button>
              <button
                onClick={() => setStatusFilter("PAID")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "PAID"
                    ? "bg-white text-emerald-600 shadow-2xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                Lunas ({studentRows.length - unpaidStudents.length})
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons: Kumpulin Kas & WA Broadcast */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={onOpenCollectCash}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all active:scale-95"
            title="Buka QRIS atau Konfirmasi Pembayaran Kas"
          >
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bayar / Kumpulin</span>
          </button>

          <button
            onClick={handleBroadcastWA}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all active:scale-95"
            title="Kirim daftar yang belum bayar ke grup WA kelas"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Tagih di Grup WA</span>
          </button>

          {isTreasurer && viewMode === "SINGLE_MONTH" && (
            <button
              onClick={() => currentPeriod && onMarkAllPaid(currentPeriod.id)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] transition-all active:scale-95"
            >
              <span className="hidden sm:inline">Tandai Semua Lunas</span>
              <span className="sm:hidden">Semua Lunas</span>
            </button>
          )}
        </div>
      </div>

      {/* View 1: Single Month Detailed Table */}
      {viewMode === "SINGLE_MONTH" ? (
        <div className="overflow-hidden rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase font-bold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-14 text-center">No</th>
                  <th className="py-3.5 px-4">Nama Siswa</th>
                  <th className="py-3.5 px-4 text-center">Iuran Bulanan</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#94A3B8]">
                      Tidak ada data siswa yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map(({ student, payment, isPaid }) => (
                    <tr
                      key={student.id}
                      className="hover:bg-[#F8FAFC] transition-colors"
                    >
                      {/* No Absen */}
                      <td className="py-3.5 px-4 text-center font-bold text-[#64748B]">
                        {student.attendance_number}
                      </td>

                      {/* Nama & Gender */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#0F172A]">
                            {student.name}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                              student.gender === "L"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-pink-50 text-pink-700"
                            }`}
                          >
                            {student.gender}
                          </span>
                        </div>
                        {payment?.payment_date && isPaid && (
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">
                            Lunas: {payment.payment_date} ({payment.payment_method || "CASH"})
                          </p>
                        )}
                      </td>

                      {/* Nominal */}
                      <td className="py-3.5 px-4 text-center font-semibold text-[#475569]">
                        {formatRupiah(targetAmount)}
                      </td>

                      {/* Status Pill */}
                      <td className="py-3.5 px-4 text-center">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Lunas</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Belum Bayar</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click WhatsApp personal reminder */}
                          {!isPaid && (
                            <button
                              onClick={() => handleSingleWA(student)}
                              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1"
                              title={`Ingatkan ${student.name} via WA`}
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Ingatkan WA</span>
                            </button>
                          )}

                          {/* Toggle Payment (Treasurer Only) */}
                          {isTreasurer ? (
                            <button
                              onClick={() =>
                                currentPeriod &&
                                handleToggle(student.id, currentPeriod.id, isPaid)
                              }
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                                isPaid
                                  ? "bg-[#F1F5F9] hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-[#E2E8F0]"
                                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs"
                              }`}
                            >
                              {isPaid ? "Batal" : "Tandai Lunas"}
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#94A3B8] italic">
                              {isPaid ? "Terverifikasi" : "Menunggu"}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View 2: Full Semester Matrix (All Months Grid) */
        <div className="overflow-hidden rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase font-bold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">No</th>
                  <th className="py-3 px-3 min-w-[140px]">Nama Siswa</th>
                  {periods.map((p) => (
                    <th key={p.id} className="py-3 px-2 text-center min-w-[70px]">
                      {p.short_code}
                    </th>
                  ))}
                  <th className="py-3 px-3 text-center min-w-[90px]">Total Terbayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {students
                  .filter((s) => s.is_active)
                  .map((student) => {
                    let studentTotal = 0;
                    return (
                      <tr key={student.id} className="hover:bg-[#F8FAFC]">
                        <td className="py-2.5 px-3 text-center font-bold text-[#64748B]">
                          {student.attendance_number}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-[#0F172A] truncate">
                          {student.name}
                        </td>
                        {periods.map((period) => {
                          const payment = payments.find(
                            (item) => item.student_id === student.id && item.period_id === period.id
                          );
                          const isPaid = payment?.status === "LUNAS";
                          if (isPaid) studentTotal += period.target_amount;

                          return (
                            <td key={period.id} className="py-2 px-2 text-center">
                              {isTreasurer ? (
                                <button
                                  onClick={() => handleToggle(student.id, period.id, isPaid)}
                                  className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all ${
                                    isPaid
                                      ? "bg-emerald-500 text-white shadow-2xs hover:bg-emerald-600"
                                      : "bg-[#F1F5F9] text-[#94A3B8] hover:bg-emerald-50 hover:text-emerald-700"
                                  }`}
                                  title={`${student.name} - ${period.short_code}: ${isPaid ? "Lunas" : "Belum"}`}
                                >
                                  {isPaid ? "✓" : "–"}
                                </button>
                              ) : (
                                <span
                                  className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold ${
                                    isPaid
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-slate-100 text-slate-400"
                                  }`}
                                >
                                  {isPaid ? "✓" : "–"}
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600">
                          {formatRupiah(studentTotal)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
