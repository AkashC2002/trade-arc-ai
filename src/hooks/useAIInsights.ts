import { useState, useEffect } from "react";

interface AIInsights {
  risk: "Low" | "Medium" | "High";
  predictions: {
    symbol: string;
    direction: "Bullish" | "Bearish" | "Neutral";
    confidence: number;
  }[];
  suggestions: string[];
}

// Mock data - will be replaced with real AI service
const MOCK_INSIGHTS: AIInsights = {
  risk: "Medium",
  predictions: [
    {
      symbol: "BTC",
      direction: "Bullish",
      confidence: 78,
    },
    {
      symbol: "ETH",
      direction: "Bullish",
      confidence: 65,
    },
    {
      symbol: "SOL",
      direction: "Neutral",
      confidence: 52,
    },
  ],
  suggestions: [
    "Consider rebalancing: BTC allocation is 58% of portfolio",
    "Strong uptrend detected for BTC - consider taking partial profits",
    "ETH showing consolidation pattern - good accumulation zone",
  ],
};

export const useAIInsights = () => {
  const [insights, setInsights] = useState<AIInsights>(MOCK_INSIGHTS);
  const [isLoading, setIsLoading] = useState(false);

  return {
    insights,
    isLoading,
  };
};
