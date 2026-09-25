"use client";

import React, { useState } from "react";
import { ClassProfile, Student } from "@/types";
import {
  Users,
  UserPlus,
  Settings,
  Trash2,
  Save,
  RotateCcw,
  Check,
  FileText,
  KeyRound,
  Coins,
  QrCode,
  CreditCard,
  Phone,
} from "lucide-react";

interface StudentManagerProps {
  students: Student[];
  profile: ClassProfile;
  isTreasurer: boolean;
  onAddStudent: (student: Omit<Student, "id">) => void;
  onBulkAddStudents: (names: string[]) => void;
  onDeleteStudent: (id: string) => void;
  onUpdateProfile: (profile: ClassProfile) => void;
  onResetData: () => void;
  onSyncClassy?: () => void;
  isSyncingClassy?: boolean;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  profile,
  isTreasurer,
  onAddStudent,
  onBulkAddStudents,
  onDeleteStudent,
  onUpdateProfile,
  onResetData,
  onSyncClassy,
  isSyncingClassy = false,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"STUDENTS" | "SETTINGS">("STUDENTS");

  // Single student form
  const [name, setName] = useState("");
  const [attendanceNumber, setAttendanceNumber] = useState<number | "">(
    students.length + 1
  );
  const [gender, setGender] = useState<"L" | "P">("L");
  const [phone, setPhone] = useState("");

  // Bulk add modal/input
  const [bulkInput, setBulkInput] = useState("");
  const [showBulkInput, setShowBulkInput] = useState(false);

  // Settings form
  const [className, setClassName] = useState(profile.class_name);
  const [schoolName, setSchoolName] = useState(profile.school_name);
  const [academicYear, setAcademicYear] = useState(profile.academic_year);
  const [monthlyDueAmount, setMonthlyDueAmount] = useState(profile.monthly_due_amount);
  const [treasurerName, setTreasurerName] = useState(profile.treasurer_name);
  const [treasurerPhone, setTreasurerPhone] = useState(profile.treasurer_phone);
  const [treasurerPin, setTreasurerPin] = useState(profile.treasurer_pin);
  const [bankName, setBankName] = useState(profile.bank_name || "BCA / DANA");
  const [bankAccount, setBankAccount] = useState(profile.bank_account_number || "");
  const [bankHolder, setBankHolder] = useState(profile.bank_account_holder || "");
  const [qrisUrl, setQrisUrl] = useState(profile.qris_image_url || "");
  const [announcement, setAnnouncement] = useState(profile.announcement || "");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !attendanceNumber) return;

    onAddStudent({
      name: name.trim(),
      attendance_number: Number(attendanceNumber),
      gender,
      phone_number: phone.trim() || undefined,
      is_active: true,
    });

    setName("");
    setAttendanceNumber(students.length + 2);
    setPhone("");
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const names = bulkInput
      .split("\n")
      .map((n) => n.trim().replace(/^\d+[\.\-\s]+/, ""))
      .filter((n) => n.length > 0);

    if (names.length > 0) {
      onBulkAddStudents(names);
      setBulkInput("");
      setShowBulkInput(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      class_name: className.trim(),
      school_name: schoolName.trim(),
      academic_year: academicYear.trim(),
      monthly_due_amount: Number(monthlyDueAmount),
      treasurer_name: treasurerName.trim(),
      treasurer_phone: treasurerPhone.trim(),
      treasurer_pin: treasurerPin.trim() || "1234",
      bank_name: bankName.trim(),
      bank_account_number: bankAccount.trim(),
      bank_account_holder: bankHolder.trim(),
      qris_image_url: qrisUrl.trim(),
      announcement: announcement.trim(),
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] max-w-xs">
        <button
          onClick={() => setActiveSubTab("STUDENTS")}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === "STUDENTS"
              ? "bg-white text-[#0F172A] shadow-2xs"
              : "text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Daftar Siswa ({students.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab("SETTINGS")}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === "SETTINGS"
              ? "bg-white text-[#0F172A] shadow-2xs"
              : "text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Pengaturan Kelas</span>
        </button>
      </div>

      {activeSubTab === "STUDENTS" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Add Student Form */}
          {isTreasurer && (
            <div className="lg:col-span-1 space-y-4">
              <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs">
                <h4 className="font-extrabold text-sm text-[#0F172A] mb-3 flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  <span>Tambah Siswa Baru</span>
                </h4>

                <form onSubmit={handleAddSingle} className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="block text-[11px] font-bold text-[#475569] mb-1">
                        No. Absen
                      </label>
                      <input
                        type="number"
                        required
                        value={attendanceNumber}
                        onChange={(e) =>
                          setAttendanceNumber(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-bold"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-[#475569] mb-1">
                        Gender
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setGender("L")}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                            gender === "L"
                              ? "bg-blue-50 border-blue-500 text-blue-700"
                              : "border-[#E2E8F0] text-slate-400"
                          }`}
                        >
                          Laki-laki
                        </button>
                        <button
                          type="button"
                          onClick={() => setGender("P")}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                            gender === "P"
                              ? "bg-pink-50 border-pink-500 text-pink-700"
                              : "border-[#E2E8F0] text-slate-400"
                          }`}
                        >
                          Perempuan
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Misal: Bagas Dewantara"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] mb-1">
                      Nomor WhatsApp (Opsional)
                    </label>
                    <input
                      type="tel"
                      placeholder="081234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#0F172A] hover:bg-slate-800 text-white shadow-2xs transition-all"
                  >
                    Simpan Siswa
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
                  <button
                    onClick={() => setShowBulkInput(!showBulkInput)}
                    className="w-full py-2 text-xs font-bold text-[#475569] hover:bg-[#F8FAFC] rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Paste Banyak Siswa Sekaligus</span>
                  </button>
                </div>

                {showBulkInput && (
                  <form onSubmit={handleBulkSubmit} className="mt-3 space-y-2">
                    <p className="text-[11px] text-slate-400">
                      Tempel daftar nama siswa (satu nama per baris):
                    </p>
                    <textarea
                      rows={5}
                      required
                      placeholder={"Aditya Pratama\nAnisa Rahmawati\nBagas Dewantara"}
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A]"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500"
                    >
                      Impor Nama Siswa
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Right: Student Roster List */}
          <div className={`${isTreasurer ? "lg:col-span-2" : "lg:col-span-3"} space-y-3`}>
            {/* Classy Integration Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h5 className="font-extrabold text-xs text-emerald-950">
                    Terhubung ke Classy Database (classy.exars.my.id)
                  </h5>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Data mahasiswa otomatis disinkronkan dari kelas <strong>{profile.class_name}</strong>.
                </p>
              </div>

              {onSyncClassy && (
                <button
                  type="button"
                  onClick={onSyncClassy}
                  disabled={isSyncingClassy}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-900 transition-all shadow-2xs active:scale-95 flex items-center gap-1.5 shrink-0"
                >
                  <Users className={`w-3.5 h-3.5 ${isSyncingClassy ? "animate-spin text-emerald-600" : ""}`} />
                  <span>{isSyncingClassy ? "Menyinkronkan..." : "Sinkronkan dari Classy"}</span>
                </button>
              )}
            </div>

            <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs">
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider">
                  Daftar Absen Kelas
                </span>
                <span className="text-xs text-[#94A3B8] font-semibold">
                  Total {students.length} Siswa Aktif
                </span>
              </div>

              <div className="divide-y divide-[#F1F5F9]">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="py-2.5 px-3 flex items-center justify-between hover:bg-[#F8FAFC] rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-xs font-bold text-[#94A3B8]">
                        {student.attendance_number}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                            {student.name}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold ${
                              student.gender === "L"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-pink-50 text-pink-700"
                            }`}
                          >
                            {student.gender}
                          </span>
                        </div>
                        {student.phone_number && (
                          <span className="text-[11px] text-[#94A3B8]">
                            {student.phone_number}
                          </span>
                        )}
                      </div>
                    </div>

                    {isTreasurer && (
                      <button
                        onClick={() => {
                          if (confirm(`Hapus ${student.name} dari daftar kelas?`)) {
                            onDeleteStudent(student.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Siswa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Settings Sub Tab */
        <div className="max-w-2xl mx-auto p-5 sm:p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
          <div>
            <h4 className="font-extrabold text-base text-[#0F172A] flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-600" />
              <span>Pengaturan Kelas & Informasi Kas</span>
            </h4>
            <p className="text-xs text-[#64748B] mt-0.5">
              Sesuaikan identitas kelas, nominal kas bulanan, nomor rekening bendahara, dan QRIS.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Nama Kelas
                </label>
                <input
                  type="text"
                  required
                  disabled={!isTreasurer}
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-semibold disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Nama Sekolah
                </label>
                <input
                  type="text"
                  required
                  disabled={!isTreasurer}
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-semibold disabled:opacity-60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Nominal Kas Bulanan (Rp)
                </label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    disabled={!isTreasurer}
                    value={monthlyDueAmount}
                    onChange={(e) => setMonthlyDueAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-black disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  PIN Bendahara (4-6 Angka)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="password"
                    maxLength={6}
                    required
                    disabled={!isTreasurer}
                    value={treasurerPin}
                    onChange={(e) => setTreasurerPin(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-mono font-bold disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Rekening & QRIS Section */}
            <div className="pt-2 border-t border-[#F1F5F9] space-y-3">
              <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>Info Pembayaran & Bendahara</span>
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">
                    Nama Bendahara Kelas
                  </label>
                  <input
                    type="text"
                    disabled={!isTreasurer}
                    value={treasurerName}
                    onChange={(e) => setTreasurerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">
                    Nomor WhatsApp Bendahara
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="tel"
                      disabled={!isTreasurer}
                      placeholder="6281234567890"
                      value={treasurerPhone}
                      onChange={(e) => setTreasurerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">
                    Nama Bank / E-Wallet
                  </label>
                  <input
                    type="text"
                    disabled={!isTreasurer}
                    placeholder="BCA / Mandiri / DANA"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    disabled={!isTreasurer}
                    placeholder="887012345678"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-mono font-bold disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">
                    Atas Nama
                  </label>
                  <input
                    type="text"
                    disabled={!isTreasurer}
                    placeholder="Anisa Rahmawati"
                    value={bankHolder}
                    onChange={(e) => setBankHolder(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  URL / Link Gambar Barcode QRIS
                </label>
                <div className="relative">
                  <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="url"
                    disabled={!isTreasurer}
                    placeholder="https://... (link gambar QRIS kelas)"
                    value={qrisUrl}
                    onChange={(e) => setQrisUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Pengumuman Kas Kelas
              </label>
              <textarea
                rows={2}
                disabled={!isTreasurer}
                placeholder="Pesan untuk seluruh siswa kelas..."
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] disabled:opacity-60"
              />
            </div>

            {isTreasurer ? (
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Reset semua data kas & siswa ke data contoh awal?")) {
                      onResetData();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Data Demo</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs transition-all active:scale-95"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Tersimpan!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                🔒 Masuk dengan PIN Bendahara untuk mengedit pengaturan kelas ini.
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
