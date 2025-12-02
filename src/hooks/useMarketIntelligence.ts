import { useState, useCallback } from "react";

export const useMarketIntelligence = () => {
  const [isLoading, setIsLoading] = useState(false);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    refetch
  };
};
