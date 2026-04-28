import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "@/components/app-layout";
import Index from "./pages/Index";
import Patrimoine from "./pages/Patrimoine";
import Locataires from "./pages/Locataires";
import Baux from "./pages/Baux";
import Finances from "./pages/Finances";
import Impayes from "./pages/Impayes";
import Inbox from "./pages/Inbox";
import Carte from "./pages/Carte";
import Configuration from "./pages/Configuration";
import Admins from "./pages/Admins";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/patrimoine" element={<Patrimoine />} />
              <Route path="/locataires" element={<Locataires />} />
              <Route path="/baux" element={<Baux />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/impayes" element={<Impayes />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/carte" element={<Carte />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/admins" element={<Admins />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
