import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dictionary from "./pages/Dictionary";
import FontSimplified from "./pages/FontSimplified";
import FontDocumentation from "./pages/FontDocumentation";
import FontLogin from "./pages/FontLogin";
import FontAdminDashboard from "./pages/FontAdminDashboard";
import FontUserDashboard from "./pages/FontUserDashboard";
import Analytics from "./pages/Analytics";
import Automation from "./pages/Automation";
import VideoAutomation from "./pages/VideoAutomation";
import AiChat from "./pages/AiChat";
import NuclearCodeSearch from "./pages/NuclearCodeSearch";
import MazeGame from "./pages/MazeGame";
import SearchEngine from "./pages/SearchEngine";
import IslamicServices from "./pages/IslamicServices";
import Sitemap from "./pages/Sitemap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/D" element={<Dictionary />} />
          <Route path="/F" element={<FontSimplified />} />
          <Route path="/F/D" element={<FontDocumentation />} />
          <Route path="/F/L" element={<FontLogin />} />
          <Route path="/F/A" element={<FontAdminDashboard />} />
          <Route path="/F/U" element={<FontUserDashboard />} />
          <Route path="/A" element={<Analytics />} />
          <Route path="/FP" element={<Automation />} />
          <Route path="/FV" element={<VideoAutomation />} />
          <Route path="/AI" element={<AiChat />} />
          <Route path="/HN" element={<NuclearCodeSearch />} />
          <Route path="/GA" element={<MazeGame />} />
          <Route path="/SE" element={<SearchEngine />} />
          <Route path="/IS" element={<IslamicServices />} />
          <Route path="/sitemap" element={<Sitemap />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
