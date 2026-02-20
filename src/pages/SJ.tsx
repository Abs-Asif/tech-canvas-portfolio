import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, RefreshCw, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const SJ = () => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fontSize, setFontSize] = useState(80);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedTitle, setGeneratedTitle] = useState('');

  const CANVAS_WIDTH = 1080;
  const CANVAS_HEIGHT = 1080;

  // Box coordinates (approx based on template)
  const BOX = {
    x: 28,
    y: 32,
    w: 1024,
    h: 535
  };

  const GRAY_BAR_Y = 660;
  const GRAY_BAR_H = 85;
  const DATE_X = 88;
  const DATE_Y = GRAY_BAR_Y + GRAY_BAR_H / 2;

  const TITLE_X = CANVAS_WIDTH / 2;
  const TITLE_Y = 830; // Adjusted for larger font

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

  const splitTitle = (text: string) => {
    const words = text.split(' ');
    if (words.length < 2) return [text, ''];

    let mid = Math.floor(text.length / 2);
    let bestSplit = 0;
    let minDiff = Infinity;

    let currentPos = 0;
    // For 3+ words, we must have at least 2 words on second line
    const maxSplitIndex = words.length >= 3 ? words.length - 3 : words.length - 2;

    for (let i = 0; i <= maxSplitIndex; i++) {
      currentPos += words[i].length;
      let diff = Math.abs(currentPos - mid);
      if (diff <= minDiff) {
        minDiff = diff;
        bestSplit = i;
      }
      currentPos += 1; // for space
    }

    return [
      words.slice(0, bestSplit + 1).join(' '),
      words.slice(bestSplit + 1).join(' ')
    ];
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
        document.fonts.load('13px "Cambria"'),
        document.fonts.load('bold 24px "Cambria"')
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

      // 4. Draw Date
      ctx.font = '13px "Cambria"';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatDate(new Date()).toUpperCase(), DATE_X, DATE_Y);

      // 5. Draw Title with Auto-scaling
      let currentFontSize = fontSize;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lines = splitTitle(title);
      const maxW = 980; // Allow some margin

      const checkAndScale = () => {
        ctx.font = `bold ${currentFontSize}px "Cambria"`;
        if (lines[1]) {
          const w1 = ctx.measureText(lines[0]).width;
          const w2 = ctx.measureText(lines[1]).width;
          const maxLineW = Math.max(w1, w2);
          if (maxLineW > maxW) {
            currentFontSize *= (maxW / maxLineW);
            ctx.font = `bold ${currentFontSize}px "Cambria"`;
          }
        } else {
          const w = ctx.measureText(lines[0]).width;
          if (w > maxW) {
            currentFontSize *= (maxW / w);
            ctx.font = `bold ${currentFontSize}px "Cambria"`;
          }
        }
      };

      checkAndScale();

      if (lines[1]) {
        // Use a slightly larger multiplier for line spacing to avoid overlap at large sizes
        const spacing = currentFontSize * 0.6;
        ctx.fillText(lines[0], TITLE_X, TITLE_Y - spacing);
        ctx.fillText(lines[1], TITLE_X, TITLE_Y + spacing);
      } else {
        ctx.fillText(lines[0], TITLE_X, TITLE_Y);
      }

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
                <Input
                  id="title"
                  placeholder="Enter photocard title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-surface-2 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size ({fontSize}px)</Label>
                <Input
                  id="fontSize"
                  type="number"
                  min="20"
                  max="150"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value) || 80)}
                  className="bg-surface-2 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="bg-surface-2 border-border"
                  />
                  <Button variant="outline" size="icon" onClick={() => setImageUrl('')}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
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
    </div>
  );
};

export default SJ;
