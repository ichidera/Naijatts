import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import TranslatePage from "./pages/TranslatePage";
import PhrasesPage from "./pages/PhrasesPage";
import AboutPage from "./pages/AboutPage";
import DocumentationPage from "./pages/DocumentationPage";
import NotFound from "./pages/NotFound";

// Same reasoning as TranslationPanel.tsx: keep the three.js-heavy avatar
// code out of the main bundle entirely, only fetched when this route is
// actually visited.
const AvatarDemoPage = lazy(() => import("./pages/AvatarDemoPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
              <Route
                path="/avatar-demo"
                element={
                  <Suspense fallback={<div className="px-4 py-16 text-center text-muted-foreground">Loading…</div>}>
                    <AvatarDemoPage />
                  </Suspense>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
