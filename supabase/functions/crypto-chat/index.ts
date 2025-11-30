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
    const { message, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build conversation context
    const messages = [
      {
        role: "system",
        content: `You are an expert crypto trading and investment AI assistant. You provide:
        
1. Market Analysis: Real-time insights on crypto trends, price movements, and market sentiment
2. Portfolio Advice: Personalized recommendations based on user holdings and risk tolerance
3. Educational Content: Clear explanations of crypto concepts, DeFi, NFTs, trading strategies
4. Price Predictions: Data-driven forecasts using technical analysis and market indicators
5. News & Sentiment: Latest crypto news with sentiment analysis
6. Risk Management: Guidance on position sizing, stop losses, and risk mitigation

Be concise, actionable, and always include relevant metrics when discussing prices or trends.
Use emojis sparingly to make responses engaging. Focus on data-driven insights.`,
      },
      ...conversationHistory.slice(-5).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    console.log("Sending request to Lovable AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            response: "I'm receiving a lot of requests right now. Please try again in a moment! 🔄" 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            response: "The AI service needs additional credits. Please contact support. 💳" 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log("AI response received successfully");

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in crypto-chat function:", error);
    return new Response(
      JSON.stringify({ 
        response: "I apologize, but I'm having trouble processing your request right now. Please try again! 🔧" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
