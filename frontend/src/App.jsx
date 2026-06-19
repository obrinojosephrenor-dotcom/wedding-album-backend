import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar    from "./components/Navbar";
import Home      from "./pages/Home";
import Upload    from "./pages/Upload";
import Gallery   from "./pages/Gallery";
import ThankYou  from "./pages/ThankYou";
import Admin     from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "font-body text-sm",
          style:     { borderRadius: "12px", background: "#FAF8F5", color: "#333" },
          success:   { iconTheme: { primary: "#A8B8A2", secondary: "#FAF8F5" } },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/upload"   element={<Upload />} />
        <Route path="/gallery"  element={<Gallery />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/admin"    element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}