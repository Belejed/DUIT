"use client";

import React, { useState, useEffect } from "react";
import {
  ClassProfile,
  Expense,
  MonthlyPeriod,
  Student,
  StudentPayment,
  WishlistItem,
} from "@/types";
import {
  DEFAULT_CLASS_PROFILE,
  INITIAL_EXPENSES,
  INITIAL_MONTHLY_PERIODS,
  INITIAL_PAYMENTS,
  INITIAL_STUDENTS,
  INITIAL_WISHLIST,
  calculateFinancialStats,
} from "@/lib/dataStore";
import { fetchClassyClasses, convertClassyMembersToStudents } from "@/lib/classySync";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { FinancialSummary } from "@/components/FinancialSummary";
import { PaymentMatrix } from "@/components/PaymentMatrix";
import { ClassWishlist } from "@/components/ClassWishlist";
import { ExpenseManager } from "@/components/ExpenseManager";
import { StudentManager } from "@/components/StudentManager";
import { CollectCashModal } from "@/components/CollectCashModal";
import { PinModal } from "@/components/PinModal";
import { ReportExportModal } from "@/components/ReportExportModal";
import { AddPeriodModal } from "@/components/AddPeriodModal";
import {
  LayoutGrid,
  Receipt,
  Users,
  FileSpreadsheet,
  Coins,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function Home() {
  // State: Profile & entities
  const [profile, setProfile] = useState<ClassProfile>(DEFAULT_CLASS_PROFILE);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [periods, setPeriods] = useState<MonthlyPeriod[]>(INITIAL_MONTHLY_PERIODS);
  const [payments, setPayments] = useState<StudentPayment[]>(INITIAL_PAYMENTS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(INITIAL_WISHLIST);

  // Active period (default to current month: September / m-3)
  const [currentPeriodId, setCurrentPeriodId] = useState<string>("m-3");

  // Active Navigation Tab (default to EXPENSES / Pengeluaran first)
  const [activeTab, setActiveTab] = useState<"EXPENSES" | "PAYMENTS" | "WISHLIST" | "STUDENTS">(
    "EXPENSES"
  );

  // Modals & Roles
  const [isTreasurer, setIsTreasurer] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddPeriodOpen, setIsAddPeriodOpen] = useState(false);
  const [isCollectCashOpen, setIsCollectCashOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncingClassy, setIsSyncingClassy] = useState(false);

  // Function to sync directly from Classy's database
  const handleSyncWithClassy = async (manual = false) => {
    setIsSyncingClassy(true);
    try {
      const classes = await fetchClassyClasses();
      const mlogB =
        classes.find(
          (c) =>
            c.name.toLowerCase().includes("m.log b") ||
            c.name.toLowerCase().includes("mlog b")
        ) || classes[0];

      if (mlogB) {
        setProfile((prev) => ({
          ...prev,
          class_name: mlogB.name,
          school_name: mlogB.classIdentifier || "26B (S1 - M.Log)",
        }));

        if (mlogB.members && mlogB.members.length > 0) {
          const converted = convertClassyMembersToStudents(mlogB.members);
          setStudents(converted);
        }

        if (manual) {
          alert(`Sukses! ${mlogB.members.length} anggota dari kelas "${mlogB.name}" berhasil disinkronkan dari Classy! 🎉`);
        }
      }
    } catch (err) {
      console.error("Gagal sinkronisasi Classy:", err);
      if (manual) alert("Gagal mengambil data dari Classy.");
    } finally {
      setIsSyncingClassy(false);
    }
  };

  // 1. Initial Load from LocalStorage & Clean Production Setup
  useEffect(() => {
    try {
      const STORAGE_VERSION_KEY = "duit_storage_version";
      const CURRENT_VERSION = "v3_production_clean";

      // If user had previous demo data, clean it up for production
      if (localStorage.getItem(STORAGE_VERSION_KEY) !== CURRENT_VERSION) {
        localStorage.removeItem("duit_classy_payments");
        localStorage.removeItem("duit_classy_expenses");
        localStorage.removeItem("duit_classy_wishlist");
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      }

      const storedProfile = localStorage.getItem("duit_classy_profile");
      const storedStudents = localStorage.getItem("duit_classy_students");
      const storedPeriods = localStorage.getItem("duit_classy_periods");
      const storedPayments = localStorage.getItem("duit_classy_payments");
      const storedExpenses = localStorage.getItem("duit_classy_expenses");
      const storedWishlist = localStorage.getItem("duit_classy_wishlist");

      if (storedProfile) setProfile(JSON.parse(storedProfile));
      if (storedStudents) setStudents(JSON.parse(storedStudents));
      if (storedPeriods) setPeriods(JSON.parse(storedPeriods));
      if (storedPayments) setPayments(JSON.parse(storedPayments));
      if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    } catch (e) {
      console.warn("Using default initial state:", e);
    }
    setIsLoaded(true);
  }, []);

  // 2. Persist to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("duit_classy_profile", JSON.stringify(profile));
      localStorage.setItem("duit_classy_students", JSON.stringify(students));
      localStorage.setItem("duit_classy_periods", JSON.stringify(periods));
      localStorage.setItem("duit_classy_payments", JSON.stringify(payments));
      localStorage.setItem("duit_classy_expenses", JSON.stringify(expenses));
      localStorage.setItem("duit_classy_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  }, [profile, students, periods, payments, expenses, wishlist, isLoaded]);

  // Derived financial statistics
  const currentPeriod = periods.find((p) => p.id === currentPeriodId) || periods[0];
  const stats = calculateFinancialStats(
    payments,
    expenses,
    students,
    wishlist,
    currentPeriod?.id
  );

  // Toggle single payment
  const handleTogglePayment = (studentId: string, periodId: string) => {
    setPayments((prev) => {
      const existing = prev.find(
        (p) => p.student_id === studentId && p.period_id === periodId
      );
      const targetPeriod = periods.find((p) => p.id === periodId);
      const amount = targetPeriod?.target_amount || profile.monthly_due_amount;

      if (existing) {
        return prev.map((p) => {
          if (p.id === existing.id) {
            const nextStatus = p.status === "LUNAS" ? "BELUM" : "LUNAS";
            return {
              ...p,
              status: nextStatus,
              amount_paid: nextStatus === "LUNAS" ? amount : 0,
              payment_date:
                nextStatus === "LUNAS"
                  ? new Date().toISOString().split("T")[0]
                  : undefined,
            };
          }
          return p;
        });
      } else {
        const newPayment: StudentPayment = {
          id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          student_id: studentId,
          period_id: periodId,
          amount_paid: amount,
          status: "LUNAS",
          payment_date: new Date().toISOString().split("T")[0],
          payment_method: "CASH",
        };
        return [...prev, newPayment];
      }
    });
  };

  // Mark all students paid for a month
  const handleMarkAllPaid = (periodId: string) => {
    const targetPeriod = periods.find((p) => p.id === periodId);
    const amount = targetPeriod?.target_amount || profile.monthly_due_amount;
    const today = new Date().toISOString().split("T")[0];

    setPayments((prev) => {
      const updated = [...prev];
      students
        .filter((s) => s.is_active)
        .forEach((student) => {
          const idx = updated.findIndex(
            (p) => p.student_id === student.id && p.period_id === periodId
          );
          if (idx >= 0) {
            updated[idx] = {
              ...updated[idx],
              status: "LUNAS",
              amount_paid: amount,
              payment_date: today,
            };
          } else {
            updated.push({
              id: `pay-${Date.now()}-${student.id}`,
              student_id: student.id,
              period_id: periodId,
              amount_paid: amount,
              status: "LUNAS",
              payment_date: today,
              payment_method: "CASH",
            });
          }
        });
      return updated;
    });
  };

  // Record payment from Kumpulin Kas modal
  const handleRecordPayment = (studentId: string, periodIds: string[]) => {
    const today = new Date().toISOString().split("T")[0];

    setPayments((prev) => {
      const updated = [...prev];
      periodIds.forEach((pId) => {
        const targetPeriod = periods.find((p) => p.id === pId);
        const amount = targetPeriod?.target_amount || profile.monthly_due_amount;

        const idx = updated.findIndex(
          (p) => p.student_id === studentId && p.period_id === pId
        );
        if (idx >= 0) {
          updated[idx] = {
            ...updated[idx],
            status: "LUNAS",
            amount_paid: amount,
            payment_date: today,
            payment_method: "QRIS",
          };
        } else {
          updated.push({
            id: `pay-${Date.now()}-${pId}`,
            student_id: studentId,
            period_id: pId,
            amount_paid: amount,
            status: "LUNAS",
            payment_date: today,
            payment_method: "QRIS",
          });
        }
      });
      return updated;
    });
  };

  // Handlers for expenses
  const handleAddExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Handlers for wishlist
  const handleAddWishlist = (
    item: Omit<WishlistItem, "id" | "allocated_amount" | "created_at">
  ) => {
    const newItem: WishlistItem = {
      ...item,
      id: `wish-${Date.now()}`,
      allocated_amount: 0,
      created_at: new Date().toISOString().split("T")[0],
    };
    setWishlist((prev) => [newItem, ...prev]);
  };

  const handleAllocateFund = (id: string, amount: number) => {
    setWishlist((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newAllocated = Math.min(
            item.target_amount,
            item.allocated_amount + amount
          );
          const nextStatus =
            newAllocated >= item.target_amount ? "TERCAPAI" : "PROSES";
          return {
            ...item,
            allocated_amount: newAllocated,
            status: nextStatus,
          };
        }
        return item;
      })
    );
  };

  const handleDeleteWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((w) => w.id !== id));
  };

  const handleMarkAchieved = (id: string) => {
    setWishlist((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "TERCAPAI", allocated_amount: item.target_amount }
          : item
      )
    );
  };

  // Handlers for students
  const handleAddStudent = (student: Omit<Student, "id">) => {
    const newStudent: Student = {
      ...student,
      id: `s-${Date.now()}`,
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const handleBulkAddStudents = (names: string[]) => {
    let nextAbsen =
      students.length > 0
        ? Math.max(...students.map((s) => s.attendance_number)) + 1
        : 1;

    const newStudents: Student[] = names.map((name, i) => ({
      id: `s-${Date.now()}-${i}`,
      attendance_number: nextAbsen + i,
      name,
      gender: "L",
      is_active: true,
    }));

    setStudents((prev) => [...prev, ...newStudents]);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Handlers for period
  const handleAddPeriod = (
    monthName: string,
    shortCode: string,
    dueDate: string,
    targetAmount: number
  ) => {
    const newPeriod: MonthlyPeriod = {
      id: `m-${Date.now()}`,
      month_name: monthName,
      short_code: shortCode,
      month_number: periods.length + 1,
      year: new Date(dueDate).getFullYear() || 2027,
      due_date: dueDate,
      target_amount: targetAmount,
    };
    setPeriods((prev) => [...prev, newPeriod]);
    setCurrentPeriodId(newPeriod.id);
  };

  // Handlers for reset demo data
  const handleResetData = () => {
    setProfile(DEFAULT_CLASS_PROFILE);
    setStudents(INITIAL_STUDENTS);
    setPeriods(INITIAL_MONTHLY_PERIODS);
    setPayments(INITIAL_PAYMENTS);
    setExpenses(INITIAL_EXPENSES);
    setWishlist(INITIAL_WISHLIST);
    setCurrentPeriodId("m-3");
    localStorage.clear();
  };

  return (
    <div
      className="min-h-screen bg-[#FDFBF7] text-[#0F172A] flex flex-col font-sans transition-colors"
      suppressHydrationWarning
    >
      {/* 1. Header Navigation matching Classy Style */}
      <Header
        profile={profile}
        isTreasurer={isTreasurer}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onLockTreasurer={() => setIsTreasurer(false)}
        onOpenCollectCash={() => setIsCollectCashOpen(true)}
        isCloudConnected={isSupabaseConfigured}
        onSyncClassy={() => handleSyncWithClassy(true)}
        isSyncingClassy={isSyncingClassy}
      />

      {/* 2. Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Financial Overview Cards */}
        <FinancialSummary
          stats={stats}
          announcement={profile.announcement}
          currentPeriodTitle={currentPeriod?.month_name || "Bulan Ini"}
        />

        {/* Navigation Tabs matching Classy Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Main 4 Tabs (Pengeluaran first) */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("EXPENSES")}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === "EXPENSES"
                  ? "bg-white text-[#0F172A] shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <Receipt className="w-4 h-4 text-rose-500" />
              <span>Pengeluaran & Nota ({expenses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("PAYMENTS")}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === "PAYMENTS"
                  ? "bg-white text-[#0F172A] shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-emerald-600" />
              <span>Kas Bulanan</span>
            </button>

            <button
              onClick={() => setActiveTab("WISHLIST")}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === "WISHLIST"
                  ? "bg-white text-[#0F172A] shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Wishlist Kelas ({wishlist.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("STUDENTS")}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === "STUDENTS"
                  ? "bg-white text-[#0F172A] shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>Siswa & Pengaturan ({students.length})</span>
            </button>
          </div>

          {/* Action: Export Rekap */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] shadow-2xs transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor / Cetak Rekap</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="pt-1">
          {activeTab === "PAYMENTS" && (
            <PaymentMatrix
              periods={periods}
              currentPeriodId={currentPeriodId}
              onSelectPeriod={(id) => setCurrentPeriodId(id)}
              students={students}
              payments={payments}
              isTreasurer={isTreasurer}
              monthlyDueAmount={profile.monthly_due_amount}
              classNameTitle={profile.class_name}
              onTogglePayment={handleTogglePayment}
              onMarkAllPaid={handleMarkAllPaid}
              onOpenCollectCash={() => setIsCollectCashOpen(true)}
              onAddPeriodModal={() => setIsAddPeriodOpen(true)}
            />
          )}

          {activeTab === "WISHLIST" && (
            <ClassWishlist
              wishlist={wishlist}
              totalBalance={stats.totalBalance}
              isTreasurer={isTreasurer}
              onAddWishlist={handleAddWishlist}
              onAllocateFund={handleAllocateFund}
              onDeleteWishlist={handleDeleteWishlist}
              onMarkAchieved={handleMarkAchieved}
            />
          )}

          {activeTab === "EXPENSES" && (
            <ExpenseManager
              expenses={expenses}
              isTreasurer={isTreasurer}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {activeTab === "STUDENTS" && (
            <StudentManager
              students={students}
              profile={profile}
              isTreasurer={isTreasurer}
              onAddStudent={handleAddStudent}
              onBulkAddStudents={handleBulkAddStudents}
              onDeleteStudent={handleDeleteStudent}
              onUpdateProfile={(newProfile) => setProfile(newProfile)}
              onResetData={handleResetData}
              onSyncClassy={() => handleSyncWithClassy(true)}
              isSyncingClassy={isSyncingClassy}
            />
          )}
        </div>

        {/* Cloud Info Banner */}
        {!isSupabaseConfigured && (
          <div className="p-4 sm:p-5 rounded-3xl bg-[#0F172A] text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="text-sm font-bold text-white">
                  DUIT by classy — Terhubung ke Database Classy
                </h4>
              </div>
              <p className="text-xs text-slate-300">
                Data anggota kelas disinkronkan langsung dari <strong>classy.exars.my.id</strong> ({profile.class_name}). Transaksi kas kamu tersimpan otomatis dan dapat diekspor kapan saja.
              </p>
            </div>
            <a
              href="https://classy.exars.my.id"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-[#0F172A] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>Buka Web Classy</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </main>

      {/* 3. Footer */}
      <footer className="mt-12 py-6 border-t border-[#E2E8F0] text-center text-xs text-[#94A3B8]">
        <p>
          <strong className="text-[#0F172A]">DUIT by classy</strong> — Ruang Transparansi & Akuntansi Kas Kelas.
        </p>
      </footer>

      {/* Modals */}
      <CollectCashModal
        isOpen={isCollectCashOpen}
        onClose={() => setIsCollectCashOpen(false)}
        profile={profile}
        students={students}
        periods={periods}
        currentPeriodId={currentPeriodId}
        isTreasurer={isTreasurer}
        onRecordPayment={handleRecordPayment}
      />

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => setIsTreasurer(true)}
        expectedPin={profile.treasurer_pin}
      />

      <ReportExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        profile={profile}
        students={students}
        periods={periods}
        payments={payments}
        expenses={expenses}
        stats={stats}
      />

      <AddPeriodModal
        isOpen={isAddPeriodOpen}
        onClose={() => setIsAddPeriodOpen(false)}
        defaultMonthlyAmount={profile.monthly_due_amount}
        onAddPeriod={handleAddPeriod}
      />
    </div>
  );
}
