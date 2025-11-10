import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { SentimentBadge } from "@/components/sentiment/SentimentBadge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const HoldingsTable = () => {
  const { holdings, isLoading, deleteHolding } = usePortfolio();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <h2 className="text-xl font-bold text-foreground mb-6">Holdings</h2>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-muted-foreground">Asset</TableHead>
              <TableHead className="text-muted-foreground">Sentiment</TableHead>
              <TableHead className="text-muted-foreground">Quantity</TableHead>
              <TableHead className="text-muted-foreground">Avg Buy Price</TableHead>
              <TableHead className="text-muted-foreground">Current Price</TableHead>
              <TableHead className="text-muted-foreground">Value</TableHead>
              <TableHead className="text-muted-foreground">P/L</TableHead>
              <TableHead className="text-muted-foreground">24h</TableHead>
              <TableHead className="text-muted-foreground"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((holding, index) => (
              <motion.tr
                key={holding.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-muted/5 border-b border-border cursor-pointer"
                onClick={() => navigate(`/coin/${holding.symbol}`)}
              >
                <TableCell>
                  <div>
                    <p className="font-semibold text-foreground">{holding.symbol}</p>
                    <p className="text-sm text-muted-foreground">{holding.name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <SentimentBadge symbol={holding.symbol} />
                </TableCell>
                <TableCell className="text-foreground">{holding.quantity}</TableCell>
                <TableCell className="text-foreground">${holding.buyPrice.toLocaleString()}</TableCell>
                <TableCell className="text-foreground">${holding.currentPrice.toLocaleString()}</TableCell>
                <TableCell className="text-foreground font-semibold">${holding.value.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {holding.pnl >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span className={holding.pnl >= 0 ? "text-success font-semibold" : "text-destructive font-semibold"}>
                      {holding.pnl >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(2)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={holding.change24h >= 0 ? "default" : "destructive"}
                    className="font-semibold"
                  >
                    {holding.change24h >= 0 ? '+' : ''}{holding.change24h}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHolding(holding.id);
                    }}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
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