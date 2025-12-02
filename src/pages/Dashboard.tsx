import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { HoldingsTable } from "@/components/dashboard/HoldingsTable";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { NewsPanel } from "@/components/dashboard/NewsPanel";
import { AddHoldingDialog } from "@/components/dashboard/AddHoldingDialog";
import { PortfolioAnalytics } from "@/components/analytics/PortfolioAnalytics";
import { ProfitHeatmap } from "@/components/analytics/ProfitHeatmap";
import { MarketMoodGauge } from "@/components/sentiment/MarketMoodGauge";
import { MarketWidgets } from "@/components/market/MarketWidgets";
import { AIChatbot } from "@/components/chat/AIChatbot";
import { PlusCircle, Wallet, TrendingUp, LogOut, Bot, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

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
            <div className="flex gap-2">
              <Button onClick={() => setIsChatbotOpen(true)} variant="outline" className="gap-2 border-border hover:bg-secondary">
                <Bot className="w-4 h-4" />
                AI Assistant
              </Button>
              <Button onClick={() => navigate("/market-intelligence")} variant="outline" className="gap-2 border-border hover:bg-secondary">
                <Globe className="w-4 h-4" />
                Market Intel
              </Button>
              <Button onClick={() => navigate("/earn")} variant="outline" className="gap-2 border-border hover:bg-secondary">
                <TrendingUp className="w-4 h-4" />
                Earn & Yield
              </Button>
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-gradient-primary hover:opacity-90">
                <PlusCircle className="w-4 h-4" />
                Add Holding
              </Button>
              <Button onClick={signOut} variant="outline" size="icon" className="border-border hover:bg-destructive/10">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PortfolioSummary />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <MarketWidgets />
            <PortfolioChart />
            <HoldingsTable />
            <ProfitHeatmap />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <MarketMoodGauge />
            <PortfolioAnalytics />
            <AIInsights />
            <NewsPanel />
          </motion.div>
        </div>
      </main>

      <AddHoldingDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      <AIChatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
      
      {/* Floating AI Button */}
      {!isChatbotOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatbotOpen(true)}
          className="fixed right-6 bottom-6 w-14 h-14 bg-gradient-primary rounded-full shadow-glow flex items-center justify-center z-40 hover:shadow-accent transition-shadow"
        >
          <Bot className="w-6 h-6 text-primary-foreground" />
        </motion.button>
      )}
    </div>
  );
};

export default Dashboard;
