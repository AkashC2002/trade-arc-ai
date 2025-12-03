import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StrategyResult } from '@/lib/strategyEngine';
import { SignalHistory } from '@/hooks/useStrategyEngine';
import { TrendingUp, TrendingDown, Activity, Gauge } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SignalPanelProps {
  currentResult: StrategyResult | null;
  signalHistory: SignalHistory[];
}

export function SignalPanel({ currentResult, signalHistory }: SignalPanelProps) {
  const getSignalColor = (signalType: string) => {
    switch (signalType) {
      case 'strong_buy': return 'bg-green-500 text-white';
      case 'soft_buy': return 'bg-blue-500 text-white';
      case 'strong_sell': return 'bg-red-500 text-white';
      case 'soft_sell': return 'bg-gray-600 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSignalIcon = (signalType: string) => {
    if (signalType.includes('buy')) return <TrendingUp className="h-4 w-4" />;
    if (signalType.includes('sell')) return <TrendingDown className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Current Signal Card */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Current Signal
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={`${getSignalColor(currentResult.signalType)} text-sm px-3 py-1`}>
                  {getSignalIcon(currentResult.signalType)}
                  <span className="ml-1">{currentResult.signalType.replace('_', ' ').toUpperCase()}</span>
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-background/50 rounded-lg p-3">
                  <p className="text-muted-foreground text-xs">EMA 9</p>
                  <p className="font-mono text-red-400 font-semibold">
                    ${currentResult.ema9.toFixed(2)}
                  </p>
                </div>
                <div className="bg-background/50 rounded-lg p-3">
                  <p className="text-muted-foreground text-xs">EMA 15</p>
                  <p className="font-mono font-semibold">
                    ${currentResult.ema15.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="bg-background/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-xs flex items-center gap-1">
                    <Gauge className="h-3 w-3" />
                    Slope Angle
                  </span>
                  <span className={`font-mono font-semibold ${
                    currentResult.slopeAngle >= 50 ? 'text-green-400' : 
                    currentResult.slopeAngle <= -50 ? 'text-red-400' : 
                    'text-muted-foreground'
                  }`}>
                    {currentResult.slopeAngle.toFixed(1)}°
                  </span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      currentResult.slopeAngle >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${Math.min(Math.abs(currentResult.slopeAngle), 90) / 90 * 50 + 50}%`,
                      marginLeft: currentResult.slopeAngle < 0 ? `${50 - Math.min(Math.abs(currentResult.slopeAngle), 90) / 90 * 50}%` : '50%'
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>-90°</span>
                  <span>0°</span>
                  <span>+90°</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`px-2 py-1 rounded ${currentResult.buySignal2 || currentResult.buySignal3 ? 'bg-green-500/20 text-green-400' : 'bg-muted/20 text-muted-foreground'}`}>
                  Buy Signal: {currentResult.buySignal2 ? 'S2' : currentResult.buySignal3 ? 'S3' : 'None'}
                </div>
                <div className={`px-2 py-1 rounded ${currentResult.sellSignal2 || currentResult.sellSignal3 ? 'bg-red-500/20 text-red-400' : 'bg-muted/20 text-muted-foreground'}`}>
                  Sell Signal: {currentResult.sellSignal2 ? 'S2' : currentResult.sellSignal3 ? 'S3' : 'None'}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Calculating...</p>
          )}
        </CardContent>
      </Card>

      {/* Signal History */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Signal History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            {signalHistory.length === 0 ? (
              <p className="text-muted-foreground text-sm p-4">No signals yet. Start the engine to generate signals.</p>
            ) : (
              <div className="space-y-1 p-4">
                {[...signalHistory].reverse().map((signal) => (
                  <div 
                    key={signal.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {getSignalIcon(signal.signalType)}
                      <div>
                        <Badge variant="outline" className={getSignalColor(signal.signalType) + ' text-xs'}>
                          {signal.signalType.replace('_', ' ')}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(signal.time).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">${signal.price.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{signal.slopeAngle.toFixed(1)}°</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
