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

    const systemPrompt = `You are an expert translator specializing in Nigerian languages: Igbo, Hausa, Yoruba, and Ikwere.
Translate text accurately, preserving cultural nuances, tone, and intent.

Rules:
1. Output ONLY the translated text — no explanations, quotation marks, or extra commentary.
2. Use the most natural, conversational form of the target language.
3. Preserve proper nouns (names, places) unless the target language has a well-known equivalent.
4. For partial or incomplete sentences, translate what is given naturally.
5. If the input is a single word, translate that word directly.
6. Maintain the register and formality level of the source text.
7. For idiomatic expressions, translate the meaning rather than word-for-word.${directionHint}`;

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
