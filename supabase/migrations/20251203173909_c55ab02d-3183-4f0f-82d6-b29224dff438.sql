-- Create algorithm_signals table for audit logging
CREATE TABLE public.algorithm_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  symbol TEXT NOT NULL,
  timeframe TEXT NOT NULL DEFAULT '1h',
  signal_type TEXT NOT NULL CHECK (signal_type IN ('strong_buy', 'soft_buy', 'strong_sell', 'soft_sell', 'neutral')),
  ema9 NUMERIC NOT NULL,
  ema15 NUMERIC NOT NULL,
  slope_angle NUMERIC NOT NULL,
  open_price NUMERIC NOT NULL,
  high_price NUMERIC NOT NULL,
  low_price NUMERIC NOT NULL,
  close_price NUMERIC NOT NULL,
  candle_time TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.algorithm_signals ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own signals
CREATE POLICY "Users can view their own signals"
ON public.algorithm_signals
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to insert their own signals
CREATE POLICY "Users can insert their own signals"
ON public.algorithm_signals
FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create index for faster queries
CREATE INDEX idx_algorithm_signals_symbol_time ON public.algorithm_signals(symbol, candle_time DESC);
CREATE INDEX idx_algorithm_signals_user ON public.algorithm_signals(user_id, created_at DESC);