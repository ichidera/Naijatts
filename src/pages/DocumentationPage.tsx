import { motion } from "framer-motion";
import { FileText, BookOpen, Code, Lightbulb, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function DocumentationPage() {
  return (
    <div className="pb-24 md:pb-8">
      {/* Hero Section */}
      <section className="px-4 py-8 md:py-16 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 md:mb-6">
            <GraduationCap className="h-4 w-4" />
            <span className="text-sm font-medium">Final Year Project Documentation</span>
          </motion.div>

          <motion.h1
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 leading-tight"
          >
            AI-Enabled Real-Time Translation and Accessibility Support for Nigerian Languages
          </motion.h1>

          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            A comprehensive documentation of an intelligent system designed to bridge communication gaps across Nigeria's diverse linguistic landscape.
          </motion.p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Table of Contents
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium text-primary">Front Matter</p>
                <ul className="space-y-1 text-muted-foreground ml-4">
                  <li>• Dedication</li>
                  <li>• Acknowledgment</li>
                  <li>• Abstract</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-primary">Main Chapters</p>
                <ul className="space-y-1 text-muted-foreground ml-4">
                  <li>• Chapter 1: Introduction</li>
                  <li>• Chapter 2: Literature Review</li>
                  <li>• Chapter 3: Methodologies and Design</li>
                  <li>• Chapter 4: System Implementation</li>
                  <li>• Chapter 5: Conclusion & Recommendation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dedication */}
      <section className="px-4 py-8 bg-muted/30">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Dedication</h2>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-lg text-muted-foreground italic leading-relaxed">
                This project is dedicated to the millions of Nigerians who navigate daily life across linguistic boundaries, 
                to the deaf and hard-of-hearing community who deserve equal access to communication technologies, 
                and to the preservation of our rich linguistic heritage for future generations.
              </p>
              <p className="text-muted-foreground mt-4">
                To my family, mentors, and all who believe in the power of technology to unite rather than divide.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Acknowledgment */}
      <section className="px-4 py-8">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Acknowledgment</h2>
          <Card>
            <CardContent className="pt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I wish to express my profound gratitude to the Almighty God for His guidance, wisdom, and strength throughout 
                the duration of this research project. His grace has been sufficient in every step of this academic journey.
              </p>
              <p>
                My sincere appreciation goes to my project supervisor for the invaluable guidance, constructive criticism, 
                and unwavering support that shaped this work into its final form. Your expertise in artificial intelligence 
                and natural language processing was instrumental in navigating the technical complexities of this project.
              </p>
              <p>
                I extend my gratitude to the Department of Computer Science for providing the necessary resources and 
                conducive academic environment. Special thanks to all lecturers who contributed to my academic foundation.
              </p>
              <p>
                To my parents and family members, your moral and financial support throughout my academic career is deeply 
                appreciated. Your belief in my abilities kept me motivated during challenging times.
              </p>
              <p>
                Finally, I thank my colleagues and friends who contributed to this work through discussions, testing, 
                and feedback. Your collaborative spirit enriched this research significantly.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Abstract */}
      <section className="px-4 py-8 bg-muted/30">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Abstract</h2>
          <Card>
            <CardContent className="pt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Nigeria, with over 500 indigenous languages, faces significant communication barriers that impede 
                social cohesion, economic development, and access to essential services. This research presents 
                <strong className="text-foreground"> NaijaTTS</strong>, an AI-enabled real-time translation and accessibility 
                support system designed specifically for Nigerian languages, addressing both linguistic diversity and 
                accessibility needs for the deaf and hard-of-hearing community.
              </p>
              <p>
                The system leverages advanced artificial intelligence techniques including Large Language Models (LLMs), 
                speech synthesis, and speech recognition to provide bidirectional translation between English and four 
                major Nigerian languages: Igbo, Hausa, Yoruba, and Ikwere. A distinguishing feature is the integration 
                of sign language support through an animated avatar capable of rendering both Nigerian Sign Language (NSL) 
                and American Sign Language (ASL).
              </p>
              <p>
                The methodology employs a client-server architecture built with React.js for the frontend, Supabase 
                Edge Functions for serverless backend processing, and integration with Google's Gemini AI models for 
                natural language processing tasks. The system incorporates pronunciation guides with phonetic notation 
                and audio playback to facilitate accurate spoken reproduction of translations.
              </p>
              <p>
                Evaluation results demonstrate that the system achieves high accuracy in translation tasks while 
                maintaining real-time responsiveness. The sign language avatar successfully renders gestures with 
                appropriate hand shapes, facial expressions, and body movements. The system's responsive design 
                ensures accessibility across desktop, tablet, and mobile devices.
              </p>
              <p>
                This research contributes to the body of knowledge in computational linguistics for low-resource 
                African languages and demonstrates the viability of AI-powered accessibility solutions for Nigerian 
                contexts. The implications extend to education, healthcare, commerce, and social integration.
              </p>
              <p className="text-sm">
                <strong className="text-foreground">Keywords:</strong> Artificial Intelligence, Machine Translation, 
                Nigerian Languages, Sign Language, Accessibility, Natural Language Processing, Speech Synthesis, 
                Low-Resource Languages
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Chapter One: Introduction */}
      <section className="px-4 py-8">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Chapter One</h2>
              <p className="text-muted-foreground">Introduction</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* 1.1 Background of Study */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1.1 Background of Study</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Language serves as the fundamental medium of human communication, cultural transmission, and social 
                  cohesion. In Nigeria, a nation characterized by remarkable linguistic diversity with over 500 distinct 
                  languages spoken across its 36 states and Federal Capital Territory, language barriers present 
                  significant challenges to national unity, economic development, and access to essential services 
                  (Ethnologue, 2023). This linguistic heterogeneity, while a source of cultural richness, creates 
                  practical communication obstacles that affect millions of Nigerians in their daily interactions.
                </p>
                <p>
                  The three major Nigerian languages—Hausa, Igbo, and Yoruba—account for approximately 60% of the 
                  population's mother tongue speakers (National Bureau of Statistics, 2022). However, inter-ethnic 
                  communication often relies on English, the official language, which many Nigerians, particularly 
                  in rural areas, have limited proficiency in. This language gap affects access to healthcare, legal 
                  services, education, and economic opportunities, disproportionately impacting marginalized communities 
                  (Adegbija, 2020).
                </p>
                <p>
                  The emergence of artificial intelligence (AI) and natural language processing (NLP) technologies 
                  presents unprecedented opportunities for addressing these communication barriers. Machine translation 
                  systems have evolved significantly from rule-based approaches to statistical methods and, more recently, 
                  to neural machine translation (NMT) architectures that leverage deep learning (Vaswani et al., 2017). 
                  These advancements have enabled the development of translation systems capable of handling the 
                  grammatical complexities and contextual nuances inherent in human languages.
                </p>
                <p>
                  However, the majority of NLP research and commercial translation services have focused on 
                  high-resource languages such as English, Chinese, and European languages, leaving African languages, 
                  including Nigerian languages, significantly underrepresented (Adelani et al., 2021). This disparity 
                  in technological attention has created what researchers term the "digital language divide," where 
                  speakers of low-resource languages lack access to the same digital tools and services available 
                  to speakers of dominant world languages (Joshi et al., 2020).
                </p>
                <p>
                  Compounding these challenges is the issue of accessibility for persons with disabilities. Nigeria's 
                  deaf and hard-of-hearing population, estimated at over 1.6 million individuals (World Health Organization, 
                  2021), faces dual communication barriers—both linguistic and modal. Nigerian Sign Language (NSL) 
                  serves as the primary mode of communication for many deaf Nigerians, yet digital translation tools 
                  rarely incorporate sign language output, effectively excluding this population from the benefits 
                  of technological advancement in language services.
                </p>
                <p>
                  The convergence of AI capabilities, cloud computing infrastructure, and increasing smartphone 
                  penetration in Nigeria (estimated at 51% in 2023 according to GSMA) creates a favorable environment 
                  for deploying accessible, real-time translation services. Modern AI models, particularly Large 
                  Language Models (LLMs) such as Google's Gemini and OpenAI's GPT series, have demonstrated 
                  remarkable capabilities in understanding and generating text across multiple languages, including 
                  some Nigerian languages (Google AI, 2024).
                </p>
                <p>
                  This research responds to these intersecting challenges by developing NaijaTTS, an AI-enabled 
                  real-time translation and accessibility support system specifically designed for Nigerian languages. 
                  The system integrates multiple modalities—text, speech, and sign language—to provide comprehensive 
                  translation services that address both linguistic diversity and accessibility needs. By leveraging 
                  cutting-edge AI technologies within a responsive web application framework, NaijaTTS aims to 
                  democratize access to translation services for all Nigerians, regardless of their linguistic 
                  background or physical abilities.
                </p>
              </CardContent>
            </Card>

            {/* 1.2 Statement of Problem */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1.2 Statement of Problem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Despite Nigeria's significant linguistic diversity, existing translation technologies fail to 
                  adequately serve the communication needs of Nigerian language speakers. Major commercial translation 
                  platforms such as Google Translate and Microsoft Translator offer limited support for Nigerian 
                  languages, with varying accuracy levels that often render translations unreliable for practical 
                  use (Ahia et al., 2023). The absence of pronunciation guides exacerbates this problem, as users 
                  may understand written translations but struggle with correct verbal reproduction.
                </p>
                <p>
                  Furthermore, existing translation tools universally neglect the needs of the deaf and hard-of-hearing 
                  community. No commercially available translation service provides Nigerian Sign Language output, 
                  creating a complete exclusion of deaf Nigerians from the benefits of digital translation technology. 
                  This accessibility gap perpetuates communication isolation and limits opportunities for social 
                  and economic participation.
                </p>
                <p>
                  The problem is further compounded by the following specific challenges:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-foreground">Limited Language Coverage:</strong> Most translation systems 
                    support only Hausa, Igbo, and Yoruba, excluding other significant Nigerian languages such as 
                    Ikwere, Fulfulde, and Kanuri.
                  </li>
                  <li>
                    <strong className="text-foreground">Absence of Pronunciation Support:</strong> Available translation 
                    tools provide textual output without phonetic guidance, limiting their utility for spoken 
                    communication.
                  </li>
                  <li>
                    <strong className="text-foreground">Lack of Speech Integration:</strong> Few systems offer voice 
                    input for Nigerian languages or speech synthesis for audio output of translations.
                  </li>
                  <li>
                    <strong className="text-foreground">Complete Accessibility Gap:</strong> No existing system provides 
                    sign language translation capability for Nigerian or any other sign language in the African context.
                  </li>
                  <li>
                    <strong className="text-foreground">Connectivity Constraints:</strong> Many translation tools require 
                    robust internet connectivity, limiting their utility in areas with poor network infrastructure.
                  </li>
                </ul>
                <p>
                  These limitations collectively contribute to persistent communication barriers that affect 
                  education, healthcare delivery, commercial transactions, legal proceedings, and social integration 
                  across Nigeria's diverse communities. The need for a comprehensive, accessible, and culturally 
                  appropriate translation solution has never been more pressing.
                </p>
              </CardContent>
            </Card>

            {/* 1.3 Aim and Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1.3 Aim and Objectives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Aim:</strong> The primary aim of this research is to design 
                  and implement an AI-enabled real-time translation and accessibility support system for Nigerian 
                  languages that incorporates text, speech, and sign language modalities to serve diverse user needs.
                </p>
                <p><strong className="text-foreground">Objectives:</strong></p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    To develop a real-time translation system supporting bidirectional translation between English 
                    and four Nigerian languages (Igbo, Hausa, Yoruba, and Ikwere) using advanced AI models.
                  </li>
                  <li>
                    To integrate pronunciation guides with phonetic notation and audio playback to facilitate 
                    accurate spoken reproduction of translations.
                  </li>
                  <li>
                    To implement speech recognition capabilities enabling voice input for translation requests 
                    in supported languages.
                  </li>
                  <li>
                    To develop a sign language translation feature with an animated avatar capable of rendering 
                    both Nigerian Sign Language (NSL) and American Sign Language (ASL).
                  </li>
                  <li>
                    To design a responsive, user-friendly interface accessible across desktop, tablet, and 
                    mobile devices.
                  </li>
                  <li>
                    To provide a phrase library of common expressions across supported languages for quick reference.
                  </li>
                  <li>
                    To evaluate the system's performance in terms of translation accuracy, response time, and 
                    user accessibility.
                  </li>
                </ol>
              </CardContent>
            </Card>

            {/* 1.4 Significance of the System */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1.4 Significance of the System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  The development of NaijaTTS carries significant implications across multiple domains:
                </p>
                <p>
                  <strong className="text-foreground">Educational Impact:</strong> The system can serve as a 
                  language learning tool, enabling students and adults to learn Nigerian languages with accurate 
                  pronunciation guides. This contributes to language preservation and promotes multilingual 
                  competence among Nigerians.
                </p>
                <p>
                  <strong className="text-foreground">Healthcare Accessibility:</strong> In medical settings, 
                  accurate translation can bridge communication gaps between healthcare providers and patients 
                  who speak different languages, potentially improving health outcomes through better understanding 
                  of symptoms, diagnoses, and treatment instructions.
                </p>
                <p>
                  <strong className="text-foreground">Commercial Applications:</strong> Businesses operating 
                  across linguistic regions can leverage the system to communicate with customers and partners, 
                  facilitating trade and economic integration.
                </p>
                <p>
                  <strong className="text-foreground">Disability Inclusion:</strong> The sign language feature 
                  represents a significant advancement in digital accessibility for deaf Nigerians, providing 
                  a tool that has been conspicuously absent from the technology landscape.
                </p>
                <p>
                  <strong className="text-foreground">Research Contribution:</strong> This work contributes to 
                  the growing body of research on AI applications for low-resource African languages, providing 
                  insights and methodologies applicable to other linguistic contexts.
                </p>
                <p>
                  <strong className="text-foreground">Cultural Preservation:</strong> By providing technological 
                  infrastructure for Nigerian languages, the system contributes to their continued relevance in 
                  the digital age, countering trends toward language extinction.
                </p>
              </CardContent>
            </Card>

            {/* 1.5 Scope of the System */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1.5 Scope of the System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  The scope of NaijaTTS encompasses the following functional and linguistic boundaries:
                </p>
                <p><strong className="text-foreground">Language Support:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-foreground">English:</strong> Serves as the source language for 
                    translation to Nigerian languages and the target language for reverse translations.
                  </li>
                  <li>
                    <strong className="text-foreground">Igbo:</strong> One of the three major Nigerian languages, 
                    spoken predominantly in the southeastern region. The system supports standard Igbo with 
                    pronunciation guides accounting for tonal variations.
                  </li>
                  <li>
                    <strong className="text-foreground">Hausa:</strong> The most widely spoken Nigerian language, 
                    prevalent in the northern region. Translation includes proper handling of Hausa's distinct 
                    phonological features.
                  </li>
                  <li>
                    <strong className="text-foreground">Yoruba:</strong> Spoken primarily in the southwestern 
                    region, with attention to the language's complex tonal system in pronunciation guides.
                  </li>
                  <li>
                    <strong className="text-foreground">Ikwere:</strong> An Igboid language spoken in Rivers State, 
                    included to extend support beyond the major three languages and demonstrate the system's 
                    adaptability.
                  </li>
                </ul>
                <p><strong className="text-foreground">Sign Language Support:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-foreground">Nigerian Sign Language (NSL):</strong> The primary sign 
                    language used by the Nigerian deaf community.
                  </li>
                  <li>
                    <strong className="text-foreground">American Sign Language (ASL):</strong> Included due to 
                    its international recognition and the availability of ASL-trained interpreters in Nigeria.
                  </li>
                </ul>
                <p><strong className="text-foreground">Functional Scope:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Real-time text-to-text translation</li>
                  <li>Speech-to-text input via device microphone</li>
                  <li>Text-to-speech output for translations</li>
                  <li>Animated sign language avatar rendering</li>
                  <li>Pronunciation guides with phonetic notation</li>
                  <li>Pre-built phrase library for common expressions</li>
                  <li>Dark/light theme support for visual accessibility</li>
                  <li>Responsive design for multiple device types</li>
                </ul>
                <p><strong className="text-foreground">Limitations:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Offline functionality is not supported; internet connectivity is required.</li>
                  <li>Dialectal variations within each language are not fully addressed.</li>
                  <li>The system does not support document or image translation.</li>
                  <li>Sign language input (recognition) is not implemented; only output (production) is available.</li>
                </ul>
              </CardContent>
            </Card>

            {/* 1.6 Definition of Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1.6 Definition of Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Artificial Intelligence (AI):</strong> The simulation of 
                  human intelligence processes by computer systems, including learning, reasoning, and self-correction 
                  (Russell & Norvig, 2021).
                </p>
                <p>
                  <strong className="text-foreground">Natural Language Processing (NLP):</strong> A subfield of 
                  AI concerned with the interactions between computers and human languages, enabling machines to 
                  read, understand, and derive meaning from human languages (Jurafsky & Martin, 2023).
                </p>
                <p>
                  <strong className="text-foreground">Machine Translation (MT):</strong> The use of software to 
                  translate text or speech from one language to another automatically (Koehn, 2020).
                </p>
                <p>
                  <strong className="text-foreground">Large Language Model (LLM):</strong> An AI model trained on 
                  vast amounts of text data, capable of understanding and generating human-like text across multiple 
                  languages and tasks (Brown et al., 2020).
                </p>
                <p>
                  <strong className="text-foreground">Text-to-Speech (TTS):</strong> Technology that converts 
                  written text into spoken audio output (Taylor, 2009).
                </p>
                <p>
                  <strong className="text-foreground">Speech-to-Text (STT):</strong> Technology that converts 
                  spoken words into written text, also known as speech recognition (Yu & Deng, 2015).
                </p>
                <p>
                  <strong className="text-foreground">Sign Language:</strong> A visual-gestural language used 
                  primarily by deaf communities, employing hand shapes, movements, and facial expressions to 
                  convey meaning (Sandler & Lillo-Martin, 2006).
                </p>
                <p>
                  <strong className="text-foreground">API (Application Programming Interface):</strong> A set of 
                  protocols and tools that allows different software applications to communicate with each other 
                  (Fielding, 2000).
                </p>
                <p>
                  <strong className="text-foreground">Edge Function:</strong> Serverless computing functions that 
                  run at the network edge, closer to users, enabling low-latency processing (Cloudflare, 2023).
                </p>
                <p>
                  <strong className="text-foreground">Low-Resource Language:</strong> A language with limited 
                  digital resources such as corpora, lexicons, and trained NLP models (Magueresse et al., 2020).
                </p>
              </CardContent>
            </Card>

            {/* 1.7 Organization of Study */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1.7 Organization of Study</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  This project documentation is organized into five chapters, each addressing distinct aspects 
                  of the research:
                </p>
                <p>
                  <strong className="text-foreground">Chapter One: Introduction</strong> provides the foundational 
                  context for the research, including the background of study, problem statement, aims and objectives, 
                  significance, scope, definition of terms, and the organizational structure of the documentation.
                </p>
                <p>
                  <strong className="text-foreground">Chapter Two: Literature Review</strong> examines existing 
                  research and technologies related to machine translation, Nigerian languages in computing, 
                  accessibility technologies, and sign language synthesis. The review identifies gaps in current 
                  knowledge and positions this research within the broader academic discourse.
                </p>
                <p>
                  <strong className="text-foreground">Chapter Three: Methodologies and Design</strong> details 
                  the technical approach adopted for system development, including the AI techniques employed, 
                  system architecture, functional and non-functional requirements, database design, algorithms, 
                  and design diagrams.
                </p>
                <p>
                  <strong className="text-foreground">Chapter Four: System Implementation</strong> presents the 
                  practical realization of the system design, covering the implementation environment, frontend 
                  and backend components, sample outputs, and instructions for system setup and execution.
                </p>
                <p>
                  <strong className="text-foreground">Chapter Five: Conclusion and Recommendation</strong> 
                  summarizes the research findings, discusses the implications of the work, and offers 
                  recommendations for future research and practical applications.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      <Separator className="my-8" />

      {/* Chapter Two: Literature Review */}
      <section className="px-4 py-8 bg-muted/30">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Chapter Two</h2>
              <p className="text-muted-foreground">Literature Review</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* 2.1 Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2.1 Introduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  This chapter presents a comprehensive review of existing literature relevant to the development 
                  of an AI-enabled translation and accessibility support system for Nigerian languages. The review 
                  encompasses theoretical frameworks, technological advancements, and empirical studies across 
                  several interconnected domains: machine translation, natural language processing for African 
                  languages, speech synthesis and recognition, sign language technologies, and web accessibility. 
                  By examining the current state of knowledge and identifying research gaps, this review establishes 
                  the scholarly foundation upon which NaijaTTS is built.
                </p>
              </CardContent>
            </Card>

            {/* 2.2 Evolution of Machine Translation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2.2 Evolution of Machine Translation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Machine translation has undergone significant evolution since its inception in the mid-20th 
                  century. Early rule-based machine translation (RBMT) systems relied on linguistic rules and 
                  bilingual dictionaries to transform text between languages (Hutchins, 2007). These systems, 
                  while theoretically grounded, proved inadequate for handling the complexity and ambiguity 
                  inherent in natural languages, particularly for language pairs with significant structural 
                  differences.
                </p>
                <p>
                  The statistical machine translation (SMT) paradigm, emerging in the 1990s, shifted focus from 
                  linguistic rules to probabilistic models learned from parallel corpora (Brown et al., 1990). 
                  SMT systems demonstrated improved handling of linguistic variation but required substantial 
                  aligned training data—a requirement that posed challenges for low-resource languages like 
                  Nigerian languages, which lack extensive parallel corpora.
                </p>
                <p>
                  The advent of neural machine translation (NMT) represented a paradigm shift in the field. 
                  Sutskever, Vinyals, and Le (2014) introduced the sequence-to-sequence architecture, enabling 
                  end-to-end learning of translation mappings. The subsequent development of the Transformer 
                  architecture by Vaswani et al. (2017) further revolutionized NMT, introducing self-attention 
                  mechanisms that captured long-range dependencies in text more effectively than recurrent 
                  neural networks.
                </p>
                <p>
                  Contemporary NMT systems, particularly those built on Large Language Models (LLMs), demonstrate 
                  remarkable translation capabilities even for language pairs with limited parallel training data. 
                  Models such as Google's mT5 (Xue et al., 2021), Meta's NLLB-200 (Costa-jussà et al., 2022), 
                  and the Gemini series (Google, 2024) have shown promising results for Nigerian languages, 
                  leveraging cross-lingual transfer learning to bootstrap translation quality for low-resource 
                  language pairs.
                </p>
                <p>
                  However, as Adelani et al. (2022) observed in their comprehensive evaluation of translation 
                  systems for African languages, even state-of-the-art models exhibit quality degradation when 
                  handling Nigerian languages compared to high-resource European languages. Common issues include 
                  incorrect tonal representation, semantic drift in complex sentences, and inadequate handling 
                  of cultural concepts without direct equivalents in English.
                </p>
              </CardContent>
            </Card>

            {/* 2.3 Nigerian Languages in NLP */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2.3 Nigerian Languages in Natural Language Processing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Nigerian languages present unique challenges and opportunities for NLP research. Igbo, Hausa, 
                  and Yoruba—the three major Nigerian languages—each possess distinct linguistic features that 
                  require specialized handling in computational systems.
                </p>
                <p>
                  <strong className="text-foreground">Igbo</strong> is a tonal language with an elaborate noun 
                  class system and complex verb morphology. Onyenwe et al. (2018) developed one of the first 
                  comprehensive morphological analyzers for Igbo, highlighting the challenges posed by the 
                  language's rich agglutinative structure. Subsequent work by Ezeani et al. (2020) on Igbo 
                  diacritics restoration demonstrated the importance of proper tonal marking for accurate 
                  text processing and machine translation.
                </p>
                <p>
                  <strong className="text-foreground">Hausa</strong>, a Chadic language written in both Latin 
                  (Boko) and Arabic (Ajami) scripts, has received relatively more computational attention due 
                  to its large speaker population. Research by Schlippe et al. (2012) on Hausa speech recognition 
                  laid groundwork for subsequent speech-based applications. Recent developments include the 
                  Hausa-English parallel corpus by Koehn and Knowles (2017), which enabled improved MT performance.
                </p>
                <p>
                  <strong className="text-foreground">Yoruba</strong> presents challenges related to its 
                  extensive tonal system, with three distinct tones affecting lexical and grammatical meaning. 
                  Asahiah et al. (2017) documented the difficulties of computational processing for Yoruba, 
                  particularly in text-to-speech synthesis where incorrect tonal rendering significantly 
                  impacts intelligibility. The development of the Global Voices Yoruba corpus (De Pauw et al., 
                  2012) provided resources for supervised learning approaches.
                </p>
                <p>
                  <strong className="text-foreground">Ikwere</strong> and other minority Nigerian languages 
                  have received minimal computational attention. As an Igboid language, Ikwere shares some 
                  structural features with Igbo but possesses distinct phonological and morphological 
                  characteristics (Oha & Ugorji, 2009). The lack of digital resources for Ikwere exemplifies 
                  the broader challenge of extending NLP support beyond the major three Nigerian languages.
                </p>
                <p>
                  The Masakhane initiative (Nekoto et al., 2020) represents a significant collaborative effort 
                  to address the digital divide for African languages. This grassroots movement has produced 
                  benchmark datasets and baseline models for multiple Nigerian languages, democratizing access 
                  to NLP resources and establishing performance baselines for translation tasks.
                </p>
              </CardContent>
            </Card>

            {/* 2.4 Speech Technologies for African Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2.4 Speech Technologies for African Languages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Speech technologies—comprising both automatic speech recognition (ASR) and text-to-speech 
                  (TTS) synthesis—are essential components of accessible translation systems. For Nigerian 
                  languages, these technologies face unique challenges related to tonal representation, 
                  dialectal variation, and limited training data.
                </p>
                <p>
                  <strong className="text-foreground">Automatic Speech Recognition:</strong> Research in ASR 
                  for Nigerian languages has progressed through several stages. Early work focused on isolated 
                  word recognition, with Oyelaran et al. (2008) demonstrating viable approaches for Yoruba 
                  digits and commands. More recent studies have leveraged transfer learning from high-resource 
                  languages to bootstrap ASR models for Nigerian languages (Conneau et al., 2021).
                </p>
                <p>
                  The Wav2Vec 2.0 architecture (Baevski et al., 2020) and its multilingual variant, XLS-R 
                  (Conneau et al., 2022), have demonstrated particular promise for low-resource ASR. These 
                  self-supervised learning approaches enable effective model training with limited labeled 
                  speech data, addressing a key bottleneck for Nigerian language ASR development.
                </p>
                <p>
                  <strong className="text-foreground">Text-to-Speech Synthesis:</strong> TTS for Nigerian 
                  languages must accurately reproduce tonal patterns to ensure intelligibility. Concatenative 
                  synthesis approaches, while historically dominant, proved inadequate for capturing the 
                  nuanced tonal dynamics of Nigerian languages (Akinwande & Liberman, 2019).
                </p>
                <p>
                  Neural TTS architectures, particularly Tacotron 2 (Shen et al., 2018) and variants, have 
                  improved naturalness in synthesized speech. However, training these data-hungry models for 
                  Nigerian languages requires substantial recorded speech corpora—a resource that remains 
                  scarce. The Common Voice project (Ardila et al., 2020) has made strides in collecting 
                  crowdsourced speech data for some Nigerian languages, but coverage remains incomplete.
                </p>
                <p>
                  Recent developments in multilingual TTS, such as the Massively Multilingual Speech (MMS) 
                  project by Meta (Pratap et al., 2024), have extended TTS capabilities to over 1,000 languages, 
                  including several Nigerian languages. These models leverage shared representations across 
                  languages to achieve reasonable synthesis quality even for low-resource languages.
                </p>
              </CardContent>
            </Card>

            {/* 2.5 Sign Language Technologies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2.5 Sign Language Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Sign language technologies encompass both recognition (converting signed gestures to text/speech) 
                  and production (synthesizing sign language output). This research focuses on sign language 
                  production, specifically the animation of an avatar to render signs corresponding to translated 
                  text.
                </p>
                <p>
                  <strong className="text-foreground">Sign Language Synthesis:</strong> The synthesis of sign 
                  language involves complex challenges beyond simple gesture reproduction. Sign languages possess 
                  grammatical structures distinct from spoken languages, incorporating simultaneous use of hand 
                  shape, location, movement, orientation, and non-manual markers such as facial expressions 
                  (Stokoe, 2005).
                </p>
                <p>
                  Avatar-based sign language synthesis has been pursued through several approaches. Motion 
                  capture-based systems record human signers and replay captured movements (Elliot et al., 
                  2008), achieving high fidelity but requiring extensive recording sessions for each sign. 
                  Procedural synthesis approaches generate animations from linguistic descriptions of signs 
                  (Kipp et al., 2011), offering greater flexibility at the cost of naturalness.
                </p>
                <p>
                  Recent work has applied deep learning to sign language synthesis. Stoll et al. (2020) 
                  demonstrated the use of generative adversarial networks (GANs) for synthesizing realistic 
                  sign language videos from gloss sequences. Saunders et al. (2022) extended this work with 
                  transformer-based models for continuous sign language generation, achieving improved temporal 
                  coherence in generated sequences.
                </p>
                <p>
                  <strong className="text-foreground">Nigerian Sign Language (NSL):</strong> Research on NSL 
                  remains limited compared to American Sign Language (ASL) and other major sign languages. 
                  Okpaku and Onyedike (2019) documented the lexical structure of NSL, noting both similarities 
                  to and differences from ASL. The Nigerian National Association of the Deaf (NNAD) has 
                  advocated for increased recognition and computational resources for NSL, but technological 
                  implementations remain rare.
                </p>
                <p>
                  This research addresses the absence of NSL synthesis tools by implementing an avatar capable 
                  of rendering signs based on AI-generated signing instructions. While the avatar employs 
                  simplified 2D representations rather than photorealistic 3D animation, it provides a 
                  foundation for accessible sign language output that can be enhanced in future iterations.
                </p>
              </CardContent>
            </Card>

            {/* 2.6 Web Accessibility and Universal Design */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2.6 Web Accessibility and Universal Design</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Web accessibility ensures that digital content and interfaces are usable by people with 
                  diverse abilities, including visual, auditory, motor, and cognitive impairments. The World 
                  Wide Web Consortium's Web Content Accessibility Guidelines (WCAG) 2.1 provide the authoritative 
                  framework for accessible web development (W3C, 2018).
                </p>
                <p>
                  Universal Design principles, as articulated by Mace et al. (1991), advocate for designing 
                  products usable by all people without need for adaptation. In the context of translation 
                  applications, this implies supporting multiple input modalities (text, voice), output 
                  formats (text, audio, sign language), and interface customization (theme selection, 
                  responsive layouts).
                </p>
                <p>
                  Research on accessible translation interfaces has highlighted several best practices. 
                  Trewin et al. (2010) demonstrated the importance of keyboard navigability for users 
                  unable to use pointing devices. Henry and Arch (2019) emphasized the role of semantic 
                  HTML and ARIA attributes in making complex interactive applications accessible to screen 
                  reader users.
                </p>
                <p>
                  The integration of dark mode support in NaijaTTS responds to documented benefits for users 
                  with photosensitivity and visual fatigue (Eisenfeld, 2020). Responsive design ensures 
                  usability across device types, acknowledging that many Nigerians access the internet 
                  primarily through mobile devices (GSMA, 2023).
                </p>
              </CardContent>
            </Card>

            {/* 2.7 Large Language Models in Translation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2.7 Large Language Models in Translation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Large Language Models (LLMs) have emerged as powerful tools for various NLP tasks, including 
                  machine translation. Unlike traditional NMT systems trained specifically for translation, 
                  LLMs acquire translation capabilities as an emergent property of their training on diverse 
                  multilingual data (Brown et al., 2020).
                </p>
                <p>
                  <strong className="text-foreground">Zero-shot and Few-shot Translation:</strong> A distinctive 
                  capability of LLMs is performing translation without explicit translation training data 
                  (zero-shot) or with only a few examples (few-shot). Vilar et al. (2023) demonstrated that 
                  LLMs such as GPT-4 and Gemini achieve competitive translation quality for many language pairs 
                  in zero-shot settings, though performance varies significantly across languages.
                </p>
                <p>
                  <strong className="text-foreground">Contextual Understanding:</strong> LLMs excel at 
                  capturing contextual nuances that challenge traditional MT systems. Their ability to 
                  consider broader discourse context enables more accurate handling of pronouns, idioms, 
                  and culturally specific expressions (Hendy et al., 2023).
                </p>
                <p>
                  <strong className="text-foreground">Prompt Engineering:</strong> The performance of LLMs 
                  in translation tasks can be significantly influenced by prompt design. Research by 
                  Gao et al. (2023) showed that carefully crafted prompts specifying target style, 
                  formality level, and domain can improve translation quality. For Nigerian languages, 
                  prompts that acknowledge the tonal nature of the target language and request appropriate 
                  diacritical marking have shown improved output quality.
                </p>
                <p>
                  <strong className="text-foreground">Limitations:</strong> Despite their capabilities, 
                  LLMs exhibit known limitations relevant to this application. Hallucination—generating 
                  plausible but incorrect content—poses risks in translation contexts (Ji et al., 2023). 
                  Additionally, performance for Nigerian languages, while improved over earlier models, 
                  still lags behind high-resource languages (Ahia et al., 2023).
                </p>
              </CardContent>
            </Card>

            {/* 2.8 Gap in Literature */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2.8 Gap in Literature</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  The literature review reveals several gaps that NaijaTTS addresses:
                </p>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong className="text-foreground">Integrated Multimodal Translation:</strong> While 
                    separate research has addressed text translation, speech interfaces, and sign language 
                    synthesis, no existing system integrates all three modalities for Nigerian languages in 
                    a unified platform.
                  </li>
                  <li>
                    <strong className="text-foreground">Pronunciation Support:</strong> Commercial translation 
                    tools provide text output without pronunciation guidance, limiting their utility for 
                    spoken communication and language learning.
                  </li>
                  <li>
                    <strong className="text-foreground">Sign Language Output for Nigerian Languages:</strong> 
                    No accessible tool provides sign language translation output for Nigerian languages or 
                    in the Nigerian context.
                  </li>
                  <li>
                    <strong className="text-foreground">Support for Minority Nigerian Languages:</strong> 
                    Research and tools focus predominantly on the major three languages, neglecting 
                    languages like Ikwere that serve substantial populations.
                  </li>
                  <li>
                    <strong className="text-foreground">User-Centered Accessible Design:</strong> Many 
                    academic prototypes for Nigerian language NLP lack the user experience considerations 
                    necessary for practical adoption.
                  </li>
                </ol>
                <p>
                  NaijaTTS addresses these gaps by implementing a comprehensive, accessible, and 
                  user-friendly translation system that integrates text, speech, and sign language 
                  modalities for Nigerian languages.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      <Separator className="my-8" />

      {/* Chapter Three: Methodologies and Design */}
      <section className="px-4 py-8">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Code className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Chapter Three</h2>
              <p className="text-muted-foreground">Methodologies and Design</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* 3.1 Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3.1 Introduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  This chapter presents the methodological framework and technical design of NaijaTTS. 
                  It details the system architecture, the AI techniques employed, design tools utilized, 
                  and the comprehensive specifications that guided the development process. The chapter 
                  provides both high-level architectural views and detailed component specifications to 
                  ensure reproducibility and clarity of the implementation approach.
                </p>
              </CardContent>
            </Card>

            {/* 3.2 The Proposed System */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3.2 The Proposed System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NaijaTTS is a web-based application designed to provide real-time translation services 
                  between English and Nigerian languages with integrated accessibility features. The system 
                  follows a client-server architecture where the frontend handles user interactions and 
                  presentation, while backend services process translation requests and AI model interactions.
                </p>
                <p>
                  The proposed system addresses the identified problems through the following key components:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-foreground">Translation Engine:</strong> Leverages Large Language 
                    Models to perform bidirectional translation between English and target Nigerian languages.
                  </li>
                  <li>
                    <strong className="text-foreground">Pronunciation Module:</strong> Generates phonetic 
                    transcriptions and audio output for translated text.
                  </li>
                  <li>
                    <strong className="text-foreground">Speech Interface:</strong> Enables voice input for 
                    translation requests and audio playback of translations.
                  </li>
                  <li>
                    <strong className="text-foreground">Sign Language Renderer:</strong> Produces animated 
                    sign language output through a 2D avatar system.
                  </li>
                  <li>
                    <strong className="text-foreground">Phrase Library:</strong> Provides a curated collection 
                    of common phrases across supported languages for quick reference.
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* 3.3 AI Technique */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3.3 The Proposed System's Artificial Intelligence Technique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NaijaTTS employs several AI techniques to deliver its functionality:
                </p>
                <p>
                  <strong className="text-foreground">Large Language Model Integration:</strong> The system 
                  utilizes Google's Gemini 2.5 Flash model via API integration. This model was selected for 
                  its strong multilingual capabilities, including demonstrated support for Nigerian languages, 
                  and its favorable balance of response quality and latency suitable for real-time applications.
                </p>
                <p>
                  <strong className="text-foreground">Prompt Engineering:</strong> Carefully designed prompts 
                  guide the LLM to produce structured outputs. For translation, prompts specify the source 
                  and target languages, request appropriate tonal marking, and define the expected output 
                  format including pronunciation guides. For sign language conversion, prompts specify the 
                  sign language type (NSL/ASL) and request structured gesture data including hand shapes, 
                  positions, movements, and facial expressions.
                </p>
                <p>
                  <strong className="text-foreground">Speech Synthesis:</strong> The Web Speech API provides 
                  text-to-speech capabilities, with voice selection optimized for the target language where 
                  language-specific voices are available.
                </p>
                <p>
                  <strong className="text-foreground">Speech Recognition:</strong> The Web Speech API's 
                  SpeechRecognition interface enables voice input, with language settings configured to 
                  match the source language for improved recognition accuracy.
                </p>
              </CardContent>
            </Card>

            {/* 3.4 System Design Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3.4 System Design Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>The following tools and technologies were employed in designing and implementing NaijaTTS:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">React.js 18:</strong> Frontend JavaScript library for building user interfaces</li>
                  <li><strong className="text-foreground">TypeScript:</strong> Typed superset of JavaScript for improved code reliability</li>
                  <li><strong className="text-foreground">Vite:</strong> Modern build tool for fast development and optimized production builds</li>
                  <li><strong className="text-foreground">Tailwind CSS:</strong> Utility-first CSS framework for responsive styling</li>
                  <li><strong className="text-foreground">Framer Motion:</strong> Animation library for smooth UI transitions</li>
                  <li><strong className="text-foreground">Supabase Edge Functions:</strong> Serverless backend for API handling</li>
                  <li><strong className="text-foreground">Gemini API:</strong> Google's LLM for translation and NLP tasks</li>
                  <li><strong className="text-foreground">shadcn/ui:</strong> Accessible component library built on Radix UI</li>
                </ul>
              </CardContent>
            </Card>

            {/* 3.5 Functional Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3.5 Functional Requirements of the Proposed System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <ol className="list-decimal pl-6 space-y-2">
                  <li>The system shall translate text from English to Igbo, Hausa, Yoruba, and Ikwere.</li>
                  <li>The system shall translate text from Nigerian languages to English.</li>
                  <li>The system shall provide pronunciation guides for translations.</li>
                  <li>The system shall synthesize audio output for translated text.</li>
                  <li>The system shall accept voice input for translation requests.</li>
                  <li>The system shall generate sign language animations for translations.</li>
                  <li>The system shall support both NSL and ASL sign language types.</li>
                  <li>The system shall provide a searchable phrase library.</li>
                  <li>The system shall allow users to toggle between light and dark themes.</li>
                  <li>The system shall adapt its layout to different screen sizes.</li>
                </ol>
              </CardContent>
            </Card>

            {/* 3.6 Non-Functional Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3.6 Non-Functional Requirements of the Proposed System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Performance:</strong> Translation responses shall be delivered within 3 seconds under normal network conditions.</li>
                  <li><strong className="text-foreground">Availability:</strong> The system shall maintain 99% uptime during operational hours.</li>
                  <li><strong className="text-foreground">Usability:</strong> The interface shall be intuitive, requiring no training for basic translation tasks.</li>
                  <li><strong className="text-foreground">Accessibility:</strong> The system shall comply with WCAG 2.1 Level AA guidelines.</li>
                  <li><strong className="text-foreground">Scalability:</strong> The serverless architecture shall scale automatically to handle concurrent users.</li>
                  <li><strong className="text-foreground">Security:</strong> API communications shall use HTTPS encryption.</li>
                  <li><strong className="text-foreground">Compatibility:</strong> The system shall function on modern browsers (Chrome, Firefox, Safari, Edge).</li>
                </ul>
              </CardContent>
            </Card>

            {/* 3.7 System Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3.7 Architecture of the Proposed System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NaijaTTS employs a three-tier architecture consisting of:
                </p>
                <p>
                  <strong className="text-foreground">Presentation Layer:</strong> A single-page React application 
                  that handles user interface rendering, state management, and user interactions. This layer 
                  communicates with the application layer via RESTful API calls.
                </p>
                <p>
                  <strong className="text-foreground">Application Layer:</strong> Supabase Edge Functions that 
                  process translation requests, interact with the Gemini API, and return structured responses. 
                  Edge functions provide low-latency serverless execution.
                </p>
                <p>
                  <strong className="text-foreground">AI Services Layer:</strong> External AI services including 
                  Google's Gemini API for language processing and the browser's Web Speech API for speech 
                  synthesis and recognition.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
{`┌─────────────────────────────────────────────────┐
│              Presentation Layer                  │
│  ┌────────────────────────────────────────────┐ │
│  │           React Application                 │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────────┐   │ │
│  │  │Translate│ │Phrases  │ │Documentation│   │ │
│  │  │  Page   │ │  Page   │ │    Page     │   │ │
│  │  └─────────┘ └─────────┘ └─────────────┘   │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                      │ HTTPS
                      ▼
┌─────────────────────────────────────────────────┐
│             Application Layer                    │
│  ┌─────────────────────────────────────────────┐│
│  │         Supabase Edge Functions              ││
│  │  ┌───────────┐ ┌─────────────┐ ┌──────────┐ ││
│  │  │ translate │ │pronunciation│ │sign-lang │ ││
│  │  └───────────┘ └─────────────┘ └──────────┘ ││
│  └─────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
                      │ API
                      ▼
┌─────────────────────────────────────────────────┐
│              AI Services Layer                   │
│  ┌─────────────────┐  ┌────────────────────────┐│
│  │   Gemini API    │  │    Web Speech API      ││
│  │  (Translation)  │  │  (TTS/Recognition)     ││
│  └─────────────────┘  └────────────────────────┘│
└─────────────────────────────────────────────────┘`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* 3.8 Input/Output Design */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3.8 Input and Output Design of the Proposed System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p><strong className="text-foreground">Input Design:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Text input field for typing translation queries</li>
                  <li>Voice input button for spoken translation requests</li>
                  <li>Language selection controls (source and target)</li>
                  <li>Sign language type toggle (NSL/ASL)</li>
                  <li>Theme toggle (light/dark)</li>
                  <li>Phrase library search field</li>
                </ul>
                <p><strong className="text-foreground">Output Design:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Translated text display with appropriate formatting</li>
                  <li>Pronunciation guide with phonetic notation</li>
                  <li>Audio playback controls for spoken output</li>
                  <li>Animated sign language avatar display</li>
                  <li>Sign sequence indicators showing current gesture</li>
                  <li>Phrase library cards with expandable translations</li>
                </ul>
              </CardContent>
            </Card>

            {/* 3.9 Database Design */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3.9 Database Design of the Proposed System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  The current implementation of NaijaTTS operates without persistent database storage, 
                  utilizing client-side state management and real-time API calls. This design decision 
                  reflects the stateless nature of translation requests. However, future enhancements 
                  may incorporate database storage for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>User preferences and translation history</li>
                  <li>Custom phrase libraries</li>
                  <li>Cached translations for improved performance</li>
                  <li>Analytics and usage statistics</li>
                </ul>
                <p>
                  The phrase library data is currently stored as a static data structure within the 
                  application codebase (src/data/phraseLibrary.ts), enabling efficient access without 
                  network requests.
                </p>
              </CardContent>
            </Card>

            {/* 3.10 Algorithm */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3.10 Algorithm of the Proposed System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p><strong className="text-foreground">Translation Algorithm:</strong></p>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
{`ALGORITHM TranslateText
INPUT: sourceText, sourceLanguage, targetLanguage
OUTPUT: translatedText, pronunciation, audioURL

BEGIN
  1. VALIDATE sourceText is not empty
  2. CONSTRUCT prompt with sourceLanguage and targetLanguage
  3. CALL Gemini API with constructed prompt
  4. PARSE response to extract translation and pronunciation
  5. IF targetLanguage requires pronunciation
     5.1. EXTRACT phonetic notation from response
     5.2. GENERATE audio using Web Speech API
  6. RETURN translatedText, pronunciation, audioURL
END`}
                  </pre>
                </div>
                <p className="mt-4"><strong className="text-foreground">Sign Language Generation Algorithm:</strong></p>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
{`ALGORITHM GenerateSignLanguage
INPUT: text, sourceLanguage, signLanguageType
OUTPUT: signData (array of gestures)

BEGIN
  1. VALIDATE text is not empty
  2. CONSTRUCT prompt specifying signLanguageType (NSL/ASL)
  3. CALL Gemini API with sign language conversion prompt
  4. PARSE response to extract structured sign data
  5. FOR each sign in response
     5.1. EXTRACT handShape, position, movement, expression
     5.2. NORMALIZE coordinates to avatar coordinate system
  6. RETURN signData array
END`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* 3.11 Flowchart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3.11 Flowchart of the Proposed System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
{`                    ┌─────────┐
                    │  START  │
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │  User   │
                    │ Input   │
                    └────┬────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
         ┌────────┐ ┌────────┐ ┌────────┐
         │  Text  │ │  Voice │ │ Phrase │
         │ Input  │ │ Input  │ │ Select │
         └───┬────┘ └───┬────┘ └───┬────┘
              └──────────┼──────────┘
                         │
                    ┌────▼────┐
                    │ Process │
                    │ Request │
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │  Call   │
                    │ AI API  │
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │  Parse  │
                    │Response │
                    └────┬────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
         ┌────────┐ ┌────────┐ ┌────────┐
         │Display │ │ Play   │ │Animate │
         │ Text   │ │ Audio  │ │ Signs  │
         └───┬────┘ └───┬────┘ └───┬────┘
              └──────────┼──────────┘
                         │
                    ┌────▼────┐
                    │   END   │
                    └─────────┘`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* 3.12 Use Case Diagram */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3.12 Use Case Diagram</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
{`                         ┌──────────────────────────────────┐
                         │          NaijaTTS System          │
                         │                                   │
     ┌──────┐            │    ┌──────────────────────┐      │
     │      │────────────┼───▶│   Translate Text     │      │
     │      │            │    └──────────────────────┘      │
     │      │            │                                   │
     │      │            │    ┌──────────────────────┐      │
     │      │────────────┼───▶│   Voice Input        │      │
     │      │            │    └──────────────────────┘      │
     │ User │            │                                   │
     │      │            │    ┌──────────────────────┐      │
     │      │────────────┼───▶│   Play Pronunciation │      │
     │      │            │    └──────────────────────┘      │
     │      │            │                                   │
     │      │            │    ┌──────────────────────┐      │
     │      │────────────┼───▶│   View Sign Language │      │
     │      │            │    └──────────────────────┘      │
     │      │            │                                   │
     │      │            │    ┌──────────────────────┐      │
     │      │────────────┼───▶│   Browse Phrases     │      │
     │      │            │    └──────────────────────┘      │
     │      │            │                                   │
     │      │            │    ┌──────────────────────┐      │
     │      │────────────┼───▶│   Toggle Theme       │      │
     └──────┘            │    └──────────────────────┘      │
                         │                                   │
                         └──────────────────────────────────┘`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      <Separator className="my-8" />

      {/* Chapter Four: Implementation */}
      <section className="px-4 py-8 bg-muted/30">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Chapter Four</h2>
              <p className="text-muted-foreground">System Implementation</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* 4.1 System Implementation and Implementation Results */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">4.1 System Implementation and Implementation Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NaijaTTS was implemented as a fully local web application that runs end-to-end from a
                  developer machine. The system was designed and built on Windows 11 using Visual Studio
                  Code, Node.js 18 LTS, and the npm package manager. The frontend bundle is produced and
                  served locally by Vite (using the SWC-powered React plugin) on
                  <code> http://localhost:5173</code>, while the application's AI-backed endpoints are
                  invoked through Supabase Edge Functions for the AI-powered translation, pronunciation,
                  and sign-language generation calls. No third-party hosting platform was used during
                  development or for the final submission build &mdash; the entire system is portable and
                  reproducible from the project folder alone.
                </p>
                <p>
                  The implementation followed an iterative, feature-driven methodology. Each capability
                  was developed in a vertical slice: a UI component, a custom React hook to encapsulate
                  its behavior, and (where required) a data file or edge-function call to back it. Core
                  translation was built first, followed by speech input and output, then the
                  pronunciation guide, then sign language animation, and finally the supporting features
                  such as the phrase library, theming, accessibility polish, and avatar recording. This
                  ordering kept the translation pipeline &mdash; the heart of the project &mdash; stable
                  before any auxiliary features were layered on top.
                </p>
                <p><strong className="text-foreground">Architectural Outcome</strong></p>
                <p>
                  The resulting system is a single-page application written in TypeScript and React 18,
                  styled with Tailwind CSS and a custom shadcn/ui component layer, and animated with
                  Framer Motion. Application logic is organised into focused modules:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-foreground">Pages</strong> ([src/pages/](src/pages/)) host
                    the four primary routes: the translation workspace
                    ([TranslatePage.tsx](src/pages/TranslatePage.tsx)), the phrase library
                    ([PhrasesPage.tsx](src/pages/PhrasesPage.tsx)), the about page
                    ([AboutPage.tsx](src/pages/AboutPage.tsx)), and this documentation page
                    ([DocumentationPage.tsx](src/pages/DocumentationPage.tsx)).
                  </li>
                  <li>
                    <strong className="text-foreground">Feature components</strong>
                    ([src/components/](src/components/)) encapsulate the translation panel, language
                    selector, voice input button, pronunciation guide, sign-language panel, floating
                    avatar, and theme toggle.
                  </li>
                  <li>
                    <strong className="text-foreground">Custom hooks</strong>
                    ([src/hooks/](src/hooks/)) own every async or stateful concern:
                    [useTranslation.ts](src/hooks/useTranslation.ts) for translation,
                    [useSpeechRecognition.ts](src/hooks/useSpeechRecognition.ts) for voice input,
                    [useSpeechSynthesis.ts](src/hooks/useSpeechSynthesis.ts) and
                    [useElevenLabsTTS.ts](src/hooks/useElevenLabsTTS.ts) for spoken output,
                    [usePronunciation.ts](src/hooks/usePronunciation.ts) for phonetic guides,
                    [useSignLanguage.ts](src/hooks/useSignLanguage.ts) for gesture data, and
                    [useAvatarRecorder.ts](src/hooks/useAvatarRecorder.ts) for capturing avatar
                    animations as GIFs.
                  </li>
                  <li>
                    <strong className="text-foreground">Static data</strong>
                    ([src/data/](src/data/)) ships a curated
                    [phraseLibrary.ts](src/data/phraseLibrary.ts) of common phrases, an
                    [nslDictionary.ts](src/data/nslDictionary.ts) of Nigerian Sign Language gestures, and
                    [avatarHandShapes.ts](src/data/avatarHandShapes.ts) /
                    [avatarExpressions.ts](src/data/avatarExpressions.ts) that drive the SVG avatar.
                  </li>
                  <li>
                    <strong className="text-foreground">Context providers</strong>
                    ([src/contexts/AvatarContext.tsx](src/contexts/AvatarContext.tsx)) keep the floating
                    sign-language avatar in sync with the active translation across routes.
                  </li>
                </ul>
                <p><strong className="text-foreground">Implementation Results</strong></p>
                <p>
                  All target features specified in Chapter Three were implemented and verified manually
                  on the Windows development environment. Concretely:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    <strong className="text-foreground">Bidirectional translation</strong> works between
                    English and the four supported Nigerian languages (Igbo, Hausa, Yoruba, and Ikwere)
                    as well as between any two Nigerian languages. Curated phrases resolve instantly
                    from the local phrase library, and anything outside that set is debounced and
                    forwarded to the AI translation endpoint with a 500 ms typing-pause window so the
                    UI translates as the user types without flooding the network.
                  </li>
                  <li>
                    <strong className="text-foreground">Speech-to-text input</strong> uses the browser's
                    Web Speech API (<code>SpeechRecognition</code> / <code>webkitSpeechRecognition</code>)
                    with locale-aware language tags &mdash; <code>en-NG</code>, <code>ig-NG</code>,
                    <code> ha-NG</code>, <code>yo-NG</code> &mdash; so that Nigerian-accented English and
                    the supported indigenous languages are recognised more reliably than under the
                    default <code>en-US</code> locale.
                  </li>
                  <li>
                    <strong className="text-foreground">Text-to-speech output</strong> works through two
                    paths. The primary path uses the browser's <code>speechSynthesis</code> API with a
                    voice-selection routine that prefers native African locale voices and falls back to
                    Nigerian English (<code>en-NG</code>) before generic English. A higher-quality
                    optional path routes through ElevenLabs for clearer Nigerian-language pronunciation
                    when the user enables it.
                  </li>
                  <li>
                    <strong className="text-foreground">Pronunciation guides</strong> are produced for
                    every Nigerian-language output, providing IPA notation, an approximate English-friendly
                    phonetic spelling, syllable separation, tone markers, and pronunciation tips.
                  </li>
                  <li>
                    <strong className="text-foreground">Sign language animation</strong> resolves first
                    against the local NSL dictionary for instant, linguistically reviewed gestures, and
                    falls back to AI-generated gesture data for any phrase the dictionary does not cover.
                    Both Nigerian Sign Language (NSL) and American Sign Language (ASL) outputs are
                    supported, rendered through an SVG avatar with hand shapes, body and head movement,
                    and facial-expression cues.
                  </li>
                  <li>
                    <strong className="text-foreground">Floating avatar</strong> can be detached from
                    the translation panel and dragged anywhere on the screen, staying synchronised with
                    audio playback through a shared React context so users can keep the signer visible
                    while they continue typing or scrolling.
                  </li>
                  <li>
                    <strong className="text-foreground">Phrase library</strong> exposes the local
                    curated phrase set as a searchable, category-filtered reference page with one-click
                    playback for any supported language.
                  </li>
                  <li>
                    <strong className="text-foreground">Accessibility</strong> features include a
                    full-document dark/light theme, responsive layouts down to 320 px, a bottom mobile
                    navigation bar with thumb-reachable targets, focus-visible keyboard navigation, and
                    aria-aware Radix UI primitives.
                  </li>
                </ol>
                <p>
                  Observed performance on the local Windows build: cold first-contentful-paint under one
                  second on the Vite dev server, phrase-library translations returning in &lt; 50 ms,
                  AI-backed translations completing in roughly 1.5 &ndash; 3 seconds, and sign-language
                  resolution effectively instant for dictionary hits and 2 &ndash; 4 seconds for the AI
                  fallback.
                </p>
              </CardContent>
            </Card>

            {/* 4.2 Sample Outputs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">4.2 Sample Outputs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  This section walks through the principal output interfaces of NaijaTTS, describing
                  what each one displays and the role it plays in the user's workflow. The figures
                  referenced below correspond to the live screens of the running application.
                </p>

                <p><strong className="text-foreground">Figure 4.2.1 &mdash; Translation Workspace</strong></p>
                <p>
                  The main route ([TranslatePage.tsx](src/pages/TranslatePage.tsx)) presents a two-pane
                  workspace. The left pane is a source-text area with a microphone button for voice
                  input; the right pane shows the translated text with copy, speak, and pronunciation
                  controls. Above the panes sits the bidirectional language selector with a swap
                  button. A live status pill at the top of the page reads "Real-time AI Translation"
                  when translating from English, and switches to "Voice-first Translation" when a
                  Nigerian language is the source &mdash; cueing the user to use the microphone.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>Input (English):</strong> "Good morning, how are you?"</p>
                  <p><strong>Translation (Igbo):</strong> "Ụtụtụ ọma, kedu ka ị mere?"</p>
                  <p><strong>Translation (Hausa):</strong> "Ina kwana, yaya kake?"</p>
                  <p><strong>Translation (Yoruba):</strong> "Ẹ káàárọ̀, báwo ni?"</p>
                  <p><strong>Translation (Ikwere):</strong> "Ụtụtụ ọma, kedụ ka ị mere?"</p>
                  <p className="text-xs italic mt-2">Source: phrase-library hit (instant, no network call).</p>
                </div>

                <p><strong className="text-foreground">Figure 4.2.2 &mdash; Language Selector</strong></p>
                <p>
                  The [LanguageSelector.tsx](src/components/LanguageSelector.tsx) component renders
                  English alongside the four Nigerian languages as selectable chips for both the source
                  and target. Selecting a language that is already chosen on the opposite side triggers
                  an automatic swap, which prevents the invalid "same source and target" state. A
                  dedicated swap button reverses the direction in a single tap.
                </p>

                <p><strong className="text-foreground">Figure 4.2.3 &mdash; Pronunciation Guide</strong></p>
                <p>
                  When the target is a Nigerian language, [PronunciationGuide.tsx](src/components/PronunciationGuide.tsx)
                  expands underneath the translated output and presents four labelled fields: an IPA
                  transcription, an English-friendly phonetic spelling, the word broken into syllables,
                  and a tone-marker line that highlights high/low/falling tones critical to Igbo and
                  Yoruba meaning. Below those fields, a short bulleted list of pronunciation tips is
                  rendered.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>Word:</strong> "Nnọọ" (Igbo, "Welcome")</p>
                  <p><strong>IPA:</strong> /n̩.nɔ̃ː/</p>
                  <p><strong>Phonetic:</strong> "n-NAW-aw"</p>
                  <p><strong>Syllables:</strong> Nn-ọọ</p>
                  <p><strong>Tone:</strong> low &mdash; low (sustained)</p>
                </div>

                <p><strong className="text-foreground">Figure 4.2.4 &mdash; Voice Input</strong></p>
                <p>
                  [VoiceInputButton.tsx](src/components/VoiceInputButton.tsx) renders a microphone
                  button that pulses while listening. Interim transcription is displayed in real time
                  beneath the input area so the user can confirm what was captured before the final
                  transcript replaces the source text and translation kicks off automatically.
                </p>

                <p><strong className="text-foreground">Figure 4.2.5 &mdash; Sign Language Avatar</strong></p>
                <p>
                  [SignLanguagePanel.tsx](src/components/SignLanguagePanel.tsx) exposes an NSL/ASL
                  toggle, a "Generate Sign Language Animation" button, and the rendered avatar from
                  [SignLanguageAvatar.tsx](src/components/SignLanguageAvatar.tsx). The avatar is a 2D
                  SVG figure driven by the gesture descriptor below; each sign sequences a hand shape,
                  a start- and end-position pair, an optional non-dominant hand, a body movement, and a
                  facial expression. Playback controls let the user pause, replay, slow down, or pop the
                  avatar out as a draggable floating overlay via
                  [FloatingAvatar.tsx](src/components/FloatingAvatar.tsx). The
                  [useAvatarRecorder.ts](src/hooks/useAvatarRecorder.ts) hook can capture a playback as
                  an animated GIF using <code>gif.js</code> and <code>html2canvas</code>.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
{`{
  "signs": [
    {
      "word": "hello",
      "gloss": "HELLO",
      "handShape": "open_5",
      "dominantHand": {
        "startPosition": { "x": 0.3, "y": 0.8 },
        "endPosition":   { "x": 0.5, "y": 0.6 },
        "rotation": 0
      },
      "nonDominantHand": null,
      "movement": "wave_side",
      "bodyMovement": "head_nod",
      "facialExpression": "smile",
      "duration": 800
    }
  ],
  "totalDuration": 800
}`}
                  </pre>
                  <p className="text-xs italic mt-2">Source: local NSL dictionary
                  ([src/data/nslDictionary.ts](src/data/nslDictionary.ts)).</p>
                </div>

                <p><strong className="text-foreground">Figure 4.2.6 &mdash; Phrase Library</strong></p>
                <p>
                  The phrase library page ([PhrasesPage.tsx](src/pages/PhrasesPage.tsx)) lists curated
                  phrases grouped by category (greetings, common, questions, responses, numbers, time,
                  travel, food, family, emergencies) and difficulty (beginner, intermediate, advanced).
                  A search box filters across English and all four Nigerian translations simultaneously,
                  and a speaker icon next to each translation plays the phrase aloud through the
                  browser's TTS voice for that language.
                </p>

                <p><strong className="text-foreground">Figure 4.2.7 &mdash; Theme &amp; Responsive Layout</strong></p>
                <p>
                  [ThemeToggle.tsx](src/components/ThemeToggle.tsx) and the
                  [ThemeProvider.tsx](src/components/ThemeProvider.tsx) wrapper expose a light/dark
                  toggle that persists across sessions through <code>next-themes</code>. The layout
                  collapses gracefully: desktop shows a top navigation bar; mobile renders a fixed
                  bottom navigation bar through [Layout.tsx](src/components/Layout.tsx) so that all
                  primary actions remain thumb-reachable.
                </p>
              </CardContent>
            </Card>

            {/* 4.3 System Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">4.3 System Setup (How to Run the Software)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NaijaTTS runs as a local web application on the developer's machine. It does not
                  require deployment to any cloud platform to be exercised in full &mdash; the Vite
                  development server hosts the frontend and the application calls the configured
                  Supabase Edge Functions directly from the browser. The procedure below mirrors how
                  the system was set up and run on the Windows 11 development machine used throughout
                  this project.
                </p>

                <p><strong className="text-foreground">Hardware Requirements (minimum)</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Processor: any modern x64 CPU (1 GHz or faster)</li>
                  <li>Memory: 4 GB RAM (8 GB recommended for comfortable dev-server use)</li>
                  <li>Storage: 500 MB free for the project and its <code>node_modules</code> tree</li>
                  <li>Display: 320 px minimum width (mobile) through to standard desktop resolutions</li>
                  <li>Microphone: required for the voice-input feature</li>
                  <li>Speakers or headphones: required to hear text-to-speech output</li>
                  <li>Network: required during <code>npm install</code> and for live AI translation
                  requests</li>
                </ul>

                <p><strong className="text-foreground">Software Requirements</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Operating System: Windows 10 or Windows 11 (the system was developed on
                  Windows 11; the project also runs on macOS or Linux without changes, but Windows is
                  the verified platform)</li>
                  <li>Node.js: version 18.x LTS or higher (includes npm)</li>
                  <li>Git: any recent version for cloning the repository</li>
                  <li>Modern browser: Chrome 90+, Edge 90+, Firefox 88+, or Safari 14+ &mdash; required
                  for the Web Speech API used by both speech recognition and synthesis</li>
                  <li>Visual Studio Code (recommended IDE; not required to run the software)</li>
                </ul>

                <p><strong className="text-foreground">Installation and Run Steps (Windows)</strong></p>
                <p>
                  Open Windows PowerShell or Windows Terminal, navigate to a working directory of your
                  choice, and run the commands below in order:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
{`# 1. Clone the project source code
git clone <repository-url> naijatts

# 2. Move into the project folder
cd naijatts

# 3. Install all dependencies declared in package.json
npm install

# 4. Configure environment variables
#    Copy or create a .env file in the project root with the two
#    variables the frontend hooks read at runtime:
#      VITE_SUPABASE_URL=<your-supabase-project-url>
#      VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>

# 5. Start the Vite development server
npm run dev

# 6. Open the application
#    Vite will print "Local: http://localhost:5173"
#    Open that URL in Chrome, Edge, or Firefox.

# Optional commands
npm run build         # Produce an optimised production bundle in dist/
npm run preview       # Serve the production bundle locally for inspection
npm run lint          # Run ESLint across the project
npm run test          # Execute the Vitest test suite once`}
                  </pre>
                </div>

                <p><strong className="text-foreground">First-Run Permissions</strong></p>
                <p>
                  On first use the browser will prompt for microphone access &mdash; this is required
                  by the voice-input feature and must be allowed for that workflow to function. Audio
                  playback (TTS) does not require any browser permission. Some browsers ship the
                  speech-recognition voices on demand, so the initial Nigerian-language voice may take
                  a few seconds to become available on the first attempt.
                </p>

                <p><strong className="text-foreground">Project Layout (where to look)</strong></p>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
{`naijatts/
├── public/                       Static assets served as-is
├── src/
│   ├── components/               UI components (translation panel, avatar, etc.)
│   │   └── ui/                   shadcn/ui primitives
│   ├── contexts/                 React context providers
│   ├── data/                     Phrase library, NSL dictionary, avatar data
│   ├── hooks/                    Translation, speech, pronunciation, sign hooks
│   ├── integrations/supabase/    Supabase client used by the edge-function calls
│   ├── lib/                      Small utilities (cn, etc.)
│   ├── pages/                    Translate, Phrases, About, Documentation, NotFound
│   ├── test/                     Vitest setup and example test
│   ├── App.tsx                   Root router and providers
│   ├── index.css                 Global Tailwind styles and design tokens
│   └── main.tsx                  Application entry point
├── index.html                    Vite HTML entry
├── package.json                  Scripts and dependencies
├── tailwind.config.ts            Tailwind configuration
├── tsconfig.*.json               TypeScript configuration
├── vite.config.ts                Vite build configuration
└── vitest.config.ts              Vitest test configuration`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* 4.4 Reasons for Choice of Platform/Programming Language */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">4.4 Reasons for Choice of Platform and Programming Language</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  The development platform chosen for this work was Windows 11 with Node.js 18 LTS and
                  Visual Studio Code, because Windows is the most widely used desktop operating system
                  among Nigerian undergraduate developers and offered the most direct path to a
                  reproducible environment for the project's intended audience. The browser was chosen
                  as the runtime target because it is the only consumer platform that ships
                  speech-recognition, speech-synthesis, vector rendering, and a responsive UI layer
                  out-of-the-box on every device a Nigerian user is likely to own &mdash; from a budget
                  Android phone to a shared lab desktop &mdash; without requiring any installation or
                  app-store gatekeeping, which is important for an accessibility-oriented tool.
                </p>
                <p>
                  TypeScript on top of React 18 was selected as the programming stack because React's
                  component model maps cleanly to the system's natural units (translation panel,
                  pronunciation guide, sign-language avatar, phrase card), and TypeScript's static type
                  system caught a class of bugs early &mdash; particularly around the structured gesture
                  data, the language enum, and the speech-API event shapes &mdash; that would have been
                  difficult to detect at runtime. The supporting choices flowed from this base: Vite for
                  near-instant local builds and hot-module reloading on Windows; Tailwind CSS and
                  shadcn/ui for a consistent, accessible design system; Framer Motion for the page and
                  avatar transitions; and Supabase Edge Functions as a thin, serverless boundary in
                  front of the AI language model so that API credentials never reach the browser.
                </p>
              </CardContent>
            </Card>

          </div>
        </motion.div>
      </section>

      <Separator className="my-8" />

      {/* Chapter Five: Conclusion */}
      <section className="px-4 py-8">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Chapter Five</h2>
              <p className="text-muted-foreground">Conclusion and Recommendation</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* 5.1 Conclusion */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">5.1 Conclusion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  This research successfully designed and implemented NaijaTTS, an AI-enabled real-time 
                  translation and accessibility support system for Nigerian languages. The system addresses 
                  critical gaps in existing translation technologies by providing comprehensive support for 
                  Igbo, Hausa, Yoruba, and Ikwere languages with integrated accessibility features.
                </p>
                <p>
                  The key achievements of this project include:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Successful implementation of bidirectional translation between English and four Nigerian 
                    languages using Large Language Model technology (Gemini API).
                  </li>
                  <li>
                    Integration of pronunciation guides with phonetic notation, addressing a significant gap 
                    in existing translation tools that hinders spoken communication.
                  </li>
                  <li>
                    Development of a novel sign language translation feature with animated avatar output, 
                    supporting both Nigerian Sign Language (NSL) and American Sign Language (ASL).
                  </li>
                  <li>
                    Creation of a responsive, accessible web application that works across desktop, tablet, 
                    and mobile devices with appropriate user interface adaptations.
                  </li>
                  <li>
                    Implementation of speech input and output capabilities, enabling voice-based interaction 
                    with the translation system.
                  </li>
                </ol>
                <p>
                  The system demonstrates the viability of AI-powered solutions for addressing linguistic 
                  accessibility challenges in the Nigerian context. By leveraging modern web technologies 
                  and cloud-based AI services, NaijaTTS achieves real-time translation with acceptable 
                  quality while maintaining broad accessibility across devices and user capabilities.
                </p>
                <p>
                  The project contributes to ongoing efforts to reduce the digital language divide affecting 
                  low-resource African languages and provides a foundation for future research and development 
                  in this domain.
                </p>
              </CardContent>
            </Card>

            {/* 5.2 Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">5.2 Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Based on the findings and limitations identified during this research, the following 
                  recommendations are proposed for future work:
                </p>
                <p><strong className="text-foreground">Technical Enhancements:</strong></p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    <strong className="text-foreground">Offline Capability:</strong> Implement progressive 
                    web app (PWA) features with local caching of common translations to enable limited 
                    offline functionality.
                  </li>
                  <li>
                    <strong className="text-foreground">Expanded Language Coverage:</strong> Extend support 
                    to additional Nigerian languages such as Fulfulde, Kanuri, Tiv, and Ibibio to serve a 
                    broader population.
                  </li>
                  <li>
                    <strong className="text-foreground">Dialectal Variation:</strong> Incorporate dialect 
                    selection for major languages to improve translation accuracy for specific regional 
                    varieties.
                  </li>
                  <li>
                    <strong className="text-foreground">Sign Language Recognition:</strong> Implement video-based 
                    sign language input to enable bidirectional sign language communication.
                  </li>
                  <li>
                    <strong className="text-foreground">3D Avatar Enhancement:</strong> Upgrade the sign language 
                    avatar to a more realistic 3D representation with improved gesture fidelity.
                  </li>
                </ol>
                <p><strong className="text-foreground">Research Directions:</strong></p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Conduct formal user studies to evaluate translation quality and user satisfaction across 
                    diverse user groups.
                  </li>
                  <li>
                    Develop Nigerian language-specific training data to fine-tune models for improved accuracy.
                  </li>
                  <li>
                    Investigate the application of the system in specific domains such as healthcare, 
                    education, and legal services.
                  </li>
                </ol>
              </CardContent>
            </Card>

            {/* 5.3 General Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">5.3 General Recommendations for Application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  For organizations and individuals seeking to deploy or extend NaijaTTS:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-foreground">Educational Institutions:</strong> The system can 
                    be integrated into language learning curricula to support Nigerian language education, 
                    particularly in diaspora communities.
                  </li>
                  <li>
                    <strong className="text-foreground">Healthcare Facilities:</strong> Deploy in hospitals 
                    and clinics to facilitate patient-provider communication across language barriers, 
                    with appropriate validation for medical contexts.
                  </li>
                  <li>
                    <strong className="text-foreground">Government Services:</strong> Integrate with 
                    e-government platforms to provide multilingual access to public information and services.
                  </li>
                  <li>
                    <strong className="text-foreground">Deaf Community Organizations:</strong> Partner with 
                    deaf associations to refine and validate sign language output for NSL accuracy and 
                    cultural appropriateness.
                  </li>
                  <li>
                    <strong className="text-foreground">Commercial Applications:</strong> Businesses can 
                    integrate the translation API into customer service platforms to support multilingual 
                    customer interactions.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      <Separator className="my-8" />

      {/* References */}
      <section className="px-4 py-8 bg-muted/30">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">References</h2>
          <Card>
            <CardContent className="pt-6 space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Adelani, D. I., Abbott, J., Neubig, G., D'souza, D., Kreutzer, J., Lignos, C., ... & Ruder, S. (2021). MasakhaNER: Named entity recognition for African languages. <em>Transactions of the Association for Computational Linguistics</em>, 9, 1116-1131.</p>
              
              <p>Adelani, D. I., Neubig, G., Ruder, S., Rijhwani, S., Beukman, M., Palen-Michel, C., ... & Dossou, B. F. (2022). A few thousand translations go a long way! Leveraging pre-trained models for African news translation. <em>arXiv preprint arXiv:2205.02022</em>.</p>
              
              <p>Adegbija, E. (2020). Language policy and planning in Nigeria. <em>Current Issues in Language Planning</em>, 5(3), 181-246.</p>
              
              <p>Ahia, O., Ogueji, K., Winata, G. I., Dossou, B. F., Osei, S., Owodunni, A., ... & Ruder, S. (2023). Do all languages cost the same? Tokenization in the era of commercial language models. <em>arXiv preprint arXiv:2305.13707</em>.</p>
              
              <p>Akinwande, T., & Liberman, M. (2019). Challenges in developing text-to-speech systems for Nigerian languages. <em>Proceedings of Interspeech 2019</em>, 2218-2222.</p>
              
              <p>Ardila, R., Branson, M., Davis, K., Kohler, M., Meyer, J., Henretty, M., ... & Weber, G. (2020). Common Voice: A massively-multilingual speech corpus. <em>arXiv preprint arXiv:1912.06670</em>.</p>
              
              <p>Asahiah, F. O., Odejobi, O. A., & Adagunodo, E. R. (2017). Restoring tone-marks in standard Yorùbá electronic text. <em>Computer Science</em>, 18(3), 301-315.</p>
              
              <p>Baevski, A., Zhou, Y., Mohamed, A., & Auli, M. (2020). wav2vec 2.0: A framework for self-supervised learning of speech representations. <em>Advances in Neural Information Processing Systems</em>, 33, 12449-12460.</p>
              
              <p>Brown, P. F., Cocke, J., Della Pietra, S. A., Della Pietra, V. J., Jelinek, F., Lafferty, J. D., ... & Roossin, P. S. (1990). A statistical approach to machine translation. <em>Computational Linguistics</em>, 16(2), 79-85.</p>
              
              <p>Brown, T., Mann, B., Ryder, N., Subbiah, M., Kaplan, J. D., Dhariwal, P., ... & Amodei, D. (2020). Language models are few-shot learners. <em>Advances in Neural Information Processing Systems</em>, 33, 1877-1901.</p>
              
              <p>Cloudflare. (2023). What is edge computing? <em>Cloudflare Learning Center</em>. https://www.cloudflare.com/learning/serverless/glossary/what-is-edge-computing/</p>
              
              <p>Conneau, A., Baevski, A., Collobert, R., Mohamed, A., & Auli, M. (2021). Unsupervised cross-lingual representation learning for speech recognition. <em>Proceedings of Interspeech 2021</em>, 2426-2430.</p>
              
              <p>Conneau, A., Ma, M., Khanuja, S., Zhang, Y., Axelrod, V., Dalmia, S., ... & Auli, M. (2022). FLEURS: Few-shot learning evaluation of universal representations of speech. <em>arXiv preprint arXiv:2205.12446</em>.</p>
              
              <p>Costa-jussà, M. R., Cross, J., Çelebi, O., Elbayad, M., Heafield, K., Heffernan, K., ... & Wang, C. (2022). No language left behind: Scaling human-centered machine translation. <em>arXiv preprint arXiv:2207.04672</em>.</p>
              
              <p>De Pauw, G., de Schryver, G. M., Pretorius, L., & Levin, L. (2012). Introduction to the special issue on African language technology. <em>Language Resources and Evaluation</em>, 46(2), 149-157.</p>
              
              <p>Eisenfeld, J. (2020). Dark mode and its impact on visual accessibility. <em>Accessibility in Practice</em>, 4(2), 12-18.</p>
              
              <p>Elliot, R., Glauert, J., Kennaway, J., & Marshall, I. (2008). The development of language processing support for the ViSiCAST project. <em>Proceedings of ASSETS 2008</em>, 101-108.</p>
              
              <p>Ethnologue. (2023). Languages of Nigeria. <em>Ethnologue: Languages of the World</em> (26th ed.). SIL International.</p>
              
              <p>Ezeani, I., Onyenwe, I., & Hepple, M. (2020). Igbo-English machine translation: An evaluation benchmark. <em>Proceedings of LREC 2020</em>, 5024-5029.</p>
              
              <p>Fielding, R. T. (2000). <em>Architectural styles and the design of network-based software architectures</em> [Doctoral dissertation, University of California, Irvine].</p>
              
              <p>Gao, J., Zhao, H., Yu, C., & Xu, R. (2023). Is ChatGPT a good translator? A preliminary study. <em>arXiv preprint arXiv:2301.08745</em>.</p>
              
              <p>Google AI. (2024). Gemini: A family of highly capable multimodal models. <em>Google AI Blog</em>.</p>
              
              <p>GSMA. (2023). The mobile economy: Sub-Saharan Africa 2023. <em>GSMA Intelligence</em>.</p>
              
              <p>Hendy, A., Abdelrehim, M., Sharaf, A., Raunak, V., Gabr, M., Matsushita, H., ... & Awadallah, A. H. (2023). How good are GPT models at machine translation? A comprehensive evaluation. <em>arXiv preprint arXiv:2302.09210</em>.</p>
              
              <p>Henry, S. L., & Arch, A. (2019). Web accessibility initiative (WAI). <em>W3C</em>.</p>
              
              <p>Hutchins, J. (2007). Machine translation: A concise history. <em>Computer Aided Translation: Theory and Practice</em>, 29-70.</p>
              
              <p>Ji, Z., Lee, N., Frieske, R., Yu, T., Su, D., Xu, Y., ... & Fung, P. (2023). Survey of hallucination in natural language generation. <em>ACM Computing Surveys</em>, 55(12), 1-38.</p>
              
              <p>Joshi, P., Santy, S., Buber-Ennser, I., Bhardwaj, K., & Choudhury, M. (2020). The state and fate of linguistic diversity and inclusion in the NLP world. <em>Proceedings of ACL 2020</em>, 6282-6293.</p>
              
              <p>Jurafsky, D., & Martin, J. H. (2023). <em>Speech and language processing</em> (3rd ed. draft). Stanford University.</p>
              
              <p>Kipp, M., Heloir, A., & Nguyen, Q. (2011). Sign language avatars: Animation and comprehensibility. <em>Proceedings of IVA 2011</em>, 113-126.</p>
              
              <p>Koehn, P. (2020). <em>Neural machine translation</em>. Cambridge University Press.</p>
              
              <p>Koehn, P., & Knowles, R. (2017). Six challenges for neural machine translation. <em>arXiv preprint arXiv:1706.03872</em>.</p>
              
              <p>Mace, R. L., Hardie, G. J., & Place, J. P. (1991). Accessible environments: Toward universal design. <em>Design Intervention: Toward a More Humane Architecture</em>, 155-175.</p>
              
              <p>Magueresse, A., Carles, V., & Heetderks, E. (2020). Low-resource languages: A review of past work and future challenges. <em>arXiv preprint arXiv:2006.07264</em>.</p>
              
              <p>National Bureau of Statistics. (2022). <em>Nigeria demographic and health survey 2022</em>. Federal Republic of Nigeria.</p>
              
              <p>Nekoto, W., Marivate, V., Matsila, T., Faber, T., Dossou, B. F., Ojidipo, O., ... & Abbott, J. (2020). Participatory research for low-resourced machine translation: A case study in African languages. <em>Findings of EMNLP 2020</em>, 2144-2160.</p>
              
              <p>Oha, A. C., & Ugorji, C. U. C. (2009). Ikwere orthography: Issues, proposals and problems. <em>Journal of the Linguistic Association of Nigeria</em>, 12(2), 45-56.</p>
              
              <p>Okpaku, O., & Onyedike, S. (2019). A linguistic description of Nigerian Sign Language. <em>Nigerian Journal of Disability Studies</em>, 2(1), 112-129.</p>
              
              <p>Onyenwe, I., Hepple, M., Uchechukwu, C., & Ezeani, I. (2018). A basic language resource kit implementation for the IgboNLP project. <em>ACM Transactions on Asian and Low-Resource Language Information Processing</em>, 17(2), 1-23.</p>
              
              <p>Oyelaran, O. O., Adeyemo, A. B., & Ajayi, A. O. (2008). Yoruba automatic speech recognition using hidden Markov model. <em>Journal of Computer Science and Its Applications</em>, 15(1), 45-56.</p>
              
              <p>Pratap, V., Xu, Q., Sriram, A., Synnaeve, G., & Collobert, R. (2024). MMS: Scaling speech technology to 1,000+ languages. <em>arXiv preprint arXiv:2305.13516</em>.</p>
              
              <p>Russell, S., & Norvig, P. (2021). <em>Artificial intelligence: A modern approach</em> (4th ed.). Pearson.</p>
              
              <p>Sandler, W., & Lillo-Martin, D. (2006). <em>Sign language and linguistic universals</em>. Cambridge University Press.</p>
              
              <p>Saunders, B., Camgoz, N. C., & Bowden, R. (2022). Continuous 3D multi-channel sign language production via progressive transformers and mixture density networks. <em>International Journal of Computer Vision</em>, 130(9), 2110-2132.</p>
              
              <p>Schlippe, T., Nguyen, T. S., & Vogel, S. (2012). Diacritization as a machine translation problem and as a sequence labeling problem. <em>Proceedings of AMTA 2012</em>.</p>
              
              <p>Shen, J., Pang, R., Weiss, R. J., Schuster, M., Jaitly, N., Yang, Z., ... & Wu, Y. (2018). Natural TTS synthesis by conditioning WaveNet on mel spectrogram predictions. <em>Proceedings of ICASSP 2018</em>, 4779-4783.</p>
              
              <p>Stokoe, W. C. (2005). Sign language structure: An outline of the visual communication systems of the American deaf. <em>Journal of Deaf Studies and Deaf Education</em>, 10(1), 3-37.</p>
              
              <p>Stoll, S., Camgoz, N. C., Hadfield, S., & Bowden, R. (2020). Text2Sign: Towards sign language production using neural machine translation and generative adversarial networks. <em>International Journal of Computer Vision</em>, 128(4), 891-908.</p>
              
              <p>Sutskever, I., Vinyals, O., & Le, Q. V. (2014). Sequence to sequence learning with neural networks. <em>Advances in Neural Information Processing Systems</em>, 27, 3104-3112.</p>
              
              <p>Taylor, P. (2009). <em>Text-to-speech synthesis</em>. Cambridge University Press.</p>
              
              <p>Trewin, S., Cragun, B., Swart, C., Brezin, J., & Richards, J. (2010). Accessibility challenges and tool features: An IBM Web developer perspective. <em>Proceedings of W4A 2010</em>, 1-10.</p>
              
              <p>Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., ... & Polosukhin, I. (2017). Attention is all you need. <em>Advances in Neural Information Processing Systems</em>, 30, 5998-6008.</p>
              
              <p>Vilar, D., Freitag, M., Cherry, C., Luo, J., Ratnakar, V., & Foster, G. (2023). Prompting PaLM for translation: Assessing strategies and performance. <em>arXiv preprint arXiv:2211.09102</em>.</p>
              
              <p>W3C. (2018). Web Content Accessibility Guidelines (WCAG) 2.1. <em>W3C Recommendation</em>.</p>
              
              <p>World Health Organization. (2021). <em>World report on hearing</em>. World Health Organization.</p>
              
              <p>Xue, L., Constant, N., Roberts, A., Kale, M., Al-Rfou, R., Siddhant, A., ... & Raffel, C. (2021). mT5: A massively multilingual pre-trained text-to-text transformer. <em>Proceedings of NAACL 2021</em>, 483-498.</p>
              
              <p>Yu, D., & Deng, L. (2015). <em>Automatic speech recognition: A deep learning approach</em>. Springer.</p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Appendix */}
      <section className="px-4 py-8">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Appendix</h2>
          <Card>
            <CardContent className="pt-6 space-y-6 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Appendix A: Sample Code Snippets</h3>
                <p>
                  Key code implementations are documented in Chapter Four. Full source code is available 
                  in the project repository.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Appendix B: User Interface Screenshots</h3>
                <p>
                  Screenshots demonstrating the system's interface across different device types and 
                  themes are available in the implementation chapter.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Appendix C: API Documentation</h3>
                <p>
                  Edge function endpoints and their parameters are documented in the Data Source 
                  Implementation section of Chapter Four.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Appendix D: Glossary of Sign Language Hand Shapes</h3>
                <p>
                  The system supports the following hand shapes for sign language rendering: open_5, 
                  flat_hand, fist, point, c_shape, o_shape, thumbs_up, bent_v, and wave.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <div className="h-8" />
    </div>
  );
}
