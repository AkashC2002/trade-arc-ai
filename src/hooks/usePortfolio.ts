import { useState, useEffect } from "react";

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
}

interface PortfolioSummary {
  totalValue: number;
  change24h: number;
  totalChange24h: number;
  totalPnL: number;
  totalPnLPercent: number;
  holdingsCount: number;
}

// Mock data for demo - will be replaced with real API calls
const MOCK_HOLDINGS: Holding[] = [
  {
    id: "1",
    symbol: "BTC",
    name: "Bitcoin",
    quantity: 0.5,
    buyPrice: 45000,
    currentPrice: 67850,
    value: 33925,
    pnl: 11425,
    pnlPercent: 50.78,
    change24h: 2.34,
  },
  {
    id: "2",
    symbol: "ETH",
    name: "Ethereum",
    quantity: 5,
    buyPrice: 2800,
    currentPrice: 3450,
    value: 17250,
    pnl: 3250,
    pnlPercent: 23.21,
    change24h: 1.89,
  },
  {
    id: "3",
    symbol: "SOL",
    name: "Solana",
    quantity: 50,
    buyPrice: 95,
    currentPrice: 142,
    value: 7100,
    pnl: 2350,
    pnlPercent: 49.47,
    change24h: -0.56,
  },
];

export const usePortfolio = () => {
  const [holdings, setHoldings] = useState<Holding[]>(MOCK_HOLDINGS);
  const [isLoading, setIsLoading] = useState(false);

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
    // In real app, this would call an API
    const newHolding: Holding = {
      id: Date.now().toString(),
      symbol: data.symbol,
      name: data.symbol,
      quantity: data.quantity,
      buyPrice: data.buyPrice,
      currentPrice: data.buyPrice * 1.1, // Mock current price
      value: data.quantity * data.buyPrice * 1.1,
      pnl: data.quantity * data.buyPrice * 0.1,
      pnlPercent: 10,
      change24h: Math.random() * 10 - 5,
    };
    setHoldings([...holdings, newHolding]);
  };

  const deleteHolding = async (id: string) => {
    setHoldings(holdings.filter(h => h.id !== id));
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
