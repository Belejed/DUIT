"use client";

import React, { useState } from "react";
import { ClassProfile, FinancialStats, MonthlyPeriod, Student, StudentPayment, Expense } from "@/types";
import { formatRupiah } from "@/lib/dataStore";
import {
  Download,
  Printer,
  FileSpreadsheet,
  X,
  CheckCircle,
} from "lucide-react";

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ClassProfile;
  students: Student[];
  periods: MonthlyPeriod[];
  payments: StudentPayment[];
  expenses: Expense[];
  stats: FinancialStats;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  profile,
  students,
  periods,
  payments,
  expenses,
  stats,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    let csv = `REKAP KAS BULANAN KELAS - ${profile.class_name} (${profile.school_name})\n`;
    csv += `Tahun Ajaran: ${profile.academic_year}\n`;
    csv += `Tanggal Unduh: ${new Date().toLocaleDateString("id-ID")}\n`;
    csv += `Total Saldo Kas: ${formatRupiah(stats.totalBalance)}\n`;
    csv += `Total Pemasukan: ${formatRupiah(stats.totalIncome)}\n`;
    csv += `Total Pengeluaran: ${formatRupiah(stats.totalExpense)}\n\n`;

    // Headers
    csv += `No Absen,Nama Siswa,Gender,`;
    csv += periods.map((p) => `"${p.month_name}"`).join(",") + `,Total Bayar\n`;

    students.forEach((student) => {
      let row = `${student.attendance_number},"${student.name}",${student.gender},`;
      let studentTotal = 0;

      const periodValues = periods.map((p) => {
        const pay = payments.find(
          (item) => item.student_id === student.id && item.period_id === p.id
        );
        const amount = pay?.amount_paid || 0;
        studentTotal += amount;
        return pay?.status === "LUNAS" ? "LUNAS" : "BELUM";
      });

      row += periodValues.join(",") + `,${studentTotal}\n`;
      csv += row;
    });

    // Expenses section
    csv += `\n\nRINCIAN PENGELUARAN KAS\n`;
    csv += `Tanggal,Keperluan Belanja,Kategori,Nominal,Dicatat Oleh\n`;
    expenses.forEach((e) => {
      csv += `${e.expense_date},"${e.title}","${e.category}",${e.amount},"${e.created_by || "-"}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Rekap_Kas_${profile.class_name.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-[#E2E8F0] p-6 shadow-2xl font-sans">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full hover:bg-[#F1F5F9]"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className="w-11 h-11 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center p-1 shrink-0">
            <img src="/logo.jpg" alt="DUIT by classy" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] leading-tight">
              Ekspor & Cetak Rekap Kas Bulanan
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Unduh rekapitulasi kas dalam format Excel (CSV) atau cetak langsung untuk mading.
            </p>
          </div>
        </div>

        {/* Summary box */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] mb-6 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Kelas:</span>
            <span className="font-bold text-[#0F172A]">
              {profile.class_name} ({profile.school_name})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Total Saldo Kas Aktif:</span>
            <span className="font-extrabold text-emerald-600">
              {formatRupiah(stats.totalBalance)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Siswa Terdaftar:</span>
            <span className="font-bold text-[#0F172A]">{students.length} Siswa</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Periode Bulanan:</span>
            <span className="font-bold text-[#0F172A]">{periods.length} Bulan</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            onClick={handleExportCSV}
            className="p-4 rounded-2xl border-2 border-emerald-500/20 hover:border-emerald-500 bg-emerald-50/40 text-left transition-all group active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#0F172A]">
              Unduh File Excel (CSV)
            </h4>
            <p className="text-xs text-[#64748B] mt-1">
              Kompatibel dengan Microsoft Excel, Google Sheets, dan Numbers.
            </p>
            {downloadSuccess && (
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <CheckCircle className="w-3.5 h-3.5" />
                File berhasil diunduh!
              </span>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="p-4 rounded-2xl border border-[#E2E8F0] hover:border-slate-400 bg-white text-left transition-all group active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#0F172A]">
              Cetak / Simpan PDF
            </h4>
            <p className="text-xs text-[#64748B] mt-1">
              Format cetak rapi untuk ditempel di mading ruang kelas.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
