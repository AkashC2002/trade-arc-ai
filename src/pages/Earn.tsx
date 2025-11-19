import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { EarnOverviewHeader } from "@/components/earn/EarnOverviewHeader";
import { ProductCard } from "@/components/earn/ProductCard";
import { WealthManagementWidget } from "@/components/earn/WealthManagementWidget";
import { useEarnProducts } from "@/hooks/useEarnProducts";
import { useEarnPositions } from "@/hooks/useEarnPositions";
import { Wallet, Search } from "lucide-react";
import { motion } from "framer-motion";

const Earn = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [matchMyAssets, setMatchMyAssets] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { products, categories } = useEarnProducts();
  const { positions, totalEarnAssets, yesterdayYield, autoAllocate } = useEarnPositions();

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.token.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesAssets = !matchMyAssets || ["BTC", "ETH", "USDT", "SOL"].includes(product.token);
    
    return matchesSearch && matchesCategory && matchesAssets;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Crypto Earn & Yield Center
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <EarnOverviewHeader
            totalEarnAssets={totalEarnAssets}
            yesterdayYield={yesterdayYield}
            onAutoEarn={autoAllocate}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">Explore Products</h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products by name or token..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="match-assets"
                    checked={matchMyAssets}
                    onCheckedChange={(checked) => setMatchMyAssets(checked as boolean)}
                  />
                  <label
                    htmlFor="match-assets"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Match My Assets
                  </label>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  size="sm"
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.productId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No products found matching your criteria
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <WealthManagementWidget />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Earn;
