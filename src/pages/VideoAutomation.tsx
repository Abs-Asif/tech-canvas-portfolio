import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Play, History, Loader2, AlertCircle, Terminal, CheckCircle2, Download, Video, Settings2, ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import puter from "@heyputer/puter.js";

// Initialize Puter if possible - though it often works automatically in browser
// We'll wrap the calls to ensure it's ready.

const WORD_TYPES = [
  "Relationship", "Family", "Friendship", "Romance", "Work/Career", "Business", "Finance", "Economics", "Law/Legal", "Government/Politics", "Education", "Science", "Technology", "Health", "Medicine", "Fitness", "Nutrition", "Psychology", "Mental health", "Religion", "Spirituality", "Ethics", "Philosophy", "Art", "Music", "Literature", "Film/TV", "Media/Journalism", "Entertainment", "Sports", "Travel", "Leisure", "Food/Culinary", "Fashion", "Beauty", "Home/Housing", "Real estate", "Environment", "Nature/Wildlife", "Agriculture", "Transportation", "Safety", "Danger/Risk", "Security (physical/cyber)", "Emergency/Disaster", "History", "Culture", "Language/Linguistics", "Society/Social issues", "Demographics", "Community", "Parenting", "Childhood", "Aging/Elder care", "Hobbies", "Crafts/DIY", "Gardening", "Retail/Shopping", "Marketing/Advertising", "Sales", "Customer service", "Manufacturing/Industry", "Energy/Utilities", "Finance products (banking, insurance, investing)", "Cryptocurrency/Blockchain", "Realities (urban/rural)", "Infrastructure", "Urban planning", "Religion-related (sects, denominations)"
];

interface WordData {
  word: string;
  banglaMeaning: string;
  partOfSpeech: string;
  example: string;
  exampleBangla: string;
}

interface AutomationRecord {
  id: string;
  timestamp: string;
  data: WordData[];
}

const VideoAutomation = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"start" | "records">("start");
  const [logs, setLogs] = useState<{ message: string; type: "info" | "success" | "error" | "process" }[]>([]);
  const [rawLogs, setRawLogs] = useState<{ label: string; content: any }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<WordData[] | null>(null);
  const [records, setRecords] = useState<AutomationRecord[]>([]);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Settings State
  const [selectedWordTypes, setSelectedWordTypes] = useState<string[]>([]);
  const [isWordTypeModalOpen, setIsWordTypeModalOpen] = useState(false);
  const [isLogsExpanded, setIsLogsExpanded] = useState(false);
  const [isRawLogsExpanded, setIsRawLogsExpanded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const savedRecords = localStorage.getItem("video_automation_records");
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const addLog = (message: string, type: "info" | "success" | "error" | "process" = "info") => {
    setLogs((prev) => [...prev, { message, type }]);
  };

  const fetchOpenRouter = async (prompt: string) => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OpenRouter API key not found in environment.");
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://abdullah.ami.bd",
        "X-Title": "Abdullah Portfolio Video Automation",
      },
      body: JSON.stringify({
        model: "qwen/qwen3-vl-30b-a3b-thinking",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const parseJsonFromAi = (text: string) => {
    try {
      const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (markdownMatch) return JSON.parse(markdownMatch[1].trim());
      const jsonMatch = text.match(/\[[\s\S]*\]/) || text.match(/{[\s\S]*}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0].trim());
      return JSON.parse(text.trim());
    } catch (e) {
      console.error("Failed to parse JSON:", text);
      throw new Error("Failed to parse AI response as JSON.");
    }
  };

  const fetchDictionary = async (word: string) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) return null;
      const data = await response.json();
      const entry = data[0];
      const meaning = entry.meanings[0];
      const definition = meaning.definitions[0];

      return {
        word: entry.word,
        definition: definition.definition,
        partOfSpeech: meaning.partOfSpeech,
        example: definition.example || ""
      };
    } catch (e) {
      return null;
    }
  };

  const handleStart = async () => {
    if (isProcessing) return;
    if (selectedWordTypes.length === 0) {
      addLog("Please select at least one word type.", "error");
      setIsWordTypeModalOpen(true);
      return;
    }

    setIsProcessing(true);
    setLogs([]);
    setRawLogs([]);
    setCurrentResult(null);
    setVideoUrl(null);
    addLog("Initializing video automation sequence...", "process");

    try {
      addLog("Step 1: Requesting 10 unique words from AI...", "info");
      const firstPrompt = `Return ONLY a valid JSON array of 10 unique English words (C1 and C2 levels) related to: ${selectedWordTypes.join(', ')}.
NO introductory or concluding text.
Example format: ["word1", "word2", ..., "word10"]`;

      const wordsResponse = await fetchOpenRouter(firstPrompt);
      const wordsList = parseJsonFromAi(wordsResponse);
      const wordsArray = Array.isArray(wordsList) ? wordsList : wordsList.words || [];

      addLog(`Extracted ${wordsArray.length} words.`, "success");

      addLog("Step 2: Fetching data from Dictionary API...", "info");
      const enrichedWords = [];
      for (const word of wordsArray) {
        const data = await fetchDictionary(word);
        enrichedWords.push(data ? data : { word, definition: "", partOfSpeech: "", example: "" });
      }

      addLog("Step 3: Translating and refining with AI...", "info");
      const secondPrompt = `Return ONLY a valid JSON array of objects.
Each object: {"partOfSpeech": "...", "word": "...", "banglaMeaning": "...", "example": "...", "exampleBangla": "..."}
Input: ${JSON.stringify(enrichedWords)}`;

      const translationResponse = await fetchOpenRouter(secondPrompt);
      const finalJson = parseJsonFromAi(translationResponse);

      const formattedResult: WordData[] = finalJson.map((item: any) => ({
        word: item.word || item.english_word || "",
        banglaMeaning: item.banglaMeaning || item.bangla_meaning || item.meaning || "",
        partOfSpeech: item.partOfSpeech || item.pos || "",
        example: item.example || "",
        exampleBangla: item.exampleBangla || item.example_bn || ""
      }));

      setCurrentResult(formattedResult);
      addLog("Automation sequence completed successfully!", "success");

      const newRecord: AutomationRecord = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        data: formattedResult
      };
      const updatedRecords = [newRecord, ...records];
      setRecords(updatedRecords);
      localStorage.setItem("video_automation_records", JSON.stringify(updatedRecords));

    } catch (error: any) {
      addLog(`ERROR: ${error.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleWordType = (type: string) => {
    setSelectedWordTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const drawJustifiedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    alpha: number = 1
  ) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    ctx.save();
    ctx.globalAlpha = alpha;
    let currentY = y;
    lines.forEach((line, index) => {
      const isLastLine = index === lines.length - 1;
      const lineWords = line.split(' ');

      if (isLastLine || lineWords.length === 1) {
        ctx.textAlign = 'center';
        ctx.fillText(line, x + maxWidth / 2, currentY);
      } else {
        const totalWordsWidth = lineWords.reduce((acc, w) => acc + ctx.measureText(w).width, 0);
        const totalSpacing = maxWidth - totalWordsWidth;
        const spacingPerWord = totalSpacing / (lineWords.length - 1);

        let currentX = x;
        ctx.textAlign = 'left';
        lineWords.forEach((word) => {
          ctx.fillText(word, currentX, currentY);
          currentX += ctx.measureText(word).width + spacingPerWord;
        });
      }
      currentY += lineHeight;
    });
    ctx.restore();
    return currentY;
  };

  const generateVideo = async () => {
    if (!currentResult || isGeneratingVideo) return;
    setIsGeneratingVideo(true);
    setVideoUrl(null);
    addLog("Starting video generation process...", "process");

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      // Setup Audio
      const audioCtx = new AudioContext();
      const destination = audioCtx.createMediaStreamDestination();

      // Setup MediaRecorder
      const stream = canvas.captureStream(30);
      const combinedStream = new MediaStream([
        ...stream.getVideoTracks(),
        ...destination.stream.getAudioTracks()
      ]);

      const mimeType = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4'
      ].find(m => MediaRecorder.isTypeSupported(m));

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: mimeType || undefined
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);

      const videoPromise = new Promise<string>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(URL.createObjectURL(blob));
        };
      });

      const bgImg = new Image();
      bgImg.src = "/reel-bg.png";
      await new Promise((res) => { bgImg.onload = res; bgImg.onerror = res; });

      // Ensure fonts are loaded
      await Promise.all([
        document.fonts.load('bold 90px Inter'),
        document.fonts.load('60px Kalpurush'),
        document.fonts.load('50px Inter'),
        document.fonts.load('bold 40px "JetBrains Mono"')
      ]);

      // 1. Pre-fetch all audio segments to avoid choppiness during recording
      addLog("Step 1: Pre-fetching all audio segments...", "process");
      const allAudioSegments: { wordIdx: number; type: string; audio: HTMLAudioElement | null }[] = [];

      for (let i = 0; i < currentResult.length; i++) {
        const item = currentResult[i];
        const parts = [
          { text: item.word, lang: "en-US", type: "word" },
          { text: item.banglaMeaning, lang: "bn-IN", type: "meaning" },
          { text: item.example, lang: "en-US", type: "example" },
          { text: item.exampleBangla, lang: "bn-IN", type: "translation" }
        ];

        for (const part of parts) {
          addLog(`Fetching audio for: ${item.word} (${part.type})...`, "process");
          try {
            // @ts-ignore
            const audio = await puter.ai.txt2speech(part.text, part.lang);
            if (audio) audio.crossOrigin = "anonymous";
            allAudioSegments.push({ wordIdx: i, type: part.type, audio });
          } catch (err) {
            console.error("TTS fetch error", err);
            allAudioSegments.push({ wordIdx: i, type: part.type, audio: null });
          }
        }
      }

      // 2. Start recording
      addLog("Step 2: Starting recording sequence...", "success");
      recorder.start();

      for (let i = 0; i < currentResult.length; i++) {
        const item = currentResult[i];
        addLog(`Recording word ${i + 1}/${currentResult.length}: ${item.word}`, "info");

        const visibleParts: string[] = [];
        const wordSegments = allAudioSegments.filter(s => s.wordIdx === i);

        for (const segment of wordSegments) {
          visibleParts.push(segment.type);

          if (segment.audio) {
            const audio = segment.audio;
            const audioSource = audioCtx.createMediaElementSource(audio);
            audioSource.connect(destination);
            audioSource.connect(audioCtx.destination);

            await new Promise<void>((res) => {
              audio.onended = () => {
                audioSource.disconnect();
                res();
              };

              const draw = () => {
                // Clear and Draw BG
                ctx.clearRect(0, 0, 1080, 1920);
                if (bgImg.complete && bgImg.naturalWidth > 0) {
                  ctx.drawImage(bgImg, 0, 0, 1080, 1920);
                } else {
                  ctx.fillStyle = "#020617";
                  ctx.fillRect(0, 0, 1080, 1920);
                }

                // Draw Text Elements
                let currentY = 500;

                if (visibleParts.includes("word")) {
                  ctx.fillStyle = "white";
                  ctx.font = "bold 90px Inter";
                  ctx.textAlign = "center";
                  ctx.fillText(item.word, 540, currentY);
                  currentY += 120;
                }

                if (visibleParts.includes("meaning")) {
                  ctx.fillStyle = "#22c55e";
                  ctx.font = "60px Kalpurush";
                  ctx.textAlign = "center";
                  ctx.fillText(item.banglaMeaning, 540, currentY);
                  currentY += 200;
                }

                if (visibleParts.includes("example")) {
                  ctx.fillStyle = "#94a3b8";
                  ctx.font = "italic 45px Inter";
                  currentY = drawJustifiedText(ctx, `"${item.example}"`, 140, currentY, 800, 60);
                  currentY += 40;
                }

                if (visibleParts.includes("translation")) {
                  ctx.fillStyle = "#64748b";
                  ctx.font = "40px Kalpurush";
                  currentY = drawJustifiedText(ctx, item.exampleBangla, 140, currentY, 800, 55);
                }

                if (!audio.paused && !audio.ended) {
                  requestAnimationFrame(draw);
                }
              };

              audio.play().catch(e => {
                console.error("Audio play failed", e);
                res();
              });
              requestAnimationFrame(draw);
            });
          } else {
            // Fallback if audio failed to load
            await new Promise(res => setTimeout(res, 2000));
          }
        }
        // Short gap between words
        await new Promise(res => setTimeout(res, 1000));
      }

      recorder.stop();
      const finalUrl = await videoPromise;
      setVideoUrl(finalUrl);
      addLog("Video generated successfully!", "success");

    } catch (err: any) {
      addLog(`Generation error: ${err.message}`, "error");
      console.error(err);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      <div className="max-w-4xl mx-auto pt-6 md:pt-20 px-4">
        <header className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate("/")}
            className="p-2.5 rounded-xl bg-surface-1 border border-border hover:border-primary transition-all active:scale-95 group shrink-0"
          >
            <ArrowLeft size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-5xl font-bold font-mono truncate gradient-text">
              Video Automation
            </h1>
            <p className="text-muted-foreground font-mono text-[10px] md:text-sm truncate">
              {"// Educational reel generation system"}
            </p>
          </div>
        </header>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={() => {
              setView("start");
              handleStart();
            }}
            disabled={isProcessing}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg",
              view === "start" && !isProcessing
                ? "bg-primary text-primary-foreground"
                : "bg-surface-1 text-muted-foreground"
            )}
          >
            {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
            Start Automation
          </button>
          <button
            onClick={() => setView("records")}
            disabled={isProcessing}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg",
              view === "records"
                ? "bg-accent text-accent-foreground"
                : "bg-surface-1 text-muted-foreground"
            )}
          >
            <History size={20} />
            View Records
          </button>
          <button
            onClick={() => setIsWordTypeModalOpen(true)}
            className="px-6 py-4 rounded-2xl bg-surface-1 border border-border hover:border-primary transition-all active:scale-95"
          >
            <Settings2 size={20} />
          </button>
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="terminal-window mb-6">
            <div className="terminal-header flex items-center justify-between px-4 py-2 cursor-pointer" onClick={() => setIsLogsExpanded(!isLogsExpanded)}>
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-primary" />
                <span className="text-xs font-mono font-bold">PROCESS_LOGS</span>
              </div>
              {isLogsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
            {isLogsExpanded && (
              <div className="p-4 bg-black/40 font-mono text-xs space-y-2 max-h-60 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className={cn(
                    "flex gap-2",
                    log.type === "success" && "text-primary",
                    log.type === "error" && "text-destructive",
                    log.type === "process" && "text-accent"
                  )}>
                    <span>{">"}</span>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <div className="space-y-8 min-h-[400px]">
          {view === "start" ? (
            currentResult ? (
              <div className="animate-fade-in space-y-6 text-center">
                <h3 className="text-xl font-bold font-mono text-primary flex items-center justify-center gap-2">
                  <CheckCircle2 size={24} />
                  GENERATION_COMPLETE
                </h3>

                <div className="grid gap-4 max-w-2xl mx-auto">
                  {currentResult.map((item, idx) => (
                    <div key={idx} className="terminal-window bg-card/40 text-left">
                      <div className="terminal-header py-1 px-3 flex justify-between">
                        <span className="text-[10px] font-mono text-primary">{item.word}</span>
                        <span className="text-[10px] font-mono text-muted-foreground italic">{item.partOfSpeech}</span>
                      </div>
                      <div className="p-3">
                        <p className="font-bangla text-primary text-sm">{item.banglaMeaning}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {!videoUrl ? (
                  <div className="pt-6">
                    <button
                      onClick={generateVideo}
                      disabled={isGeneratingVideo}
                      className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-accent text-accent-foreground font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
                    >
                      {isGeneratingVideo ? <Loader2 className="animate-spin" size={24} /> : <Video size={24} />}
                      Generate Reel Video
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 pt-6">
                    <div className="relative max-w-[270px] mx-auto aspect-[9/16] rounded-3xl overflow-hidden border-4 border-accent shadow-2xl">
                      <video src={videoUrl} controls className="w-full h-full object-cover" />
                    </div>
                    <a
                      href={videoUrl}
                      download="educational-reel.webm"
                      className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg"
                    >
                      <Download size={24} />
                      Download Video
                    </a>
                  </div>
                )}
              </div>
            ) : !isProcessing && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-surface-1 border border-border flex items-center justify-center mb-4 text-muted-foreground/30">
                  <Play size={40} />
                </div>
                <h3 className="text-xl font-mono text-muted-foreground">Ready to start</h3>
                <p className="text-sm text-muted-foreground/60 max-w-xs">
                  Select word types and click start to generate content for your reel.
                </p>
              </div>
            )
          ) : (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-mono text-accent">PAST_RECORDS</h3>
                {records.length > 0 && (
                  <button
                    onClick={() => {
                      localStorage.removeItem("video_automation_records");
                      setRecords([]);
                    }}
                    className="text-xs font-mono text-destructive hover:underline"
                  >
                    CLEAR_ALL
                  </button>
                )}
              </div>

              {records.length > 0 ? (
                <div className="space-y-12">
                  {records.map((record) => (
                    <div key={record.id} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono px-2 py-1 rounded bg-secondary border border-border text-muted-foreground">
                          {new Date(record.timestamp).toLocaleString()}
                        </span>
                        <div className="h-px flex-1 bg-border/50" />
                      </div>
                      <div className="grid gap-4">
                        {record.data.map((item, idx) => (
                          <div key={idx} className="terminal-window bg-card/20">
                            <div className="p-4 flex justify-between items-center">
                              <div>
                                <span className="font-bold">{item.word}</span>
                                <span className="text-xs text-muted-foreground ml-2">({item.partOfSpeech})</span>
                                <p className="font-bangla text-primary text-sm mt-1">{item.banglaMeaning}</p>
                              </div>
                              <button
                                onClick={() => {
                                  setCurrentResult(record.data);
                                  setView("start");
                                  setVideoUrl(null);
                                }}
                                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                              >
                                <Play size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-surface-1 border border-border flex items-center justify-center mb-4 text-muted-foreground/30">
                    <History size={40} />
                  </div>
                  <h3 className="text-xl font-mono text-muted-foreground">No records found</h3>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hidden Canvas for Video Generation (not using 'hidden' to avoid browser throttling) */}
        <canvas
          ref={canvasRef}
          width={1080}
          height={1920}
          className="fixed -left-[5000px] -top-[5000px] pointer-events-none opacity-0"
        />
      </div>

      {/* Word Type Selection Modal */}
      {isWordTypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsWordTypeModalOpen(false)} />
          <div className="relative w-full max-w-2xl max-h-[80vh] bg-card border border-border rounded-3xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-bold font-mono">SELECT WORD TYPES</h3>
              <button onClick={() => setIsWordTypeModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-2">
              {WORD_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleWordType(type)}
                  className={cn(
                    "px-3 py-2 rounded-xl border text-left text-xs font-mono",
                    selectedWordTypes.includes(type) ? "bg-primary/10 border-primary text-primary" : "bg-surface-1 border-border"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="p-6 border-t border-border flex gap-4">
              <button onClick={() => setSelectedWordTypes(WORD_TYPES)} className="flex-1 py-3 border border-border rounded-xl font-mono text-sm">ALL</button>
              <button onClick={() => setIsWordTypeModalOpen(false)} className="flex-[2] py-3 bg-primary text-primary-foreground rounded-xl font-mono text-sm font-bold">DONE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoAutomation;
