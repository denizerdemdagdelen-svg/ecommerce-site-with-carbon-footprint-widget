import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./contexts/CartContext";

const root = createRoot(document.getElementById("root")!);

root.render(
  <CartProvider>
    <App />
  </CartProvider>
);
