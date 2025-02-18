
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Statistics from "./pages/Statistics";
import Overview from "./pages/Overview";
import Matches from "./pages/Matches";
import Rankings from "./pages/Rankings";
import Promotions from "./pages/Promotions";
import Tournaments from "./pages/Tournaments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
