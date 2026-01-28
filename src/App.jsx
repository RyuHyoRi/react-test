import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Skincare from "./pages/Skincare.jsx";
import Cart from "./pages/Cart.jsx";
import OrderDashboard from "./pages/OrderDashboard.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/skincare" element={<Skincare />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<OrderDashboard />} />
    </Routes>
  );
}
