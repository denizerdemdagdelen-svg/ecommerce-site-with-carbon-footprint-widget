import { useState, useMemo } from "react";
import { CarbonFootprintWidget } from "./CarbonFootprintWidget";
import { products as localProducts } from "../data/products";
import { useCart } from "../contexts/CartContext";

interface ProductListProps {
  onSelectProduct: (productId: string) => void;
}

export function ProductList({ onSelectProduct }: ProductListProps) {
  const [category, setCategory] = useState<string>("");
  const [footprintRange, setFootprintRange] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  // Sepet context'i
  const { addToCart } = useCart();

  // Kategoriler
  const categories = useMemo(() => {
    return [...new Set(localProducts.map((p) => p.category))];
  }, []);

  // Filtre + Sıralama
  const filteredProducts = useMemo(() => {
    // type hatalarını engellemek için any dizisi olarak kopyalıyoruz
    let filtered = [...(localProducts as any[])];

    // Arama
    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Kategori
    if (category !== "") {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Karbon skoru aralığı
    if (footprintRange !== "") {
      const [min, max] = footprintRange.split("-").map(Number);
      filtered = filtered.filter(
        (p) => p.footprint.score >= min && p.footprint.score <= max
      );
    }

    // Sıralama
    if (sortBy === "footprint-asc") {
      filtered.sort((a, b) => a.footprint.score - b.footprint.score);
    } else if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [category, footprintRange, sortBy, search]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">EkoMağaza</h1>
        <p className="text-lg text-gray-600">
          Satın aldığınız ürünlerin çevresel etkisini bilerek güvenle alışveriş
          yapın
        </p>
      </div>

      {/* Filtreler */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Arama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Ara
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün ara..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() +
                    cat.slice(1).replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Karbon filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Karbon Ayak İzi
            </label>
            <select
              value={footprintRange}
              onChange={(e) => setFootprintRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Tüm Aralıklar</option>
              <option value="1-3">Düşük (1–3)</option>
              <option value="4-7">Orta (4–7)</option>
              <option value="8-10">Yüksek (8–10)</option>
            </select>
          </div>

          {/* Sıralama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sırala
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Varsayılan</option>
              <option value="footprint-asc">
                Karbon Ayak İzi (Düşük → Yüksek)
              </option>
              <option value="price-asc">Fiyat (Düşük → Yüksek)</option>
              <option value="name-asc">İsim (A → Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ürünler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product: any) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition cursor-pointer flex flex-col"
            onClick={() => onSelectProduct(product.id)}
          >
            <div className="aspect-square overflow-hidden rounded-t-lg">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {product.category.replace("_", " ")}
                  </p>
                </div>

                <CarbonFootprintWidget
                  score={product.footprint.score}
                  label={product.footprint.label}
                  estimatedKgCO2e={product.footprint.estimated_kgCO2e}
                  breakdown={product.footprint.breakdown}
                  size="small"
                />
              </div>

              <p className="text-lg font-bold text-primary">₺{product.price}</p>

              <p className="text-sm text-gray-600 mt-1 line-clamp-2 flex-1">
                {product.description}
              </p>

              {/* Sepete ekle butonu */}
              <button
                className="mt-3 w-full bg-primary text-white text-sm font-semibold py-2 rounded-md hover:bg-primary/90 transition"
                onClick={(e) => {
                  e.stopPropagation(); // karta tıklamayı engelle
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                    quantity: 1,
                  });
                }}
              >
                Sepete Ekle
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sonuç yoksa */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Kriterlerinize uygun ürün bulunamadı.
          </p>
        </div>
      )}
    </div>
  );
}
