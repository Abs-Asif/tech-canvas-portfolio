import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, RefreshCw, Image as ImageIcon, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Settings2, X, ClipboardPaste } from "lucide-react";
import { toast } from "sonner";

const SJ = () => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fontSize, setFontSize] = useState(70);
  const [dateXOffset, setDateXOffset] = useState(-40);
  const [dateYOffset, setDateYOffset] = useState(-30);
  const [dateFontSize, setDateFontSize] = useState(20);
  const [titleLetterSpacing, setTitleLetterSpacing] = useState(-2.4);
  const [showSettings, setShowSettings] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedTitle, setGeneratedTitle] = useState('');

  const handlePaste = async (setter: (val: string) => void) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setter(text);
        toast.success("Pasted from clipboard");
      }
    } catch (err) {
      console.error("Paste error:", err);
      toast.error("Failed to paste. Please allow clipboard access.");
    }
  };

  const CANVAS_WIDTH = 1080;
  const CANVAS_HEIGHT = 1080;

  // Box coordinates (updated per request)
  const BOX = {
    x: 30,
    y: 32,
    w: 1020,
    h: 574
  };

  const GRAY_BAR_Y = 660;
  const GRAY_BAR_H = 85;
  const DATE_X = 88;
  const DATE_Y = GRAY_BAR_Y + (GRAY_BAR_H / 2);

  const TITLE_X = CANVAS_WIDTH / 2;
  const TITLE_Y = 860; // Moved down as requested

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName} | ${day} ${monthName} ${year}`;
  };

  const fetchImageWithProxy = async (url: string): Promise<string> => {
    const proxies = [
      (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
      (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    ];

    const isRestricted = url.includes('bangladeshguardian.com') || url.includes('backoffice.bangladeshguardian.com');

    if (!isRestricted) {
      try {
        const response = await fetch(url, { mode: 'cors' });
        if (response.ok) {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        }
      } catch (e) {
        console.warn("Direct fetch failed, trying proxies...", e);
      }
    }

    for (const proxy of proxies) {
      try {
        const proxiedUrl = proxy(url);
        const response = await fetch(proxiedUrl);
        if (response.ok) {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        }
      } catch (e) {
        console.warn(`Proxy failed:`, e);
      }
    }

    throw new Error("Failed to load image. Make sure your url is valid and allows cors.");
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && i > 0) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const generatePhotoCard = async () => {
    if (!title) {
      toast.error("Please enter a title");
      return;
    }
    if (!imageUrl) {
      toast.error("Please enter an image URL");
      return;
    }

    setIsGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Clear canvas before drawing
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let userImgBlobUrl = '';
    try {
      // 1. Draw Template
      const template = new Image();
      template.crossOrigin = "anonymous";
      template.src = "/PhotocardTemplate.png";
      await new Promise((resolve, reject) => {
        template.onload = resolve;
        template.onerror = reject;
      });
      ctx.drawImage(template, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 2. Ensure fonts are loaded
      await Promise.all([
        document.fonts.load(`bold ${fontSize}px "Cambria"`),
        document.fonts.load(`${dateFontSize}px "Cambria"`)
      ]).catch(e => console.warn('Font loading failed:', e));

      // 3. Draw User Image
      userImgBlobUrl = await fetchImageWithProxy(imageUrl);
      const userImg = new Image();
      userImg.src = userImgBlobUrl;
      await new Promise((resolve, reject) => {
        userImg.onload = resolve;
        userImg.onerror = reject;
      });

      // Scale to fill BOX (cover)
      const scale = Math.max(BOX.w / userImg.width, BOX.h / userImg.height);
      const drawW = userImg.width * scale;
      const drawH = userImg.height * scale;
      const drawX = BOX.x + (BOX.w - drawW) / 2;
      const drawY = BOX.y + (BOX.h - drawH) / 2;

      // Rounded corners path
      const radius = 35;
      const defineBoxPath = () => {
        ctx.beginPath();
        ctx.moveTo(BOX.x + radius, BOX.y);
        ctx.lineTo(BOX.x + BOX.w - radius, BOX.y);
        ctx.quadraticCurveTo(BOX.x + BOX.w, BOX.y, BOX.x + BOX.w, BOX.y + radius);
        ctx.lineTo(BOX.x + BOX.w, BOX.y + BOX.h - radius);
        ctx.quadraticCurveTo(BOX.x + BOX.w, BOX.y + BOX.h, BOX.x + BOX.w - radius, BOX.y + BOX.h);
        ctx.lineTo(BOX.x + radius, BOX.y + BOX.h);
        ctx.quadraticCurveTo(BOX.x, BOX.y + BOX.h, BOX.x, BOX.y + BOX.h - radius);
        ctx.lineTo(BOX.x, BOX.y + radius);
        ctx.quadraticCurveTo(BOX.x, BOX.y, BOX.x + radius, BOX.y);
        ctx.closePath();
      };

      ctx.save();
      defineBoxPath();
      ctx.clip();
      ctx.drawImage(userImg, drawX, drawY, drawW, drawH);
      ctx.restore();

      // Draw red outline manually as requested (since template outline might be covered)
      ctx.save();
      defineBoxPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FF0000';
      ctx.stroke();
      ctx.restore();

      // 4. Draw Date (Double size)
      ctx.font = `${dateFontSize}px "Cambria"`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatDate(new Date()), DATE_X + dateXOffset, DATE_Y + dateYOffset);

      // 5. Draw Title with Dynamic Line Management
      let currentFontSize = fontSize;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Decrease letter spacing
      ctx.letterSpacing = `${titleLetterSpacing}px`;

      const maxW = 980;
      let lines: string[] = [];

      const performLayout = () => {
        let attempts = 0;
        while (attempts < 10) {
          ctx.font = `bold ${currentFontSize}px "Cambria"`;
          lines = wrapText(ctx, title, maxW);

          let maxLineW = 0;
          lines.forEach(l => {
            maxLineW = Math.max(maxLineW, ctx.measureText(l).width);
          });

          if (lines.length <= 3 && maxLineW <= maxW) {
            break;
          }

          if (lines.length > 3) {
            currentFontSize *= 0.9;
          } else if (maxLineW > maxW) {
            currentFontSize *= (maxW / maxLineW);
          }
          attempts++;
        }
      };

      performLayout();

      const lineHeight = currentFontSize * 0.9;
      const totalHeight = (lines.length - 1) * lineHeight;
      const startY = TITLE_Y - (totalHeight / 2);

      lines.forEach((line, index) => {
        ctx.fillText(line, TITLE_X, startY + (index * lineHeight));
      });

      // Reset letter spacing
      ctx.letterSpacing = "0px";

      setPreviewUrl(canvas.toDataURL('image/png'));
      setGeneratedTitle(title);
      toast.success("Photocard generated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to load image. Make sure the URL is valid and allows CORS.");
    } finally {
      if (userImgBlobUrl && userImgBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(userImgBlobUrl);
      }
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.download = `${generatedTitle || title || 'photocard'}.png`;
    link.href = previewUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
            SJ PHOTOCARD
          </h1>
          <p className="text-muted-foreground">
            Generate professional photocards automatically.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6 terminal-window p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title Text</Label>
                <div className="flex gap-2">
                  <Textarea
                    id="title"
                    placeholder="Enter photocard title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-surface-2 border-border min-h-[80px]"
                    rows={2}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePaste(setTitle)}
                    className="shrink-0"
                    title="Paste from clipboard"
                  >
                    <ClipboardPaste className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <div className="flex gap-2">
                  <Textarea
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="bg-surface-2 border-border min-h-[80px]"
                    rows={2}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePaste(setImageUrl)}
                    className="shrink-0"
                    title="Paste from clipboard"
                  >
                    <ClipboardPaste className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={generatePhotoCard}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="mr-2 h-4 w-4" />
                )}
                Generate Preview
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowSettings(true)}
                className="border-border hover:bg-surface-2"
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>

            {previewUrl && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={downloadImage}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
            )}
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-full aspect-square border-2 border-dashed border-border rounded-lg overflow-hidden flex items-center justify-center bg-surface-1 shadow-lg">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Photocard Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                  <ImageIcon className="h-12 w-12 opacity-20" />
                  <span>Preview will appear here</span>
                </div>
              )}
            </div>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono">
          <div className="bg-surface-1 border border-border rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between bg-surface-2">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                ADVANCED SETTINGS
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)} className="h-8 w-8 hover:bg-surface-3">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Title Font Size ({fontSize}px)</Label>
                <Input
                  type="number"
                  min="20"
                  max="150"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value) || 70)}
                  className="bg-surface-2 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Title Letter Spacing ({titleLetterSpacing}px)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="-10"
                  max="10"
                  value={titleLetterSpacing}
                  onChange={(e) => setTitleLetterSpacing(parseFloat(e.target.value) || 0)}
                  className="bg-surface-2 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Date Font Size ({dateFontSize}px)</Label>
                <Input
                  type="number"
                  min="10"
                  max="100"
                  value={dateFontSize}
                  onChange={(e) => setDateFontSize(parseInt(e.target.value) || 20)}
                  className="bg-surface-2 border-border"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Date Position</Label>
                <div className="flex flex-col items-center gap-2 bg-surface-2 p-4 rounded-lg border border-border">
                  <Button variant="outline" size="icon" onClick={() => setDateYOffset(prev => prev - 5)} className="h-8 w-8 bg-surface-1"><ChevronUp className="h-4 w-4" /></Button>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => setDateXOffset(prev => prev - 5)} className="h-8 w-8 bg-surface-1"><ChevronLeft className="h-4 w-4" /></Button>
                    <div className="w-20 text-center text-[10px] font-mono text-muted-foreground bg-surface-1 border border-border py-1 rounded">
                      {dateXOffset}, {dateYOffset}
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setDateXOffset(prev => prev + 5)} className="h-8 w-8 bg-surface-1"><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => setDateYOffset(prev => prev + 5)} className="h-8 w-8 bg-surface-1"><ChevronDown className="h-4 w-4" /></Button>
                </div>
              </div>

              <Button
                onClick={() => setShowSettings(false)}
                className="w-full"
              >
                Apply & Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SJ;
