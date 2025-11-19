import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Product {
  productId: string;
  name: string;
  token: string;
  apr: number;
  duration: string;
  riskLevel: string;
  settlementDetails?: {
    strikePrice?: number;
    settlementDate?: string;
  };
}

interface InvestmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export const InvestmentDialog = ({
  open,
  onOpenChange,
  product,
}: InvestmentDialogProps) => {
  const [amount, setAmount] = useState("");

  const handleInvest = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    toast.success("Investment successful!", {
      description: `You've staked ${amount} ${product.token} at ${product.apr}% APR`,
    });
    
    onOpenChange(false);
    setAmount("");
  };

  const estimatedYield = amount ? (parseFloat(amount) * product.apr / 100 / 365).toFixed(4) : "0";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invest in {product.name}</DialogTitle>
          <DialogDescription>
            Earn {product.apr}% APR on your {product.token}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {product.token}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">APR</span>
              <span className="font-medium text-green-500">{product.apr}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">{product.duration}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Risk Level</span>
              <span className="font-medium">{product.riskLevel}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-border">
              <span className="text-muted-foreground">Daily Yield (Est.)</span>
              <span className="font-bold text-green-500">+{estimatedYield} {product.token}</span>
            </div>
          </div>

          {product.settlementDetails && (
            <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3 space-y-1">
              <p className="text-sm font-medium text-yellow-500">Dual Asset Settlement</p>
              {product.settlementDetails.strikePrice && (
                <p className="text-xs text-muted-foreground">
                  Strike Price: ${product.settlementDetails.strikePrice}
                </p>
              )}
              {product.settlementDetails.settlementDate && (
                <p className="text-xs text-muted-foreground">
                  Settlement: {product.settlementDetails.settlementDate}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvest}>Confirm Investment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
