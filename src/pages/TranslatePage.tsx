import { useState } from "react";
import { motion } from "framer-motion";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TranslationPanel } from "@/components/TranslationPanel";

export default function TranslatePage() {
  const [sourceLanguage, setSourceLanguage] = useState("English");
  const [targetLanguage, setTargetLanguage] = useState("Igbo");

  const handleSwapLanguages = () => {
    if (sourceLanguage !== "English") {
      setSourceLanguage(targetLanguage);
      setTargetLanguage(sourceLanguage);
    }
  };

  return (
    <div className="pb-24 md:pb-8">
      {/* Hero Section */}
      <section className="px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground mb-4 md:mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-sm font-medium">Real-time AI Translation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6"
          >
            Break Language Barriers{" "}
            <span className="gradient-text">Instantly</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8"
          >
            Translate with pronunciation guides for Igbo, Hausa, Yoruba, and Ikwere. 
            Speak or type — understand and be understood.
          </motion.p>
        </div>
      </section>

      {/* Language Selection */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-4 pb-6"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-sm font-semibold text-center text-muted-foreground mb-3 uppercase tracking-wide">
            Translate to
          </h2>
          <LanguageSelector
            selectedLanguage={targetLanguage}
            onSelectLanguage={setTargetLanguage}
          />
        </div>
      </motion.section>

      {/* Translation Panel */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4 py-6"
      >
        <TranslationPanel
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          onSwapLanguages={handleSwapLanguages}
        />
      </motion.section>
    </div>
  );
}
