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
    const { text, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert linguist specializing in Nigerian language pronunciation.
Your task is to provide detailed pronunciation guides for ${language} text.

For the given text, provide:
1. IPA (International Phonetic Alphabet) transcription
2. A simplified phonetic guide using English sounds that any English speaker can read
3. Syllable breakdown with stress markers
4. Key pronunciation tips specific to ${language} sounds

Format your response as JSON with this exact structure:
{
  "ipa": "IPA transcription here",
  "phonetic": "Simplified phonetic guide (e.g., 'naw-aw' for 'nnọọ')",
  "syllables": "Syllable breakdown with stressed syllables in CAPS",
  "tips": ["tip 1", "tip 2"],
  "toneMarkers": "Description of tone patterns if applicable"
}

Only respond with valid JSON, no additional text.`;

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
          { role: "user", content: `Provide pronunciation guide for: "${text}"` },
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
      throw new Error("Pronunciation service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || "{}";
    
    // Parse the JSON response
    let pronunciationData;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      pronunciationData = JSON.parse(cleanContent);
    } catch {
      pronunciationData = {
        ipa: "",
        phonetic: content,
        syllables: "",
        tips: [],
        toneMarkers: ""
      };
    }

    return new Response(JSON.stringify(pronunciationData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Pronunciation error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
