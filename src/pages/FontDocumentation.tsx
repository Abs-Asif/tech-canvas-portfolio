import { ArrowLeft, BookOpen, Code, Copy, Check, Globe, Type, Languages, Terminal, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FontDocumentation = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);
  const [lang, setLang] = useState<"EN" | "BN">("EN");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      <div className="max-w-4xl mx-auto pt-6 md:pt-20 px-4">
        <header className="mb-16 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/F")}
                className="p-2.5 rounded-xl bg-surface-1 border border-border hover:border-primary transition-all active:scale-95 group shrink-0"
              >
                <ArrowLeft size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-4xl font-bold font-mono truncate gradient-text">
                  {lang === "EN" ? "Documentation" : "ডকুমেন্টেশন"}
                </h1>
                <p className="text-muted-foreground font-mono text-[10px] md:text-sm truncate">
                  {lang === "EN" ? "// How to use Bangla Fonts Simplified" : "// আপনার প্রোজেক্টে বাংলা ফন্ট ব্যবহারের নিয়মাবলী"}
                </p>
              </div>
            </div>

            <div className="flex items-center bg-surface-1 p-1 rounded-xl border border-border self-start">
              <button
                onClick={() => setLang("EN")}
                className={cn("flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono transition-all", lang === "EN" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground")}
              >
                <Languages size={14} />
                English
              </button>
              <button
                onClick={() => setLang("BN")}
                className={cn("flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono transition-all", lang === "BN" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground")}
              >
                <Languages size={14} />
                বাংলা
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-20">
          {lang === "EN" ? (
            <>
              {/* Introduction EN */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <BookOpen size={28} />
                  <h2 className="text-3xl font-bold tracking-tight">Introduction</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Bangla Fonts Simplified is a specialized alternative to Google Fonts, built from the ground up for the Bengali web.
                    Stop manually uploading <code className="text-primary font-mono text-sm">.ttf</code> or <code className="text-primary font-mono text-sm">.woff2</code> files.
                    Just link, style, and ship.
                  </p>
                </div>
              </section>

              {/* Implementation Methods EN */}
              <section className="space-y-10">
                <div className="flex items-center gap-3 text-primary">
                  <Globe size={28} />
                  <h2 className="text-3xl font-bold tracking-tight">Implementation</h2>
                </div>

                <div className="grid gap-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground uppercase">
                      <Terminal size={14} />
                      Option 01: Standard HTML Link
                    </div>
                    <div className="terminal-window">
                      <div className="p-8 space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Paste this into the <code className="text-primary font-mono">&lt;head&gt;</code> of your website. This is the <strong>fastest</strong> way to load fonts.
                        </p>
                        <div className="relative group">
                          <pre className="bg-black/50 p-6 rounded-xl text-xs font-mono overflow-x-auto border border-border text-muted-foreground leading-relaxed">
{`<link rel="preconnect" href="https://abdullah.ami.bd">
<link rel="stylesheet" href="https://abdullah.ami.bd/fonts/ekushey-lalsalu.css">`}
                          </pre>
                          <button
                            onClick={() => handleCopy(`<link rel="preconnect" href="https://abdullah.ami.bd">\n<link rel="stylesheet" href="https://abdullah.ami.bd/fonts/ekushey-lalsalu.css">`, 'html-en')}
                            className="absolute right-4 top-4 p-2 rounded-lg bg-surface-1 border border-border opacity-0 group-hover:opacity-100 transition-all"
                          >
                            {copied === 'html-en' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground uppercase">
                      <Terminal size={14} />
                      Option 02: CSS @import
                    </div>
                    <div className="terminal-window">
                      <div className="p-8 space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Ideal for React/Vue or pure CSS projects. Add this at the <strong>very top</strong> of your CSS file.
                        </p>
                        <div className="relative group">
                          <pre className="bg-black/50 p-6 rounded-xl text-xs font-mono overflow-x-auto border border-border text-muted-foreground leading-relaxed">
{`@import url('https://abdullah.ami.bd/fonts/ekushey-lalsalu.css');`}
                          </pre>
                          <button
                            onClick={() => handleCopy(`@import url('https://abdullah.ami.bd/fonts/ekushey-lalsalu.css');`, 'css-en')}
                            className="absolute right-4 top-4 p-2 rounded-lg bg-surface-1 border border-border opacity-0 group-hover:opacity-100 transition-all"
                          >
                            {copied === 'css-en' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Usage EN */}
              <section className="space-y-10">
                <div className="flex items-center gap-3 text-primary">
                  <Type size={28} />
                  <h2 className="text-3xl font-bold tracking-tight">Applying Styles</h2>
                </div>
                <div className="terminal-window">
                  <div className="p-8 space-y-6">
                    <p className="text-muted-foreground">Apply the font to specific classes or the entire body:</p>
                    <div className="relative group">
                      <pre className="bg-black/50 p-6 rounded-xl text-xs font-mono overflow-x-auto border border-border text-muted-foreground leading-relaxed">
{`body {
  font-family: 'Ekushey Lal Salu Normal', sans-serif;
}

.title-bold {
  font-family: 'Ekushey Lal Salu Normal', sans-serif;
  font-weight: 700;
}`}
                      </pre>
                      <button
                        onClick={() => handleCopy(`body {\n  font-family: 'Ekushey Lal Salu Normal', sans-serif;\n}\n\n.title-bold {\n  font-family: 'Ekushey Lal Salu Normal', sans-serif;\n  font-weight: 700;\n}`, 'usage-en')}
                        className="absolute right-4 top-4 p-2 rounded-lg bg-surface-1 border border-border opacity-0 group-hover:opacity-100 transition-all"
                      >
                        {copied === 'usage-en' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <>
              {/* Introduction BN */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <BookOpen size={28} />
                  <h2 className="text-3xl font-bold tracking-tight font-ekushey-bold">সূচনা</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground text-xl leading-relaxed font-ekushey-regular">
                    Bangla Fonts Simplified হলো একটি ওপেন-সোর্স প্রজেক্ট যা আপনার ওয়েবসাইট বা ওয়েব অ্যাপ্লিকেশনে চমৎকার সব বাংলা ফন্ট ব্যবহারের প্রক্রিয়াকে সহজ করে দেয়।
                    এখন আর আপনাকে কষ্ট করে ফন্ট ফাইল ডাউনলোড এবং আপলোড করতে হবে না। জাস্ট এক লাইন কোড দিয়ে আপনার সাইটকে সাজিয়ে তুলুন একদম গুগল ফন্টের মতো।
                  </p>
                </div>
              </section>

              {/* Implementation Methods BN */}
              <section className="space-y-10">
                <div className="flex items-center gap-3 text-primary">
                  <Globe size={28} />
                  <h2 className="text-3xl font-bold tracking-tight font-ekushey-bold">কিভাবে ব্যবহার করবেন?</h2>
                </div>

                <div className="grid gap-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground uppercase border-b border-border pb-2">
                      <Layers size={14} className="text-primary" />
                      ধাপ ০১: এইচটিএমএল (HTML) পদ্ধতি
                    </div>
                    <div className="terminal-window border-primary/20">
                      <div className="p-8 space-y-6">
                        <p className="text-muted-foreground font-ekushey-regular text-lg">
                          নিচের কোডটি কপি করে আপনার ওয়েবসাইটের <code className="text-primary font-mono">&lt;head&gt;</code> ট্যাগ এর ভেতরে বসিয়ে দিন। এটি সবচেয়ে ভালো এবং দ্রুত পদ্ধতি।
                        </p>
                        <div className="relative group">
                          <pre className="bg-black/50 p-6 rounded-xl text-xs font-mono overflow-x-auto border border-border text-muted-foreground leading-relaxed">
{`<link rel="preconnect" href="https://abdullah.ami.bd">
<link rel="stylesheet" href="https://abdullah.ami.bd/fonts/ekushey-lalsalu.css">`}
                          </pre>
                          <button
                            onClick={() => handleCopy(`<link rel="preconnect" href="https://abdullah.ami.bd">\n<link rel="stylesheet" href="https://abdullah.ami.bd/fonts/ekushey-lalsalu.css">`, 'html-bn')}
                            className="absolute right-4 top-4 p-2 rounded-lg bg-surface-1 border border-border opacity-0 group-hover:opacity-100 transition-all border-primary/50"
                          >
                            {copied === 'html-bn' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm font-ekushey-regular text-muted-foreground">
                          <strong>টিপস:</strong> <code className="text-primary">preconnect</code> লিংকটি দিলে ফন্ট অনেক দ্রুত লোড হবে।
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground uppercase border-b border-border pb-2">
                      <Layers size={14} className="text-primary" />
                      ধাপ ০২: সিএসএস (CSS) পদ্ধতি
                    </div>
                    <div className="terminal-window border-primary/20">
                      <div className="p-8 space-y-6">
                        <p className="text-muted-foreground font-ekushey-regular text-lg">
                          আপনি যদি এইচটিএমএল ফাইল এ কোড রাখতে না চান, তবে আপনার মেইন সিএসএস ফাইলের একদম উপরে এই কোডটি কপি করে বসিয়ে দিন।
                        </p>
                        <div className="relative group">
                          <pre className="bg-black/50 p-6 rounded-xl text-xs font-mono overflow-x-auto border border-border text-muted-foreground leading-relaxed">
{`@import url('https://abdullah.ami.bd/fonts/ekushey-lalsalu.css');`}
                          </pre>
                          <button
                            onClick={() => handleCopy(`@import url('https://abdullah.ami.bd/fonts/ekushey-lalsalu.css');`, 'css-bn')}
                            className="absolute right-4 top-4 p-2 rounded-lg bg-surface-1 border border-border opacity-0 group-hover:opacity-100 transition-all border-primary/50"
                          >
                            {copied === 'css-bn' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Usage BN */}
              <section className="space-y-10">
                <div className="flex items-center gap-3 text-primary">
                  <Type size={28} />
                  <h2 className="text-3xl font-bold tracking-tight font-ekushey-bold">সিএসএস-এ ব্যবহার</h2>
                </div>
                <div className="terminal-window border-primary/20">
                  <div className="p-8 space-y-6">
                    <p className="text-muted-foreground font-ekushey-regular text-lg">ফন্ট ইমপোর্ট করার পর যেকোনো লিখাকে বাংলা করতে নিচের মত কোড লিখুন:</p>
                    <div className="relative group">
                      <pre className="bg-black/50 p-6 rounded-xl text-xs font-mono overflow-x-auto border border-border text-muted-foreground leading-relaxed">
{`/* সম্পূর্ণ ওয়েবসাইট বাংলা করতে */
body {
  font-family: 'Ekushey Lal Salu Normal', sans-serif;
}

/* নির্দিষ্ট কোনো ক্লাস বাংলা করতে */
.bangla-text {
  font-family: 'Ekushey Lal Salu Normal', sans-serif;
}`}
                      </pre>
                      <button
                        onClick={() => handleCopy(`body {\n  font-family: 'Ekushey Lal Salu Normal', sans-serif;\n}\n\n.bangla-text {\n  font-family: 'Ekushey Lal Salu Normal', sans-serif;\n}`, 'usage-bn')}
                        className="absolute right-4 top-4 p-2 rounded-lg bg-surface-1 border border-border opacity-0 group-hover:opacity-100 transition-all border-primary/50"
                      >
                        {copied === 'usage-bn' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Common Tip */}
          <div className="p-8 rounded-3xl bg-surface-1 border border-border space-y-4 shadow-xl">
            <h3 className="font-bold text-primary flex items-center gap-2 text-xl">
              <Code size={24} />
              {lang === "EN" ? "Developer Note" : "ডেভেলপার নোট"}
            </h3>
            <p className={cn("text-muted-foreground leading-relaxed", lang === "BN" ? "font-ekushey-regular text-lg" : "text-sm")}>
              {lang === "EN"
                ? "Always remember to use a fallback font like 'sans-serif' in your CSS declarations. This ensures that even if our servers are temporarily unreachable, your text remains legible."
                : "সব সময় ফন্ট ব্যবহারের সময় শেষে 'sans-serif' ব্যবহার করবেন। এতে করে যদি আমাদের সার্ভার থেকে ফন্ট লোড হতে দেরি হয়, তবে ব্রাউজার তার ডিফল্ট ফন্ট দিয়ে আপনার লিখাটি অন্তত পড়ার যোগ্য রাখবে।"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontDocumentation;
