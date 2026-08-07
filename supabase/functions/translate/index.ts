import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, sourceLanguage, targetLanguage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const isNigerianToEnglish = targetLanguage === "English" && ["Igbo", "Hausa", "Yoruba", "Ikwere"].includes(sourceLanguage);
    const isNigerianToNigerian = ["Igbo", "Hausa", "Yoruba", "Ikwere"].includes(sourceLanguage) && ["Igbo", "Hausa", "Yoruba", "Ikwere"].includes(targetLanguage);
    const isIkwereInvolved = sourceLanguage === "Ikwere" || targetLanguage === "Ikwere";

    let directionHint = "";
    if (isNigerianToEnglish) {
      directionHint = `
IMPORTANT — the source text is in ${sourceLanguage}, a Nigerian language. Special handling:
8. The input may contain special characters and diacritical marks (ọ, ụ, ị, ṅ, ẹ, ṣ, ɓ, ɗ, ƙ) — interpret them correctly.
9. The input may be spoken/informal — transcribed from voice. Handle spelling variations and colloquialisms gracefully.
10. Provide natural, idiomatic English — not stiff word-for-word translation.
11. If the input appears to be a greeting or common phrase, translate it culturally (e.g. "Kedu?" → "How are you?" not "What?").
12. For Pidgin or code-mixed text (mixing ${sourceLanguage} and English), still translate to clean English.`;
    } else if (isNigerianToNigerian) {
      directionHint = `
IMPORTANT — translating between two Nigerian languages (${sourceLanguage} → ${targetLanguage}):
8. Preserve cultural context and tone across languages.
9. For greetings and idiomatic expressions, use the culturally equivalent form in ${targetLanguage}, not a literal translation.
10. Both languages may use special characters and diacritical marks — handle them correctly.`;
    }

    // Ikwerre is a distinct, low-resource Igboid language — general-purpose models tend to
    // default to Igbo vocabulary when unsure, because Igbo dominates their training data and
    // the two languages are related. This block grounds the model in verified Ikwerre data
    // (from "Mụnya Ikwere" by S.A. Ekwulo & O.J. Agwmu, and the Ikwerre Language Committee's
    // standardized decimal counting system) so it stops silently substituting Igbo.
    let ikwereGrounding = "";
    if (isIkwereInvolved) {
      ikwereGrounding = `

IKWERRE-SPECIFIC GROUNDING — read carefully before translating:
Ikwerre (ISO 639-3: ikw) is spoken in Rivers State, Nigeria (Port Harcourt, Obio-Akpor, Emohua, Ikwerre LGAs). It is a distinct Igboid language, related to Igbo but NOT the same language — it has its own vocabulary and phonology (e.g. it retains an "r" sound Igbo dialects often drop: "rumu" vs. Igbo "umu"). Do not substitute Igbo words for Ikwerre words. Only use a shared/cognate form if you are genuinely confident it is also correct in Ikwerre, not merely because it is the Igbo word.

For ANY numbers, use this verified Ikwerre numeral system (the Ikwerre Language Committee's standardized decimal counting system) — do not use Igbo numerals for these:
0 etekne · 1 otu · 2 ẹbo · 3 ẹto · 4 ẹno · 5 isne · 6 isunu · 7 ẹsawu · 8 ẹsato · 9 tolu · 10 nri · 20 nri lawụru · 30 nri ẹto · 40 nri ẹno · 50 nri isne · 100 otu pokwu · 1,000 otu riwhu · 1,000,000 otu ndasi · 1,000,000,000 otu nde · 1,000,000,000,000 otu pokwu nde.
Compound numbers follow a "[tens/hundreds/etc.] nụ [remainder]" pattern, e.g. 21 = "nri lawụru nụ otu" (twenty and one).
The Igbo numerals Abụọ, Atọ, Anọ, Ise, Isii, Asaa, Asatọ, Itoolu, Iri, Narị and Puku are NOT Ikwerre — do not use them for an Ikwerre translation, even though "otu" (one) happens to be shared between the two languages.

For Ikwerre vocabulary outside of numbers, translate carefully and conservatively — prefer a simpler, more literal rendering you are reasonably confident about over a fluent-sounding guess, since incorrect "confident" Ikwerre is worse than a plainer correct one.`;
    }

    const systemPrompt = `You are an expert translator specializing in Nigerian languages: Igbo, Hausa, Yoruba, and Ikwere.
Translate text accurately, preserving cultural nuances, tone, and intent.

Rules:
1. Output ONLY the translated text — no explanations, quotation marks, or extra commentary.
2. Use the most natural, conversational form of the target language.
3. Preserve proper nouns (names, places) unless the target language has a well-known equivalent.
4. For partial or incomplete sentences, translate what is given naturally.
5. If the input is a single word, translate that word directly.
6. Maintain the register and formality level of the source text.
7. For idiomatic expressions, translate the meaning rather than word-for-word.${directionHint}${ikwereGrounding}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Translate the following text from ${sourceLanguage} to ${targetLanguage}:\n\n"${text}"` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Translation service error");
    }

    const data = await response.json();
    const translation = data.choices?.[0]?.message?.content?.trim() || "";

    return new Response(JSON.stringify({ translation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});