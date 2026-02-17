import { useState } from "react";
import { ArrowLeft, Search, Loader2, AlertCircle, HardDrive, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
      // Use AllOrigins proxy to bypass CORS
      const targetUrl = `https://nhentai.xxx/g/${code}/`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

      const response = await fetch(proxyUrl);
      const data = await response.json();

      if (!data || !data.contents) {
        throw new Error("Failed to retrieve content from proxy.");
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, "text/html");

      // Extract title matching the specific format: [Author] Title (Language)
      // On nhentai, this is usually the h1.title within #info
      const titleElements = Array.from(doc.querySelectorAll("#info h1 .full, #info h1, h1"));
      let title = `Manga #${code}`;

      const titleRegex = /^\[.+\] .+\(.+\)$/;
      for (const el of titleElements) {
        const text = el.textContent?.trim() || "";
        if (titleRegex.test(text)) {
          title = text;
          break;
        }
      }

      // If no exact match found, try to construct it from parts or use the first h1
      if (title === `Manga #${code}`) {
        const h1 = doc.querySelector("#info h1")?.textContent?.trim();
        if (h1) title = h1;
      }

      // Extract images using the "system" (URL transformation) logic
      // System logic: replace 't.' with 'i.' for hostname and 't.' with '.' for filename
      const mangaImages: string[] = [];

      // Find images in gallery thumbnails
      // Thumbnails are usually in .gallerythumb img or inside noscript
      const thumbElements = Array.from(doc.querySelectorAll(".gallerythumb img, .thumb-container img"));

      thumbElements.forEach((img) => {
        const src = img.getAttribute("data-src") || img.getAttribute("src");
        if (src) {
          // Apply transformation logic from nhentai-image-getter
          // Logic: images.push(url.replace('t.', 'i.').replace('t.', '.'))

          let highResUrl = src;

          // 1. Host transformation: t.nhentai.net -> i.nhentai.net
          // Or more generally, replace first 't.' with 'i.' if it looks like a subdomain
          if (highResUrl.includes("//t.")) {
            highResUrl = highResUrl.replace("//t.", "//i.");
          } else if (highResUrl.includes("t.nhentai")) {
            highResUrl = highResUrl.replace("t.nhentai", "i.nhentai");
          }

          // 2. Filename transformation: .../1t.jpg -> .../1.jpg
          // Replace 't.' that appears before the extension (at the end of the numeric part)
          highResUrl = highResUrl.replace(/(\d+)t\./, "$1.");

          if (!mangaImages.includes(highResUrl)) {
            mangaImages.push(highResUrl);
          }
        }
      });

      // Secondary attempt via noscript tags (nhentai often uses noscript for thumbnails)
      if (mangaImages.length === 0) {
        const noscripts = Array.from(doc.querySelectorAll(".gallerythumb noscript, .thumb-container noscript"));
        noscripts.forEach(ns => {
          const content = ns.textContent || "";
          const match = content.match(/src="([^"]+)"/);
          if (match) {
            let url = match[1];
            url = url.replace("//t.", "//i.")
                     .replace("t.nhentai", "i.nhentai")
                     .replace(/(\d+)t\./, "$1.");
            if (!mangaImages.includes(url)) mangaImages.push(url);
          }
        });
      }

      // Sort images numerically by the page number in the URL
      mangaImages.sort((a, b) => {
        const matchA = a.match(/\/(\d+)\./);
        const matchB = b.match(/\/(\d+)\./);
        if (matchA && matchB) {
          return parseInt(matchA[1]) - parseInt(matchB[1]);
        }
        return 0;
      });

      if (mangaImages.length === 0) {
        setError("No manga panels found. The archives might be under heavy protection.");
      } else {
        setMangaData({ title, images: mangaImages });
      }
    } catch (err) {
      console.error("Decryption error:", err);
      setError("Failed to breach the firewall. Check your connection and try again.");
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
              {"// SECURE_ARCHIVE_ACCESS_V2"}
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
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : "DECRYPT"}
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-8 min-h-[400px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="font-mono text-muted-foreground uppercase tracking-widest">Bypassing nHnetai encryption...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="terminal-window p-8 border-destructive/50 bg-destructive/5">
              <div className="flex items-start gap-4">
                <AlertCircle className="text-destructive shrink-0" size={24} />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-destructive font-mono">DECRYPTION_FAILED</h3>
                  <p className="text-muted-foreground">{error}</p>
                  <div className="pt-4">
                    <a
                      href={`https://nhentai.xxx/g/${code}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-primary flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink size={12} /> OPEN_MANUALLY
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isLoading && mangaData && (
            <div className="animate-fade-in">
              <div className="terminal-window mb-8 border-primary/20">
                <div className="terminal-header flex items-center justify-between bg-primary/5">
                  <div className="flex items-center gap-2">
                    <HardDrive size={14} className="text-primary" />
                    <span className="text-xs font-mono text-primary uppercase">MANGA_STREAM::{code}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">{mangaData.title}</h2>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="px-2 py-1 rounded bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary font-bold">
                      HQ_STREAM
                    </span>
                    <span className="text-muted-foreground font-mono text-xs uppercase">
                      {mangaData.images.length} PAGES_DETECTED
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-8 flex flex-col items-center">
                {mangaData.images.map((url, index) => (
                  <div key={index} className="w-full max-w-3xl bg-surface-1 rounded-2xl overflow-hidden border border-border shadow-2xl">
                    <img
                      src={url}
                      alt={`Page ${index + 1}`}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x1200?text=UNIT_${index + 1}_OFFLINE`;
                      }}
                    />
                    <div className="bg-black/40 py-2 px-6 border-t border-border flex justify-between items-center">
                      <span className="text-[10px] font-mono text-muted-foreground">P_{index + 1}</span>
                      <span className="text-[8px] font-mono text-primary/30 uppercase tracking-widest font-bold">Encrypted_Payload</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoading && !mangaData && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
              <div className="w-20 h-20 rounded-3xl bg-surface-1 border border-border flex items-center justify-center mb-4 shadow-inner">
                <HardDrive size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-mono text-muted-foreground">TERMINAL_STANDBY</h3>
              <p className="text-sm text-muted-foreground max-w-xs uppercase tracking-tighter">
                Enter target sequence to begin high-quality data retrieval.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NuclearCodeSearch;
