import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const WealthManagementWidget = () => {
  return (
    <Card className="border-border/50 bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur-sm sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Crown className="w-4 h-4 text-primary-foreground" />
            </div>
            VIP Wealth
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Exclusive
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Private Wealth Management</h3>
          <p className="text-sm text-muted-foreground">
            Access institutional-grade strategies with personalized portfolio management.
          </p>
        </div>

        <div className="space-y-3 py-4 border-y border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Min. Investment</span>
            <span className="font-semibold">$100,000</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Target APR</span>
            <span className="font-semibold text-green-500">15-25%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Lock Period</span>
            <span className="font-semibold">6-12 months</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            ✓ Dedicated Account Manager<br />
            ✓ Customized Strategy<br />
            ✓ Priority Support<br />
            ✓ Quarterly Performance Reviews
          </p>
        </div>

        <Button 
          className="w-full gap-2" 
          onClick={() => toast.info("VIP Wealth Management", {
            description: "Our team will contact you within 24 hours to discuss your investment goals."
          })}
        >
          Learn More
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
