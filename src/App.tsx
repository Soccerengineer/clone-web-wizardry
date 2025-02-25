import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import AppRoutes from "./pages/Routes";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as UIToaster } from "@/components/ui/toaster";

/**
 * Ana uygulama bileşeni
 * Tüm sayfaları ve rotaları tanımlar
 */
function App() {
  return (
    <Router>
      <AppRoutes />

      {/* Bildirim bileşenleri */}
      <Toaster position="top-center" />
      <UIToaster />
    </Router>
  );
}

export default App;
