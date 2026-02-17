import { useState } from "react";
import { ArrowLeft, Search, Loader2, AlertCircle, HardDrive, ExternalLink, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface NHentaiPage {
  t: "j" | "p" | "w";
  w: number;
  h: number;
}

interface NHentaiGallery {
  id: number;
  media_id: string;
  title: {
    english: string;
    japanese: string;
    pretty: string;
  };
  images: {
    pages: NHentaiPage[];
    cover: NHentaiPage;
    thumbnail: NHentaiPage;
  };
  num_pages: number;
}

const NuclearCodeSearch = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mangaData, setMangaData] = useState<{ title: string; images: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getExtension = (t: string) => {
    switch (t) {
      case "p": return "png";
      case "w": return "webp";
      default: return "jpg";
    }
  };

  const fetchWithProxy = async (targetUrl: string) => {
    // Primary: CodeTabs Proxy
    try {
      const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`);
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn("Primary proxy failed, trying fallback...");
    }

    // Fallback: AllOrigins
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
      const data = await response.json();
      if (data && data.contents) return JSON.parse(data.contents);
    } catch (e) {
      console.error("Fallback proxy failed as well.");
    }

    throw new Error("All proxy layers failed to retrieve data.");
  };

  const handleSearch = async () => {
    if (!/^\d{1,6}$/.test(code)) {
      toast.error("Please enter a valid code");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMangaData(null);

    try {
      const apiUrl = `https://nhentai.net/api/gallery/${code}`;
      const data: NHentaiGallery = await fetchWithProxy(apiUrl);

      if (!data || !data.media_id) {
        throw new Error("Invalid response from archive servers.");
      }

      const title = data.title.english || data.title.pretty || `Manga #${code}`;
      const mediaId = data.media_id;

      // Construct HQ image URLs
      const images = data.images.pages.map((page, index) => {
        const ext = getExtension(page.t);
        // Page numbers are 1-indexed
        return `https://i.nhentai.net/galleries/${mediaId}/${index + 1}.${ext}`;
      });

      setMangaData({ title, images });
    } catch (err: any) {
      console.error("Archive access error:", err);
      setError("FAILED TO BYPASS ENCRYPTION. The target may be offline or heavily guarded.");
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
            <p className="text-muted-foreground font-mono text-[10px] md:text-sm truncate">
              Search through the database of nHnetai.
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
              placeholder="6 digit number"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex h-14 w-full rounded-2xl border border-border bg-surface-1 px-12 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all font-mono"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading || !code}
            className="h-14 px-8 inline-flex items-center justify-center rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 shrink-0 shadow-none disabled:opacity-50 disabled:cursor-not-allowed font-mono font-bold"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : "ACCESS"}
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-8 min-h-[400px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="font-mono text-muted-foreground uppercase tracking-widest">Infiltrating archive servers...</p>
              <p className="text-[10px] text-muted-foreground mt-2 font-mono">ESTABLISHING_CORS_BYPASS...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="terminal-window p-8 border-destructive/50 bg-destructive/5">
              <div className="flex items-start gap-4">
                <AlertCircle className="text-destructive shrink-0" size={24} />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-destructive font-mono">CONNECTION_FAILURE</h3>
                  <p className="text-muted-foreground">{error}</p>
                  <div className="pt-4">
                    <a
                      href={`https://nhentai.net/g/${code}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-primary flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink size={12} /> VIEW_EXTERNAL_SOURCE
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isLoading && mangaData && (
            <div className="animate-fade-in">
              <div className="terminal-window mb-8 border-primary/20 bg-surface-1 shadow-2xl">
                <div className="terminal-header flex items-center justify-between bg-primary/10 px-4 py-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-primary" />
                    <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-tighter">Verified_Entry::{code}</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary/20" />
                    <div className="w-2 h-2 rounded-full bg-primary/40" />
                    <div className="w-2 h-2 rounded-full bg-primary/60" />
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">{mangaData.title}</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-[10px] font-mono font-bold uppercase">
                      HQ_STREAMING
                    </span>
                    <span className="px-2 py-1 rounded bg-secondary border border-border text-[10px] font-mono text-muted-foreground uppercase">
                      {mangaData.images.length} PAGES_INDEXED
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-10 flex flex-col items-center">
                {mangaData.images.map((url, index) => (
                  <div key={index} className="group relative w-full max-w-3xl bg-surface-1 rounded-2xl overflow-hidden border border-border shadow-2xl transition-all hover:border-primary/30">
                    <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="bg-black/60 backdrop-blur-md text-primary font-mono text-[10px] px-2 py-1 rounded-md border border-primary/20">
                         UNIT_ID::{index + 1}
                       </span>
                    </div>
                    <img
                      src={url}
                      alt={`Page ${index + 1}`}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x1200?text=DATA_FRAGMENT_${index + 1}_UNAVAILABLE`;
                      }}
                    />
                    <div className="bg-black/60 backdrop-blur-md py-3 px-8 flex justify-between items-center text-muted-foreground border-t border-border/20">
                      <span className="text-[10px] font-mono uppercase tracking-widest">Sequence_{index + 1}</span>
                      <span className="text-[10px] font-mono uppercase opacity-30">Archive_Sector_0{index % 10}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoading && !mangaData && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 opacity-40 group hover:opacity-100 transition-opacity">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
                <div className="relative w-24 h-24 rounded-3xl bg-surface-1 border border-border flex items-center justify-center shadow-2xl group-hover:border-primary/50 transition-all">
                  <HardDrive size={48} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-mono text-muted-foreground group-hover:text-foreground transition-colors">READY_FOR_DECRYPTION</h3>
                <p className="text-sm text-muted-foreground max-w-xs uppercase tracking-tighter leading-relaxed">
                  Enter target ID to establish high-quality data stream from the encrypted archives.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NuclearCodeSearch;
