import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { HoldingsTable } from "@/components/dashboard/HoldingsTable";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { NewsPanel } from "@/components/dashboard/NewsPanel";
import { AddHoldingDialog } from "@/components/dashboard/AddHoldingDialog";
import { PlusCircle, TrendingUp, Wallet } from "lucide-react";

const Dashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CryptoFolio AI
              </h1>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <PlusCircle className="w-4 h-4" />
              Add Holding
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <PortfolioSummary />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PortfolioChart />
            <HoldingsTable />
          </div>

          <div className="space-y-6">
            <AIInsights />
            <NewsPanel />
          </div>
        </div>
      </main>

      <AddHoldingDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
};

export default Dashboard;
