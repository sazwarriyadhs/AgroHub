'use client';

interface MobileCTAProps {
  title?: string;
  message?: string;
  showAlways?: boolean;
}

export default function MobileCTA({ 
  title = "🚀 Fitur Lengkap di Mobile",
  message = "Akses fitur jual produk, AI Doctor, dan wallet hanya di aplikasi mobile AgroHub",
  showAlways = false 
}: MobileCTAProps) {
  // Jangan tampilkan jika sudah di mobile
  if (!showAlways && typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  const handleDownload = () => {
    // Redirect ke download page atau show QR
    window.open('https://play.google.com/store/apps/details?id=com.agrohub.app', '_blank');
  };

  const handleContinue = () => {
    // Simpan preference bahwa user memilih lanjut di web
    localStorage.setItem('prefer_web', 'true');
    window.location.reload();
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">📱</div>
          <div>
            <h3 className="font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition text-sm font-medium"
          >
            Download App
          </button>
          <button
            onClick={handleContinue}
            className="border border-green-600 text-green-600 hover:bg-green-50 px-5 py-2 rounded-lg transition text-sm font-medium"
          >
            Lanjut di Web
          </button>
        </div>
      </div>
    </div>
  );
}

