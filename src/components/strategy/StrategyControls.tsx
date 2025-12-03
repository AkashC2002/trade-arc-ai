import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RefreshCw, Settings } from 'lucide-react';

interface StrategyControlsProps {
  symbol: string;
  timeframe: string;
  isRunning: boolean;
  onSymbolChange: (symbol: string) => void;
  onTimeframeChange: (timeframe: string) => void;
  onStart: () => void;
  onStop: () => void;
}

const symbols = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'DOGE', 'AVAX'];
const timeframes = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: '1 Day' },
];

export function StrategyControls({
  symbol,
  timeframe,
  isRunning,
  onSymbolChange,
  onTimeframeChange,
  onStart,
  onStop
}: StrategyControlsProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Symbol Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Symbol:</span>
            <Select value={symbol} onValueChange={onSymbolChange} disabled={isRunning}>
              <SelectTrigger className="w-[100px] h-9 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {symbols.map(s => (
                  <SelectItem key={s} value={s}>{s}/USDT</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Timeframe:</span>
            <Select value={timeframe} onValueChange={onTimeframeChange} disabled={isRunning}>
              <SelectTrigger className="w-[120px] h-9 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map(tf => (
                  <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Engine Status */}
          <Badge 
            variant="outline" 
            className={`${isRunning ? 'bg-green-500/10 text-green-400 border-green-500/30 animate-pulse' : 'bg-muted/20 text-muted-foreground'}`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 ${isRunning ? 'bg-green-400' : 'bg-muted-foreground'}`} />
            {isRunning ? 'Live' : 'Stopped'}
          </Badge>

          {/* Control Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {isRunning ? (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={onStop}
                className="gap-2"
              >
                <Pause className="h-4 w-4" />
                Stop Engine
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm"
                onClick={onStart}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4" />
                Start Engine
              </Button>
            )}
          </div>
        </div>

        {/* Strategy Info */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Settings className="h-3 w-3" />
            <span>9-15 EMA Auto Signal Strategy | Angle Threshold: 50° | Educational Purposes Only</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
