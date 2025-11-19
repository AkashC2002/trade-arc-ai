import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Zap } from "lucide-react";
import { toast } from "sonner";

interface EarnOverviewHeaderProps {
  totalEarnAssets: number;
  yesterdayYield: number;
  onAutoEarn: () => void;
}

export const EarnOverviewHeader = ({
  totalEarnAssets,
  yesterdayYield,
  onAutoEarn,
}: EarnOverviewHeaderProps) => {
  const handleAutoEarn = () => {
    onAutoEarn();
    toast.success("Auto-Earn activated", {
      description: "Your idle assets are now optimized for maximum yield",
    });
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Earn Asset</p>
            <p className="text-3xl font-bold">
              ${totalEarnAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Yesterday's Yield</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-green-500">
                +${yesterdayYield.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleAutoEarn}
              className="w-full gap-2"
              size="lg"
            >
              <Zap className="w-4 h-4" />
              Auto-Earn
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
