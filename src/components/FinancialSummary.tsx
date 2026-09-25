"use client";

import React from "react";
import { FinancialStats } from "@/types";
import { formatRupiah } from "@/lib/dataStore";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  Megaphone,
  Sparkles,
} from "lucide-react";

interface FinancialSummaryProps {
  stats: FinancialStats;
  announcement?: string;
  currentPeriodTitle: string;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  stats,
  announcement,
  currentPeriodTitle,
}) => {
  return (
    <div className="space-y-4 font-sans">
      {/* Announcement Bar matching Classy Announcment style */}
      {announcement && (
        <div className="flex items-start sm:items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-xs sm:text-sm shadow-2xs">
          <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
            <Megaphone className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="font-bold text-[#0F172A] mr-1.5">
              Info Bendahara:
            </span>
            <span className="text-[#475569]">{announcement}</span>
          </div>
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Total Saldo Kas (Main Highlight) */}
        <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl shadow-emerald-700/10">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              Total Saldo Kas
            </span>
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-md">
              <Wallet className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {formatRupiah(stats.totalBalance)}
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1 flex items-center gap-1 font-medium">
              <span>Dana kas bersih yang siap digunakan</span>
            </p>
          </div>
        </div>

        {/* Card 2: Total Pemasukan Kas */}
        <div className="rounded-3xl p-5 sm:p-6 bg-white border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Total Uang Masuk
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A]">
              {formatRupiah(stats.totalIncome)}
            </h2>
            <p className="text-xs text-[#64748B] mt-1 font-medium">
              Akumulasi iuran bulanan siswa
            </p>
          </div>
        </div>

        {/* Card 3: Total Pengeluaran Kas */}
        <div className="rounded-3xl p-5 sm:p-6 bg-white border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Total Belanja Kas
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A]">
              {formatRupiah(stats.totalExpense)}
            </h2>
            <p className="text-xs text-[#64748B] mt-1 font-medium">
              Operasional, materi & wishlist
            </p>
          </div>
        </div>

        {/* Card 4: Kepatuhan Bulan Ini */}
        <div className="rounded-3xl p-5 sm:p-6 bg-white border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Kas {currentPeriodTitle}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A]">
                {stats.complianceRate}%
              </h2>
              <span className="text-xs font-semibold text-[#64748B]">
                {stats.paidStudentsCount}/{stats.activeStudentsCount} Siswa
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.complianceRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
