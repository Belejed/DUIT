export type PaymentStatus = "LUNAS" | "BELUM" | "SEBAGIAN";

export type ExpenseCategory =
  | "Operasional"
  | "Kebersihan"
  | "Fotokopi & Materi"
  | "Konsumsi & Acara"
  | "Wishlist / Pengadaan"
  | "Kas Tak Terduga"
  | "Lainnya";

export interface Student {
  id: string;
  attendance_number: number;
  name: string;
  gender: "L" | "P";
  phone_number?: string;
  is_active: boolean;
}

export interface MonthlyPeriod {
  id: string;
  month_name: string; // e.g. "September 2026"
  short_code: string; // e.g. "Sep"
  month_number: number; // 9
  year: number; // 2026
  due_date: string;
  target_amount: number; // e.g. 20000
}

export interface StudentPayment {
  id: string;
  student_id: string;
  period_id: string;
  amount_paid: number;
  status: PaymentStatus;
  payment_date?: string;
  payment_method?: "CASH" | "QRIS" | "TRANSFER";
  notes?: string;
}

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  expense_date: string;
  receipt_url?: string;
  notes?: string;
  created_by?: string;
}

export interface WishlistItem {
  id: string;
  title: string;
  category: string;
  target_amount: number;
  allocated_amount: number;
  status: "TERCAPAI" | "PROSES" | "DIRENCANAKAN";
  image_url?: string;
  description?: string;
  priority: "TINGGI" | "SEDANG" | "RENDAH";
  created_at: string;
}

export interface ClassProfile {
  id: string;
  class_name: string;
  school_name: string;
  academic_year: string;
  monthly_due_amount: number;
  treasurer_name: string;
  treasurer_phone: string;
  treasurer_pin: string;
  qris_image_url?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
  announcement?: string;
}

export interface FinancialStats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  activeStudentsCount: number;
  paidStudentsCount: number;
  unpaidStudentsCount: number;
  complianceRate: number;
  wishlistTargetTotal: number;
  wishlistAllocatedTotal: number;
}
