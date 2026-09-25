"use client";

import React, { useState, useEffect } from "react";
import { KeyRound, X, AlertCircle } from "lucide-react";

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  expectedPin: string;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  expectedPin,
}) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin("");
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);

      if (nextPin === expectedPin) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 150);
      } else if (nextPin.length >= expectedPin.length) {
        setError(true);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-sm rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-7 shadow-2xl text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full hover:bg-[#F1F5F9] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot Logo */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center p-1.5 mb-4 shadow-sm">
          <img src="/logo.jpg" alt="DUIT by classy" className="w-full h-full object-contain" />
        </div>

        <h3 className="text-lg font-extrabold text-[#0F172A]">
          Akses Bendahara Kelas
        </h3>
        <p className="text-xs text-[#64748B] mt-1 mb-6">
          Masukkan PIN rahasia bendahara untuk membuka fitur input dan kelola kas.
        </p>

        {/* PIN Indicators */}
        <div className="flex justify-center items-center gap-3 mb-6">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                pin.length > idx
                  ? error
                    ? "bg-rose-500 scale-110"
                    : "bg-emerald-500 scale-110 shadow-sm shadow-emerald-500/50"
                  : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-500 mb-4">
            <AlertCircle className="w-4 h-4" />
            <span>PIN salah! Silakan coba lagi.</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="h-12 rounded-2xl bg-[#F8FAFC] hover:bg-emerald-50 hover:text-emerald-700 font-bold text-lg text-[#0F172A] transition-all active:scale-95 border border-[#E2E8F0]"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPin("")}
            className="h-12 rounded-2xl text-xs font-bold text-[#94A3B8] hover:text-[#0F172A] transition-colors"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress("0")}
            className="h-12 rounded-2xl bg-[#F8FAFC] hover:bg-emerald-50 hover:text-emerald-700 font-bold text-lg text-[#0F172A] transition-all active:scale-95 border border-[#E2E8F0]"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-12 rounded-2xl text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center justify-center"
          >
            Del
          </button>
        </div>

        {/* Helper Note */}
        <p className="text-[11px] text-[#64748B] bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
          💡 Demo default PIN: <strong className="text-emerald-600 font-bold">{expectedPin}</strong>
          <br />
          (Dapat diubah di tab Pengaturan Kelas)
        </p>
      </div>
    </div>
  );
};
