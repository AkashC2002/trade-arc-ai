import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Zap, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const topGainers = [
  { symbol: "ELIZAOS", price: "$0.01128", change: "+18.34%", rank: 1 },
  { symbol: "CYPR", price: "$0.0817", change: "+15.56%", rank: 2 },
  { symbol: "NUMI", price: "$0.1586", change: "+13.85%", rank: 3 },
];

const liquidationData = {
  total: "277.02M",
  change: "-74.32%",
  trend: "down" as const,
};

const longShortRatio = {
  long: 48.41,
  short: 51.59,
};

const fearGreedIndex = {
  value: 42,
  label: "NEUTRAL",
};

export const MarketWidgets = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Top Gainers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Top Gainers
            </h3>
            <div className="flex gap-2">
              <button className="px-2 py-1 text-xs bg-secondary/50 rounded-md text-muted-foreground hover:text-foreground">
                5m
              </button>
              <button className="px-2 py-1 text-xs bg-primary/20 rounded-md text-primary">
                30m
              </button>
              <button className="px-2 py-1 text-xs bg-secondary/50 rounded-md text-muted-foreground hover:text-foreground">
                4h
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {topGainers.map((gainer, index) => (
              <motion.div
                key={gainer.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-mono text-sm">
                    {gainer.rank}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{gainer.symbol}</p>
                    <p className="text-xs text-muted-foreground">{gainer.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-success font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  {gainer.change}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Liquidation & Market Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-4"
      >
        {/* Liquidation */}
        <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              24h Liquidation
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">
              {liquidationData.total}
            </span>
            <span className="text-destructive flex items-center gap-1 font-semibold">
              <TrendingDown className="w-4 h-4" />
              {liquidationData.change}
            </span>
          </div>
          <div className="mt-4 h-16 flex items-end gap-1">
            {[40, 65, 45, 80, 60, 45, 70, 55, 40, 60, 45, 50].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-destructive/80 to-destructive/40 rounded-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </Card>

        {/* Fear & Greed + Long/Short */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-gradient-card border-border/50 shadow-card">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">
              Fear & Greed Index
            </h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {fearGreedIndex.value}
              </div>
              <div className="text-xs font-semibold text-muted-foreground">
                {fearGreedIndex.label}
              </div>
              <div className="mt-3 h-2 bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-destructive via-warning to-success"
                  style={{ width: `${fearGreedIndex.value}%` }}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card border-border/50 shadow-card">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">
              Long/Short Ratio
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-success">Long</span>
                  <span className="font-semibold text-success">
                    {longShortRatio.long}%
                  </span>
                </div>
                <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success"
                    style={{ width: `${longShortRatio.long}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-destructive">Short</span>
                  <span className="font-semibold text-destructive">
                    {longShortRatio.short}%
                  </span>
                </div>
                <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-destructive"
                    style={{ width: `${longShortRatio.short}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};
