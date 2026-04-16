import { cn } from "@/lib/utils";

interface Language {
  name: string;
  nativeName: string;
  region: string;
  color: string;
}

const languages: Language[] = [
  { name: "Igbo", nativeName: "Asụsụ Igbo", region: "Southeast", color: "bg-[hsl(var(--igbo))]" },
  { name: "Hausa", nativeName: "Harshen Hausa", region: "North", color: "bg-[hsl(var(--hausa))]" },
  { name: "Yoruba", nativeName: "Èdè Yorùbá", region: "Southwest", color: "bg-[hsl(var(--yoruba))]" },
  { name: "Ikwere", nativeName: "Ásụ̀sụ̀ Ìkwéré", region: "Rivers", color: "bg-[hsl(var(--ikwere))]" },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

export function LanguageSelector({ selectedLanguage, onSelectLanguage }: LanguageSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      {languages.map((lang) => {
        const isSelected = selectedLanguage === lang.name;
        return (
          <button
            key={lang.name}
            onClick={() => onSelectLanguage(lang.name)}
            className={cn(
              "relative px-4 py-2.5 md:px-5 md:py-3 rounded-xl transition-all duration-300",
              "flex items-center gap-2 md:gap-3",
              isSelected
                ? "bg-primary text-primary-foreground shadow-card scale-105"
                : "glass-card hover:scale-102 hover:shadow-elevated"
            )}
          >
            <div className={cn("w-2.5 h-2.5 md:w-3 md:h-3 rounded-full", lang.color)} />
            <div className="text-left">
              <p className={cn(
                "font-display font-semibold text-sm md:text-base",
                isSelected ? "text-primary-foreground" : "text-foreground"
              )}>
                {lang.name}
              </p>
              <p className={cn(
                "text-xs hidden sm:block",
                isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {lang.nativeName}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
