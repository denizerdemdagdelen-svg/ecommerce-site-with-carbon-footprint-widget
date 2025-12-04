import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const increase = (id: string) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p))
    );
  };

  const decrease = (id: string) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 🔥 **TOPLAM FİYAT BURADA HESAPLANIYOR**
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increase,
        decrease,
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
