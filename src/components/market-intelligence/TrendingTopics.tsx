import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Flame, Zap, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const trendingData = [
  { topic: "#Bitcoin100K", mentions: "234K", sentiment: "bullish", icon: TrendingUp },
  { topic: "#EthereumETF", mentions: "156K", sentiment: "bullish", icon: Zap },
  { topic: "#SolanaBreakout", mentions: "89K", sentiment: "bullish", icon: Flame },
  { topic: "#AltcoinSeason", mentions: "67K", sentiment: "neutral", icon: MessageCircle },
  { topic: "#CryptoRegulation", mentions: "45K", sentiment: "bearish", icon: MessageCircle },
  { topic: "#DeFiSummer", mentions: "38K", sentiment: "bullish", icon: Flame },
];

const topGainers = [
  { symbol: "PEPE", name: "Pepe", change: "+45.67%" },
  { symbol: "WIF", name: "dogwifhat", change: "+32.45%" },
  { symbol: "BONK", name: "Bonk", change: "+28.90%" },
];

const topLosers = [
  { symbol: "LUNA", name: "Terra Classic", change: "-12.34%" },
  { symbol: "FTT", name: "FTX Token", change: "-8.90%" },
  { symbol: "LUNC", name: "Luna Classic", change: "-6.78%" },
];

export const TrendingTopics = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Trending Topics */}
      <Card className="lg:col-span-2 bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Flame className="h-5 w-5 text-warning" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingData.map((item, index) => (
              <motion.div
                key={item.topic}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Badge 
                  variant="outline" 
                  className={`px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                    item.sentiment === 'bullish' ? 'border-success/50 hover:border-success' :
                    item.sentiment === 'bearish' ? 'border-destructive/50 hover:border-destructive' :
                    'border-border'
                  }`}
                >
                  <item.icon className={`h-3 w-3 mr-1.5 ${
                    item.sentiment === 'bullish' ? 'text-success' :
                    item.sentiment === 'bearish' ? 'text-destructive' :
                    'text-muted-foreground'
                  }`} />
                  <span className="font-medium">{item.topic}</span>
                  <span className="ml-2 text-muted-foreground text-xs">{item.mentions}</span>
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gainers & Losers */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Top Movers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success" /> Top Gainers
            </p>
            <div className="space-y-2">
              {topGainers.map((coin) => (
                <div key={coin.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-success">{coin.symbol.slice(0, 2)}</span>
                    </div>
                    <span className="text-sm font-medium">{coin.symbol}</span>
                  </div>
                  <span className="text-sm text-success font-medium">{coin.change}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-border/50 pt-4">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-destructive rotate-180" /> Top Losers
            </p>
            <div className="space-y-2">
              {topLosers.map((coin) => (
                <div key={coin.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-destructive">{coin.symbol.slice(0, 2)}</span>
                    </div>
                    <span className="text-sm font-medium">{coin.symbol}</span>
                  </div>
                  <span className="text-sm text-destructive font-medium">{coin.change}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
