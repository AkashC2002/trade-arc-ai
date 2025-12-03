import { useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { Candle, StrategyResult } from '@/lib/strategyEngine';
import { SignalHistory } from '@/hooks/useStrategyEngine';

interface StrategyChartProps {
  candles: Candle[];
  ema9Data: number[];
  ema15Data: number[];
  signalHistory: SignalHistory[];
  height?: number;
}

export function StrategyChart({ candles, ema9Data, ema15Data, signalHistory, height = 400 }: StrategyChartProps) {
  const chartData = useMemo(() => {
    return candles.map((candle, index) => {
      const signal = signalHistory.find(s => s.time === candle.time);
      return {
        time: new Date(candle.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: candle.time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        ema9: ema9Data[index],
        ema15: ema15Data[index],
        volume: candle.volume,
        bullish: candle.close >= candle.open,
        signal: signal?.signalType || null,
        signalPrice: signal?.price
      };
    });
  }, [candles, ema9Data, ema15Data, signalHistory]);

  const priceRange = useMemo(() => {
    if (chartData.length === 0) return { min: 0, max: 100 };
    const prices = chartData.flatMap(d => [d.high, d.low, d.ema9, d.ema15].filter(Boolean));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;
    return { min: min - padding, max: max + padding };
  }, [chartData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const data = payload[0].payload;
    
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-2">{data.time}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <span className="text-muted-foreground">Open:</span>
          <span className="font-mono">${data.open?.toFixed(2)}</span>
          <span className="text-muted-foreground">High:</span>
          <span className="font-mono text-green-400">${data.high?.toFixed(2)}</span>
          <span className="text-muted-foreground">Low:</span>
          <span className="font-mono text-red-400">${data.low?.toFixed(2)}</span>
          <span className="text-muted-foreground">Close:</span>
          <span className={`font-mono ${data.bullish ? 'text-green-400' : 'text-red-400'}`}>
            ${data.close?.toFixed(2)}
          </span>
          <span className="text-red-500">EMA9:</span>
          <span className="font-mono">${data.ema9?.toFixed(2)}</span>
          <span className="text-foreground">EMA15:</span>
          <span className="font-mono">${data.ema15?.toFixed(2)}</span>
        </div>
        {data.signal && (
          <div className={`mt-2 px-2 py-1 rounded text-xs font-semibold text-center ${
            data.signal.includes('buy') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {data.signal.replace('_', ' ').toUpperCase()}
          </div>
        )}
      </div>
    );
  };

  // Custom candlestick shapes
  const CandleShape = (props: any) => {
    const { x, y, width, payload } = props;
    if (!payload) return null;
    
    const { open, high, low, close, bullish, signal } = payload;
    const bodyHeight = Math.abs(close - open);
    const scaledBodyHeight = (bodyHeight / (priceRange.max - priceRange.min)) * height * 0.8;
    const candleWidth = Math.max(width * 0.6, 2);
    
    const yScale = (price: number) => {
      return ((priceRange.max - price) / (priceRange.max - priceRange.min)) * height * 0.8 + 20;
    };
    
    const wickTop = yScale(high);
    const wickBottom = yScale(low);
    const bodyTop = yScale(Math.max(open, close));
    const bodyBottom = yScale(Math.min(open, close));
    
    return (
      <g>
        {/* Wick */}
        <line
          x1={x + width / 2}
          y1={wickTop}
          x2={x + width / 2}
          y2={wickBottom}
          stroke={bullish ? '#22c55e' : '#ef4444'}
          strokeWidth={1}
        />
        {/* Body */}
        <rect
          x={x + (width - candleWidth) / 2}
          y={bodyTop}
          width={candleWidth}
          height={Math.max(bodyBottom - bodyTop, 1)}
          fill={bullish ? '#22c55e' : '#ef4444'}
          stroke={bullish ? '#22c55e' : '#ef4444'}
          rx={1}
        />
        {/* Signal arrow */}
        {signal && (
          <g>
            {signal.includes('buy') ? (
              <polygon
                points={`${x + width / 2},${wickBottom + 15} ${x + width / 2 - 6},${wickBottom + 25} ${x + width / 2 + 6},${wickBottom + 25}`}
                fill={signal === 'strong_buy' ? '#22c55e' : '#3b82f6'}
                stroke={signal === 'strong_buy' ? '#22c55e' : '#3b82f6'}
              />
            ) : (
              <polygon
                points={`${x + width / 2},${wickTop - 15} ${x + width / 2 - 6},${wickTop - 25} ${x + width / 2 + 6},${wickTop - 25}`}
                fill={signal === 'strong_sell' ? '#ef4444' : '#1f2937'}
                stroke={signal === 'strong_sell' ? '#ef4444' : '#6b7280'}
              />
            )}
          </g>
        )}
      </g>
    );
  };

  return (
    <div className="w-full bg-card rounded-lg border border-border p-4">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={[priceRange.min, priceRange.max]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
            orientation="right"
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* EMA Lines */}
          <Line
            type="monotone"
            dataKey="ema9"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            name="EMA 9"
          />
          <Line
            type="monotone"
            dataKey="ema15"
            stroke="#1f2937"
            strokeWidth={2}
            dot={false}
            name="EMA 15"
          />
          
          {/* Price line for visual reference */}
          <Line
            type="monotone"
            dataKey="close"
            stroke="transparent"
            dot={false}
          />
          
          {/* Candlesticks rendered via Bar with custom shape */}
          <Bar
            dataKey="close"
            shape={<CandleShape />}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
