import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Star, ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
import { SparklineChart } from "./SparklineChart";

interface CoinData {
  rank: number;
  name: string;
  symbol: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  sparkline: number[];
  network: string;
}

const mockCoins: CoinData[] = [
  { rank: 1, name: "Bitcoin", symbol: "BTC", price: 97234.56, change1h: 0.23, change24h: 2.45, change7d: 8.12, marketCap: 1920000000000, volume24h: 45000000000, circulatingSupply: 19750000, sparkline: [95000, 95500, 96000, 95800, 96500, 97000, 97234], network: "bitcoin" },
  { rank: 2, name: "Ethereum", symbol: "ETH", price: 3456.78, change1h: -0.12, change24h: 1.89, change7d: 5.67, marketCap: 415000000000, volume24h: 18000000000, circulatingSupply: 120000000, sparkline: [3300, 3350, 3400, 3380, 3420, 3450, 3456], network: "ethereum" },
  { rank: 3, name: "Tether", symbol: "USDT", price: 1.00, change1h: 0.01, change24h: 0.02, change7d: 0.01, marketCap: 95000000000, volume24h: 65000000000, circulatingSupply: 95000000000, sparkline: [1, 1, 1, 1, 1, 1, 1], network: "ethereum" },
  { rank: 4, name: "BNB", symbol: "BNB", price: 654.32, change1h: 0.45, change24h: 3.21, change7d: 12.34, marketCap: 98000000000, volume24h: 2100000000, circulatingSupply: 150000000, sparkline: [600, 610, 625, 635, 640, 650, 654], network: "bsc" },
  { rank: 5, name: "Solana", symbol: "SOL", price: 234.56, change1h: 1.23, change24h: 5.67, change7d: 15.89, marketCap: 110000000000, volume24h: 8500000000, circulatingSupply: 470000000, sparkline: [210, 215, 220, 225, 228, 232, 234], network: "solana" },
  { rank: 6, name: "XRP", symbol: "XRP", price: 2.34, change1h: -0.34, change24h: -1.23, change7d: 4.56, marketCap: 134000000000, volume24h: 12000000000, circulatingSupply: 57000000000, sparkline: [2.2, 2.25, 2.3, 2.28, 2.32, 2.35, 2.34], network: "xrp" },
  { rank: 7, name: "Cardano", symbol: "ADA", price: 1.12, change1h: 0.67, change24h: 4.32, change7d: 18.90, marketCap: 40000000000, volume24h: 2800000000, circulatingSupply: 35700000000, sparkline: [0.95, 1.0, 1.02, 1.05, 1.08, 1.10, 1.12], network: "cardano" },
  { rank: 8, name: "Avalanche", symbol: "AVAX", price: 45.67, change1h: 0.89, change24h: 6.78, change7d: 22.34, marketCap: 18500000000, volume24h: 1200000000, circulatingSupply: 405000000, sparkline: [38, 40, 42, 43, 44, 45, 45.67], network: "avalanche" },
  { rank: 9, name: "Dogecoin", symbol: "DOGE", price: 0.42, change1h: -0.56, change24h: -2.34, change7d: 8.90, marketCap: 62000000000, volume24h: 4500000000, circulatingSupply: 147000000000, sparkline: [0.38, 0.39, 0.41, 0.40, 0.41, 0.42, 0.42], network: "dogecoin" },
  { rank: 10, name: "Polygon", symbol: "MATIC", price: 0.98, change1h: 1.12, change24h: 7.89, change7d: 25.67, marketCap: 9800000000, volume24h: 890000000, circulatingSupply: 10000000000, sparkline: [0.78, 0.82, 0.85, 0.88, 0.92, 0.95, 0.98], network: "polygon" },
];

interface CoinMarketTableProps {
  networkFilter: string;
}

type SortField = 'rank' | 'price' | 'change24h' | 'marketCap' | 'volume24h';

export const CoinMarketTable = ({ networkFilter }: CoinMarketTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredCoins = useMemo(() => {
    let filtered = mockCoins;
    
    if (networkFilter !== "all") {
      filtered = filtered.filter(coin => coin.network === networkFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(coin => 
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      return (a[sortField] - b[sortField]) * multiplier;
    });
  }, [networkFilter, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(4)}`;
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold">Cryptocurrency Prices by Market Cap</CardTitle>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search coins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-10"></TableHead>
                <TableHead className="w-12">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('rank')} className="h-auto p-0 font-medium">
                    # <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('price')} className="h-auto p-0 font-medium">
                    Price <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">1h %</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('change24h')} className="h-auto p-0 font-medium">
                    24h % <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">7d %</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('marketCap')} className="h-auto p-0 font-medium">
                    Market Cap <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('volume24h')} className="h-auto p-0 font-medium">
                    Volume(24h) <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-center w-28">Last 7 Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoins.map((coin) => (
                <TableRow key={coin.symbol} className="hover:bg-muted/30 border-border/30">
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => toggleFavorite(coin.symbol)}
                    >
                      <Star className={`h-4 w-4 ${favorites.includes(coin.symbol) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">{coin.rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-xs font-bold">{coin.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{coin.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{coin.symbol}</Badge>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">{coin.network}</Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatPrice(coin.price)}</TableCell>
                  <TableCell className="text-right">
                    <span className={`flex items-center justify-end gap-1 ${coin.change1h >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {coin.change1h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(coin.change1h).toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`flex items-center justify-end gap-1 ${coin.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {coin.change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(coin.change24h).toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`flex items-center justify-end gap-1 ${coin.change7d >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {coin.change7d >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(coin.change7d).toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(coin.marketCap)}</TableCell>
                  <TableCell className="text-right">{formatNumber(coin.volume24h)}</TableCell>
                  <TableCell>
                    <SparklineChart data={coin.sparkline} isPositive={coin.change7d >= 0} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
