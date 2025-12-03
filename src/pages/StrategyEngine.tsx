import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, ChartCandlestick, Info } from 'lucide-react';
import { useStrategyEngine } from '@/hooks/useStrategyEngine';
import { StrategyChart } from '@/components/strategy/StrategyChart';
import { SignalPanel } from '@/components/strategy/SignalPanel';
import { AutoTradePanel } from '@/components/strategy/AutoTradePanel';
import { StrategyControls } from '@/components/strategy/StrategyControls';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function StrategyEngine() {
  const [symbol, setSymbol] = useState('BTC');
  const [timeframe, setTimeframe] = useState('1h');
  
  const {
    candles,
    currentResult,
    ema9Data,
    ema15Data,
    signalHistory,
    isRunning,
    autoTradeConfig,
    setAutoTradeConfig,
    startEngine,
    stopEngine
  } = useStrategyEngine(symbol, timeframe);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Strategy Engine</h1>
                  <p className="text-xs text-muted-foreground">9-15 EMA Auto Signal Strategy</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChartCandlestick className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{symbol}/USDT</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Disclaimer */}
        <Alert className="bg-yellow-500/10 border-yellow-500/30">
          <Info className="h-4 w-4 text-yellow-500" />
          <AlertTitle className="text-yellow-500">Educational Purposes Only</AlertTitle>
          <AlertDescription className="text-yellow-500/80">
            This strategy engine is for educational and research purposes only. Past performance does not guarantee future results. 
            Always do your own research before making any trading decisions.
          </AlertDescription>
        </Alert>

        {/* Controls */}
        <StrategyControls
          symbol={symbol}
          timeframe={timeframe}
          isRunning={isRunning}
          onSymbolChange={setSymbol}
          onTimeframeChange={setTimeframe}
          onStart={startEngine}
          onStop={stopEngine}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-3 space-y-4">
            <StrategyChart
              candles={candles}
              ema9Data={ema9Data}
              ema15Data={ema15Data}
              signalHistory={signalHistory}
              height={500}
            />
            
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground bg-card rounded-lg p-3 border border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-red-500"></div>
                <span>EMA 9</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-gray-800"></div>
                <span>EMA 15</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-green-500"></div>
                <span>Strong Buy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-blue-500"></div>
                <span>Soft Buy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-red-500"></div>
                <span>Strong Sell</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-gray-600"></div>
                <span>Soft Sell</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <SignalPanel
              currentResult={currentResult}
              signalHistory={signalHistory}
            />
            <AutoTradePanel
              config={autoTradeConfig}
              setConfig={setAutoTradeConfig}
              isEngineRunning={isRunning}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
