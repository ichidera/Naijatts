import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { phraseLibrary, categories, type CategoryId } from "@/data/phraseLibrary";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { cn } from "@/lib/utils";

const languages = ["Igbo", "Hausa", "Yoruba", "Ikwere"] as const;

export default function PhrasesPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("greetings");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Igbo");
  const [expandedPhrases, setExpandedPhrases] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const { speak, isSpeaking } = useSpeechSynthesis();

  const filteredPhrases = phraseLibrary.filter((phrase) => {
    const matchesCategory = phrase.category === selectedCategory;
    const matchesSearch = searchQuery
      ? phrase.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Object.values(phrase.translations).some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true;
    return matchesCategory && matchesSearch;
  });

  const handleSpeak = (text: string, language: string) => {
    speak(text, language);
  };

  const toggleExpand = (phraseId: string) => {
    setExpandedPhrases((prev) => {
      const next = new Set(prev);
      if (next.has(phraseId)) {
        next.delete(phraseId);
      } else {
        next.add(phraseId);
      }
      return next;
    });
  };

  const getLanguageColor = (lang: string) => {
    switch (lang) {
      case "Igbo":
        return "bg-[hsl(var(--igbo))]/10 text-[hsl(var(--igbo))] border-[hsl(var(--igbo))]/30";
      case "Hausa":
        return "bg-[hsl(var(--hausa))]/10 text-[hsl(var(--hausa))] border-[hsl(var(--hausa))]/30";
      case "Yoruba":
        return "bg-[hsl(var(--yoruba))]/10 text-[hsl(var(--yoruba))] border-[hsl(var(--yoruba))]/30";
      case "Ikwere":
        return "bg-[hsl(var(--ikwere))]/10 text-[hsl(var(--ikwere))] border-[hsl(var(--ikwere))]/30";
      default:
        return "bg-primary/10 text-primary border-primary/30";
    }
  };

  return (
    <div className="pb-24 md:pb-8">
      {/* Header */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3"
          >
            Quick Reference <span className="gradient-text">Phrases</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-lg mx-auto"
          >
            Common phrases ready to use. Tap to hear pronunciation.
          </motion.p>
        </div>
      </section>

      {/* Controls */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 pb-6"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search phrases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl bg-card/50"
            />
          </div>

          {/* Language Pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {languages.map((lang) => (
              <Button
                key={lang}
                variant={selectedLanguage === lang ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLanguage(lang)}
                className={cn(
                  "rounded-full transition-all",
                  selectedLanguage === lang && getLanguageColor(lang)
                )}
              >
                {lang}
              </Button>
            ))}
          </div>

          {/* Category Tabs - Horizontal Scroll */}
          <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-2 min-w-max pb-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "rounded-full whitespace-nowrap",
                    selectedCategory === category.id && "shadow-md"
                  )}
                >
                  <span className="mr-1.5">{category.icon}</span>
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Phrases Grid */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-3">
            {filteredPhrases.map((phrase, index) => {
              const isExpanded = expandedPhrases.has(phrase.id);
              const translation =
                phrase.translations[selectedLanguage as keyof typeof phrase.translations];

              return (
                <motion.div
                  key={phrase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="glass-card rounded-xl p-4 hover:shadow-elevated transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm text-muted-foreground">{phrase.english}</p>
                    <Badge
                      variant="outline"
                      className={cn("text-xs shrink-0", getLanguageColor(selectedLanguage))}
                    >
                      {selectedLanguage}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display font-semibold text-lg text-primary">
                      {translation}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSpeak(translation, selectedLanguage)}
                      className="rounded-full h-9 w-9 shrink-0"
                    >
                      <Volume2
                        className={cn("h-4 w-4", isSpeaking && "text-primary animate-pulse")}
                      />
                    </Button>
                  </div>

                  {/* Expand to see all languages */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(phrase.id)}
                    className="w-full mt-2 text-xs text-muted-foreground h-8"
                  >
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 mr-1 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                    {isExpanded ? "Less" : "All languages"}
                  </Button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 pt-2 border-t border-border/50 space-y-2"
                    >
                      {Object.entries(phrase.translations).map(([lang, trans]) => (
                        <div
                          key={lang}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={cn("text-xs", getLanguageColor(lang))}
                            >
                              {lang}
                            </Badge>
                            <span className="text-foreground">{trans}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSpeak(trans, lang)}
                            className="h-7 w-7 rounded-full"
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {filteredPhrases.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No phrases found. Try a different search or category.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
