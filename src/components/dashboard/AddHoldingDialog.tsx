import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const { addHolding } = usePortfolio();
  const [formData, setFormData] = useState({
    symbol: "",
    quantity: "",
    buyPrice: "",
    buyDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addHolding({
        symbol: formData.symbol.toUpperCase(),
        quantity: parseFloat(formData.quantity),
        buyPrice: parseFloat(formData.buyPrice),
        buyDate: formData.buyDate,
      });
      
      toast.success("Holding added successfully!");
      onOpenChange(false);
      setFormData({
        symbol: "",
        quantity: "",
        buyPrice: "",
        buyDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      toast.error("Failed to add holding");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Holding</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              placeholder="BTC, ETH, SOL..."
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              required
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              step="any"
              placeholder="0.00"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyPrice">Buy Price ($)</Label>
            <Input
              id="buyPrice"
              type="number"
              step="any"
              placeholder="0.00"
              value={formData.buyPrice}
              onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
              required
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyDate">Purchase Date</Label>
            <Input
              id="buyDate"
              type="date"
              value={formData.buyDate}
              onChange={(e) => setFormData({ ...formData, buyDate: e.target.value })}
              required
              className="bg-background border-border"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Holding
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
