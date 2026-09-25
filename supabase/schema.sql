-- ==========================================================
-- DUIT by Classy - Supabase Database Schema (Monthly & Wishlist)
-- Project: https://supabase.com/dashboard/project/qgdwpxqqybvtdogydgxa
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Class Profile & Settings Table
CREATE TABLE IF NOT EXISTS public.class_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_name TEXT NOT NULL DEFAULT 'XII MIPA 2',
    school_name TEXT NOT NULL DEFAULT 'SMAN 1 Classy',
    academic_year TEXT NOT NULL DEFAULT '2026/2027',
    monthly_due_amount NUMERIC NOT NULL DEFAULT 20000,
    treasurer_name TEXT DEFAULT 'Anisa Rahmawati & Gita Permata',
    treasurer_phone TEXT DEFAULT '6281234567890',
    treasurer_pin TEXT NOT NULL DEFAULT '1234',
    bank_name TEXT DEFAULT 'BCA / DANA',
    bank_account_number TEXT DEFAULT '887012345678',
    bank_account_holder TEXT DEFAULT 'Anisa Rahmawati',
    qris_image_url TEXT DEFAULT '',
    announcement TEXT DEFAULT 'Mohon lunasi kas bulanan sebelum tanggal 10 setiap bulannya ya!',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attendance_number INT NOT NULL,
    name TEXT NOT NULL,
    gender VARCHAR(1) NOT NULL DEFAULT 'L',
    phone_number TEXT DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Monthly Periods Table (Bulan Kas)
CREATE TABLE IF NOT EXISTS public.monthly_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    month_name TEXT NOT NULL,
    short_code TEXT NOT NULL,
    month_number INT NOT NULL,
    year INT NOT NULL,
    due_date DATE NOT NULL,
    target_amount NUMERIC NOT NULL DEFAULT 20000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Student Payments Table
CREATE TABLE IF NOT EXISTS public.student_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    period_id UUID NOT NULL REFERENCES public.monthly_periods(id) ON DELETE CASCADE,
    amount_paid NUMERIC NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'BELUM',
    payment_date DATE,
    payment_method VARCHAR(20) DEFAULT 'CASH',
    notes TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_student_monthly_period UNIQUE (student_id, period_id)
);

-- 6. Expenses Table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Operasional',
    amount NUMERIC NOT NULL DEFAULT 0,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    receipt_url TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_by TEXT DEFAULT 'Bendahara',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Wishlist Table (Pengadaan / Impian Kelas)
CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Kenyamanan Ruang',
    target_amount NUMERIC NOT NULL DEFAULT 0,
    allocated_amount NUMERIC NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'DIRENCANAKAN',
    priority VARCHAR(20) NOT NULL DEFAULT 'SEDANG',
    image_url TEXT DEFAULT '',
    description TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE public.class_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read class_profile" ON public.class_profile FOR SELECT USING (true);
CREATE POLICY "Public write class_profile" ON public.class_profile FOR ALL USING (true);

CREATE POLICY "Public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Public write students" ON public.students FOR ALL USING (true);

CREATE POLICY "Public read monthly_periods" ON public.monthly_periods FOR SELECT USING (true);
CREATE POLICY "Public write monthly_periods" ON public.monthly_periods FOR ALL USING (true);

CREATE POLICY "Public read student_payments" ON public.student_payments FOR SELECT USING (true);
CREATE POLICY "Public write student_payments" ON public.student_payments FOR ALL USING (true);

CREATE POLICY "Public read expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Public write expenses" ON public.expenses FOR ALL USING (true);

CREATE POLICY "Public read wishlist" ON public.wishlist FOR SELECT USING (true);
CREATE POLICY "Public write wishlist" ON public.wishlist FOR ALL USING (true);
