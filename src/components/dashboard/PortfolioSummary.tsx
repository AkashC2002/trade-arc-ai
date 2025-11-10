import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";

export const PortfolioSummary = () => {
  const { summary, isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 animate-pulse bg-card">
            <div className="h-4 bg-muted rounded w-24 mb-4"></div>
            <div className="h-8 bg-muted rounded w-32"></div>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Total Value",
      value: `$${summary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      trend: summary.totalChange24h,
      color: "text-primary",
    },
    {
      label: "24h Change",
      value: `$${Math.abs(summary.change24h).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: summary.change24h >= 0 ? TrendingUp : TrendingDown,
      trend: summary.totalChange24h,
      color: summary.change24h >= 0 ? "text-success" : "text-destructive",
    },
    {
      label: "Total P/L",
      value: `$${Math.abs(summary.totalPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: summary.totalPnL >= 0 ? TrendingUp : TrendingDown,
      trend: summary.totalPnLPercent,
      color: summary.totalPnL >= 0 ? "text-success" : "text-destructive",
    },
    {
      label: "Holdings",
      value: summary.holdingsCount.toString(),
      icon: Percent,
      color: "text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="p-6 bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                {stat.trend !== undefined && (
                  <p
                    className={`text-sm font-medium flex items-center gap-1 ${
                      stat.trend >= 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {stat.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(stat.trend).toFixed(2)}%
                  </p>
                )}
              </div>
              <div className={`w-12 h-12 rounded-lg bg-${stat.color.replace('text-', '')}/10 flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
