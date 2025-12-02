import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalKPIs } from "@/components/market-intelligence/GlobalKPIs";
import { CoinMarketTable } from "@/components/market-intelligence/CoinMarketTable";
import { TrendingTopics } from "@/components/market-intelligence/TrendingTopics";
import { NetworkFilters } from "@/components/market-intelligence/NetworkFilters";
import { AISentimentSummary } from "@/components/market-intelligence/AISentimentSummary";
import { useMarketIntelligence } from "@/hooks/useMarketIntelligence";

const MarketIntelligence = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>("all");
  const { isLoading, refetch } = useMarketIntelligence();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Global Market Intelligence
              </h1>
              <p className="text-xs text-muted-foreground">Real-time crypto market monitoring</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        {/* Global KPIs Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlobalKPIs />
        </motion.section>

        {/* AI Sentiment Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <AISentimentSummary />
        </motion.section>

        {/* Trending Topics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TrendingTopics />
        </motion.section>

        {/* Network Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <NetworkFilters 
            selectedNetwork={selectedNetwork} 
            onNetworkChange={setSelectedNetwork} 
          />
        </motion.section>

        {/* Coin Market Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CoinMarketTable networkFilter={selectedNetwork} />
        </motion.section>
      </main>
    </div>
  );
};

export default MarketIntelligence;
