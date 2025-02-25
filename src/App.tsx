
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Overview from "@/pages/Overview";
import Statistics from "@/pages/Statistics";
import Rankings from "@/pages/Rankings";
import Matches from "@/pages/Matches";
import Challenges from "@/pages/Challenges";
import Tournaments from "@/pages/Tournaments";
import AISquadBuilder from "@/pages/AISquadBuilder";
import Settings from "@/pages/settings/Settings";
import Profile from "@/pages/settings/Profile";
import Language from "@/pages/settings/Language";
import Security from "@/pages/settings/Security";
import Privacy from "@/pages/settings/Privacy";
import DevicePairing from "@/pages/DevicePairing"; // Yeni sayfayı ekleyin
import { Toaster } from "@/components/ui/sonner";
import { Toaster as UIToaster } from "@/components/ui/toaster";
import NotFound from "@/pages/NotFound";
import About from "@/pages/About";
import Promotions from "@/pages/Promotions";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/device-pairing" element={<DevicePairing />} /> {/* Yeni rota */}
        <Route path="/overview" element={<Overview />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/squad-builder" element={<AISquadBuilder />} />
        <Route path="/about" element={<About />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/profile" element={<Profile />} />
        <Route path="/settings/language" element={<Language />} />
        <Route path="/settings/security" element={<Security />} />
        <Route path="/settings/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-center" />
      <UIToaster />
    </Router>
  );
}

export default App;
