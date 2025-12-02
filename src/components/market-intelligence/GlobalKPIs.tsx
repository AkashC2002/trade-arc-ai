import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Gauge, Coins, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const kpiData = [
  {
    label: "Global Market Cap",
    value: "$3.42T",
    change: "+2.34%",
    isPositive: true,
    icon: Coins,
    subtext: "24h Volume: $127.8B"
  },
  {
    label: "CMC Crypto 200",
    value: "1,847.32",
    change: "+1.89%",
    isPositive: true,
    icon: BarChart3,
    subtext: "Top 200 Index"
  },
  {
    label: "Fear & Greed Index",
    value: "72",
    change: "Greed",
    isPositive: true,
    icon: Gauge,
    subtext: "Market Sentiment"
  },
  {
    label: "Altcoin Season Index",
    value: "58",
    change: "Neutral",
    isPositive: null,
    icon: Activity,
    subtext: "75 = Altcoin Season"
  },
  {
    label: "BTC Dominance",
    value: "52.4%",
    change: "-0.32%",
    isPositive: false,
    icon: TrendingDown,
    subtext: "ETH: 17.2%"
  },
  {
    label: "Active Cryptos",
    value: "2.4M+",
    change: "+1,234",
    isPositive: true,
    icon: TrendingUp,
    subtext: "Listed tokens"
  }
];

export const GlobalKPIs = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Global Crypto Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">{kpi.label}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-medium ${
                      kpi.isPositive === true ? 'text-success' : 
                      kpi.isPositive === false ? 'text-destructive' : 
                      'text-warning'
                    }`}>
                      {kpi.change}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{kpi.subtext}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
