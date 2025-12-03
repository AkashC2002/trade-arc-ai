import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Candle, 
  StrategyResult, 
  generateMockCandles, 
  generateNextCandle, 
  evaluateStrategy,
  calculateEMA
} from '@/lib/strategyEngine';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SignalHistory {
  id: string;
  time: number;
  signalType: StrategyResult['signalType'];
  price: number;
  ema9: number;
  ema15: number;
  slopeAngle: number;
}

export interface AutoTradeConfig {
  enabled: boolean;
  symbol: string;
  positionSize: number;
  maxPositions: number;
  stopLossPercent: number;
  takeProfitPercent: number;
}

export function useStrategyEngine(symbol: string = 'BTC', timeframe: string = '1h') {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [currentResult, setCurrentResult] = useState<StrategyResult | null>(null);
  const [ema9Data, setEma9Data] = useState<number[]>([]);
  const [ema15Data, setEma15Data] = useState<number[]>([]);
  const [signalHistory, setSignalHistory] = useState<SignalHistory[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [autoTradeConfig, setAutoTradeConfig] = useState<AutoTradeConfig>({
    enabled: false,
    symbol: 'BTCUSDT',
    positionSize: 0.001,
    maxPositions: 3,
    stopLossPercent: 2,
    takeProfitPercent: 4
  });
  
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const signalCountRef = useRef(0);

  // Initialize with mock data
  useEffect(() => {
    const initialCandles = generateMockCandles(45000, 100, 0.015);
    setCandles(initialCandles);
    
    const closes = initialCandles.map(c => c.close);
    setEma9Data(calculateEMA(closes, 9));
    setEma15Data(calculateEMA(closes, 15));
    
    const result = evaluateStrategy(initialCandles);
    setCurrentResult(result);
  }, [symbol]);

  // Log signal to database
  const logSignal = useCallback(async (candle: Candle, result: StrategyResult) => {
    if (result.signalType === 'neutral') return;
    
    try {
      const { error } = await supabase.from('algorithm_signals').insert({
        symbol,
        timeframe,
        signal_type: result.signalType,
        ema9: result.ema9,
        ema15: result.ema15,
        slope_angle: result.slopeAngle,
        open_price: candle.open,
        high_price: candle.high,
        low_price: candle.low,
        close_price: candle.close,
        candle_time: new Date(candle.time).toISOString(),
        metadata: {
          buySignal2: result.buySignal2,
          buySignal3: result.buySignal3,
          sellSignal2: result.sellSignal2,
          sellSignal3: result.sellSignal3
        }
      });
      
      if (error) console.error('Failed to log signal:', error);
    } catch (err) {
      console.error('Error logging signal:', err);
    }
  }, [symbol, timeframe]);

  // Process new candle
  const processCandle = useCallback((newCandle: Candle) => {
    setCandles(prev => {
      const updated = [...prev.slice(-99), newCandle];
      
      const closes = updated.map(c => c.close);
      const newEma9 = calculateEMA(closes, 9);
      const newEma15 = calculateEMA(closes, 15);
      
      setEma9Data(newEma9);
      setEma15Data(newEma15);
      
      const result = evaluateStrategy(updated);
      setCurrentResult(result);
      
      if (result && result.signalType !== 'neutral') {
        signalCountRef.current += 1;
        const newSignal: SignalHistory = {
          id: `signal-${signalCountRef.current}`,
          time: newCandle.time,
          signalType: result.signalType,
          price: newCandle.close,
          ema9: result.ema9,
          ema15: result.ema15,
          slopeAngle: result.slopeAngle
        };
        
        setSignalHistory(prev => [...prev.slice(-49), newSignal]);
        logSignal(newCandle, result);
        
        // Show toast for strong signals
        if (result.signalType === 'strong_buy' || result.signalType === 'strong_sell') {
          toast({
            title: result.signalType === 'strong_buy' ? '🟢 Strong Buy Signal' : '🔴 Strong Sell Signal',
            description: `${symbol} @ $${newCandle.close.toFixed(2)} | Angle: ${result.slopeAngle.toFixed(1)}°`,
            variant: result.signalType === 'strong_buy' ? 'default' : 'destructive'
          });
        }
        
        // Auto-trade logic (simulated)
        if (autoTradeConfig.enabled && (result.signalType === 'strong_buy' || result.signalType === 'strong_sell')) {
          console.log(`[AUTO-TRADE] ${result.signalType.toUpperCase()} executed at $${newCandle.close.toFixed(2)}`);
        }
      }
      
      return updated;
    });
  }, [logSignal, toast, symbol, autoTradeConfig.enabled]);

  // Start/stop real-time simulation
  const startEngine = useCallback(() => {
    if (intervalRef.current) return;
    
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setCandles(prev => {
        if (prev.length === 0) return prev;
        const lastCandle = prev[prev.length - 1];
        const newCandle = generateNextCandle(lastCandle, 0.008);
        processCandle(newCandle);
        return prev;
      });
    }, 3000); // Generate new candle every 3 seconds for demo
    
    toast({
      title: 'Strategy Engine Started',
      description: 'Real-time signal generation is now active'
    });
  }, [processCandle, toast]);

  const stopEngine = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    
    toast({
      title: 'Strategy Engine Stopped',
      description: 'Signal generation paused'
    });
  }, [toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    candles,
    currentResult,
    ema9Data,
    ema15Data,
    signalHistory,
    isRunning,
    autoTradeConfig,
    setAutoTradeConfig,
    startEngine,
    stopEngine,
    processCandle
  };
}
