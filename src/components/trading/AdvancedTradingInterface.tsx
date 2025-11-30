import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent,
  Clock,
  Target,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";

interface AdvancedTradingInterfaceProps {
  symbol: string;
  currentPrice?: number;
}

export const AdvancedTradingInterface = ({ 
  symbol, 
  currentPrice = 50000 
}: AdvancedTradingInterfaceProps) => {
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop-limit">("market");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(currentPrice.toString());
  const [stopPrice, setStopPrice] = useState("");
  const [leverage, setLeverage] = useState([1]);
  const [timeInForce, setTimeInForce] = useState("GTC");

  const calculateTotal = () => {
    const qty = parseFloat(amount) || 0;
    const prc = parseFloat(price) || currentPrice;
    return (qty * prc).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      symbol,
      orderType,
      tradeType,
      amount,
      price,
      stopPrice,
      leverage: leverage[0],
      timeInForce
    });
  };

  return (
    <Card className="bg-gradient-card border-border/50 overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Trade Type Selector */}
        <Tabs value={tradeType} onValueChange={(v) => setTradeType(v as "buy" | "sell")}>
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger 
              value="buy" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/20 data-[state=active]:to-green-600/20 data-[state=active]:text-green-400"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Buy {symbol}
            </TabsTrigger>
            <TabsTrigger 
              value="sell"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/20 data-[state=active]:to-red-600/20 data-[state=active]:text-red-400"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Sell {symbol}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Order Type Selector */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Order Type</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={orderType === "market" ? "default" : "outline"}
              size="sm"
              onClick={() => setOrderType("market")}
              className="text-xs"
            >
              Market
            </Button>
            <Button
              variant={orderType === "limit" ? "default" : "outline"}
              size="sm"
              onClick={() => setOrderType("limit")}
              className="text-xs"
            >
              Limit
            </Button>
            <Button
              variant={orderType === "stop-limit" ? "default" : "outline"}
              size="sm"
              onClick={() => setOrderType("stop-limit")}
              className="text-xs"
            >
              Stop-Limit
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Price Input */}
          {orderType !== "market" && (
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {orderType === "stop-limit" ? "Limit Price" : "Price"}
              </Label>
              <Input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={currentPrice.toString()}
                className="bg-secondary/50 border-border"
              />
            </div>
          )}

          {/* Stop Price */}
          {orderType === "stop-limit" && (
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Stop Price
              </Label>
              <Input
                type="number"
                step="0.01"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                placeholder="Trigger price"
                className="bg-secondary/50 border-border"
              />
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-2">
            <Label className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4" />
              Amount ({symbol})
            </Label>
            <Input
              type="number"
              step="0.00000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-secondary/50 border-border"
              required
            />
            <div className="flex gap-2">
              {[25, 50, 75, 100].map((percent) => (
                <Button
                  key={percent}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => setAmount((currentPrice * (percent / 100) / currentPrice).toString())}
                >
                  {percent}%
                </Button>
              ))}
            </div>
          </div>

          {/* Leverage Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Leverage
              </Label>
              <Badge variant="outline" className="bg-gradient-primary/10">
                {leverage[0]}x
              </Badge>
            </div>
            <Slider
              value={leverage}
              onValueChange={setLeverage}
              max={125}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1x</span>
              <span>25x</span>
              <span>50x</span>
              <span>125x</span>
            </div>
          </div>

          {/* Time in Force */}
          <div className="space-y-2">
            <Label className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time in Force
            </Label>
            <select
              value={timeInForce}
              onChange={(e) => setTimeInForce(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-secondary/50 border border-border text-foreground text-sm"
            >
              <option value="GTC">Good Till Cancel</option>
              <option value="IOC">Immediate or Cancel</option>
              <option value="FOK">Fill or Kill</option>
            </select>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-secondary/30 border border-border/30 space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold">${calculateTotal()} USDT</span>
            </div>
            {leverage[0] > 1 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Max Position</span>
                <span className="font-semibold text-accent">
                  ${(parseFloat(calculateTotal()) * leverage[0]).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fee (0.1%)</span>
              <span>${(parseFloat(calculateTotal()) * 0.001).toFixed(2)}</span>
            </div>
          </motion.div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={`w-full font-semibold ${
              tradeType === "buy"
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            }`}
          >
            {tradeType === "buy" ? "Buy" : "Sell"} {symbol}
          </Button>
        </form>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/30">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Available Balance</p>
            <p className="text-sm font-semibold">12,450.00 USDT</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Max {tradeType === "buy" ? "Buy" : "Sell"}</p>
            <p className="text-sm font-semibold">0.2485 {symbol}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
