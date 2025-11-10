import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { useSentiment, SentimentData } from "@/hooks/useSentiment";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SentimentBadgeProps {
  symbol: string;
  showIcon?: boolean;
}

export const SentimentBadge = ({ symbol, showIcon = true }: SentimentBadgeProps) => {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const { analyzeSentiment, isLoading } = useSentiment();

  useEffect(() => {
    loadSentiment();
  }, [symbol]);

  const loadSentiment = async () => {
    const result = await analyzeSentiment(symbol);
    if (result) setSentiment(result);
  };

  if (isLoading || !sentiment) {
    return <Badge variant="outline" className="text-xs">...</Badge>;
  }

  const getSentimentColor = () => {
    if (sentiment.sentiment === 'Bullish') return 'bg-success/20 text-success border-success/30';
    if (sentiment.sentiment === 'Bearish') return 'bg-destructive/20 text-destructive border-destructive/30';
    return 'bg-muted/20 text-muted-foreground border-muted/30';
  };

  const getSentimentIcon = () => {
    if (sentiment.sentiment === 'Bullish') return <TrendingUp className="w-3 h-3" />;
    if (sentiment.sentiment === 'Bearish') return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  return (
    <Badge className={`${getSentimentColor()} text-xs`}>
      {showIcon && <span className="mr-1">{getSentimentIcon()}</span>}
      {sentiment.sentiment}
    </Badge>
  );
};