// Pine Script 9-15 EMA Strategy - Exact Implementation
// Educational purposes only

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface StrategyResult {
  ema9: number;
  ema15: number;
  slopeAngle: number;
  signalType: 'strong_buy' | 'soft_buy' | 'strong_sell' | 'soft_sell' | 'neutral';
  buySignal2: boolean;
  buySignal3: boolean;
  sellSignal2: boolean;
  sellSignal3: boolean;
  buyConditionAngle: boolean;
  sellConditionAngle: boolean;
}

// Calculate EMA
export function calculateEMA(prices: number[], period: number): number[] {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA is SMA
  let sum = 0;
  for (let i = 0; i < period && i < prices.length; i++) {
    sum += prices[i];
  }
  ema[period - 1] = sum / period;
  
  // Calculate subsequent EMAs
  for (let i = period; i < prices.length; i++) {
    ema[i] = (prices[i] - ema[i - 1]) * multiplier + ema[i - 1];
  }
  
  return ema;
}

// Calculate slope angle in degrees (matching Pine Script logic)
export function calculateSlopeAngle(ema9Current: number, ema9Previous: number, mintick: number = 0.01): number {
  const piInput = 5.58159265; // From Pine Script input
  const angle = Math.atan((ema9Current - ema9Previous) / mintick) * (180 / piInput);
  return angle;
}

// Evaluate strategy on a single candle with history context
export function evaluateStrategy(
  candles: Candle[],
  angleThreshold: number = 50
): StrategyResult | null {
  if (candles.length < 16) return null; // Need enough history for EMA15
  
  const closes = candles.map(c => c.close);
  const ema9Array = calculateEMA(closes, 9);
  const ema15Array = calculateEMA(closes, 15);
  
  const lastIndex = candles.length - 1;
  const current = candles[lastIndex];
  
  const ema9 = ema9Array[lastIndex];
  const ema15 = ema15Array[lastIndex];
  const ema9Prev = ema9Array[lastIndex - 1];
  
  if (!ema9 || !ema15 || !ema9Prev) return null;
  
  // Calculate slope angle
  const mintick = current.close * 0.0001; // Dynamic mintick based on price
  const slopeAngle = calculateSlopeAngle(ema9, ema9Prev, mintick);
  
  const { open, high, low, close } = current;
  
  // Buy Signal 2: Bullish candle with specific EMA conditions
  // close > open and open < ema9 and open > ema15 and close > ema9 and low > ema15 
  // and high - max(open, close) <= abs(open - close) * 0.3
  const buySignal2 = 
    close > open && 
    open < ema9 && 
    open > ema15 && 
    close > ema9 && 
    low > ema15 && 
    (high - Math.max(open, close)) <= Math.abs(open - close) * 0.3;
  
  // Buy Signal 3: Bullish candle bouncing off EMA9
  // close > open and open > ema9 and low <= ema9 and close > ema9 and low > ema15 
  // and high - max(open, close) <= abs(open - close) * 0.3
  const buySignal3 = 
    close > open && 
    open > ema9 && 
    low <= ema9 && 
    close > ema9 && 
    low > ema15 && 
    (high - Math.max(open, close)) <= Math.abs(open - close) * 0.3;
  
  // Buy condition angle: slope >= 50 degrees
  const buyConditionAngle = slopeAngle >= angleThreshold;
  
  // Sell Signal 2: Bearish candle with specific EMA conditions
  // close < open and open > ema9 and open < ema15 and close < ema9 and high < ema15 
  // and min(open, close) - low <= abs(open - close) * 0.3
  const sellSignal2 = 
    close < open && 
    open > ema9 && 
    open < ema15 && 
    close < ema9 && 
    high < ema15 && 
    (Math.min(open, close) - low) <= Math.abs(open - close) * 0.3;
  
  // Sell Signal 3: Bearish candle bouncing off EMA9
  // close < open and open < ema9 and high >= ema9 and close < ema9 and high < ema15 
  // and min(open, close) - low <= abs(open - close) * 0.3
  const sellSignal3 = 
    close < open && 
    open < ema9 && 
    high >= ema9 && 
    close < ema9 && 
    high < ema15 && 
    (Math.min(open, close) - low) <= Math.abs(open - close) * 0.3;
  
  // Sell condition angle: slope <= -50 degrees
  const sellConditionAngle = slopeAngle <= -angleThreshold;
  
  // Determine signal type
  let signalType: StrategyResult['signalType'] = 'neutral';
  
  if ((buySignal2 || buySignal3) && buyConditionAngle) {
    signalType = 'strong_buy';
  } else if (buySignal2 || buySignal3) {
    signalType = 'soft_buy';
  } else if ((sellSignal2 || sellSignal3) && sellConditionAngle) {
    signalType = 'strong_sell';
  } else if (sellSignal2 || sellSignal3) {
    signalType = 'soft_sell';
  }
  
  return {
    ema9,
    ema15,
    slopeAngle,
    signalType,
    buySignal2,
    buySignal3,
    sellSignal2,
    sellSignal3,
    buyConditionAngle,
    sellConditionAngle
  };
}

// Generate mock candle data with realistic price movements
export function generateMockCandles(basePrice: number, count: number, volatility: number = 0.02): Candle[] {
  const candles: Candle[] = [];
  let currentPrice = basePrice;
  const now = Date.now();
  const interval = 60 * 60 * 1000; // 1 hour
  
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * volatility * currentPrice * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * currentPrice * 0.5;
    
    candles.push({
      time: now - (count - i) * interval,
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000000
    });
    
    currentPrice = close;
  }
  
  return candles;
}

// Generate a new candle based on the last one
export function generateNextCandle(lastCandle: Candle, volatility: number = 0.01): Candle {
  const change = (Math.random() - 0.5) * 2 * volatility * lastCandle.close;
  const open = lastCandle.close;
  const close = open + change;
  const high = Math.max(open, close) + Math.random() * volatility * lastCandle.close * 0.5;
  const low = Math.min(open, close) - Math.random() * volatility * lastCandle.close * 0.5;
  
  return {
    time: lastCandle.time + 60 * 60 * 1000,
    open,
    high,
    low,
    close,
    volume: Math.random() * 1000000
  };
}
