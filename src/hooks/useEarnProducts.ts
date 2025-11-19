import { useState, useEffect } from "react";

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

const MOCK_PRODUCTS: Product[] = [
  {
    productId: "1",
    name: "BTC On-Chain Earn",
    token: "BTC",
    type: "On-Chain Earn",
    apr: 5.4,
    duration: "Flexible",
    bonusTag: "Bonus",
    riskLevel: "Low",
    category: "Steady Returns",
    supportedAssets: ["BTC"],
  },
  {
    productId: "2",
    name: "USDT Easy Earn",
    token: "USDT",
    type: "Easy Earn",
    apr: 6.72,
    aprTier: "Up to 8% for VIP",
    duration: "Flexible",
    riskLevel: "Low",
    category: "Steady Returns",
    supportedAssets: ["USDT"],
  },
  {
    productId: "3",
    name: "BTC-USDT Dual Asset",
    token: "BTC-USDT",
    type: "Dual Asset",
    apr: 194.71,
    duration: "3 Days",
    riskLevel: "High",
    category: "Top Gains",
    supportedAssets: ["BTC", "USDT"],
    settlementDetails: {
      strikePrice: 67500,
      settlementDate: "2025-11-22",
    },
  },
  {
    productId: "4",
    name: "ETH Flexible Staking",
    token: "ETH",
    type: "Flexible Staking",
    apr: 4.85,
    duration: "Flexible",
    riskLevel: "Low",
    category: "Steady Returns",
    supportedAssets: ["ETH"],
  },
  {
    productId: "5",
    name: "SOL High Yield",
    token: "SOL",
    type: "Fixed Staking",
    apr: 12.5,
    duration: "30 Days",
    bonusTag: "Hot",
    riskLevel: "Medium",
    category: "Top Gains",
    supportedAssets: ["SOL"],
  },
  {
    productId: "6",
    name: "USDC Savings",
    token: "USDC",
    type: "Easy Earn",
    apr: 7.2,
    duration: "Flexible",
    riskLevel: "Low",
    category: "Steady Returns",
    supportedAssets: ["USDC"],
  },
  {
    productId: "7",
    name: "ETH-USDT Dual Asset",
    token: "ETH-USDT",
    type: "Dual Asset",
    apr: 156.3,
    duration: "7 Days",
    riskLevel: "High",
    category: "Top Gains",
    supportedAssets: ["ETH", "USDT"],
    settlementDetails: {
      strikePrice: 3400,
      settlementDate: "2025-11-26",
    },
  },
  {
    productId: "8",
    name: "BTC VIP Vault",
    token: "BTC",
    type: "VIP Exclusive",
    apr: 8.9,
    duration: "90 Days",
    bonusTag: "VIP",
    riskLevel: "Medium",
    category: "VIP Exclusive",
    supportedAssets: ["BTC"],
  },
];

const CATEGORIES = ["Steady Returns", "Top Gains", "VIP Exclusive"];

export const useEarnProducts = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);

  // In real implementation, fetch from API
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setIsLoading(false);
    }, 500);
  }, []);

  return {
    products,
    categories: CATEGORIES,
    isLoading,
  };
};
