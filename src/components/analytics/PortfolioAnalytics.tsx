import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Activity, Target, AlertTriangle } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { motion } from "framer-motion";

export const PortfolioAnalytics = () => {
  const { holdings, summary } = usePortfolio();

  // Calculate volatility index (simplified)
  const volatilityIndex = Math.min(100, Math.abs(summary.totalChange24h) * 10);
  const volatilityLevel = volatilityIndex < 30 ? 'Low' : volatilityIndex < 60 ? 'Medium' : 'High';
  
  // Calculate diversification score
  const diversificationScore = Math.min(100, (holdings.length / 10) * 100);
  
  // Calculate AI portfolio health score
  const healthScore = Math.round(
    (summary.totalPnLPercent > 0 ? 40 : 20) + 
    (diversificationScore * 0.3) + 
    ((100 - volatilityIndex) * 0.3)
  );

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getVolatilityColor = (level: string) => {
    if (level === 'Low') return 'bg-success/20 text-success border-success/30';
    if (level === 'Medium') return 'bg-warning/20 text-warning border-warning/30';
    return 'bg-destructive/20 text-destructive border-destructive/30';
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Advanced Analytics</h2>
      </div>

      <div className="space-y-6">
        {/* AI Portfolio Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">AI Portfolio Health Score</span>
            <span className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
              {healthScore}/100
            </span>
          </div>
          <Progress value={healthScore} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {healthScore >= 80 ? '🎯 Excellent portfolio performance' :
             healthScore >= 60 ? '📊 Good performance, room for optimization' :
             '⚠️ Consider rebalancing and diversification'}
          </p>
        </motion.div>

        {/* Volatility Index */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Portfolio Volatility</span>
            <Badge className={getVolatilityColor(volatilityLevel)}>
              {volatilityLevel}
            </Badge>
          </div>
          <Progress value={volatilityIndex} className="h-2" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="w-3 h-3" />
            <span>Risk score: {volatilityIndex.toFixed(1)}/100</span>
          </div>
        </motion.div>

        {/* Diversification Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Diversification</span>
            <span className="text-sm font-semibold text-foreground">
              {diversificationScore.toFixed(0)}%
            </span>
          </div>
          <Progress value={diversificationScore} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {holdings.length} assets in portfolio
            {holdings.length < 5 && ' - Consider adding more for better diversification'}
          </p>
        </motion.div>

        {/* Performance vs Benchmark */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-4 rounded-lg bg-muted/5 border border-border/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Performance vs BTC</span>
            {summary.totalChange24h > 2.34 ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Your portfolio: {summary.totalChange24h.toFixed(2)}% | BTC: +2.34%
          </p>
          <p className="text-xs font-semibold mt-1 text-foreground">
            {summary.totalChange24h > 2.34 ? 
              `Outperforming by ${(summary.totalChange24h - 2.34).toFixed(2)}%` :
              `Underperforming by ${(2.34 - summary.totalChange24h).toFixed(2)}%`
            }
          </p>
        </motion.div>

        {/* Top Performer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-4 rounded-lg bg-primary/5 border border-primary/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Top Performer</span>
          </div>
          {holdings.length > 0 && (
            <div>
              <p className="text-foreground font-semibold">
                {holdings.reduce((top, h) => h.pnlPercent > top.pnlPercent ? h : top).symbol}
              </p>
              <p className="text-xs text-muted-foreground">
                +{holdings.reduce((top, h) => h.pnlPercent > top.pnlPercent ? h : top).pnlPercent.toFixed(2)}% gain
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </Card>
  );
};