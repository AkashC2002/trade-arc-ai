import { useMemo } from "react";

interface SparklineChartProps {
  data: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
}

export const SparklineChart = ({ data, isPositive, width = 100, height = 32 }: SparklineChartProps) => {
  const pathData = useMemo(() => {
    if (!data || data.length === 0) return "";
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });
    
    return `M${points.join(" L")}`;
  }, [data, width, height]);

  const gradientId = useMemo(() => `sparkline-gradient-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity="0.3" />
          <stop offset="100%" stopColor={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={pathData}
        fill="none"
        stroke={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
