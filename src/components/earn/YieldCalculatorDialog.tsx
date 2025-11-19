import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Product {
  productId: string;
  name: string;
  token: string;
  apr: number;
}

interface YieldCalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export const YieldCalculatorDialog = ({
  open,
  onOpenChange,
  product,
}: YieldCalculatorDialogProps) => {
  const [amount, setAmount] = useState("1000");

  const calculateYield = (days: number) => {
    const principal = parseFloat(amount) || 0;
    return (principal * product.apr / 100 / 365 * days).toFixed(2);
  };

  const dailyYield = calculateYield(1);
  const weeklyYield = calculateYield(7);
  const monthlyYield = calculateYield(30);

  const chartData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    value: parseFloat(amount || "0") + parseFloat(calculateYield(i + 1)),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Yield Calculator - {product.name}</DialogTitle>
          <DialogDescription>
            Estimate your potential earnings at {product.apr}% APR
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="calc-amount">Investment Amount ({product.token})</Label>
            <Input
              id="calc-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <Tabs defaultValue="returns" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="returns">Returns</TabsTrigger>
              <TabsTrigger value="chart">Growth Chart</TabsTrigger>
            </TabsList>

            <TabsContent value="returns" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">Daily</p>
                    <p className="text-2xl font-bold text-green-500">+{dailyYield}</p>
                    <p className="text-xs text-muted-foreground">{product.token}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">Weekly</p>
                    <p className="text-2xl font-bold text-green-500">+{weeklyYield}</p>
                    <p className="text-xs text-muted-foreground">{product.token}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">Monthly</p>
                    <p className="text-2xl font-bold text-green-500">+{monthlyYield}</p>
                    <p className="text-xs text-muted-foreground">{product.token}</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="pt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Principal</span>
                    <span className="font-medium">{amount} {product.token}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>APR</span>
                    <span className="font-medium text-green-500">{product.apr}%</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="font-medium">Est. Monthly Earnings</span>
                    <span className="font-bold text-green-500">+{monthlyYield} {product.token}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chart">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="day"
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: "Days", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: product.token, angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
