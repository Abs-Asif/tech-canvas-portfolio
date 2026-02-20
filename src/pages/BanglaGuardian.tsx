import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Download, RefreshCw, Image as ImageIcon, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Settings2, X, ClipboardPaste, History, Clock, AlertCircle, ExternalLink, Eye, List, Zap, Play, Square } from "lucide-react";
import { toast } from "sonner";

interface AutoRecord {
  id: string;
  url: string;
  title: string;
  imageUrl: string;
  previewUrl: string;
  timestamp: string;
}

interface LogEntry {
  message: string;
  timestamp: number;
  type?: 'info' | 'success' | 'error' | 'process';
}

const DB_NAME = 'BanglaGuardianDB';
const STORE_NAME = 'photocards';

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveRecordDB = async (record: AutoRecord) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(record);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

const getAllRecordsDB = async (): Promise<AutoRecord[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const BanglaGuardian = () => {
  const [postUrl, setPostUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
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

  // Automation State
  const [autoModeActive, setAutoModeActive] = useState(false);
  const [isAutoChecking, setIsAutoChecking] = useState(false);
  const isAutoCheckingRef = useRef(false);
  const [autoRecords, setAutoRecords] = useState<AutoRecord[]>([]);
  const [autoLogs, setAutoLogs] = useState<LogEntry[]>([]);
  const [processedUrls, setProcessedUrls] = useState<Set<string>>(new Set());
  const processedUrlsRef = useRef<Set<string>>(new Set());

  // Keep ref in sync
  useEffect(() => {
    processedUrlsRef.current = processedUrls;
  }, [processedUrls]);

  // Load cache and records on mount
  useEffect(() => {
    const savedUrls = localStorage.getItem('bg_processed_urls');
    if (savedUrls) {
      try {
        const urls = JSON.parse(savedUrls);
        setProcessedUrls(new Set(urls));
      } catch (e) {
        console.error("Failed to load processed URLs", e);
      }
    }

    const savedAutoActive = localStorage.getItem('bg_auto_active');
    if (savedAutoActive === 'true') {
      setAutoModeActive(true);
    }

    getAllRecordsDB().then(records => {
      // Sort by timestamp descending
      const sorted = records.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      setAutoRecords(sorted);
    });
  }, []);

  // Save cache when it changes
  useEffect(() => {
    localStorage.setItem('bg_processed_urls', JSON.stringify(Array.from(processedUrls)));
  }, [processedUrls]);

  // Save auto active state
  useEffect(() => {
    localStorage.setItem('bg_auto_active', String(autoModeActive));
  }, [autoModeActive]);

  // Log cleaner: remove logs older than 1 hour
  useEffect(() => {
    const interval = setInterval(() => {
      const oneHourAgo = Date.now() - 3600000;
      setAutoLogs(prev => prev.filter(log => log.timestamp > oneHourAgo));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      message,
      timestamp: Date.now(),
      type
    };
    setAutoLogs(prev => [newLog, ...prev]);
  };

  const playAlert = () => {
    const audio = new Audio('/Alert.mp3');
    audio.play().catch(e => console.warn("Audio play failed:", e));
  };

  const getMetadata = async (targetUrl: string) => {
    let html = '';
    const proxies = [
      { url: (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`, type: 'text' },
      { url: (u: string) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`, type: 'text' },
      { url: (u: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`, type: 'json' },
      { url: (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`, type: 'text' }
    ];

    for (const proxy of proxies) {
      try {
        const response = await fetch(proxy.url(targetUrl));
        if (response.ok) {
          if (proxy.type === 'json') {
            const data = await response.json();
            html = data.contents;
          } else {
            html = await response.text();
          }
          if (html && (html.includes('<title>') || html.includes('og:title'))) break;
        }
      } catch (e) {
        console.warn("Proxy failed for metadata fetch:", e);
      }
    }

    if (!html) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                    doc.querySelector('meta[name="og:title"]')?.getAttribute('content');
    const metaTitle = doc.querySelector('title')?.textContent;
    const h1Title = doc.querySelector('h1')?.textContent;

    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                    doc.querySelector('meta[name="og:image"]')?.getAttribute('content');
    const twitterImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');

    return {
      title: ogTitle || metaTitle || h1Title || '',
      image: ogImage || twitterImage || ''
    };
  };

  const fetchPostData = async () => {
    const trimmedUrl = postUrl.trim();
    if (!trimmedUrl) {
      toast.error("Please enter a Post URL");
      return;
    }

    if (!trimmedUrl.includes('bangladeshguardian.com')) {
      toast.error("Only bangladeshguardian.com links are supported");
      return;
    }

    setIsFetching(true);
    let html = '';

    const proxies = [
      {
        url: (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
        type: 'text'
      },
      {
        url: (u: string) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`,
        type: 'text'
      },
      {
        url: (u: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
        type: 'json'
      },
      {
        url: (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
        type: 'text'
      }
    ];

    try {
      for (const proxy of proxies) {
        try {
          const response = await fetch(proxy.url(trimmedUrl));
          if (response.ok) {
            if (proxy.type === 'json') {
              const data = await response.json();
              html = data.contents;
            } else {
              html = await response.text();
            }
            if (html && (html.includes('<title>') || html.includes('og:title'))) break;
          }
        } catch (e) {
          console.warn("Proxy failed for HTML fetch:", e);
        }
      }

      if (!html) {
        throw new Error("Failed to fetch page content from all proxies");
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract Title
      const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                      doc.querySelector('meta[name="og:title"]')?.getAttribute('content');
      const metaTitle = doc.querySelector('title')?.textContent;
      const h1Title = doc.querySelector('h1')?.textContent;
      const extractedTitle = ogTitle || metaTitle || h1Title || '';

      // Extract Image
      const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                      doc.querySelector('meta[name="og:image"]')?.getAttribute('content');
      const twitterImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
      const extractedImage = ogImage || twitterImage || '';

      if (extractedTitle) setTitle(extractedTitle);
      if (extractedImage) setImageUrl(extractedImage);

      if (extractedTitle || extractedImage) {
        toast.success("Data fetched successfully!");
      } else {
        toast.warn("Could not find title or image on this page.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch post data. The site might be protected or the URL is invalid.");
    } finally {
      setIsFetching(false);
    }
  };

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
      (u: string) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`,
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

  const generatePhotoCardInternal = async (targetTitle: string, targetImageUrl: string): Promise<string> => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Canvas not found");
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error("Context not found");

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let userImgBlobUrl = '';
    try {
      const template = new Image();
      template.crossOrigin = "anonymous";
      template.src = "/PhotocardTemplate.png";
      await new Promise((resolve, reject) => {
        template.onload = resolve;
        template.onerror = reject;
      });
      ctx.drawImage(template, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      await Promise.all([
        document.fonts.load(`bold ${fontSize}px "Cambria"`),
        document.fonts.load(`${dateFontSize}px "Cambria"`)
      ]).catch(e => console.warn('Font loading failed:', e));

      userImgBlobUrl = await fetchImageWithProxy(targetImageUrl);
      const userImg = new Image();
      userImg.src = userImgBlobUrl;
      await new Promise((resolve, reject) => {
        userImg.onload = resolve;
        userImg.onerror = reject;
      });

      const scale = Math.max(BOX.w / userImg.width, BOX.h / userImg.height);
      const drawW = userImg.width * scale;
      const drawH = userImg.height * scale;
      const drawX = BOX.x + (BOX.w - drawW) / 2;
      const drawY = BOX.y + (BOX.h - drawH) / 2;

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

      ctx.save();
      defineBoxPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FF0000';
      ctx.stroke();
      ctx.restore();

      ctx.font = `${dateFontSize}px "Cambria"`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatDate(new Date()), DATE_X + dateXOffset, DATE_Y + dateYOffset);

      let currentFontSize = fontSize;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = `${titleLetterSpacing}px`;

      const maxW = 980;
      let lines: string[] = [];

      const performLayout = () => {
        let attempts = 0;
        while (attempts < 10) {
          ctx.font = `bold ${currentFontSize}px "Cambria"`;
          lines = wrapText(ctx, targetTitle, maxW);
          let maxLineW = 0;
          lines.forEach(l => { maxLineW = Math.max(maxLineW, ctx.measureText(l).width); });
          if (lines.length <= 3 && maxLineW <= maxW) break;
          if (lines.length > 3) currentFontSize *= 0.9;
          else if (maxLineW > maxW) currentFontSize *= (maxW / maxLineW);
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

      ctx.letterSpacing = "0px";
      return canvas.toDataURL('image/png');
    } finally {
      if (userImgBlobUrl && userImgBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(userImgBlobUrl);
      }
    }
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
    try {
      const dataUrl = await generatePhotoCardInternal(title, imageUrl);
      setPreviewUrl(dataUrl);
      setGeneratedTitle(title);

      const newRecord: AutoRecord = {
        id: Math.random().toString(36).substr(2, 9),
        url: postUrl || 'manual',
        title: title,
        imageUrl: imageUrl,
        previewUrl: dataUrl,
        timestamp: new Date().toISOString()
      };

      await saveRecordDB(newRecord);
      setAutoRecords(prev => [newRecord, ...prev]);

      toast.success("Photocard generated!");
      playAlert();
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate photocard.");
    } finally {
      setIsGenerating(false);
    }
  };

  const scrapeLatestLinks = async () => {
    const latestUrl = "https://www.bangladeshguardian.com/latest";
    let html = '';
    const proxies = [
      (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      (u: string) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`,
      (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    ];

    for (const proxy of proxies) {
      try {
        const response = await fetch(proxy(latestUrl));
        if (response.ok) {
          html = await response.text();
          if (html && html.includes('href=')) break;
        }
      } catch (e) {
        console.warn("Proxy failed for link scraping:", e);
      }
    }

    if (!html) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = Array.from(doc.querySelectorAll('a'))
      .map(a => a.href)
      .filter(href => {
        try {
          const url = new URL(href);
          return url.hostname.includes('bangladeshguardian.com') &&
                 url.pathname.length > 10 &&
                 !url.pathname.includes('/category/') &&
                 !['/latest', '/about', '/contact', '/privacy-policy'].includes(url.pathname);
        } catch {
          return false;
        }
      });

    const uniqueLinks = Array.from(new Set(links)).slice(0, 12);
    return uniqueLinks;
  };

  const checkAndGenerate = async () => {
    if (isAutoCheckingRef.current) return;
    isAutoCheckingRef.current = true;
    setIsAutoChecking(true);
    addLog("Checking for new posts...", "process");

    try {
      const links = await scrapeLatestLinks();
      const newLinks = links.filter(link => !processedUrlsRef.current.has(link));

      if (newLinks.length === 0) {
        addLog("No new posts found.");
      } else {
        addLog(`Found ${newLinks.length} new post(s). Processing...`);

        for (const link of newLinks) {
          addLog(`Fetching: ${link}`);
          const metadata = await getMetadata(link);
          if (metadata && metadata.title && metadata.image) {
            addLog(`Generating card for: ${metadata.title}`);
            const dataUrl = await generatePhotoCardInternal(metadata.title, metadata.image);

            const newRecord: AutoRecord = {
              id: Math.random().toString(36).substr(2, 9),
              url: link,
              title: metadata.title,
              imageUrl: metadata.image,
              previewUrl: dataUrl,
              timestamp: new Date().toISOString()
            };

            await saveRecordDB(newRecord);
            setAutoRecords(prev => [newRecord, ...prev]);
            setProcessedUrls(prev => new Set(prev).add(link));
            toast.success(`Auto-generated: ${metadata.title}`);
            playAlert();
          } else {
            addLog(`Failed to get metadata for: ${link}`);
            // Still mark as processed to avoid repeated failures
            setProcessedUrls(prev => new Set(prev).add(link));
          }
          // Small delay between generations to avoid browser issues
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    } catch (e) {
      console.error("Automation error:", e);
      addLog("Automation error occurred.", "error");
    } finally {
      setIsAutoChecking(false);
      isAutoCheckingRef.current = false;
    }
  };

  useEffect(() => {
    if (!autoModeActive) return;

    // Use a Web Worker to avoid background throttling for the 60s heartbeat
    const workerCode = `
      let interval;
      self.onmessage = (e) => {
        if (e.data === 'start') {
          self.postMessage('tick');
          interval = setInterval(() => self.postMessage('tick'), 60000);
        } else if (e.data === 'stop') {
          clearInterval(interval);
        }
      };
    `;
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);

    worker.onmessage = (e) => {
      if (e.data === 'tick') {
        checkAndGenerate();
      }
    };

    worker.postMessage('start');

    return () => {
      worker.postMessage('stop');
      worker.terminate();
      URL.revokeObjectURL(url); // Cleanup
    };
  }, [autoModeActive]);

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
            BANGLA GUARDIAN
          </h1>
          <p className="text-muted-foreground">
            Generate professional photocards automatically.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6 terminal-window p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="postUrl">Post URL (www.bangladeshguardian.com)</Label>
                <div className="flex gap-2">
                  <Input
                    id="postUrl"
                    placeholder="https://www.bangladeshguardian.com/..."
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
                    className="bg-surface-2 border-border"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePaste(setPostUrl)}
                    className="shrink-0"
                    title="Paste from clipboard"
                  >
                    <ClipboardPaste className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={fetchPostData}
                    disabled={isFetching || !postUrl}
                    className="shrink-0"
                  >
                    {isFetching ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      "Fetch"
                    )}
                  </Button>
                </div>
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-border/50"></div>
                <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase tracking-widest">OR MANUAL</span>
                <div className="flex-grow border-t border-border/50"></div>
              </div>

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

          <div className="flex flex-col space-y-6">
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

            <div className="terminal-window p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                  <Zap className="h-4 w-4" />
                  AUTOMATION STATUS
                </h3>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", autoModeActive ? 'bg-green-500 animate-pulse' : 'bg-zinc-600')} />
                  <span className="text-[10px] uppercase tracking-wider font-bold">
                    {autoModeActive ? 'Active' : 'Idle'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={autoModeActive ? "secondary" : "default"}
                  size="sm"
                  className="flex-1 text-[10px] h-8"
                  onClick={() => setAutoModeActive(true)}
                  disabled={autoModeActive}
                >
                  <Play className="h-3 w-3 mr-1" /> START
                </Button>
                <Button
                  variant={!autoModeActive ? "secondary" : "destructive"}
                  size="sm"
                  className="flex-1 text-[10px] h-8"
                  onClick={() => setAutoModeActive(false)}
                  disabled={!autoModeActive}
                >
                  <Square className="h-3 w-3 mr-1" /> STOP
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Interval: 60s</span>
                  <span className="flex items-center gap-1"><History className="h-3 w-3" /> Cache: {processedUrls.size} items</span>
                </div>

                <div className="bg-black/40 rounded border border-border/50 p-2 h-32 overflow-y-auto scrollbar-hide font-mono text-[10px] space-y-1">
                  {autoLogs.length === 0 ? (
                    <div className="text-zinc-600 italic">Waiting for activity...</div>
                  ) : (
                    autoLogs.map((log, i) => (
                      <div key={i} className={cn(
                        log.type === 'success' ? 'text-green-400' :
                        log.type === 'error' ? 'text-red-400' :
                        log.type === 'process' ? 'text-primary' : 'text-zinc-400'
                      )}>
                        [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {autoRecords.length > 0 && (
          <div className="space-y-6 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                <List className="h-6 w-6 text-primary" />
                AUTOMATED GENERATIONS
              </h2>
              <span className="bg-surface-2 border border-border px-3 py-1 rounded-full text-[10px] font-bold">
                {autoRecords.length} TOTAL
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {autoRecords.map((record) => (
                <div key={record.id} className="terminal-window overflow-hidden flex flex-col group animate-fade-in-up">
                  <div className="terminal-header flex items-center justify-between py-1 px-3">
                    <span className="text-[8px] font-mono opacity-50 truncate max-w-[150px]">{record.title}</span>
                    <span className="text-[8px] font-mono opacity-50">{new Date(record.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="aspect-square relative bg-surface-1 border-b border-border overflow-hidden">
                    <img src={record.previewUrl} alt={record.title} className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                      <Button variant="secondary" size="icon" onClick={() => {
                        const link = document.createElement('a');
                        link.download = `${record.title}.png`;
                        link.href = record.previewUrl;
                        link.click();
                      }} title="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => window.open(record.url, '_blank')} title="View Post">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h4 className="text-xs font-bold line-clamp-2 mb-2">{record.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-[10px] h-7 hover:bg-surface-2"
                      onClick={() => {
                        setPreviewUrl(record.previewUrl);
                        setGeneratedTitle(record.title);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" /> Preview Main
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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

export default BanglaGuardian;
