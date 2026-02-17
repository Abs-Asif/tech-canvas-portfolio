import { useState } from "react";
import { ArrowLeft, Search, Loader2, AlertCircle, HardDrive } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ScraperLink {
  href: string;
  text: string | null;
  type: string;
}

interface ScraperResponse {
  success: boolean;
  context: {
    "Manga panels"?: string[];
  };
  link: ScraperLink[];
}

const NuclearCodeSearch = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mangaData, setMangaData] = useState<{ title: string; images: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!/^\d{6}$/.test(code)) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMangaData(null);

    try {
      const response = await fetch("https://api.jigsawstack.com/v1/ai/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_JIGSAWSTACK_API_KEY,
        },
        body: JSON.stringify({
          url: `https://nhentai.xxx/g/${code}/`,
          element_prompts: ["Manga panels"],
        }),
      });

      const data: ScraperResponse = await response.json();

      if (data.success) {
        const title = data.context["Manga panels"]?.[0] || `Manga #${code}`;

        // Filter and sort images
        // Pattern: .../<number>t.jpg or similar as described by user
        const mangaImages = data.link
          .filter((l) => l.type === "img" && /\/(\d+)t\.[a-z]+$/i.test(l.href))
          .sort((a, b) => {
            const matchA = a.href.match(/\/(\d+)t\.[a-z]+$/i);
            const matchB = b.href.match(/\/(\d+)t\.[a-z]+$/i);
            if (matchA && matchB) {
              return parseInt(matchA[1]) - parseInt(matchB[1]);
            }
            return 0;
          })
          .map((l) => l.href);

        if (mangaImages.length === 0) {
          setError("No manga panels found for this code.");
        } else {
          setMangaData({ title, images: mangaImages });
        }
      } else {
        setError("Failed to fetch data. The code might be invalid or the service is down.");
      }
    } catch (err) {
      console.error("Scraping error:", err);
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      <div className="max-w-4xl mx-auto pt-6 md:pt-20 px-4">
        <header className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate("/")}
            className="p-2.5 rounded-xl bg-surface-1 border border-border hover:border-primary transition-all active:scale-95 group shrink-0"
            aria-label="Back to home"
          >
            <ArrowLeft size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </button>

          <div className="min-w-0">
            <h1 className="text-2xl md:text-5xl font-bold font-mono truncate gradient-text">
              Nuclear Code Search
            </h1>
            <p className="text-muted-foreground font-mono text-[10px] md:text-sm truncate uppercase tracking-widest">
              {"// Search through the database of nHnetai"}
            </p>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative mb-10 flex gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit code (e.g. 637368)..."
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex h-14 w-full rounded-2xl border border-border bg-surface-1 px-12 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all font-mono"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading || code.length !== 6}
            className="h-14 px-6 inline-flex items-center justify-center rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 shrink-0 shadow-none disabled:opacity-50 disabled:cursor-not-allowed font-mono font-bold"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : "SEARCH"}
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-8 min-h-[400px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="font-mono text-muted-foreground uppercase tracking-widest">Bypassing firewalls...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="terminal-window p-8 border-destructive/50 bg-destructive/5">
              <div className="flex items-start gap-4">
                <AlertCircle className="text-destructive shrink-0" size={24} />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-destructive font-mono">ACCESS_DENIED</h3>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && mangaData && (
            <div className="animate-fade-in">
              <div className="terminal-window mb-8">
                <div className="terminal-header flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive size={14} className="text-primary" />
                    <span className="text-xs font-mono text-primary uppercase">Manga_Entry::{code}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{mangaData.title}</h2>
                  <p className="text-muted-foreground font-mono text-sm uppercase">{mangaData.images.length} Pages detected</p>
                </div>
              </div>

              <div className="space-y-4 flex flex-col items-center">
                {mangaData.images.map((url, index) => (
                  <div key={index} className="w-full max-w-2xl bg-surface-1 rounded-lg overflow-hidden border border-border shadow-lg">
                    <img
                      src={url}
                      alt={`Page ${index + 1}`}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/500x700?text=Failed+to+load+image";
                      }}
                    />
                    <div className="bg-background/50 py-2 px-4 border-t border-border text-center">
                      <span className="text-xs font-mono text-muted-foreground">PAGE_{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoading && !mangaData && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
              <div className="w-20 h-20 rounded-2xl bg-surface-1 border border-border flex items-center justify-center mb-4">
                <HardDrive size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-mono text-muted-foreground">READY_FOR_QUERY</h3>
              <p className="text-sm text-muted-foreground max-w-xs uppercase tracking-tighter">
                Enter a valid 6-digit nuclear code to access the encrypted archives.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NuclearCodeSearch;
