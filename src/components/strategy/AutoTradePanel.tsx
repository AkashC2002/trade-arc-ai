import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AutoTradeConfig } from '@/hooks/useStrategyEngine';
import { Bot, AlertTriangle, Shield, Zap } from 'lucide-react';

interface AutoTradePanelProps {
  config: AutoTradeConfig;
  setConfig: (config: AutoTradeConfig) => void;
  isEngineRunning: boolean;
}

export function AutoTradePanel({ config, setConfig, isEngineRunning }: AutoTradePanelProps) {
  const handleToggle = () => {
    setConfig({ ...config, enabled: !config.enabled });
  };

  const updateConfig = (key: keyof AutoTradeConfig, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            Auto-Trade (Testnet)
          </CardTitle>
          <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Simulated
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Warning Banner */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-400">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Testnet Mode Only</p>
              <p className="text-yellow-400/80">This feature uses Binance Testnet for paper trading. No real funds are at risk.</p>
            </div>
          </div>
        </div>

        {/* Enable Toggle */}
        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className={`h-4 w-4 ${config.enabled ? 'text-green-400' : 'text-muted-foreground'}`} />
            <Label htmlFor="auto-trade" className="text-sm cursor-pointer">
              Enable Auto-Trading
            </Label>
          </div>
          <Switch
            id="auto-trade"
            checked={config.enabled}
            onCheckedChange={handleToggle}
            disabled={!isEngineRunning}
          />
        </div>

        {!isEngineRunning && (
          <p className="text-xs text-muted-foreground text-center">
            Start the strategy engine to enable auto-trading
          </p>
        )}

        {/* Configuration */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="symbol" className="text-xs text-muted-foreground">
                Trading Pair
              </Label>
              <Input
                id="symbol"
                value={config.symbol}
                onChange={(e) => updateConfig('symbol', e.target.value)}
                className="h-8 text-sm bg-background/50"
                disabled={config.enabled}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="position-size" className="text-xs text-muted-foreground">
                Position Size (BTC)
              </Label>
              <Input
                id="position-size"
                type="number"
                step="0.001"
                value={config.positionSize}
                onChange={(e) => updateConfig('positionSize', parseFloat(e.target.value))}
                className="h-8 text-sm bg-background/50"
                disabled={config.enabled}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="stop-loss" className="text-xs text-muted-foreground">
                Stop Loss %
              </Label>
              <Input
                id="stop-loss"
                type="number"
                step="0.5"
                value={config.stopLossPercent}
                onChange={(e) => updateConfig('stopLossPercent', parseFloat(e.target.value))}
                className="h-8 text-sm bg-background/50"
                disabled={config.enabled}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="take-profit" className="text-xs text-muted-foreground">
                Take Profit %
              </Label>
              <Input
                id="take-profit"
                type="number"
                step="0.5"
                value={config.takeProfitPercent}
                onChange={(e) => updateConfig('takeProfitPercent', parseFloat(e.target.value))}
                className="h-8 text-sm bg-background/50"
                disabled={config.enabled}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="max-positions" className="text-xs text-muted-foreground">
              Max Concurrent Positions
            </Label>
            <Input
              id="max-positions"
              type="number"
              value={config.maxPositions}
              onChange={(e) => updateConfig('maxPositions', parseInt(e.target.value))}
              className="h-8 text-sm bg-background/50"
              disabled={config.enabled}
            />
          </div>
        </div>

        {/* Status */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Status</span>
            <Badge 
              variant="outline" 
              className={config.enabled && isEngineRunning ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-muted/20 text-muted-foreground'}
            >
              {config.enabled && isEngineRunning ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
