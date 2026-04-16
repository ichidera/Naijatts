import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Mic, Menu, X, Languages, BookOpen, Info, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/", label: "Translate", icon: Languages },
  { path: "/phrases", label: "Phrases", icon: BookOpen },
  { path: "/documentation", label: "Docs", icon: FileText },
  { path: "/about", label: "About", icon: Info },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background pattern-adire flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center shadow-card group-hover:scale-105 transition-transform">
                <Globe className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full bg-accent flex items-center justify-center">
                <Mic className="h-2 w-2 md:h-3 md:w-3 text-accent-foreground" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-lg md:text-xl text-foreground">
                NaijaTTS
              </h1>
              <p className="text-xs text-muted-foreground">
                Nigerian Language AI
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "rounded-full gap-2 transition-all",
                      isActive && "shadow-md"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            <ThemeToggle />
          </nav>

          {/* Mobile Header Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-lg"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content with Page Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="px-4 py-6 border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            NaijaTTS — Breaking Language Barriers Across Nigeria
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/50 safe-area-pb">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
