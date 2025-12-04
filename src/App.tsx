import { useState } from "react";
import { ProductList } from "./components/ProductList";
import { ProductDetail } from "./components/ProductDetail";
import CartModal from "./components/CartModal";
import { useCart } from "./contexts/CartContext";

export default function App() {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);

  const { totalItems } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-primary cursor-pointer" onClick={() => setSelectedProductId(null)}>
          EkoMağaza
        </h2>

        {/* CART BUTTON */}
        <button
          onClick={() => setShowCart(true)}
          className="relative text-primary font-semibold hover:text-primary-hover"
        >
          Sepetim
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 max-w-7xl mx-auto">
        {selectedProductId ? (
          <ProductDetail
            productId={selectedProductId}
            onBack={() => setSelectedProductId(null)}
          />
        ) : (
          <ProductList onSelectProduct={setSelectedProductId} />
        )}
      </main>

      {/* ✅ CART MODAL BURADA GÖZÜKÜR */}
      {showCart && <CartModal onClose={() => setShowCart(false)} />}

    </div>
  );
}
