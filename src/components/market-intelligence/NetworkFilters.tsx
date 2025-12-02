import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface NetworkFiltersProps {
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
}

const networks = [
  { id: "all", name: "All Networks", color: "from-primary to-accent" },
  { id: "bitcoin", name: "Bitcoin", color: "from-orange-500 to-yellow-500" },
  { id: "ethereum", name: "Ethereum", color: "from-blue-500 to-purple-500" },
  { id: "bsc", name: "BNB Chain", color: "from-yellow-500 to-orange-500" },
  { id: "solana", name: "Solana", color: "from-purple-500 to-green-500" },
  { id: "polygon", name: "Polygon", color: "from-purple-500 to-indigo-500" },
  { id: "avalanche", name: "Avalanche", color: "from-red-500 to-pink-500" },
  { id: "cardano", name: "Cardano", color: "from-blue-500 to-cyan-500" },
  { id: "xrp", name: "XRP Ledger", color: "from-gray-500 to-slate-500" },
  { id: "dogecoin", name: "Dogecoin", color: "from-yellow-400 to-amber-500" },
];

export const NetworkFilters = ({ selectedNetwork, onNetworkChange }: NetworkFiltersProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Filter by Network</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {networks.map((network) => (
            <Button
              key={network.id}
              variant={selectedNetwork === network.id ? "default" : "outline"}
              size="sm"
              onClick={() => onNetworkChange(network.id)}
              className={`shrink-0 transition-all duration-300 ${
                selectedNetwork === network.id 
                  ? `bg-gradient-to-r ${network.color} text-white border-0 shadow-lg` 
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mr-2 bg-gradient-to-r ${network.color}`} />
              {network.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
