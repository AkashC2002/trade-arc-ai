import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, ExternalLink } from "lucide-react";
import { useNews } from "@/hooks/useNews";

export const NewsPanel = () => {
  const { news, isLoading } = useNews();

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-32"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive": return "bg-success/20 text-success border-success/30";
      case "negative": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Newspaper className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Crypto News</h2>
      </div>

      <div className="space-y-3">
        {news.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-lg bg-muted/5 border border-border/30 hover:border-primary/50 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-1" />
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${getSentimentColor(article.sentiment)}`}>
                {article.sentiment}
              </Badge>
              <span className="text-xs text-muted-foreground">{article.source}</span>
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
};
