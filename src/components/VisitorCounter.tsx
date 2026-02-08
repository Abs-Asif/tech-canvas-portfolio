import { useState, useEffect } from "react";

const API_KEY = "hajwwg316qfr22czgo9kdzwb81z65ipj97gosnai39wm0f88mg";
const API_URL = "https://abdullahbari.goatcounter.com/api/v0/stats/total";

export const VisitorCounter = () => {
  const [count, setCount] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        });
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        // 'total' represents total hits/pageviews in GoatCounter API
        setCount(data.total?.toString() || "0");
      } catch (error) {
        console.error("Error fetching visitor count:", error);
        setCount("ERR");
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  return (
    <div
      className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-secondary/30 border border-border/50 animate-fade-in-up opacity-0"
      style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
    >
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Live Status</span>
      </div>
      <div className="h-4 w-px bg-border/50" />
      <div className="font-mono text-xs sm:text-sm text-primary whitespace-nowrap">
        <span className="text-muted-foreground mr-1 sm:mr-2">$</span>
        visitors_count: <span className="font-bold">{loading ? "..." : count}</span>
      </div>
    </div>
  );
};
