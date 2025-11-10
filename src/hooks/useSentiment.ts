import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SentimentData {
  symbol: string;
  sentiment: 'Bullish' | 'Neutral' | 'Bearish';
  score: number;
  confidence: number;
  themes: string[];
  mood: string;
  socialSignals: {
    twitterMentions: string;
    redditActivity: string;
    fearGreedIndex: number;
  };
  timestamp: string;
}

export const useSentiment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSentiment = async (symbol: string, headlines?: string[]): Promise<SentimentData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('sentiment-analysis', {
        body: { symbol, headlines }
      });

      if (fnError) throw fnError;
      if (!data.success) throw new Error(data.error);

      return data as SentimentData;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to analyze sentiment';
      setError(errorMsg);
      console.error('Sentiment error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzeSentiment,
    isLoading,
    error
  };
};