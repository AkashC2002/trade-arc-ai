import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SentimentRequest {
  symbol: string;
  headlines?: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, headlines } = await req.json() as SentimentRequest;
    console.log(`Sentiment analysis request for ${symbol}`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const headlinesContext = headlines && headlines.length > 0
      ? `Recent headlines:\n${headlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}`
      : `Analyzing general market sentiment for ${symbol}`;

    const systemPrompt = `You are a financial sentiment analysis expert specializing in cryptocurrency markets.
Analyze news headlines, social media sentiment, and market mood to determine overall sentiment.
Provide sentiment scores on a scale of -1 (very bearish) to +1 (very bullish).`;

    const userPrompt = `Analyze sentiment for ${symbol} cryptocurrency.

${headlinesContext}

Provide a comprehensive sentiment analysis with:
- Overall sentiment: Bullish/Neutral/Bearish
- Sentiment score: -1.0 to +1.0
- Confidence: percentage
- Key themes: array of detected themes
- Market mood: brief description

Format response as JSON:
{
  "sentiment": "Bullish/Neutral/Bearish",
  "score": 0.65,
  "confidence": 78,
  "themes": ["institutional adoption", "price rally", "technical breakout"],
  "mood": "Market shows strong bullish sentiment with increasing institutional interest",
  "socialSignals": {
    "twitterMentions": "high",
    "redditActivity": "increasing",
    "fearGreedIndex": 72
  }
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;

    console.log('AI Sentiment Response:', aiContent);

    let sentimentData;
    try {
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || 
                       aiContent.match(/```\n([\s\S]*?)\n```/) ||
                       [null, aiContent];
      sentimentData = JSON.parse(jsonMatch[1] || aiContent);
    } catch (e) {
      console.error('Failed to parse sentiment response:', e);
      sentimentData = {
        sentiment: 'Neutral',
        score: 0,
        confidence: 50,
        themes: ['Market analysis pending'],
        mood: 'Awaiting more data for comprehensive analysis',
        socialSignals: {
          twitterMentions: 'moderate',
          redditActivity: 'stable',
          fearGreedIndex: 50
        }
      };
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        symbol,
        ...sentimentData,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in sentiment-analysis:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});