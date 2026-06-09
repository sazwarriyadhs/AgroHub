import Link from 'next/link';
import { Store, Tractor, Sprout, Wheat, Droplets, Bug, Cpu, Warehouse } from 'lucide-react';

// ✅ FIXED: Mengamankan interface agar cocok dengan data internal maupun data dari API luar
interface Category {
  id?: number;
  name: string;
  slug: string;
  icon?: any;
  count?: number;          // Untuk data lokal / landing page
  product_count?: number;  // Fallback untuk data yang datang dari API / Halaman Produk
}

// Map helper untuk mencocokkan slug kategori dari API dengan Icon Lucide secara dinamis
const iconMap: Record<string, any> = {
  'alat-pertanian': Tractor,
  'pupuk-nutrisi': Sprout,
  'fertilizer': Sprout,
  'benih-unggul': Wheat,
  'beras': Wheat,
  'jagung': Wheat,
  'irigasi': Droplets,
  'irrigation': Droplets,
  'pestisida': Bug,
  'iot-sensor': Cpu,
  'iot-farming': Cpu,
  'greenhouse': Warehouse,
  'pakan-ternak': Store,
  'pakan-ikan': Store,
};

const defaultCategories = [
  { name: 'Alat Pertanian', icon: Tractor, count: 45, slug: 'alat-pertanian' },
  { name: 'Pupuk & Nutrisi', icon: Sprout, count: 38, slug: 'pupuk-nutrisi' },
  { name: 'Benih Unggul', icon: Wheat, count: 52, slug: 'benih-unggul' },
  { name: 'Irigasi', icon: Droplets, count: 24, slug: 'irigasi' },
  { name: 'Pestisida', icon: Bug, count: 31, slug: 'pestisida' },
  { name: 'IoT & Sensor', icon: Cpu, count: 18, slug: 'iot-sensor' },
  { name: 'Greenhouse', icon: Warehouse, count: 15, slug: 'greenhouse' },
  { name: 'Pakan Ternak', icon: Store, count: 27, slug: 'pakan-ternak' },
];

interface CategorySectionProps {
  categories: Category[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  // Gunakan data props jika tersedia dan ada isinya, jika tidak gunakan defaultCategories
  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="max-w-[1500px] mx-auto px-5 mt-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-3xl font-black text-slate-900">Kategori Populer</h2>
        <Link href="/products" className="text-green-700 font-bold hover:text-green-800 transition">
          Lihat Semua →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {displayCategories.map((item) => {
          // 1. Tentukan Icon: Cek properti hardcoded dulu -> Cek iconMap berdasarkan slug -> Fallback ke Store icon
          const IconComponent = item.icon || iconMap[item.slug] || Store;
          
          // 2. Tentukan Jumlah Produk: Baca 'count' atau 'product_count' dari API
          const totalProducts = item.count ?? item.product_count ?? 0;

          return (
            <Link 
              key={item.slug} 
              href={`/products?category=${item.slug}`} // ✅ Diarahkan ke halaman produk dengan query params agar filternya langsung aktif
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-green-400 hover:shadow-lg transition text-left block group"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-green-50 transition duration-300">
                <IconComponent className="w-8 h-8 text-green-700 transition-transform group-hover:scale-110 duration-300" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm line-clamp-2 min-h-[40px] group-hover:text-green-700 transition">
                {item.name}
              </h3>
              <p className="text-xs text-slate-500 mt-2">{totalProducts} produk</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}