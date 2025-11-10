import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { useAIPredictions, AIPrediction } from "@/hooks/useAIPredictions";
import { motion } from "framer-motion";

interface AIPredictionPanelProps {
  symbol: string;
}

export const AIPredictionPanel = ({ symbol }: AIPredictionPanelProps) => {
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const { getPrediction, isLoading } = useAIPredictions();

  useEffect(() => {
    loadPrediction();
  }, [symbol]);

  const loadPrediction = async () => {
    const result = await getPrediction(symbol);
    if (result) setPrediction(result);
  };

  const getPredictionIcon = (pred: string) => {
    if (pred === 'UP') return <TrendingUp className="w-5 h-5 text-success" />;
    if (pred === 'DOWN') return <TrendingDown className="w-5 h-5 text-destructive" />;
    return <Minus className="w-5 h-5 text-muted-foreground" />;
  };

  const getPredictionColor = (pred: string) => {
    if (pred === 'UP') return 'bg-success/20 text-success border-success/30';
    if (pred === 'DOWN') return 'bg-destructive/20 text-destructive border-destructive/30';
    return 'bg-muted/20 text-muted-foreground border-muted/30';
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </Card>
    );
  }

  if (!prediction) {
    return (
      <Card className="p-6 bg-gradient-card border-border/50 text-center">
        <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">No prediction available</p>
        <Button onClick={loadPrediction} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Prediction
        </Button>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">AI Prediction</h3>
          </div>
          <Button onClick={loadPrediction} size="sm" variant="ghost">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Prediction Summary */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/5 border border-border/30 mb-4">
          <div className="flex items-center gap-3">
            {getPredictionIcon(prediction.prediction)}
            <div>
              <Badge className={getPredictionColor(prediction.prediction)}>
                {prediction.prediction}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {prediction.confidence}% confidence
              </p>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">7-Day Forecast</h4>
          <div className="space-y-2">
            {prediction.forecast.slice(0, 7).map((day, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Day {day.day}</span>
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">
                    ${typeof day.price === 'number' ? day.price.toLocaleString() : day.price}
                  </span>
                  <span className={day.change.startsWith('+') ? 'text-success' : day.change.startsWith('-') ? 'text-destructive' : 'text-muted-foreground'}>
                    {day.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Indicators */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Technical Indicators</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/5 border border-border/30">
              <p className="text-xs text-muted-foreground">RSI</p>
              <p className="text-sm font-semibold text-foreground">{prediction.technicalIndicators.rsi}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/5 border border-border/30">
              <p className="text-xs text-muted-foreground">MACD</p>
              <p className="text-sm font-semibold text-foreground">{prediction.technicalIndicators.macd}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/5 border border-border/30">
              <p className="text-xs text-muted-foreground">Support</p>
              <p className="text-sm font-semibold text-foreground">${prediction.technicalIndicators.support}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/5 border border-border/30">
              <p className="text-xs text-muted-foreground">Resistance</p>
              <p className="text-sm font-semibold text-foreground">${prediction.technicalIndicators.resistance}</p>
            </div>
          </div>
        </div>

        {/* Reasoning */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Key Factors</h4>
          <ul className="space-y-1">
            {prediction.reasoning.map((reason, idx) => (
              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Last updated: {new Date(prediction.timestamp).toLocaleTimeString()}
        </p>
      </Card>
    </motion.div>
  );
};