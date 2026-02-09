import { ArrowLeft, BookOpen, Code, Copy, Check, Globe, Type } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const FontDocumentation = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      <div className="max-w-4xl mx-auto pt-6 md:pt-20 px-4">
        <header className="flex items-center gap-4 mb-16">
          <button
            onClick={() => navigate("/F")}
            className="p-2.5 rounded-xl bg-surface-1 border border-border hover:border-primary transition-all active:scale-95 group shrink-0"
          >
            <ArrowLeft size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </button>

          <div className="min-w-0">
            <h1 className="text-2xl md:text-4xl font-bold font-mono truncate gradient-text">
              Documentation
            </h1>
            <p className="text-muted-foreground font-mono text-[10px] md:text-sm truncate">
              {"// How to use Bangla Fonts Simplified in your projects"}
            </p>
          </div>
        </header>

        <div className="space-y-16">
          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <BookOpen className="text-primary" size={24} />
              Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Bangla Fonts Simplified is a lightweight alternative to Google Fonts, specifically optimized for Bangla typography.
              Our goal is to make it effortless for developers to implement beautiful Bangla fonts without the hassle of manual
              font hosting and complex CSS declarations.
            </p>
          </section>

          {/* Implementation Methods */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Globe className="text-primary" size={24} />
              Implementation Methods
            </h2>

            <div className="grid gap-8">
              {/* HTML Link */}
              <div className="terminal-window">
                <div className="terminal-header">
                  <span className="text-xs font-mono text-muted-foreground">METHOD::HTML_LINK</span>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-lg">Using &lt;link&gt; tag</h3>
                  <p className="text-sm text-muted-foreground">
                    Add the following code to the <code className="text-primary">&lt;head&gt;</code> of your HTML file.
                    This is the recommended method for better performance.
                  </p>
                  <div className="relative group">
                    <pre className="bg-black/50 p-6 rounded-xl text-xs font-mono overflow-x-auto border border-border text-muted-foreground">
{`<link rel="preconnect" href="https://abdullah.ami.bd">
<link rel="stylesheet" href="https://abdullah.ami.bd/fonts/ekushey-lalsalu.css">`}
                    </pre>
                    <button
                      onClick={() => handleCopy(`<link rel="preconnect" href="https://abdullah.ami.bd">\n<link rel="stylesheet" href="https://abdullah.ami.bd/fonts/ekushey-lalsalu.css">`, 'html')}
                      className="absolute right-4 top-4 p-2 rounded-lg bg-surface-1 border border-border opacity-0 group-hover:opacity-100 transition-all"
                    >
                      {copied === 'html' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* CSS Import */}
              <div className="terminal-window">
                <div className="terminal-header">
                  <span className="text-xs font-mono text-muted-foreground">METHOD::CSS_IMPORT</span>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-lg">Using @import</h3>
                  <p className="text-sm text-muted-foreground">
                    If you prefer to keep your implementation inside your CSS file, use the @import rule.
                  </p>
                  <div className="relative group">
                    <pre className="bg-black/50 p-6 rounded-xl text-xs font-mono overflow-x-auto border border-border text-muted-foreground">
{`@import url('https://abdullah.ami.bd/fonts/ekushey-lalsalu.css');`}
                    </pre>
                    <button
                      onClick={() => handleCopy(`@import url('https://abdullah.ami.bd/fonts/ekushey-lalsalu.css');`, 'css-import')}
                      className="absolute right-4 top-4 p-2 rounded-lg bg-surface-1 border border-border opacity-0 group-hover:opacity-100 transition-all"
                    >
                      {copied === 'css-import' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Usage */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Type className="text-primary" size={24} />
              Applying Styles
            </h2>
            <p className="text-muted-foreground">
              Once the font is embedded, you can apply it to any element using the <code className="text-primary">font-family</code> property.
            </p>
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="text-xs font-mono text-muted-foreground">CSS::STYLES</span>
              </div>
              <div className="p-6">
                <div className="relative group">
                  <pre className="bg-black/50 p-6 rounded-xl text-xs font-mono overflow-x-auto border border-border text-muted-foreground">
{`.my-text {
  font-family: 'Ekushey Lal Salu Normal', sans-serif;
  font-weight: 400; /* For Regular */
}

.my-text-bold {
  font-family: 'Ekushey Lal Salu Normal', sans-serif;
  font-weight: 700; /* For Bold */
}`}
                  </pre>
                  <button
                    onClick={() => handleCopy(`.my-text {\n  font-family: 'Ekushey Lal Salu Normal', sans-serif;\n  font-weight: 400;\n}\n\n.my-text-bold {\n  font-family: 'Ekushey Lal Salu Normal', sans-serif;\n  font-weight: 700;\n}`, 'css-usage')}
                    className="absolute right-4 top-4 p-2 rounded-lg bg-surface-1 border border-border opacity-0 group-hover:opacity-100 transition-all"
                  >
                    {copied === 'css-usage' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Performance Tip */}
          <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
            <h3 className="font-bold text-primary flex items-center gap-2">
              <Code size={20} />
              Performance Optimization
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For the fastest load times, we recommend preloading the fonts in your index.html.
              This tells the browser to start downloading the font files immediately,
              preventing layout shifts and "invisible text" flashes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontDocumentation;
