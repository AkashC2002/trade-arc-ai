import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";

export const HoldingsTable = () => {
  const { holdings, isLoading, deleteHolding } = usePortfolio();

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Your Holdings</h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Asset</TableHead>
              <TableHead className="text-muted-foreground text-right">Price</TableHead>
              <TableHead className="text-muted-foreground text-right">Holdings</TableHead>
              <TableHead className="text-muted-foreground text-right">Value</TableHead>
              <TableHead className="text-muted-foreground text-right">P/L</TableHead>
              <TableHead className="text-muted-foreground text-right">24h</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((holding) => (
              <TableRow key={holding.id} className="border-border/50 hover:bg-muted/5">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{holding.symbol.slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{holding.symbol}</p>
                      <p className="text-xs text-muted-foreground">{holding.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-foreground">
                  ${holding.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right text-foreground">
                  {holding.quantity} {holding.symbol}
                </TableCell>
                <TableCell className="text-right font-semibold text-foreground">
                  ${holding.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  <div className={holding.pnl >= 0 ? "text-success" : "text-destructive"}>
                    <p className="font-semibold">
                      ${Math.abs(holding.pnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs">{holding.pnlPercent >= 0 ? "+" : ""}{holding.pnlPercent.toFixed(2)}%</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className={`flex items-center justify-end gap-1 ${holding.change24h >= 0 ? "text-success" : "text-destructive"}`}>
                    {holding.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="font-medium">{Math.abs(holding.change24h).toFixed(2)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteHolding(holding.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
