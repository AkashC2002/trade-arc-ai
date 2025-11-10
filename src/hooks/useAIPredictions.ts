import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AIPrediction {
  symbol: string;
  prediction: 'UP' | 'DOWN' | 'NEUTRAL';
  confidence: number;
  forecast: Array<{
    day: number;
    price: number;
    change: string;
  }>;
  reasoning: string[];
  technicalIndicators: {
    rsi: string;
    macd: string;
    support: string;
    resistance: string;
  };
  timestamp: string;
}

export const useAIPredictions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPrediction = async (symbol: string, historicalData?: number[]): Promise<AIPrediction | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-predict', {
        body: { symbol, historicalData }
      });

      if (fnError) throw fnError;
      if (!data.success) throw new Error(data.error);

      return data as AIPrediction;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to get prediction';
      setError(errorMsg);
      console.error('Prediction error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getPrediction,
    isLoading,
    error
  };
};