import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignLanguageRequest {
  text: string;
  sourceLanguage: string;
  signLanguageType: "NSL" | "ASL";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, sourceLanguage, signLanguageType } = await req.json() as SignLanguageRequest;

    const nslContext = signLanguageType === "NSL" ? `

CRITICAL NSL RULES:
- NSL uses TOPIC-COMMENT word order (put the topic/subject first, then the comment/action)
- NSL has NO copula ("to be") — omit signs for "is", "am", "are"
- Time signs ALWAYS come before the verb
- YES/NO questions: raised eyebrows + slight forward lean (facialExpression: "questioning", bodyMovement: "lean_forward")
- WH-questions: furrowed eyebrows + head tilt
- Negation: head shake accompanies the negative sign
- Use classifiers heavily for shape, size, and movement descriptions
- NSL incorporates many culturally Nigerian gestures (e.g., "beckon" with palm-down wave, emphasis with open palm push)
- Use two-handed signs more frequently than ASL — many NSL signs are symmetrical
- Emotional intensity is shown through LARGER movements and MORE emphatic facial expressions
- For Nigerian-specific concepts (market, family hierarchies, greetings), use culturally appropriate sign variations

Available handshapes: open_5, flat_hand, fist, point, c_shape, o_shape, thumbs_up, bent_v, wave, hook, pinch, spread, clap, index_middle, love, emphasis_push, claw, horns, palm_down, beckon, snap

Available facial expressions: neutral, smile, big_smile, serious, questioning, surprised, sad, focused, emphatic, angry, thinking, excited, concerned

Available body movements: none, lean_forward, lean_back, head_nod, head_shake` : "";

    const systemPrompt = `You are an expert sign language translator specializing in ${signLanguageType === "NSL" ? "Nigerian Sign Language (NSL)" : "American Sign Language (ASL)"}.
${nslContext}

Your task is to convert text into detailed sign language instructions that can be used to animate an avatar.

For each word or phrase, provide:
1. The sign gesture description
2. Hand shape (using standard handshape names)
3. Movement description
4. Location on body/space
5. Facial expression if needed
6. Duration in milliseconds

Return a JSON object with:
{
  "signs": [
    {
      "word": "the word/phrase being signed",
      "gloss": "sign language gloss notation",
      "handShape": "handshape name (open_5, flat_hand, fist, point, c_shape, o_shape, bent_v, thumbs_up, wave, hook, pinch, spread, clap, index_middle, love, emphasis_push, claw, horns, palm_down, beckon, snap)",
      "dominantHand": {
        "startPosition": { "x": -1 to 1, "y": -1 to 1 },
        "endPosition": { "x": -1 to 1, "y": -1 to 1 },
        "rotation": degrees
      },
      "nonDominantHand": null or same structure,
      "movement": "description of motion (e.g., 'circular', 'tap', 'wave', 'none')",
      "bodyMovement": "none" | "lean_forward" | "lean_back" | "head_nod" | "head_shake",
      "facialExpression": "neutral | smile | big_smile | serious | questioning | surprised | sad | focused | emphatic | angry | thinking | excited | concerned",
      "duration": milliseconds
    }
  ],
  "totalDuration": total milliseconds,
  "note": "any cultural or contextual notes about this translation"
}

Keep movements smooth and natural. Use positions relative to the body center (0,0).
x: -1 = far left, 1 = far right
y: -1 = low (waist), 0 = chest, 1 = head level`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Translate this ${sourceLanguage} text to ${signLanguageType} sign language gestures: "${text}"` }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse the JSON from the response
    let signData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        signData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      signData = {
        signs: [{
          word: text,
          gloss: text.toUpperCase(),
          handShape: "open_5",
          dominantHand: {
            startPosition: { x: 0, y: 0 },
            endPosition: { x: 0.2, y: 0.2 },
            rotation: 0
          },
          nonDominantHand: null,
          movement: "wave",
          bodyMovement: "none",
          facialExpression: "neutral",
          duration: 1000
        }],
        totalDuration: 1000,
        note: "Fallback gesture"
      };
    }

    return new Response(JSON.stringify(signData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Sign language translation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to translate to sign language" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
