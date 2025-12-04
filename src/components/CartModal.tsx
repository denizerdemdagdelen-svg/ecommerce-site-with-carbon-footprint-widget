import { useCart } from "../contexts/CartContext";

export default function CartModal({ onClose }: { onClose: () => void }) {
  const {
    cart,
    increase,
    decrease,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice
  } = useCart();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
      <div className="w-full sm:w-[380px] h-full bg-white shadow-xl p-5 flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Sepetim</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg"
          >
            ✕
          </button>
        </div>

        {/* Empty Cart */}
        {cart.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <p>Sepetiniz boş.</p>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 bg-gray-50 p-3 rounded-lg border"
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 rounded object-cover border"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-primary font-bold">₺{item.price}</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => decrease(item.id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    −
                  </button>

                  <span className="font-semibold">{item.quantity}</span>

                  <button
                    onClick={() => increase(item.id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Sil
              </button>
            </div>
          ))}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between text-lg font-semibold mb-3">
              <span>Toplam Ürün:</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between text-lg font-bold text-primary mb-4">
              <span>Toplam Fiyat:</span>
              <span>₺{totalPrice.toFixed(2)}</span>
            </div>

            <button
              className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover"
            >
              Satın Al
            </button>

            <button
              onClick={clearCart}
              className="mt-3 w-full py-2 text-sm border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Sepeti Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
