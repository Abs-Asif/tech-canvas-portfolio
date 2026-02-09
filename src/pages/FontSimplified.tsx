import { useState, useEffect } from "react";
import { ArrowLeft, Search, X, Type, Download, Code, Check, Copy, ExternalLink, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FontStyle {
  name: string;
  weight: string;
  file: string;
  fontClass: string;
}

interface FontData {
  name: string;
  id: string;
  styles: FontStyle[];
}

const fonts: FontData[] = [
  {
    name: "Ekushey Lal Salu Normal",
    id: "ekushey-lalsalu",
    styles: [
      { name: "Regular", weight: "400", file: "/fonts/EkusheyLalsalu-Regular.ttf", fontClass: "font-ekushey-regular" },
      { name: "Bold", weight: "700", file: "/fonts/EkusheyLalsalu-Bold.ttf", fontClass: "font-ekushey-bold" }
    ]
  }
];

const GLYPHS = "অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ ক খ গ ঘ ঙ চ ছ জ ঝ ঞ ট ঠ ড ঢ ণ ত থ দ ধ ন প ফ ব ভ ম য র ল শ ষ স হ ড় ঢ় য় ৎ ং ঃ ঁ ৰ ৱ া ি ী ু ূ ৃ ে ৈ ো ৌ ৗ ্‌ । ॥ ০ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯ ৳ ক্ক ক্ট ক্ট্র ক্ত ক্ত্র ক্ন ক্ব ক্ম ক্র ক্ল ক্ষ ক্ষ্ণ ক্ষ্ম ক্ষ্র ক্স খ্র গু গ্গ গ্ধ গ্ন গ্ব গ্ম গ্র গ্রু গ্রূ গ্ল ঘ্ন ঘ্ব ঘ্র ঙ্ক ঙ্ক্র ঙ্খ ঙ্গ ঙ্ম চ্ঞ চ্র ছ্ব ছ্র জ্জ জ্জ্ব জ্ঝ জ্ঞ জ্ব জ্র ঞ্চ ঞ্ছ ঞ্জ ঞ্ঝ ট্ট ট্ব ট্ম ট্র ঠ্র ড্ড ড্র ঢ্র ণ্ট ণ্ঠ ণ্ড ণ্ড্র ণ্ঢ ণ্ণ ণ্ব ণ্ম ণ্র ত্ত ত্ত্ব ত্থ ত্ন ত্ব ত্ল ত্ম ত্র ত্রু ত্রূ থ্ব থ্র থ্রু থ্রূ থ্ল দ্দ দ্দ্ব দ্ধ দ্ধ্ব দ্ন দ্ব দ্ভ দ্ভ্র দ্ম দ্র দ্রু দ্রূ ধ্ন ধ্ব ধ্ম ন্জ ন্ট ন্ট্র ন্ঠ ন্ড ন্ড্র ন্ত ন্ত্ব ন্ত্র ন্থ ন্দ ন্দ্র ন্ধ ন্ধ্র ন্ন ন্ব ন্ম ন্র ন্স প্ট প্ত প্ত্র প্ন প্প প্র প্রু প্রূ প্ল প্স ফ্ট ফ্র ফ্ল ব্জ ব্দ ব্ধ ব্ব ব্র ব্রু ব্রূ ব্ল ভ্র ভ্রু ভ্রূ ভ্ল ম্ন ম্ফ ম্ব ম্ব্র ম্ভ ম্ভ্র ম্ম ম্র ম্ল য্র ল্ক ল্গ ল্ড ল্প ল্ফ ল্ব ল্ম ল্র ল্ল ল্স শু শ্চ শ্ছ শ্ন শ্ব শ্ম শ্র শ্রু শ্রূ শ্ল ষ্ক ষ্ক্র ষ্ট ষ্ট্র ষ্ঠ ষ্ফ ষ্ব ষ্ম ষ্র স্ক স্ক্র স্খ স্ট স্ট্র স্ত স্ত্র স্থ স্ন স্প্ল স্ফ স্ব স্ম স্রু স্রূ স্ল হু হৃ হ্ণ হ্ন হ্ম হ্ব হ্র হ্ল ড়্গ";

const FontSimplified = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFontId, setSelectedFontId] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  const [showEmbedPopup, setShowEmbedPopup] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      const font = fonts.find(f => f.id === hash);
      if (font) {
        setSelectedFontId(font.id);
      } else {
        setSelectedFontId(null);
      }
    } else {
      setSelectedFontId(null);
    }
  }, [location.hash]);

  const filteredFonts = fonts.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedFont = fonts.find(f => f.id === selectedFontId);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      <div className="max-w-5xl mx-auto pt-6 md:pt-20 px-4">
        <header className="flex items-center gap-4 mb-10">
          <button
            onClick={() => selectedFontId ? navigate("/F") : navigate("/")}
            className="p-2.5 rounded-xl bg-surface-1 border border-border hover:border-primary transition-all active:scale-95 group shrink-0"
            aria-label="Back"
          >
            <ArrowLeft size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </button>

          <div className="min-w-0">
            <h1 className="text-2xl md:text-5xl font-bold font-mono truncate gradient-text">
              Bangla Fonts Simplified
            </h1>
            <p className="text-muted-foreground font-mono text-[10px] md:text-sm truncate">
              {"// Simplifying Bangla typography for the web"}
            </p>
          </div>
        </header>

        {!selectedFontId && (
          <div className="relative mb-10 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Search fonts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-14 w-full rounded-2xl border border-border bg-surface-1 px-12 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all font-mono"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted transition-colors"
              >
                <X size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>
        )}

        {/* Font Content */}
        <div className="min-h-[400px]">
          {!selectedFontId ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredFonts.map((font) => (
                <div
                  key={font.id}
                  onClick={() => navigate(`#${font.id}`)}
                  className="terminal-window group cursor-pointer hover:border-primary/50 transition-all active:scale-[0.98]"
                >
                  <div className="terminal-header flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      FONT::{font.id}
                    </span>
                    <ExternalLink size={12} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                        {font.name}
                      </h3>
                      <span className="text-[10px] font-mono bg-surface-2 px-1.5 py-0.5 rounded border border-border">
                        {font.styles.length} STYLES
                      </span>
                    </div>
                    <p
                      className={cn("text-3xl leading-relaxed transition-all", font.styles[0].fontClass)}
                      style={{ fontSynthesis: 'none' }}
                    >
                      আমি তোমায় ভালোবেসে করেছি তো ভূল
                    </p>
                  </div>
                </div>
              ))}
              {filteredFonts.length === 0 && (
                <div className="col-span-full py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface-1 border border-border flex items-center justify-center mx-auto mb-4">
                    <Info size={32} className="text-muted-foreground/30" />
                  </div>
                  <h3 className="text-xl font-mono text-muted-foreground">No fonts found matching "{searchTerm}"</h3>
                </div>
              )}
            </div>
          ) : (
            selectedFont && (
              <div className="animate-fade-in space-y-12 pb-20">
                {/* Font Title and Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                  <div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">{selectedFont.name}</h2>
                    <div className="flex flex-wrap gap-4">
                      <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                        {selectedFont.styles.length} Styles Available
                      </span>
                      <span className="text-xs font-mono text-muted-foreground px-2 py-1 rounded border border-border">
                        ID: {selectedFont.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Custom Preview Input */}
                <div className="space-y-4">
                  <label className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Type here to preview</label>
                  <input
                    type="text"
                    placeholder="আমি তোমায় ভালোবেসে করেছি তো ভূল"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full bg-surface-1 border border-border rounded-2xl px-6 py-4 text-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-mono"
                  />
                </div>

                {/* Style Previews */}
                <div className="space-y-8">
                  {selectedFont.styles.map((style) => (
                    <div key={style.name} className="terminal-window overflow-hidden">
                      <div className="terminal-header flex items-center justify-between">
                        <span className="text-[10px] font-mono text-muted-foreground">STYLE::{style.name.toUpperCase()}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-mono text-muted-foreground">{style.weight} Weight</span>
                        </div>
                      </div>
                      <div className="p-8 md:p-12">
                        <p
                          className={cn("text-4xl md:text-6xl leading-tight break-words", style.fontClass)}
                          style={{ fontSynthesis: 'none' }}
                        >
                          {customText || "আমি তোমায় ভালোবেসে করেছি তো ভূল"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-wrap gap-3">
                    {selectedFont.styles.map((style) => (
                      <a
                        key={style.name}
                        href={style.file}
                        download={`${selectedFont.id}-${style.name.toLowerCase()}.ttf`}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-1 border border-border font-bold hover:border-primary transition-all active:scale-95"
                      >
                        <Download size={18} />
                        Download {style.name}
                      </a>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowEmbedPopup(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all active:scale-95"
                  >
                    <Code size={18} />
                    Use in Website
                  </button>
                </div>

                {/* Glyph Preview */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold font-mono uppercase tracking-tighter">Font Glyphs Preview</h3>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="terminal-window p-8">
                    <div
                      className={cn("text-2xl md:text-3xl leading-[2] flex flex-wrap gap-x-6 gap-y-4 text-muted-foreground/80", selectedFont.styles[0].fontClass)}
                      style={{ fontSynthesis: 'none' }}
                    >
                      {GLYPHS.split(" ").map((glyph, i) => (
                        <span key={i} className="hover:text-primary transition-colors cursor-default">{glyph}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Embed Popup */}
                {showEmbedPopup && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
                    <div className="terminal-window max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                      <div className="terminal-header flex items-center justify-between sticky top-0 bg-surface-1 z-10">
                        <div className="flex items-center gap-2">
                          <Code size={14} className="text-primary" />
                          <span className="text-xs font-mono font-bold">EMBED_CODE_GENERATOR</span>
                        </div>
                        <button
                          onClick={() => setShowEmbedPopup(false)}
                          className="p-1 hover:bg-surface-2 rounded-md transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="p-6 md:p-8 space-y-8">
                        <div>
                          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">1</span>
                            Embed code in the &lt;head&gt; of your html
                          </h4>
                          <div className="relative group">
                            <pre className="bg-black/50 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-border text-muted-foreground leading-relaxed">
{`<link rel="stylesheet" href="https://abdullah.ami.bd/fonts/${selectedFont.id}.css">`}
                            </pre>
                            <button
                              onClick={() => handleCopy(`<link rel="stylesheet" href="https://abdullah.ami.bd/fonts/${selectedFont.id}.css">`, 'link')}
                              className="absolute right-3 top-3 p-2 rounded-lg bg-surface-1 border border-border hover:border-primary transition-all opacity-0 group-hover:opacity-100"
                            >
                              {copied === 'link' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">2</span>
                            Playwrite CU Guides: CSS class
                          </h4>
                          <div className="relative group">
                            <pre className="bg-black/50 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-border text-muted-foreground leading-relaxed">
{`.${selectedFont.id} {
  font-family: '${selectedFont.name}', sans-serif;
}`}
                            </pre>
                            <button
                              onClick={() => handleCopy(`.${selectedFont.id} {\n  font-family: '${selectedFont.name}', sans-serif;\n}`, 'css')}
                              className="absolute right-3 top-3 p-2 rounded-lg bg-surface-1 border border-border hover:border-primary transition-all opacity-0 group-hover:opacity-100"
                            >
                              {copied === 'css' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border/50">
                          <h4 className="text-sm font-bold mb-4 uppercase text-muted-foreground">Alternatively, use @import</h4>
                          <div className="space-y-4">
                            <div className="relative group">
                              <pre className="bg-black/50 p-4 rounded-xl text-[10px] font-mono overflow-x-auto border border-border text-muted-foreground">
{`@import url('https://abdullah.ami.bd/fonts/${selectedFont.id}.css');`}
                              </pre>
                              <button
                                onClick={() => handleCopy(`@import url('https://abdullah.ami.bd/fonts/${selectedFont.id}.css');`, 'import')}
                                className="absolute right-3 top-3 p-1.5 rounded-md bg-surface-1 border border-border opacity-0 group-hover:opacity-100"
                              >
                                {copied === 'import' ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setShowEmbedPopup(false)}
                          className="w-full py-3 rounded-xl bg-surface-2 border border-border font-bold hover:bg-surface-3 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FontSimplified;
