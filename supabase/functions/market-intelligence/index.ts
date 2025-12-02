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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { action } = await req.json();

    if (action === "analyze") {
      const systemPrompt = `You are a professional crypto market analyst AI. Analyze the current global cryptocurrency market and provide:
1. Overall market sentiment (Bullish/Neutral/Bearish)
2. A sentiment score from 0-100
3. 3 key insights about current market conditions
4. 3 detected trends
5. A brief daily summary (2-3 sentences)

Respond in this exact JSON format:
{
  "marketSentiment": "Bullish|Neutral|Bearish",
  "sentimentScore": 72,
  "keyInsights": ["insight1", "insight2", "insight3"],
  "trendDetection": ["trend1", "trend2", "trend3"],
  "dailySummary": "Brief market summary here."
}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "Analyze the current global cryptocurrency market conditions for December 2024. Bitcoin is trading near $97,000, Ethereum around $3,400, and the total market cap is approximately $3.4 trillion. Fear & Greed Index is at 72 (Greed). Provide your analysis." }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI Gateway error:", response.status, errorText);
        throw new Error(`AI Gateway error: ${response.status}`);
      }

      const aiData = await response.json();
      const content = aiData.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No content in AI response");
      }

      // Parse JSON from response
      let analysis;
      try {
        // Extract JSON from potential markdown code blocks
        const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || 
                         content.match(/```\n?([\s\S]*?)\n?```/) ||
                         [null, content];
        analysis = JSON.parse(jsonMatch[1] || content);
      } catch (parseError) {
        console.error("Failed to parse AI response:", content);
        // Fallback response
        analysis = {
          marketSentiment: "Bullish",
          sentimentScore: 72,
          keyInsights: [
            "Bitcoin maintaining strength near $97,000",
            "Strong institutional ETF inflows continue",
            "Altcoin market showing positive momentum"
          ],
          trendDetection: [
            "Layer 2 adoption accelerating",
            "AI tokens gaining traction",
            "DeFi TVL increasing"
          ],
          dailySummary: "The crypto market maintains bullish momentum with Bitcoin testing new highs. Institutional interest remains strong while altcoins benefit from positive sentiment rotation."
        };
      }

      return new Response(
        JSON.stringify({
          success: true,
          ...analysis,
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Market intelligence error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
