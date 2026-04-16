import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Language {
  name: string;
  nativeName: string;
  region: string;
  color: string;
}

const allLanguages: Language[] = [
  { name: "English", nativeName: "English", region: "Global", color: "bg-blue-500" },
  { name: "Igbo", nativeName: "Asụsụ Igbo", region: "Southeast", color: "bg-[hsl(var(--igbo))]" },
  { name: "Hausa", nativeName: "Harshen Hausa", region: "North", color: "bg-[hsl(var(--hausa))]" },
  { name: "Yoruba", nativeName: "Èdè Yorùbá", region: "Southwest", color: "bg-[hsl(var(--yoruba))]" },
  { name: "Ikwere", nativeName: "Ásụ̀sụ̀ Ìkwéré", region: "Rivers", color: "bg-[hsl(var(--ikwere))]" },
];

interface LanguageSelectorProps {
  sourceLanguage: string;
  targetLanguage: string;
  onSelectSource: (language: string) => void;
  onSelectTarget: (language: string) => void;
  onSwap: () => void;
}

export function LanguageSelector({
  sourceLanguage,
  targetLanguage,
  onSelectSource,
  onSelectTarget,
  onSwap,
}: LanguageSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
        {/* Source Language */}
        <div className="flex-1 w-full">
          <h2 className="font-display text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide text-center">
            From
          </h2>
          <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
            {allLanguages.map((lang) => {
              const isSelected = sourceLanguage === lang.name;
              const isOther = targetLanguage === lang.name;
              return (
                <button
                  key={lang.name}
                  onClick={() => onSelectSource(lang.name)}
                  className={cn(
                    "relative px-3 py-2 md:px-4 md:py-2.5 rounded-xl transition-all duration-300",
                    "flex items-center gap-1.5 md:gap-2",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-card scale-105"
                      : isOther
                        ? "glass-card opacity-50 hover:opacity-80 hover:scale-102"
                        : "glass-card hover:scale-102 hover:shadow-elevated"
                  )}
                >
                  <div className={cn("w-2 h-2 md:w-2.5 md:h-2.5 rounded-full", lang.color)} />
                  <div className="text-left">
                    <p className={cn(
                      "font-display font-semibold text-xs md:text-sm",
                      isSelected ? "text-primary-foreground" : "text-foreground"
                    )}>
                      {lang.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex-shrink-0 mt-1 md:mt-5">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSwap}
            className="rounded-full bg-primary/10 hover:bg-primary/20 text-primary h-10 w-10"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Target Language */}
        <div className="flex-1 w-full">
          <h2 className="font-display text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide text-center">
            To
          </h2>
          <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
            {allLanguages.map((lang) => {
              const isSelected = targetLanguage === lang.name;
              const isOther = sourceLanguage === lang.name;
              return (
                <button
                  key={lang.name}
                  onClick={() => onSelectTarget(lang.name)}
                  className={cn(
                    "relative px-3 py-2 md:px-4 md:py-2.5 rounded-xl transition-all duration-300",
                    "flex items-center gap-1.5 md:gap-2",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-card scale-105"
                      : isOther
                        ? "glass-card opacity-50 hover:opacity-80 hover:scale-102"
                        : "glass-card hover:scale-102 hover:shadow-elevated"
                  )}
                >
                  <div className={cn("w-2 h-2 md:w-2.5 md:h-2.5 rounded-full", lang.color)} />
                  <div className="text-left">
                    <p className={cn(
                      "font-display font-semibold text-xs md:text-sm",
                      isSelected ? "text-primary-foreground" : "text-foreground"
                    )}>
                      {lang.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
