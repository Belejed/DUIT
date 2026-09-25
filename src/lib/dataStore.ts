import {
  ClassProfile,
  Expense,
  FinancialStats,
  MonthlyPeriod,
  Student,
  StudentPayment,
  WishlistItem,
} from "@/types";

export const DEFAULT_CLASS_PROFILE: ClassProfile = {
  id: "class_xwa91itgg",
  class_name: "M.Log B",
  school_name: "26B (S1 - M.Log)",
  academic_year: "2026/2027",
  monthly_due_amount: 20000,
  treasurer_name: "Bendahara Kelas",
  treasurer_phone: "",
  treasurer_pin: "1234",
  qris_image_url: "",
  bank_name: "",
  bank_account_number: "",
  bank_account_holder: "",
  announcement:
    "Selamat datang di DUIT by classy! Rekap kas kelas M.Log B tercatat secara transparan dan rapi.",
};

export const INITIAL_MONTHLY_PERIODS: MonthlyPeriod[] = [
  { id: "m-1", month_name: "Juli 2026", short_code: "Jul", month_number: 7, year: 2026, due_date: "2026-07-15", target_amount: 20000 },
  { id: "m-2", month_name: "Agustus 2026", short_code: "Agu", month_number: 8, year: 2026, due_date: "2026-08-15", target_amount: 20000 },
  { id: "m-3", month_name: "September 2026", short_code: "Sep", month_number: 9, year: 2026, due_date: "2026-09-15", target_amount: 20000 },
  { id: "m-4", month_name: "Oktober 2026", short_code: "Okt", month_number: 10, year: 2026, due_date: "2026-10-15", target_amount: 20000 },
  { id: "m-5", month_name: "November 2026", short_code: "Nov", month_number: 11, year: 2026, due_date: "2026-11-15", target_amount: 20000 },
  { id: "m-6", month_name: "Desember 2026", short_code: "Des", month_number: 12, year: 2026, due_date: "2026-12-15", target_amount: 20000 },
];

export const INITIAL_STUDENTS: Student[] = [
  { id: "lqwYjnJxW9TMBv9Wj2JdepsFbMb2", attendance_number: 1, name: "Ahmad Baihaqi", gender: "L", phone_number: "6281388037784", is_active: true },
  { id: "N42gy7CUHjSpsJeBe3pvrJ6htcy1", attendance_number: 2, name: "Aisyah Putri Hidayat", gender: "P", phone_number: "628164242438", is_active: true },
  { id: "jxxpcq98LghI6qvyZNCWwI3Roqv2", attendance_number: 3, name: "Ajeng Carissa B.S", gender: "P", phone_number: "6287777130508", is_active: true },
  { id: "ctCWos0M51RI2eKIszUPPxcal2O2", attendance_number: 4, name: "Angeline Gabriella Nababan", gender: "P", phone_number: "6285788963382", is_active: true },
  { id: "KPcPqxl6L7R8adkYYui0HbvRC6z2", attendance_number: 5, name: "Arya Ghiffari Raditya", gender: "L", phone_number: "6281399841474", is_active: true },
  { id: "NhE6ybZYZ4ZQJ9uBTAYn0VlXBk22", attendance_number: 6, name: "Dhillarizky Mulawarman", gender: "L", phone_number: "6283137850346", is_active: true },
  { id: "ncaEiCWU2GNERZx8CyAQ3iv9krU2", attendance_number: 7, name: "fahdilham", gender: "L", phone_number: "6287848293892", is_active: true },
  { id: "ayvsuQQGzkSGhfE2cqduYkMmbxo2", attendance_number: 8, name: "Frizky Aulia Razita", gender: "P", phone_number: "6289514560992", is_active: true },
  { id: "9MYel2yBzLcqpFkSmAxDTEfSd4i1", attendance_number: 9, name: "gita ayu wardhani", gender: "P", phone_number: "6289517498005", is_active: true },
  { id: "sMrmqv09h6fesuARcfkK2fmRVep2", attendance_number: 10, name: "hafiz putra p.r", gender: "L", phone_number: "6285693707033", is_active: true },
  { id: "r7OprHJQHVPrU6xdPcvOtj9Fhfd2", attendance_number: 11, name: "Hanan Wasilah Demeng", gender: "P", phone_number: "6289524327354", is_active: true },
  { id: "o1m5fPdSWnXQfqgiKyh1Wd7CEJU2", attendance_number: 12, name: "hanifah", gender: "P", phone_number: "6287886374268", is_active: true },
  { id: "l5StP63ipNPsLlp8MZApJkzFLPn2", attendance_number: 13, name: "Jeremy Binsar", gender: "L", phone_number: "6281911844191", is_active: true },
  { id: "vx8i8BsDqPNpJwyqexKiSC9EbRE2", attendance_number: 14, name: "keyla iswandari", gender: "P", phone_number: "6285770201279", is_active: true },
  { id: "S9X2Vjfh2LTzug7oCMdMJBEgNIA3", attendance_number: 15, name: "Khaira", gender: "P", phone_number: "6281918924377", is_active: true },
  { id: "XPlZ1cYXWqV6xINzEqH5L5AhVyB2", attendance_number: 16, name: "khansa khairunnisa", gender: "P", phone_number: "6287854347702", is_active: true },
  { id: "JrU7uEPkhPbUWhtFpyZabkkMWBI2", attendance_number: 17, name: "Lala", gender: "P", phone_number: "628221074354", is_active: true },
  { id: "bCUxGatZUSYPcM5GEwcqgjlxpus2", attendance_number: 18, name: "Muhamad Reza Dwi S", gender: "L", phone_number: "62895702767927", is_active: true },
  { id: "3MpWTRedVFNKvY05OSFxwP8yw6v1", attendance_number: 19, name: "Muhammad Fatan Khalishan", gender: "L", phone_number: "6281283274491", is_active: true },
  { id: "dqoWqJc4zyaI9k89Xxs0hcm5YvC2", attendance_number: 20, name: "Muhammad Yahya Alhakim", gender: "L", phone_number: "6285333322799", is_active: true },
  { id: "YpjNwDlEGJavbDWVOEhplfcleTX2", attendance_number: 21, name: "Muhammad Zaki Al Mubaarok", gender: "L", phone_number: "62895328886884", is_active: true },
  { id: "dQV8oaQbjzRMKxZxZBivt7oTSG72", attendance_number: 22, name: "Nandita Ram Maulida", gender: "P", phone_number: "6285716279211", is_active: true },
  { id: "PiYQZUPStAbtvlQ0rXojS8WAtAj1", attendance_number: 23, name: "Nesa Galuh Wardani", gender: "P", phone_number: "6285694125925", is_active: true },
  { id: "GGItVnmGVQSJ8jIcJODwYxRR1I63", attendance_number: 24, name: "Rafif Gustin", gender: "L", phone_number: "6285280381507", is_active: true },
  { id: "xTXU5nW5uTfsXIFrp2gypQxfHBa2", attendance_number: 25, name: "Restu", gender: "L", phone_number: "6285810181152", is_active: true },
  { id: "HZ6veuk7JuNcsh5veTfJaY5NFLe2", attendance_number: 26, name: "Rizky Putra", gender: "L", phone_number: "6281297006366", is_active: true },
  { id: "0Z4ChU4NiKhMD6yyUPNhulzoeRi2", attendance_number: 27, name: "Sara Zelda", gender: "P", phone_number: "6285774473605", is_active: true },
  { id: "OFmML7j9bjQYhd6pWw2mAi3JFE73", attendance_number: 28, name: "Silvia Della Enjelia", gender: "P", phone_number: "6285609877201", is_active: true },
  { id: "UQoitkAtQvWkPklzGHnaSAJ1tbB2", attendance_number: 29, name: "Sultan Alghozali Matondamg", gender: "L", phone_number: "6289607039044", is_active: true },
  { id: "TNXAxJ5dLybivGkaWLRK6yhLpGb2", attendance_number: 30, name: "Virda Livina", gender: "P", phone_number: "6287815934228", is_active: true },
];

export const INITIAL_PAYMENTS: StudentPayment[] = [];

export const INITIAL_EXPENSES: Expense[] = [];

export const INITIAL_WISHLIST: WishlistItem[] = [];

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateFinancialStats = (
  payments: StudentPayment[],
  expenses: Expense[],
  students: Student[],
  wishlists: WishlistItem[],
  currentPeriodId?: string
): FinancialStats => {
  const totalIncome = payments.reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalBalance = totalIncome - totalExpense;

  const activeStudents = students.filter((s) => s.is_active);
  const activeStudentsCount = activeStudents.length;

  let paidStudentsCount = 0;
  let unpaidStudentsCount = 0;

  if (currentPeriodId) {
    activeStudents.forEach((student) => {
      const payment = payments.find(
        (p) => p.student_id === student.id && p.period_id === currentPeriodId
      );
      if (payment && payment.status === "LUNAS") {
        paidStudentsCount++;
      } else {
        unpaidStudentsCount++;
      }
    });
  }

  const complianceRate =
    activeStudentsCount > 0 ? Math.round((paidStudentsCount / activeStudentsCount) * 100) : 0;

  const wishlistTargetTotal = wishlists.reduce((sum, w) => sum + w.target_amount, 0);
  const wishlistAllocatedTotal = wishlists.reduce((sum, w) => sum + w.allocated_amount, 0);

  return {
    totalBalance,
    totalIncome,
    totalExpense,
    activeStudentsCount,
    paidStudentsCount,
    unpaidStudentsCount,
    complianceRate,
    wishlistTargetTotal,
    wishlistAllocatedTotal,
  };
};

export const generateWhatsAppPaymentConfirmation = (
  studentName: string,
  monthsSelected: string[],
  totalAmount: number,
  method: string,
  className: string
): string => {
  const monthList = monthsSelected.join(", ");
  const message = `Halo Bendahara Kelas *${className}*! 👋\n\nSaya ingin konfirmasi pembayaran kas bulanan:\n👤 Nama: *${studentName}*\n📅 Periode: *${monthList}*\n💰 Total: *${formatRupiah(totalAmount)}*\n💳 Metode: *${method}*\n\nBerikut bukti transfer/pembayarannya terlampir di bawah ya. Mohon diverifikasi di aplikasi DUIT by classy. Terima kasih banyak! 🙏✨`;
  return encodeURIComponent(message);
};

export const generateWhatsAppSingleReminder = (
  student: Student,
  periodName: string,
  amount: number,
  className: string
): string => {
  const message = `Halo ${student.name}! 👋\n\nMau mengingatkan uang kas bulanan *${className}* untuk bulan *${periodName}* sebesar *${formatRupiah(amount)}* belum tercatat lunas ya.\n\nKamu bisa bayar via QRIS atau transfer rekening bendahara di aplikasi DUIT by classy. Mohon kerjasamanya ya, terima kasih banyak! 🙏💫`;
  return encodeURIComponent(message);
};

export const generateWhatsAppClassBroadcast = (
  unpaidStudents: { name: string; attendance_number: number }[],
  periodName: string,
  amount: number,
  className: string
): string => {
  const studentList = unpaidStudents
    .map((s, idx) => `${idx + 1}. [No. ${s.attendance_number}] ${s.name}`)
    .join("\n");

  const message = `📢 *REKAP KAS BULANAN ${className.toUpperCase()}*\nBulan: *${periodName}*\nNominal: *${formatRupiah(amount)} / siswa*\n\nBerikut teman-teman yang belum melunasi kas bulanan:\n\n${studentList}\n\nSilakan klik tombol *Kumpulin Kas* di aplikasi web untuk scan QRIS atau transfer. Terima kasih untuk yang sudah lunas! 🙌✨`;
  return encodeURIComponent(message);
};
