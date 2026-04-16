import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Languages, Mic, Volume2, HandMetal, BookOpen, Accessibility, Globe } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function AboutPage() {
  return (
    <div className="pb-24 md:pb-8">
      {/* Hero */}
      <section className="px-4 py-8 md:py-16 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            <Globe className="h-10 w-10 text-primary" />
          </motion.div>

          <motion.h1
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4"
          >
            About <span className="gradient-text">NaijaTTS</span>
          </motion.h1>

          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Learn how to use NaijaTTS and understand its features
          </motion.p>
        </div>
      </section>

      {/* Overview */}
      <section className="px-4 py-8">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
          <Card className="p-6 space-y-4">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <Languages className="w-6 h-6 text-primary" />
              About NaijaTTS
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              NaijaTTS (Nigerian Text-to-Speech and Translation System) is an AI-enabled real-time translation
              and accessibility support system specifically designed for Nigerian languages. The system integrates
              multiple modalities including text, speech, and sign language to provide comprehensive translation
              services that address both linguistic diversity and accessibility needs.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold mb-2">Supported Languages</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• English</li>
                  <li>• Igbo (Southeastern Nigeria)</li>
                  <li>• Hausa (Northern Nigeria)</li>
                  <li>• Yoruba (Southwestern Nigeria)</li>
                  <li>• Ikwere (Rivers State)</li>
                </ul>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold mb-2">Key Features</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Real-time translation</li>
                  <li>• Speech-to-text input</li>
                  <li>• Text-to-speech output</li>
                  <li>• Pronunciation guides</li>
                  <li>• Sign language animation (NSL/ASL)</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Features Guide */}
      <section className="px-4 py-8">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
          <Card className="p-6">
            <h3 className="text-2xl font-semibold mb-4">Feature Guide</h3>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="translation">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-primary" />
                    Text Translation
                    <Badge variant="outline">Core Feature</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <p>
                    The translation engine provides bidirectional translation between English and Nigerian languages
                    using advanced AI language models.
                  </p>
                  <div className="pl-4 border-l-2 border-primary/30">
                    <p className="font-semibold text-foreground">How to use:</p>
                    <ol className="list-decimal pl-5 space-y-1 mt-2">
                      <li>Select your source language (e.g., English)</li>
                      <li>Select your target language (e.g., Igbo)</li>
                      <li>Enter or speak your text</li>
                      <li>Click "Translate" to see results</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pronunciation">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Pronunciation Guides
                    <Badge variant="outline">Learning Tool</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <p>
                    For Nigerian languages, the system provides phonetic notation to help you pronounce
                    translated words correctly. This is especially useful for tonal languages like Igbo and Yoruba.
                  </p>
                  <div className="p-3 bg-muted rounded-lg mt-2">
                    <p className="text-sm font-mono">Example: "Nnọọ" → /n̩.nɔ̃ː/</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="voice">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-primary" />
                    Voice Input
                    <Badge variant="outline">Speech Recognition</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <p>
                    Use your device's microphone to speak instead of typing. The system will convert your
                    speech to text using Web Speech API.
                  </p>
                  <div className="pl-4 border-l-2 border-primary/30">
                    <p className="font-semibold text-foreground">Tips for best results:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Speak clearly and at a moderate pace</li>
                      <li>Minimize background noise</li>
                      <li>Allow microphone access when prompted</li>
                      <li>The system will listen for up to 10 seconds</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="audio">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-primary" />
                    Audio Playback
                    <Badge variant="outline">Text-to-Speech</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <p>
                    Listen to the pronunciation of translated text with AI-generated speech synthesis.
                    This feature helps you learn correct pronunciation and verify translations.
                  </p>
                  <p className="text-sm italic">
                    Note: Audio quality varies by language. Nigerian language voices use optimized
                    synthetic voices for the best approximation.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sign">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <HandMetal className="w-5 h-5 text-primary" />
                    Sign Language Animation
                    <Badge variant="outline">Accessibility</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <p>
                    The system can generate animated sign language representations of translated text
                    in both Nigerian Sign Language (NSL) and American Sign Language (ASL).
                  </p>
                  <div className="pl-4 border-l-2 border-primary/30">
                    <p className="font-semibold text-foreground">How to use:</p>
                    <ol className="list-decimal pl-5 space-y-1 mt-2">
                      <li>First translate your text</li>
                      <li>Select NSL or ASL in the sign language settings</li>
                      <li>Click "Generate Sign Language Animation"</li>
                      <li>View the animated avatar and control playback</li>
                    </ol>
                  </div>
                  <p className="text-sm mt-3">
                    The avatar shows hand shapes, positions, movements, and facial expressions
                    to represent each word or phrase.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="phrases">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Phrase Library
                    <Badge variant="outline">Quick Reference</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <p>
                    Access a curated collection of common phrases organized by category (Greetings,
                    Basic Phrases, Questions, Health, Directions, Food, Emergency).
                  </p>
                  <p>
                    The phrase library includes over 25 essential phrases with translations in all
                    supported Nigerian languages. Use the search function to quickly find what you need.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </motion.div>
      </section>

      {/* Accessibility Features */}
      <section className="px-4 py-8">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
          <Card className="p-6 space-y-4">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <Accessibility className="w-6 h-6 text-primary" />
              Accessibility Features
            </h3>

            <div className="space-y-3 text-muted-foreground">
              <p>
                NaijaTTS is designed with accessibility at its core, following WCAG 2.1 Level AA guidelines:
              </p>

              <ul className="space-y-2 pl-5">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Dark Mode Support:</strong> Toggle between light and dark themes for reduced eye strain</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Responsive Design:</strong> Works seamlessly on desktop, tablet, and mobile devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Keyboard Navigation:</strong> All features accessible via keyboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Sign Language Support:</strong> Visual communication for deaf and hard-of-hearing users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Audio Output:</strong> Text-to-speech for visually impaired users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Voice Input:</strong> Hands-free interaction option</span>
                </li>
              </ul>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Project Information */}
      <section className="px-4 py-8">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
          <Card className="p-6 space-y-4 bg-muted/50">
            <h3 className="text-xl font-semibold">Project Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Project Title</p>
                <p className="font-medium">AI-Enabled Real-Time Translation and Accessibility Support for Nigerian Languages</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Author</p>
                <p className="font-medium">Ibekwe, Chidera Belema (DE. 2022/2871)</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Supervisor</p>
                <p className="font-medium">Dr. N. R. Saturday</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Year</p>
                <p className="font-medium">2026</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
