import { useState } from "react";
import { toast } from "sonner";

interface Position {
  positionId: string;
  userId: string;
  productId: string;
  amountInvested: number;
  yieldGenerated: number;
  startDate: string;
  endDate?: string;
  status: "active" | "settled" | "pending";
}

const MOCK_POSITIONS: Position[] = [
  {
    positionId: "1",
    userId: "user1",
    productId: "1",
    amountInvested: 0.5,
    yieldGenerated: 0.00074,
    startDate: "2025-11-18",
    status: "active",
  },
  {
    positionId: "2",
    userId: "user1",
    productId: "2",
    amountInvested: 5000,
    yieldGenerated: 0.92,
    startDate: "2025-11-15",
    status: "active",
  },
];

export const useEarnPositions = () => {
  const [positions, setPositions] = useState<Position[]>(MOCK_POSITIONS);

  const totalEarnAssets = positions
    .filter((p) => p.status === "active")
    .reduce((sum, p) => {
      // Mock price conversion (in real app, use actual prices)
      const btcPrice = 67850;
      const usdtPrice = 1;
      
      if (p.productId === "1") return sum + p.amountInvested * btcPrice;
      return sum + p.amountInvested * usdtPrice;
    }, 0);

  const yesterdayYield = positions
    .filter((p) => p.status === "active")
    .reduce((sum, p) => {
      const btcPrice = 67850;
      const usdtPrice = 1;
      
      if (p.productId === "1") return sum + p.yieldGenerated * btcPrice;
      return sum + p.yieldGenerated * usdtPrice;
    }, 0);

  const autoAllocate = () => {
    // Mock auto-allocation logic
    toast.success("Auto-allocation complete", {
      description: "Your idle assets have been allocated to optimal yield products",
    });
    
    // In real implementation, this would:
    // 1. Detect idle assets in user's portfolio
    // 2. Find best APR products for those assets
    // 3. Create new positions automatically
  };

  const addPosition = (position: Omit<Position, "positionId">) => {
    const newPosition: Position = {
      ...position,
      positionId: Date.now().toString(),
    };
    setPositions([...positions, newPosition]);
    
    // Send notification
    toast.success("Position created", {
      description: `Your investment is now earning yield`,
    });
  };

  return {
    positions,
    totalEarnAssets,
    yesterdayYield,
    autoAllocate,
    addPosition,
  };
};
