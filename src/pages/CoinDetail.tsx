import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { TradingViewWidget } from "@/components/charts/TradingViewWidget";
import { AIPredictionPanel } from "@/components/predictions/AIPredictionPanel";
import { SentimentBadge } from "@/components/sentiment/SentimentBadge";

const CoinDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();

  if (!symbol) {
    return <div>Coin not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">{symbol}</h1>
            <div className="flex items-center gap-2 mt-2">
              <SentimentBadge symbol={symbol} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-gradient-card border-border/50">
              <h2 className="text-xl font-bold text-foreground mb-4">Live Chart</h2>
              <TradingViewWidget symbol={symbol} height={600} />
            </Card>
          </div>

          <div className="space-y-6">
            <AIPredictionPanel symbol={symbol} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoinDetail;