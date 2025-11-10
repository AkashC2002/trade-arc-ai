import { useState, useEffect } from "react";

interface NewsArticle {
  title: string;
  url: string;
  source: string;
  sentiment: "Positive" | "Negative" | "Neutral";
}

// Mock data - will be replaced with real news API
const MOCK_NEWS: NewsArticle[] = [
  {
    title: "Bitcoin reaches new all-time high as institutional adoption grows",
    url: "#",
    source: "CoinDesk",
    sentiment: "Positive",
  },
  {
    title: "Ethereum upgrade successfully deployed, network scalability improved",
    url: "#",
    source: "CoinTelegraph",
    sentiment: "Positive",
  },
  {
    title: "SEC announces new crypto regulation framework",
    url: "#",
    source: "Bloomberg",
    sentiment: "Neutral",
  },
  {
    title: "Major DeFi protocol suffers security breach, funds recovered",
    url: "#",
    source: "The Block",
    sentiment: "Negative",
  },
  {
    title: "Solana network experiences brief outage, quickly resolved",
    url: "#",
    source: "Decrypt",
    sentiment: "Negative",
  },
];

export const useNews = () => {
  const [news, setNews] = useState<NewsArticle[]>(MOCK_NEWS);
  const [isLoading, setIsLoading] = useState(false);

  return {
    news,
    isLoading,
  };
};
