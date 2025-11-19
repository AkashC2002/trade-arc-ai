import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InvestmentDialog } from "./InvestmentDialog";
import { YieldCalculatorDialog } from "./YieldCalculatorDialog";
import { AlertCircle, TrendingUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Product {
  productId: string;
  name: string;
  token: string;
  type: string;
  apr: number;
  aprTier?: string;
  duration: string;
  bonusTag?: string;
  riskLevel: "Low" | "Medium" | "High";
  category: string;
  supportedAssets: string[];
  settlementDetails?: {
    strikePrice?: number;
    settlementDate?: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false);
  const [isCalcDialogOpen, setIsCalcDialogOpen] = useState(false);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "High":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-lg font-bold">
                {product.token.slice(0, 1)}
              </div>
              <div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{product.type}</p>
              </div>
            </div>
            {product.bonusTag && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {product.bonusTag}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-500">
              {product.apr}%
            </span>
            <span className="text-sm text-muted-foreground">APR</span>
            {product.aprTier && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tiered APR: {product.aprTier}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium">{product.duration}</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getRiskColor(product.riskLevel)}>
              {product.riskLevel} Risk
            </Badge>
            {product.riskLevel === "High" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>High-risk products may result in loss of principal. Please review settlement terms carefully.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsCalcDialogOpen(true)}
            >
              Calculate
            </Button>
            <Button
              className="flex-1"
              onClick={() => setIsInvestDialogOpen(true)}
            >
              Earn Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <InvestmentDialog
        open={isInvestDialogOpen}
        onOpenChange={setIsInvestDialogOpen}
        product={product}
      />

      <YieldCalculatorDialog
        open={isCalcDialogOpen}
        onOpenChange={setIsCalcDialogOpen}
        product={product}
      />
    </>
  );
};
