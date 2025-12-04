import { CarbonFootprintWidget } from "./CarbonFootprintWidget";
import { products } from "../data/products";
import { useCart } from "../contexts/CartContext";

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
}

export function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const { addToCart } = useCart();

  const product = products.find(
    (p) => String(p.id) === String(productId)
  );

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-primary hover:text-primary-hover transition-colors"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Ürünlere Dön
      </button>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                {product.category.replace("_", " ")}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-primary mb-4">
                ₺{product.price}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Ürün Detayları</h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <Detail label="Ağırlık" value={product.weight_kg + " kg"} />
                <Detail label="Menşei" value={product.origin_country} />
                <Detail
                  label="Ambalaj"
                  value={product.packaging_type.replace("_", " ")}
                />
                <Detail
                  label="Stok"
                  value={product.in_stock ? "Stokta Var" : "Stokta Yok"}
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="border-t pt-6">
              <button
                disabled={!product.in_stock}
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                    quantity: 1
                  })
                }
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.in_stock ? "Sepete Ekle" : "Stokta Yok"}
              </button>
            </div>
          </div>
        </div>

        {/* Carbon Footprint Section */}
        <div className="border-t bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Çevresel Etki
            </h2>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
              <div className="flex-shrink-0">
                <CarbonFootprintWidget
                  score={product.footprint.score}
                  label={product.footprint.label}
                  estimatedKgCO2e={product.footprint.estimated_kgCO2e}
                  breakdown={product.footprint.breakdown}
                  size="large"
                />
              </div>

              <div className="flex-1 max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                  Karbon Ayak İzi Dağılımı
                </h3>

                <DetailRow label="Üretim" value={product.footprint.breakdown.production} />
                <DetailRow label="Nakliye" value={product.footprint.breakdown.shipping} />
                <DetailRow label="Ambalaj" value={product.footprint.breakdown.packaging} />
                <DetailRow label="Ağırlık Faktörü" value={product.footprint.breakdown.weight} />

                <div className="border-t pt-3 flex justify-between items-center font-semibold">
                  <span>Toplam:</span>
                  <span>{product.footprint.estimated_kgCO2e.toFixed(2)} kgCO₂e</span>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                  <strong>Bu ne anlama geliyor?</strong> Bu ürün benzerlerine göre{" "}
                  <strong>{product.footprint.label.toLowerCase()}</strong> karbon ayak izine sahiptir.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500">{label}:</span>
      <span className="ml-2 font-medium">{value}</span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium">{value.toFixed(2)} kgCO₂e</span>
    </div>
  );
}
