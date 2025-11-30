import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePortfolio } from "@/hooks/usePortfolio";
import { toast } from "sonner";

interface AddHoldingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddHoldingDialog = ({ open, onOpenChange }: AddHoldingDialogProps) => {
  const [formData, setFormData] = useState({
    symbol: "",
    quantity: "",
    buyPrice: "",
    buyDate: new Date().toISOString().split("T")[0],
    orderType: "market",
    limitPrice: "",
    stopLoss: "",
    takeProfit: "",
  });

  const { addHolding } = usePortfolio();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addHolding({
        symbol: formData.symbol.toUpperCase(),
        quantity: parseFloat(formData.quantity),
        buyPrice: parseFloat(formData.buyPrice),
        buyDate: formData.buyDate,
      });
      
      toast.success(`${formData.orderType.toUpperCase()} order placed successfully!`);
      onOpenChange(false);
      setFormData({
        symbol: "",
        quantity: "",
        buyPrice: "",
        buyDate: new Date().toISOString().split("T")[0],
        orderType: "market",
        limitPrice: "",
        stopLoss: "",
        takeProfit: "",
      });
    } catch (error) {
      toast.error("Failed to add holding");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Add New Holding</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol" className="text-foreground">Symbol</Label>
              <Input
                id="symbol"
                placeholder="BTC, ETH, etc."
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                required
                className="bg-secondary/50 border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderType" className="text-foreground">Order Type</Label>
              <select
                id="orderType"
                value={formData.orderType}
                onChange={(e) => setFormData({ ...formData, orderType: e.target.value })}
                className="w-full h-10 px-3 rounded-md bg-secondary/50 border border-border text-foreground"
              >
                <option value="market">Market Order</option>
                <option value="limit">Limit Order</option>
                <option value="stop">Stop Order</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-foreground">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                className="bg-secondary/50 border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyPrice" className="text-foreground">
                {formData.orderType === "market" ? "Market Price (USD)" : "Price (USD)"}
              </Label>
              <Input
                id="buyPrice"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.buyPrice}
                onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                required
                className="bg-secondary/50 border-border text-foreground"
              />
            </div>
          </div>

          {formData.orderType === "limit" && (
            <div className="space-y-2">
              <Label htmlFor="limitPrice" className="text-foreground">Limit Price (USD)</Label>
              <Input
                id="limitPrice"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.limitPrice}
                onChange={(e) => setFormData({ ...formData, limitPrice: e.target.value })}
                className="bg-secondary/50 border-border text-foreground"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stopLoss" className="text-foreground">Stop Loss (Optional)</Label>
              <Input
                id="stopLoss"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.stopLoss}
                onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                className="bg-secondary/50 border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="takeProfit" className="text-foreground">Take Profit (Optional)</Label>
              <Input
                id="takeProfit"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.takeProfit}
                onChange={(e) => setFormData({ ...formData, takeProfit: e.target.value })}
                className="bg-secondary/50 border-border text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyDate" className="text-foreground">Purchase Date</Label>
            <Input
              id="buyDate"
              type="date"
              value={formData.buyDate}
              onChange={(e) => setFormData({ ...formData, buyDate: e.target.value })}
              required
              className="bg-secondary/50 border-border text-foreground"
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold">
              Place {formData.orderType.charAt(0).toUpperCase() + formData.orderType.slice(1)} Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
