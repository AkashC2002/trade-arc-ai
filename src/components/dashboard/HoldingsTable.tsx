import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { SentimentBadge } from "@/components/sentiment/SentimentBadge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export const HoldingsTable = () => {
  const { holdings, isLoading, deleteHolding } = usePortfolio();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="p-6 bg-card border-border">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (holdings.length === 0) {
    return (
      <Card className="p-12 bg-card border-border text-center">
        <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Holdings Yet</h3>
        <p className="text-muted-foreground">Add your first holding to start tracking your portfolio</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border">
      <h2 className="text-xl font-bold text-foreground mb-6">Holdings</h2>
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border bg-secondary/30">
              <TableHead className="text-muted-foreground font-semibold">Asset</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Sentiment</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Quantity</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Avg Price</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Last Price</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">24h High</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">24h Low</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Value</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">P/L</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">24h</TableHead>
              <TableHead className="text-muted-foreground font-semibold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((holding, index) => (
              <motion.tr
                key={holding.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-secondary/20 border-b border-border/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/coin/${holding.symbol}`)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{holding.symbol.slice(0, 1)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{holding.symbol}</p>
                      <p className="text-xs text-muted-foreground">{holding.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <SentimentBadge symbol={holding.symbol} />
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {holding.quantity.toFixed(6)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${holding.buyPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right font-mono font-semibold">
                  ${holding.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-muted-foreground">
                  ${holding.high24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-muted-foreground">
                  ${holding.low24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right font-mono font-bold">
                  ${holding.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {holding.pnl >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                    )}
                    <div className="flex flex-col items-end">
                      <span className={`font-mono font-semibold text-sm ${holding.pnl >= 0 ? "text-success" : "text-destructive"}`}>
                        {holding.pnl >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(2)}%
                      </span>
                      <span className={`font-mono text-xs ${holding.pnl >= 0 ? "text-success/70" : "text-destructive/70"}`}>
                        {holding.pnl >= 0 ? '+' : ''}${Math.abs(holding.pnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-mono font-semibold ${holding.change24h >= 0 ? "text-success" : "text-destructive"}`}>
                    {holding.change24h >= 0 ? '+' : ''}{holding.change24h.toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHolding(holding.id);
                    }}
                    className="text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};