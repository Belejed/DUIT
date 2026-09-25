"use client";

import React from "react";
import { ClassProfile } from "@/types";
import {
  Lock,
  Unlock,
  ShieldCheck,
  Coins,
  RefreshCw,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

interface HeaderProps {
  profile: ClassProfile;
  isTreasurer: boolean;
  onOpenPinModal: () => void;
  onLockTreasurer: () => void;
  onOpenCollectCash: () => void;
  isCloudConnected: boolean;
  onSyncClassy?: () => void;
  isSyncingClassy?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  isTreasurer,
  onOpenPinModal,
  onLockTreasurer,
  onOpenCollectCash,
  isCloudConnected,
  onSyncClassy,
  isSyncingClassy = false,
}) => {
  const [todayFormatted, setTodayFormatted] = React.useState("");

  React.useEffect(() => {
    setTodayFormatted(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
      })
    );
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] font-sans shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Brand DUIT by classy with official logo */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center overflow-hidden shrink-0 hover:scale-105 transition-transform">
              <img
                src="/logo.jpg"
                alt="DUIT by classy"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-2xl text-[#0F172A] tracking-tight font-sans">
                DUIT
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 lowercase tracking-normal">
                by classy
              </span>
            </div>

            <span className="text-[#CBD5E1] hidden sm:inline-block">/</span>

            {/* Class Name Badge with Sync Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#475569]">
              <span className="text-[#0F172A] font-bold">{profile.class_name}</span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500">{profile.school_name}</span>
              {onSyncClassy && (
                <button
                  type="button"
                  onClick={onSyncClassy}
                  disabled={isSyncingClassy}
                  className="ml-1 p-1 hover:bg-[#E2E8F0] rounded-lg text-slate-500 hover:text-[#0F172A] transition-colors"
                  title="Sinkronkan data kelas & mahasiswa dari Classy (classy.exars.my.id)"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncingClassy ? "animate-spin text-emerald-600" : ""}`} />
                </button>
              )}
            </div>
          </div>

          {/* Right Side: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Classy Live Connected Pill */}
            <a
              href="https://classy.exars.my.id"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
              title="Terhubung langsung ke database Classy (classy.exars.my.id)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Classy Linked</span>
              <ExternalLink className="w-3 h-3 text-emerald-600" />
            </a>

            {/* Today Date Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-semibold text-[#64748B]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{todayFormatted}</span>
            </div>

            {/* ⭐ Main Highlight Button: KUMPULIN KAS */}
            <button
              onClick={onOpenCollectCash}
              className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>Kumpulin Kas</span>
            </button>

            {/* Role switch button */}
            {isTreasurer ? (
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bendahara</span>
                </span>
                <button
                  onClick={onLockTreasurer}
                  className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-[#F1F5F9] border border-[#E2E8F0] transition-colors"
                  title="Kunci mode bendahara"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kunci</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenPinModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] transition-colors"
                title="Buka akses bendahara dengan PIN"
              >
                <Unlock className="w-3.5 h-3.5 text-[#64748B]" />
                <span className="hidden sm:inline">Akses Bendahara</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
