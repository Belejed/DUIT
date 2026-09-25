"use client";

import React, { useState } from "react";
import { WishlistItem } from "@/types";
import { formatRupiah } from "@/lib/dataStore";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Plus,
  CheckCircle,
  Clock,
  Trash2,
  Coins,
  X,
  Target,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react";

interface ClassWishlistProps {
  wishlist: WishlistItem[];
  totalBalance: number;
  isTreasurer: boolean;
  onAddWishlist: (item: Omit<WishlistItem, "id" | "allocated_amount" | "created_at">) => void;
  onAllocateFund: (id: string, amount: number) => void;
  onDeleteWishlist: (id: string) => void;
  onMarkAchieved: (id: string) => void;
}

export const ClassWishlist: React.FC<ClassWishlistProps> = ({
  wishlist,
  totalBalance,
  isTreasurer,
  onAddWishlist,
  onAllocateFund,
  onDeleteWishlist,
  onMarkAchieved,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAllocateItem, setSelectedAllocateItem] = useState<WishlistItem | null>(null);
  const [allocateAmount, setAllocateAmount] = useState<number | "">("");

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Kenyamanan Ruang");
  const [targetAmount, setTargetAmount] = useState<number | "">("");
  const [priority, setPriority] = useState<"TINGGI" | "SEDANG" | "RENDAH">("TINGGI");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount) return;

    onAddWishlist({
      title: title.trim(),
      category: category.trim() || "Kebutuhan Kelas",
      target_amount: Number(targetAmount),
      priority,
      status: "DIRENCANAKAN",
      description: description.trim() || undefined,
      image_url: imageUrl.trim() || undefined,
    });

    // Reset
    setTitle("");
    setTargetAmount("");
    setDescription("");
    setImageUrl("");
    setIsAddModalOpen(false);
  };

  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAllocateItem || !allocateAmount || Number(allocateAmount) <= 0) return;

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10b981", "#3b82f6", "#f59e0b"],
      });
    } catch (err) {}

    onAllocateFund(selectedAllocateItem.id, Number(allocateAmount));
    setSelectedAllocateItem(null);
    setAllocateAmount("");
  };

  const totalTarget = wishlist.reduce((acc, item) => acc + item.target_amount, 0);
  const totalAllocated = wishlist.reduce((acc, item) => acc + item.allocated_amount, 0);
  const overallProgress = totalTarget > 0 ? Math.min(100, Math.round((totalAllocated / totalTarget) * 100)) : 0;

  return (
    <div className="space-y-5 font-sans">
      {/* Top Banner / Goal Overview */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-[#0F172A] tracking-tight">
              Wishlist & Impian Kelas
            </h3>
          </div>
          <p className="text-xs text-[#64748B]">
            Target pengadaan barang & fasilitas kelas bersama yang dibeli dari tabungan uang kas.
          </p>
        </div>

        {/* Progress Summary Pill */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] min-w-[260px] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B] font-medium">Teralokasi dari Kas:</span>
            <span className="font-black text-emerald-600">
              {formatRupiah(totalAllocated)}
            </span>
          </div>
          <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span>{overallProgress}% dari total target</span>
            <span>Target: {formatRupiah(totalTarget)}</span>
          </div>
        </div>

        {/* Add Wishlist Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#0F172A] hover:bg-slate-800 text-white transition-all shadow-xs shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Usulkan Wishlist</span>
        </button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl bg-white border border-[#E2E8F0] text-[#94A3B8]">
            <Sparkles className="w-10 h-10 mx-auto text-[#CBD5E1] mb-2" />
            <p className="font-semibold text-sm">Belum ada wishlist yang dibuat.</p>
            <p className="text-xs mt-1">Ayo buat wishlist pertama untuk fasilitas kelas kita!</p>
          </div>
        ) : (
          wishlist.map((item) => {
            const isAchieved = item.status === "TERCAPAI" || item.allocated_amount >= item.target_amount;
            const progress = Math.min(100, Math.round((item.allocated_amount / item.target_amount) * 100));

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-3xl bg-white border border-[#E2E8F0] hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Image if exists */}
                  {item.image_url ? (
                    <div className="h-40 w-full overflow-hidden bg-slate-100 relative">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span
                        className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md ${
                          item.priority === "TINGGI"
                            ? "bg-rose-500/90 text-white"
                            : item.priority === "SEDANG"
                            ? "bg-amber-500/90 text-white"
                            : "bg-blue-500/90 text-white"
                        }`}
                      >
                        Prioritas {item.priority}
                      </span>
                    </div>
                  ) : (
                    <div className="p-4 pb-0 flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569]">
                        {item.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.priority === "TINGGI"
                            ? "bg-rose-50 text-rose-600"
                            : item.priority === "SEDANG"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        Prioritas {item.priority}
                      </span>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-[#0F172A] leading-snug">
                          {item.title}
                        </h4>
                        {isAchieved ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                            🎉 Tercapai
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
                            Sedang Nabung
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Progress Bar & Amount */}
                    <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#64748B]">Terkumpul:</span>
                        <span className="font-black text-[#0F172A]">
                          {formatRupiah(item.allocated_amount)}{" "}
                          <span className="text-[11px] text-[#94A3B8] font-normal">
                            / {formatRupiah(item.target_amount)}
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isAchieved ? "bg-emerald-500" : "bg-purple-600"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-[#94A3B8]">
                        <span>{progress}% terkumpul</span>
                        <span>
                          {isAchieved
                            ? "Dana siap dibelanjakan!"
                            : `Kurang ${formatRupiah(Math.max(0, item.target_amount - item.allocated_amount))}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex items-center justify-between gap-2 border-t border-[#F1F5F9] mt-2 pt-3">
                  {isTreasurer ? (
                    <>
                      {!isAchieved ? (
                        <button
                          onClick={() => {
                            setSelectedAllocateItem(item);
                            setAllocateAmount(Math.min(totalBalance, item.target_amount - item.allocated_amount));
                          }}
                          className="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center justify-center gap-1"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>Alokasikan Kas</span>
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Siap Dibeli</span>
                        </span>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Hapus wishlist "${item.title}"?`)) {
                            onDeleteWishlist(item.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Hapus Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-[#64748B] italic">
                      {isAchieved ? "🎉 Sudah Terwujud" : "Menunggu alokasi dari kas"}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Tambah Wishlist Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-[#E2E8F0] shadow-2xl p-6">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full hover:bg-[#F1F5F9]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#0F172A] mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Usulkan Wishlist Kelas</span>
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Usulkan barang atau fasilitas yang dibutuhkan kelas kita.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  Nama Barang / Wishlist
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kipas Angin Dinding Cosmos"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Target Biaya (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={5000}
                    placeholder="300000"
                    value={targetAmount}
                    onChange={(e) =>
                      setTargetAmount(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Prioritas
                  </label>
                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as "TINGGI" | "SEDANG" | "RENDAH")
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  >
                    <option value="TINGGI">Tinggi (Penting)</option>
                    <option value="SEDANG">Sedang (Bagus Ada)</option>
                    <option value="RENDAH">Rendah (Rencana Depan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  placeholder="Kenyamanan Ruang, Dekorasi, Kebutuhan Belajar..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  Link Foto / Gambar Inspirasi (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://... (link gambar online)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  Deskripsi / Alasan Kebutuhan
                </label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan kenapa kelas kita butuh barang ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
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
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-xs"
                >
                  Simpan Wishlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Alokasi Dana dari Kas (Treasurer Only) */}
      {selectedAllocateItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-white border border-[#E2E8F0] shadow-2xl p-6">
            <button
              onClick={() => setSelectedAllocateItem(null)}
              className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full hover:bg-[#F1F5F9]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#0F172A] mb-1 flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-600" />
              <span>Alokasikan Kas Kelas</span>
            </h3>
            <p className="text-xs text-[#64748B] mb-3">
              Sisihkan sebagian saldo kas aktif untuk: <strong>{selectedAllocateItem.title}</strong>
            </p>

            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1 mb-4">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Saldo Kas Aktif:</span>
                <span className="font-bold text-emerald-600">{formatRupiah(totalBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Kebutuhan Dana Wishlist:</span>
                <span className="font-bold text-[#0F172A]">
                  {formatRupiah(selectedAllocateItem.target_amount - selectedAllocateItem.allocated_amount)}
                </span>
              </div>
            </div>

            <form onSubmit={handleAllocateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  Nominal yang Dialokasikan (Rp)
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  max={totalBalance}
                  step={5000}
                  value={allocateAmount}
                  onChange={(e) =>
                    setAllocateAmount(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAllocateItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs"
                >
                  Alokasikan Dana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
