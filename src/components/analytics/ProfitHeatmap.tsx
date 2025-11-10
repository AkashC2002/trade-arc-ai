import { Card } from "@/components/ui/card";
import { usePortfolio } from "@/hooks/usePortfolio";
import { motion } from "framer-motion";

export const ProfitHeatmap = () => {
  const { holdings } = usePortfolio();

  const getHeatmapColor = (pnlPercent: number) => {
    if (pnlPercent > 40) return 'bg-success/80';
    if (pnlPercent > 20) return 'bg-success/60';
    if (pnlPercent > 10) return 'bg-success/40';
    if (pnlPercent > 0) return 'bg-success/20';
    if (pnlPercent > -10) return 'bg-destructive/20';
    if (pnlPercent > -20) return 'bg-destructive/40';
    return 'bg-destructive/60';
  };

  const getTextColor = (pnlPercent: number) => {
    if (Math.abs(pnlPercent) > 20) return 'text-foreground';
    return 'text-foreground/80';
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <h3 className="text-lg font-bold text-foreground mb-4">Profit/Loss Heatmap</h3>
      <div className="grid grid-cols-3 gap-3">
        {holdings.map((holding, index) => (
          <motion.div
            key={holding.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`p-4 rounded-lg ${getHeatmapColor(holding.pnlPercent)} border border-border/30 hover:scale-105 transition-transform cursor-pointer`}
          >
            <p className={`text-sm font-bold ${getTextColor(holding.pnlPercent)}`}>
              {holding.symbol}
            </p>
            <p className={`text-xs ${getTextColor(holding.pnlPercent)}`}>
              {holding.pnlPercent > 0 ? '+' : ''}{holding.pnlPercent.toFixed(1)}%
            </p>
            <p className={`text-xs font-semibold mt-1 ${getTextColor(holding.pnlPercent)}`}>
              ${Math.abs(holding.pnl).toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-destructive/60"></div>
          <span>Loss</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted"></div>
          <span>Break-even</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success/60"></div>
          <span>Profit</span>
        </div>
      </div>
    </Card>
  );
};