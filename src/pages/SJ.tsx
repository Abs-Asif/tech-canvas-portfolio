import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, RefreshCw, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const SJ = () => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
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

  const GRAY_BAR_Y = 575;
  const GRAY_BAR_H = 85;
  const DATE_X = 88;
  const DATE_Y = GRAY_BAR_Y + GRAY_BAR_H / 2;

  const TITLE_X = CANVAS_WIDTH / 2;
  const TITLE_Y = 850; // Below gray bar

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName} | ${day} ${monthName} ${year}`;
  };

  const splitTitle = (text: string) => {
    if (!text.includes(' ')) return [text, ''];

    const words = text.split(' ');
    let mid = Math.floor(text.length / 2);

    let bestSplit = 0;
    let minDiff = Infinity;

    let currentPos = 0;
    for (let i = 0; i < words.length - 1; i++) {
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
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

      // 2. Draw User Image
      const userImg = new Image();
      userImg.crossOrigin = "anonymous";
      userImg.src = imageUrl;
      await new Promise((resolve, reject) => {
        userImg.onload = resolve;
        userImg.onerror = reject;
      });

      // Scale to fit height
      const scale = BOX.h / userImg.height;
      const drawH = BOX.h;
      const drawW = userImg.width * scale;
      const drawX = BOX.x + (BOX.w - drawW) / 2;
      const drawY = BOX.y;

      // Rounded corners logic
      const isFullWidth = drawW >= BOX.w - 10; // Allowing small margin

      ctx.save();
      if (isFullWidth) {
        const radius = 35;
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
        ctx.clip();
      }

      ctx.drawImage(userImg, drawX, drawY, drawW, drawH);
      ctx.restore();

      // 3. Draw Date
      ctx.font = '24px "Cambria"';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatDate(new Date()), DATE_X, DATE_Y);

      // 4. Draw Title
      ctx.font = 'bold 42px "Cambria"';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';

      const lines = splitTitle(title);
      if (lines[1]) {
        ctx.fillText(lines[0], TITLE_X, TITLE_Y - 25);
        ctx.fillText(lines[1], TITLE_X, TITLE_Y + 25);
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
