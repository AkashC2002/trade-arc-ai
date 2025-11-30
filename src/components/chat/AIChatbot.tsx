import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { X, Send, Bot, User, Sparkles, TrendingUp, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatbot = ({ isOpen, onClose }: AIChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your AI crypto assistant. I can help you with market analysis, portfolio advice, predictions, and answer any crypto questions you have!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("crypto-chat", {
        body: { message: input, conversationHistory: messages },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-6 bottom-6 z-50 w-[420px] h-[600px]"
        >
          <Card className="h-full flex flex-col bg-gradient-to-br from-card via-card to-secondary/30 border-border/50 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-primary flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    AI Crypto Assistant
                    <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                  </h3>
                  <p className="text-xs text-muted-foreground">Powered by AI</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-background/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-primary/20"
                          : "bg-accent/20"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-primary" />
                      ) : (
                        <Bot className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <div
                      className={`flex-1 px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-secondary/50 border border-border/30"
                      }`}
                    >
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <span className="text-xs text-muted-foreground mt-2 block">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-accent animate-spin" />
                    </div>
                    <div className="flex-1 px-4 py-3 rounded-2xl bg-secondary/50 border border-border/30">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-accent rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-accent rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about crypto, markets, or your portfolio..."
                  className="flex-1 bg-secondary/50 border-border/50 focus:border-primary"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput("What are the top gainers today?")}
                  className="text-xs border-border/50 hover:bg-secondary"
                  disabled={isLoading}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Top Gainers
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput("Analyze my portfolio")}
                  className="text-xs border-border/50 hover:bg-secondary"
                  disabled={isLoading}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Portfolio Tips
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
