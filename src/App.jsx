import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Skincare from "./pages/Skincare.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/skincare" element={<Skincare />} />
    </Routes>
  );
}
