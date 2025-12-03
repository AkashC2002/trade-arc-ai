import { useEffect, useRef } from 'react';
import { 
  createChart, 
  IChartApi, 
  ISeriesApi, 
  CandlestickData, 
  LineData, 
  Time,
  CandlestickSeries,
  LineSeries,
  createSeriesMarkers,
  ISeriesMarkersPluginApi,
  SeriesMarker
} from 'lightweight-charts';
import { Candle } from '@/lib/strategyEngine';
import { SignalHistory } from '@/hooks/useStrategyEngine';

interface StrategyChartProps {
  candles: Candle[];
  ema9Data: number[];
  ema15Data: number[];
  signalHistory: SignalHistory[];
  height?: number;
}

export function StrategyChart({ candles, ema9Data, ema15Data, signalHistory, height = 500 }: StrategyChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const ema9SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const ema15SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const markersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: 'rgba(255, 255, 255, 0.3)',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.3)',
          width: 1,
          style: 2,
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    const ema9Series = chart.addSeries(LineSeries, {
      color: '#ef4444',
      lineWidth: 2,
      title: 'EMA 9',
    });

    const ema15Series = chart.addSeries(LineSeries, {
      color: '#6b7280',
      lineWidth: 2,
      title: 'EMA 15',
    });

    const markers = createSeriesMarkers(candlestickSeries, []);

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    ema9SeriesRef.current = ema9Series;
    ema15SeriesRef.current = ema15Series;
    markersRef.current = markers;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height]);

  // Update data
  useEffect(() => {
    if (!candlestickSeriesRef.current || !ema9SeriesRef.current || !ema15SeriesRef.current) return;
    if (candles.length === 0) return;

    const candlestickData: CandlestickData<Time>[] = candles.map((candle) => ({
      time: (candle.time / 1000) as Time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    const ema9LineData: LineData<Time>[] = candles
      .map((candle, index) => ({
        time: (candle.time / 1000) as Time,
        value: ema9Data[index],
      }))
      .filter((d) => d.value !== undefined);

    const ema15LineData: LineData<Time>[] = candles
      .map((candle, index) => ({
        time: (candle.time / 1000) as Time,
        value: ema15Data[index],
      }))
      .filter((d) => d.value !== undefined);

    candlestickSeriesRef.current.setData(candlestickData);
    ema9SeriesRef.current.setData(ema9LineData);
    ema15SeriesRef.current.setData(ema15LineData);

    if (markersRef.current) {
      const markers: SeriesMarker<Time>[] = signalHistory.map((signal) => {
        const isBuy = signal.signalType.includes('buy');
        const isStrong = signal.signalType.includes('strong');
        
        return {
          time: (signal.time / 1000) as Time,
          position: isBuy ? 'belowBar' as const : 'aboveBar' as const,
          color: isBuy 
            ? (isStrong ? '#22c55e' : '#3b82f6') 
            : (isStrong ? '#ef4444' : '#6b7280'),
          shape: isBuy ? 'arrowUp' as const : 'arrowDown' as const,
          text: isStrong ? (isBuy ? 'STRONG BUY' : 'STRONG SELL') : (isBuy ? 'Soft Buy' : 'Soft Sell'),
        };
      });

      markersRef.current.setMarkers(markers);
    }

    if (chartRef.current && candlestickData.length > 0) {
      chartRef.current.timeScale().scrollToPosition(2, false);
    }
  }, [candles, ema9Data, ema15Data, signalHistory]);

  return (
    <div className="w-full bg-card rounded-lg border border-border overflow-hidden">
      <div ref={chartContainerRef} className="w-full" style={{ height }} />
    </div>
  );
}
