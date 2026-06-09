// app/seller/register/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import {
  Store,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Wallet,
  Users,
  Truck,
  BadgeCheck,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  Upload,
  X,
  Eye,
  EyeOff,
  CreditCard,
  Banknote,
  Clock,
  Award,
  Star,
  TrendingUp,
  Package,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

// ======================================================
// CONFIG
// ======================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8900/api/v1";
const LOGO_PATH = "/assets/logo/logo-agrohub.png";

// ======================================================
// TYPES
// ======================================================

interface SellerFormData {
  storeName: string;
  storeDescription: string;
  category: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  taxId: string;
  businessType: string;
}

// ======================================================
// API SERVICE
// ======================================================

const api = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

// ======================================================
// COMPONENTS
// ======================================================

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
              step === currentStep
                ? "bg-green-600 text-white shadow-lg shadow-green-200 scale-110"
                : step < currentStep
                ? "bg-green-200 text-green-700"
                : "bg-slate-200 text-slate-400"
            }`}
          >
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-12 h-0.5 mx-1 transition-all duration-300 ${
                step < currentStep ? "bg-green-500" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  icon: Icon,
  error,
}: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full h-12 ${Icon ? "pl-12" : "pl-4"} pr-4 rounded-xl border ${
            error ? "border-red-500 bg-red-50" : "border-slate-200"
          } bg-white focus:border-green-500 focus:outline-none transition`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function FormTextArea({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder = "",
  rows = 4,
}: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:outline-none transition resize-none"
      />
    </div>
  );
}

function SelectInput({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  icon: Icon,
}: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full h-12 ${Icon ? "pl-12" : "pl-4"} pr-4 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:outline-none appearance-none cursor-pointer`}
        >
          <option value="">Pilih {label}</option>
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
        </div>
      </div>
    </div>
  );
}

// ======================================================
// MAIN PAGE
// ======================================================

export default function SellerRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState<SellerFormData>({
    storeName: "",
    storeDescription: "",
    category: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",
    taxId: "",
    businessType: "",
  });

  const [validationErrors, setValidationErrors] = useState<Partial<SellerFormData>>({});

  // Categories options
  const categoryOptions = [
    { value: "farming", label: "Pertanian & Perkebunan" },
    { value: "livestock", label: "Peternakan" },
    { value: "fishery", label: "Perikanan" },
    { value: "equipment", label: "Alat & Mesin Pertanian" },
    { value: "fertilizer", label: "Pupuk & Pestisida" },
    { value: "seeds", label: "Benih & Bibit" },
    { value: "processing", label: "Hasil Olahan" },
    { value: "other", label: "Lainnya" },
  ];

  const businessTypeOptions = [
    { value: "individual", label: "Perorangan / Petani Mandiri" },
    { value: "group", label: "Kelompok Tani / Gapoktan" },
    { value: "cooperative", label: "Koperasi" },
    { value: "company", label: "Perusahaan / CV / PT" },
    { value: "distributor", label: "Distributor / Supplier" },
  ];

  const provinceOptions = [
    { value: "jawa-barat", label: "Jawa Barat" },
    { value: "jawa-tengah", label: "Jawa Tengah" },
    { value: "jawa-timur", label: "Jawa Timur" },
    { value: "banten", label: "Banten" },
    { value: "sumatera-utara", label: "Sumatera Utara" },
    { value: "sumatera-selatan", label: "Sumatera Selatan" },
    { value: "kalimantan-timur", label: "Kalimantan Timur" },
    { value: "sulawesi-selatan", label: "Sulawesi Selatan" },
    { value: "bali", label: "Bali" },
    { value: "ntb", label: "Nusa Tenggara Barat" },
    { value: "ntt", label: "Nusa Tenggara Timur" },
  ];

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      router.push("/login?redirect=/seller/register");
      return;
    }

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);

      // Pre-fill phone from user data
      if (userData.phone) {
        setFormData((prev) => ({ ...prev, phone: userData.phone }));
      }
    }
  }, [router]);

  // Check if user is already a seller
  useEffect(() => {
    const checkSellerStatus = async () => {
      try {
        const data = await api("/seller/status");
        if (data.isSeller) {
          router.push("/seller/dashboard");
        }
      } catch (err) {
        // Not a seller yet, continue
        console.log("Not a seller yet");
      }
    };

    if (isAuthenticated) {
      checkSellerStatus();
    }
  }, [isAuthenticated, router]);

  const validateStep = (stepNumber: number): boolean => {
    const errors: Partial<SellerFormData> = {};

    if (stepNumber === 1) {
      if (!formData.storeName.trim()) errors.storeName = "Nama toko harus diisi";
      if (formData.storeName.length < 3) errors.storeName = "Nama toko minimal 3 karakter";
      if (!formData.category) errors.category = "Pilih kategori toko";
      if (!formData.storeDescription.trim()) errors.storeDescription = "Deskripsi toko harus diisi";
      if (formData.storeDescription.length < 20) errors.storeDescription = "Deskripsi minimal 20 karakter";
    }

    if (stepNumber === 2) {
      if (!formData.address.trim()) errors.address = "Alamat harus diisi";
      if (!formData.city.trim()) errors.city = "Kota harus diisi";
      if (!formData.province) errors.province = "Pilih provinsi";
      if (!formData.postalCode.trim()) errors.postalCode = "Kode pos harus diisi";
      if (!formData.phone.trim()) errors.phone = "Nomor telepon harus diisi";
      if (!/^[0-9]{10,13}$/.test(formData.phone.replace(/\D/g, ""))) {
        errors.phone = "Nomor telepon tidak valid";
      }
    }

    if (stepNumber === 3) {
      if (!formData.bankName) errors.bankName = "Nama bank harus diisi";
      if (!formData.bankAccountNumber) errors.bankAccountNumber = "Nomor rekening harus diisi";
      if (!/^[0-9]{8,20}$/.test(formData.bankAccountNumber.replace(/\D/g, ""))) {
        errors.bankAccountNumber = "Nomor rekening tidak valid";
      }
      if (!formData.bankAccountName) errors.bankAccountName = "Nama pemilik rekening harus diisi";
      if (!formData.businessType) errors.businessType = "Pilih jenis usaha";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setError("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    setError("");

    try {
      const response = await api("/seller/apply", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
        }),
      });

      if (response.success) {
        setStep(4);
        // Update user role in localStorage
        if (user) {
          const updatedUser = { ...user, role: "seller", roleName: "Penjual" };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } else {
        setError(response.message || "Gagal mendaftar sebagai seller");
      }
    } catch (err: any) {
      console.error("Error applying as seller:", err);
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-3 mb-4 group">
            {/* Logo Image */}
            <div className="relative w-12 h-12 overflow-hidden rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Image
                src={LOGO_PATH}
                alt="AgroHub Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
                onError={(e) => {
                  // Fallback jika gambar tidak ada
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  // Tampilkan icon sebagai fallback
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full bg-green-700 rounded-xl flex items-center justify-center';
                    fallback.innerHTML = '<svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                AgroHub
              </span>
              <span className="text-xs text-green-600 font-medium">Seller Center</span>
            </div>
          </Link>
          
          <h1 className="text-3xl font-black text-slate-900 mt-4">Jadi Seller di AgroHub</h1>
          <p className="text-slate-500 mt-2">Mulai jual produk pertanian Anda ke seluruh Indonesia</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} totalSteps={4} />

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
          <AnimatePresence mode="wait">
            {/* STEP 1 - Store Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Store className="w-4 h-4 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Informasi Toko</h2>
                </div>

                <FormInput
                  label="Nama Toko"
                  name="storeName"
                  value={formData.storeName}
                  onChange={(e: any) => setFormData({ ...formData, storeName: e.target.value })}
                  required
                  placeholder="Contoh: Tani Makmur Store"
                  icon={Store}
                  error={validationErrors.storeName}
                />

                <SelectInput
                  label="Kategori Toko"
                  name="category"
                  value={formData.category}
                  onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                  options={categoryOptions}
                  required
                  icon={Package}
                />

                <FormTextArea
                  label="Deskripsi Toko"
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={(e: any) => setFormData({ ...formData, storeDescription: e.target.value })}
                  required
                  placeholder="Ceritakan tentang toko Anda, produk yang dijual, dan keunggulan toko Anda..."
                  rows={4}
                />

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 text-sm text-green-700 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <BadgeCheck className="w-5 h-5" />
                    <span className="font-semibold">Tips untuk toko yang lebih baik:</span>
                  </div>
                  <ul className="space-y-1 text-xs ml-6 list-disc">
                    <li>Gunakan nama toko yang mudah diingat</li>
                    <li>Deskripsi yang jelas akan meningkatkan kepercayaan pembeli</li>
                    <li>Pilih kategori yang sesuai dengan produk Anda</li>
                  </ul>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition flex items-center gap-2 shadow-lg shadow-green-200"
                  >
                    Selanjutnya
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 - Location & Contact */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Lokasi & Kontak</h2>
                </div>

                <FormInput
                  label="Alamat Lengkap"
                  name="address"
                  value={formData.address}
                  onChange={(e: any) => setFormData({ ...formData, address: e.target.value })}
                  required
                  placeholder="Jl. Contoh No. 123"
                  icon={MapPin}
                  error={validationErrors.address}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormInput
                    label="Kota"
                    name="city"
                    value={formData.city}
                    onChange={(e: any) => setFormData({ ...formData, city: e.target.value })}
                    required
                    placeholder="Bandung"
                    error={validationErrors.city}
                  />
                  <SelectInput
                    label="Provinsi"
                    name="province"
                    value={formData.province}
                    onChange={(e: any) => setFormData({ ...formData, province: e.target.value })}
                    options={provinceOptions}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormInput
                    label="Kode Pos"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={(e: any) => setFormData({ ...formData, postalCode: e.target.value })}
                    required
                    placeholder="40123"
                    error={validationErrors.postalCode}
                  />
                  <FormInput
                    label="Nomor Telepon"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="08123456789"
                    icon={Phone}
                    error={validationErrors.phone}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Kembali
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition flex items-center gap-2 shadow-lg shadow-green-200"
                  >
                    Selanjutnya
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 - Bank Info & Business */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Informasi Bank & Usaha</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormInput
                    label="Nama Bank"
                    name="bankName"
                    value={formData.bankName}
                    onChange={(e: any) => setFormData({ ...formData, bankName: e.target.value })}
                    required
                    placeholder="BCA / Mandiri / BRI / BNI"
                    icon={Building}
                    error={validationErrors.bankName}
                  />
                  <FormInput
                    label="Nomor Rekening"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={(e: any) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                    required
                    placeholder="1234567890"
                    icon={CreditCard}
                    error={validationErrors.bankAccountNumber}
                  />
                </div>

                <FormInput
                  label="Nama Pemilik Rekening"
                  name="bankAccountName"
                  value={formData.bankAccountName}
                  onChange={(e: any) => setFormData({ ...formData, bankAccountName: e.target.value })}
                  required
                  placeholder="Sesuai dengan nama pemilik rekening"
                  icon={User}
                  error={validationErrors.bankAccountName}
                />

                <SelectInput
                  label="Jenis Usaha"
                  name="businessType"
                  value={formData.businessType}
                  onChange={(e: any) => setFormData({ ...formData, businessType: e.target.value })}
                  options={businessTypeOptions}
                  required
                  icon={Building}
                />

                <FormInput
                  label="NPWP / NIK (Opsional)"
                  name="taxId"
                  value={formData.taxId}
                  onChange={(e: any) => setFormData({ ...formData, taxId: e.target.value })}
                  placeholder="Nomor NPWP atau NIK"
                  icon={FileText}
                />

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 text-sm text-blue-700 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">Informasi Keamanan</span>
                  </div>
                  <p className="text-xs">
                    Data bank Anda akan kami jaga kerahasiaannya. Pencairan dana hanya akan dilakukan ke rekening yang terdaftar.
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Kembali
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-green-200"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        Daftar Sekarang
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4 - Success */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-8"
              >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>

                <h2 className="text-2xl font-black text-green-700">
                  Pendaftaran Berhasil! 🎉
                </h2>

                <p className="text-slate-600 max-w-md mx-auto">
                  Selamat! Akun Seller Anda telah berhasil dibuat. Tim kami akan memverifikasi data Anda dalam 1x24 jam.
                </p>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 text-left space-y-3 border border-green-100">
                  <h3 className="font-bold text-green-800 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Apa yang bisa Anda lakukan sekarang?
                  </h3>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Lengkapi profil toko Anda
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Tambahkan produk pertama Anda
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Pelajari cara mengelola pesanan
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Ikuti panduan seller untuk sukses berjualan
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Link href="/seller/dashboard">
                    <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg shadow-green-200">
                      Dashboard Seller
                    </button>
                  </Link>
                  <Link href="/">
                    <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition">
                      Kembali ke Beranda
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Benefits Section (shown only in early steps) */}
        {step < 4 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Wallet, title: "Pencairan Cepat", desc: "Dana masuk ke wallet" },
              { icon: Users, title: "Jangkau Luas", desc: "Ribuan pembeli aktif" },
              { icon: Truck, title: "Logistik Terintegrasi", desc: "Pengiriman mudah" },
              { icon: Shield, title: "Transaksi Aman", desc: "Escrow protection" },
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white/50 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/70 transition">
                <benefit.icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-xs text-slate-800">{benefit.title}</p>
                <p className="text-xs text-slate-500">{benefit.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}