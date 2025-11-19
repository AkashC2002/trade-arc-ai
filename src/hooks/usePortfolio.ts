import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

interface Holding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercent: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
}

interface PortfolioSummary {
  totalValue: number;
  change24h: number;
  totalChange24h: number;
  totalPnL: number;
  totalPnLPercent: number;
  holdingsCount: number;
}

export const usePortfolio = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchHoldings = async () => {
    if (!user) {
      setHoldings([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("holdings")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      const enrichedHoldings: Holding[] = (data || []).map((holding) => {
        const currentPrice = holding.buy_price * (1 + Math.random() * 0.2);
        const value = holding.quantity * currentPrice;
        const pnl = value - (holding.quantity * holding.buy_price);
        const pnlPercent = (pnl / (holding.quantity * holding.buy_price)) * 100;
        
        return {
          id: holding.id,
          symbol: holding.symbol,
          name: holding.name,
          quantity: parseFloat(holding.quantity.toString()),
          buyPrice: parseFloat(holding.buy_price.toString()),
          currentPrice,
          value,
          pnl,
          pnlPercent,
          change24h: (Math.random() - 0.5) * 10,
          high24h: currentPrice * 1.05,
          low24h: currentPrice * 0.95,
          volume24h: Math.random() * 1000000000,
          marketCap: Math.random() * 100000000000,
        };
      });

      setHoldings(enrichedHoldings);
    } catch (error: any) {
      toast({
        title: "Error fetching holdings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, [user]);

  const summary: PortfolioSummary = {
    totalValue: holdings.reduce((sum, h) => sum + h.value, 0),
    change24h: holdings.reduce((sum, h) => sum + (h.value * h.change24h / 100), 0),
    totalChange24h: (holdings.reduce((sum, h) => sum + (h.value * h.change24h / 100), 0) / holdings.reduce((sum, h) => sum + h.value, 0)) * 100,
    totalPnL: holdings.reduce((sum, h) => sum + h.pnl, 0),
    totalPnLPercent: (holdings.reduce((sum, h) => sum + h.pnl, 0) / holdings.reduce((sum, h) => sum + (h.value - h.pnl), 0)) * 100,
    holdingsCount: holdings.length,
  };

  // Generate mock chart data
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: summary.totalValue * (0.8 + Math.random() * 0.4),
  }));

  const addHolding = async (data: { symbol: string; quantity: number; buyPrice: number; buyDate: string }) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("holdings").insert({
        user_id: user.id,
        symbol: data.symbol.toUpperCase(),
        name: data.symbol,
        quantity: data.quantity,
        buy_price: data.buyPrice,
        buy_date: data.buyDate,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Holding added successfully",
      });

      fetchHoldings();
    } catch (error: any) {
      toast({
        title: "Error adding holding",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteHolding = async (id: string) => {
    try {
      const { error } = await supabase.from("holdings").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Holding deleted successfully",
      });

      fetchHoldings();
    } catch (error: any) {
      toast({
        title: "Error deleting holding",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    holdings,
    summary,
    chartData,
    isLoading,
    addHolding,
    deleteHolding,
  };
};
