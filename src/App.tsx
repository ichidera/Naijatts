import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AvatarProvider } from "@/contexts/AvatarContext";
import { FloatingAvatar } from "@/components/FloatingAvatar";
import { Layout } from "@/components/Layout";
import TranslatePage from "./pages/TranslatePage";
import PhrasesPage from "./pages/PhrasesPage";
import AboutPage from "./pages/AboutPage";
import DocumentationPage from "./pages/DocumentationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AvatarProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<TranslatePage />} />
                <Route path="/phrases" element={<PhrasesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/documentation" element={<DocumentationPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <FloatingAvatar />
          </BrowserRouter>
        </TooltipProvider>
      </AvatarProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
