import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Smile, Meh, Frown } from "lucide-react";
import { motion } from "framer-motion";

export const MarketMoodGauge = () => {
  // Mock Fear & Greed Index (0-100)
  const fearGreedIndex = 68; // Greed
  
  const getMoodIcon = () => {
    if (fearGreedIndex > 65) return <Smile className="w-8 h-8 text-success" />;
    if (fearGreedIndex > 35) return <Meh className="w-8 h-8 text-warning" />;
    return <Frown className="w-8 h-8 text-destructive" />;
  };

  const getMoodLabel = () => {
    if (fearGreedIndex > 75) return 'Extreme Greed';
    if (fearGreedIndex > 55) return 'Greed';
    if (fearGreedIndex > 45) return 'Neutral';
    if (fearGreedIndex > 25) return 'Fear';
    return 'Extreme Fear';
  };

  const getMoodColor = () => {
    if (fearGreedIndex > 55) return 'text-success';
    if (fearGreedIndex > 45) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <h3 className="text-lg font-bold text-foreground mb-4">Market Mood</h3>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        {getMoodIcon()}
        <p className={`text-2xl font-bold mt-2 ${getMoodColor()}`}>
          {getMoodLabel()}
        </p>
        <p className="text-sm text-muted-foreground">
          Fear & Greed Index
        </p>
      </motion.div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Index Score</span>
          <span className={`font-bold ${getMoodColor()}`}>{fearGreedIndex}/100</span>
        </div>
        <Progress value={fearGreedIndex} className="h-2" />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 text-xs text-center">
        <div>
          <p className="text-destructive font-semibold">0-25</p>
          <p className="text-muted-foreground">Extreme Fear</p>
        </div>
        <div>
          <p className="text-warning font-semibold">45-55</p>
          <p className="text-muted-foreground">Neutral</p>
        </div>
        <div>
          <p className="text-success font-semibold">75-100</p>
          <p className="text-muted-foreground">Extreme Greed</p>
        </div>
      </div>
    </Card>
  );
};