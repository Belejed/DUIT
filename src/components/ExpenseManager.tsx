"use client";

import React, { useState } from "react";
import { Expense, ExpenseCategory } from "@/types";
import { formatRupiah } from "@/lib/dataStore";
import {
  Receipt,
  Plus,
  Trash2,
  Calendar,
  ExternalLink,
  Image as ImageIcon,
  X,
  Search,
  TrendingDown,
  Tag,
  Filter,
} from "lucide-react";

interface ExpenseManagerProps {
  expenses: Expense[];
  isTreasurer: boolean;
  onAddExpense: (expense: Omit<Expense, "id">) => void;
  onDeleteExpense: (id: string) => void;
}

const CATEGORIES: ExpenseCategory[] = [
  "Operasional",
  "Kebersihan",
  "Fotokopi & Materi",
  "Konsumsi & Acara",
  "Wishlist / Pengadaan",
  "Kas Tak Terduga",
  "Lainnya",
];

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({
  expenses,
  isTreasurer,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("SEMUA");

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Operasional");
  const [amount, setAmount] = useState<number | "">("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [receiptUrl, setReceiptUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [createdBy, setCreatedBy] = useState("Bendahara");

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.created_by && e.created_by.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "SEMUA" || e.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate quick metrics
  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const withReceiptCount = expenses.filter((e) => !!e.receipt_url).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    onAddExpense({
      title: title.trim(),
      category,
      amount: Number(amount),
      expense_date: expenseDate,
      receipt_url: receiptUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      created_by: createdBy.trim() || "Bendahara",
    });

    // Reset
    setTitle("");
    setAmount("");
    setReceiptUrl("");
    setNotes("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Quick Stats Header for Expenses */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Pengeluaran Kas
            </span>
            <span className="text-lg font-black text-rose-600">
              {formatRupiah(totalExpenseAmount)}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Transaksi & Bukti Nota
            </span>
            <span className="text-lg font-black text-[#0F172A]">
              {expenses.length} Transaksi{" "}
              <span className="text-xs font-semibold text-emerald-600">
                ({withReceiptCount} ada nota)
              </span>
            </span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-between sm:justify-end gap-3">
          <div className="text-left sm:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Transparansi Keuangan
            </span>
            <span className="text-xs font-bold text-slate-600">
              100% Tercatat Terbuka
            </span>
          </div>
          {isTreasurer ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Pengeluaran</span>
            </button>
          ) : (
            <span className="text-[11px] font-semibold text-slate-400 italic">
              Mode Pantau Siswa
            </span>
          )}
        </div>
      </div>

      {/* 2. Search & Category Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pengeluaran, spidol, konsumsi, atau pencatat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Result summary indicator */}
          <div className="text-xs font-semibold text-slate-500 shrink-0 flex items-center gap-1">
            <span>Menampilkan</span>
            <span className="font-bold text-[#0F172A]">
              {filteredExpenses.length} dari {expenses.length}
            </span>
            <span>pengeluaran</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory("SEMUA")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === "SEMUA"
                ? "bg-[#0F172A] text-white shadow-xs"
                : "bg-[#F8FAFC] text-slate-600 hover:bg-[#F1F5F9] border border-[#E2E8F0]"
            }`}
          >
            Semua Kategori
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "bg-[#F8FAFC] text-slate-600 hover:bg-[#F1F5F9] border border-[#E2E8F0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {expenses.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#E2E8F0] text-[#94A3B8]">
            <Receipt className="w-10 h-10 mx-auto text-[#CBD5E1] mb-2" />
            <p className="font-semibold text-sm">Belum ada pengeluaran kas tercatat.</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-10 text-center rounded-3xl bg-white border border-[#E2E8F0] text-slate-500">
            <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-sm text-[#0F172A]">Tidak ada pengeluaran yang sesuai</p>
            <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian atau kategori lain.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("SEMUA");
              }}
              className="mt-3 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-[#0F172A]">
                    {expense.title}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569]">
                    {expense.category}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{expense.expense_date}</span>
                  </span>
                  {expense.created_by && (
                    <span>• Dicatat oleh {expense.created_by}</span>
                  )}
                </div>

                {expense.notes && (
                  <p className="text-xs text-[#475569] bg-[#F8FAFC] border border-[#F1F5F9] px-3 py-1.5 rounded-xl">
                    {expense.notes}
                  </p>
                )}
              </div>

              {/* Amount and Receipt button */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F1F5F9]">
                <div className="text-left sm:text-right">
                  <span className="text-xs text-[#94A3B8] uppercase tracking-wider block font-bold">
                    Nominal
                  </span>
                  <span className="text-base sm:text-lg font-black text-rose-600">
                    - {formatRupiah(expense.amount)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {expense.receipt_url ? (
                    <button
                      onClick={() => setSelectedReceipt(expense.receipt_url || null)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      title="Lihat foto nota pembayaran"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Lihat Nota</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#94A3B8] italic px-2">
                      Tanpa Nota
                    </span>
                  )}

                  {isTreasurer && (
                    <button
                      onClick={() => {
                        if (confirm(`Hapus pengeluaran "${expense.title}"?`)) {
                          onDeleteExpense(expense.id);
                        }
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus Pengeluaran"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Catat Pengeluaran */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-[#E2E8F0] p-6 shadow-2xl">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full hover:bg-[#F1F5F9]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#0F172A] mb-1">
              Catat Pengeluaran Kas
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Semua data pengeluaran dapat dipantau oleh seluruh anggota kelas.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  Nama / Keperluan Belanja
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Spidol Whiteboard & Penghapus"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Nominal (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="25000"
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Dicatat Oleh
                  </label>
                  <input
                    type="text"
                    value={createdBy}
                    onChange={(e) => setCreatedBy(e.target.value)}
                    placeholder="Nama Bendahara"
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  Link / URL Foto Nota (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://... (link gambar nota/struk)"
                  value={receiptUrl}
                  onChange={(e) => setReceiptUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan toko, diskon, atau rincian barang..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs"
                >
                  Simpan Pengeluaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preview Bukti Nota */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-xl w-full rounded-3xl bg-white border border-[#E2E8F0] p-4 overflow-hidden text-center shadow-2xl">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 z-10 p-2 text-[#64748B] hover:text-[#0F172A] bg-[#F1F5F9] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-sm font-bold text-[#0F172A] mb-3">
              Bukti Nota / Struk Fisik
            </h4>
            <div className="max-h-[70vh] overflow-auto rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-2 flex items-center justify-center">
              <img
                src={selectedReceipt}
                alt="Bukti Nota"
                className="max-h-full max-w-full rounded-xl object-contain shadow-md"
              />
            </div>
            <div className="mt-3 flex justify-center">
              <a
                href={selectedReceipt}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1"
              >
                <span>Buka ukuran penuh di tab baru</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
