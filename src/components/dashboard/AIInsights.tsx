import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Shield, AlertTriangle } from "lucide-react";
import { useAIInsights } from "@/hooks/useAIInsights";

export const AIInsights = () => {
  const { insights, isLoading } = useAIInsights();

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-32"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low": return "bg-success/20 text-success border-success/30";
      case "medium": return "bg-warning/20 text-warning border-warning/30";
      case "high": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-foreground">AI Insights</h2>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Portfolio Risk</span>
            <Badge className={getRiskColor(insights.risk)}>
              {insights.risk}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Predictions
          </h3>
          {insights.predictions.map((prediction, index) => (
            <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/5 border border-border/30">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{prediction.symbol}</p>
                <p className="text-xs text-muted-foreground">{prediction.direction}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {prediction.confidence}% confident
              </Badge>
            </div>
          ))}
        </div>

        {insights.suggestions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Suggestions
            </h3>
            {insights.suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-foreground">{suggestion}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
