import { useState, useEffect } from "react";
import { ArrowLeft, Play, History, Loader2, AlertCircle, Terminal, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AutomationRecord {
  id: string;
  timestamp: string;
  data: WordData[];
}

interface WordData {
  word: string;
  banglaMeaning: string;
  partOfSpeech: string;
  example: string;
  exampleBangla: string;
}

const Automation = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"start" | "records">("start");
  const [logs, setLogs] = useState<{ message: string; type: "info" | "success" | "error" | "process" }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<WordData[] | null>(null);
  const [records, setRecords] = useState<AutomationRecord[]>([]);

  useEffect(() => {
    const savedRecords = localStorage.getItem("automation_records");
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
        "X-Title": "Abdullah Portfolio Automation",
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
      // 1. Try to find JSON block in markdown (```json ... ```)
      const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (markdownMatch) {
        return JSON.parse(markdownMatch[1].trim());
      }

      // 2. If no markdown block, try to find the outermost array or object
      const jsonMatch = text.match(/\[[\s\S]*\]/) || text.match(/{[\s\S]*}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0].trim());
      }

      // 3. Fallback to parsing the whole text
      return JSON.parse(text.trim());
    } catch (e) {
      console.error("Failed to parse JSON from AI response:", text);
      throw new Error("Failed to parse AI response as JSON. Please try again.");
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

    setIsProcessing(true);
    setLogs([]);
    setCurrentResult(null);
    addLog("Initializing automation sequence...", "process");

    try {
      // Step 1: Get 10 words from AI
      addLog("Step 1: Requesting 10 unique words from AI (Qwen)...", "info");
      const firstPrompt = `Return ONLY a valid JSON array of 10 unique English words (C1 and C2 levels).
NO introductory or concluding text. NO conversational filler.
Example format: ["word1", "word2", ..., "word10"]`;
      const wordsResponse = await fetchOpenRouter(firstPrompt);
      addLog("Words received from AI.", "success");

      const wordsList = parseJsonFromAi(wordsResponse);
      const wordsArray = Array.isArray(wordsList) ? wordsList : wordsList.words || [];

      if (!wordsArray.length) throw new Error("Received empty word list from AI.");

      addLog(`Extracted ${wordsArray.length} words: ${wordsArray.join(", ")}`, "info");

      // Step 2: Fetch definitions for each word
      addLog("Step 2: Fetching data from Dictionary API...", "info");
      const enrichedWords = [];
      for (const word of wordsArray) {
        addLog(`Processing word: ${word}...`, "process");
        const data = await fetchDictionary(word);
        if (data) {
          enrichedWords.push(data);
        } else {
          addLog(`Could not find data for "${word}", will let AI generate details.`, "info");
          enrichedWords.push({
            word,
            definition: "",
            partOfSpeech: "",
            example: ""
          });
        }
      }

      if (enrichedWords.length === 0) throw new Error("Could not fetch data for any of the words.");

      // Step 3: Translate and refine with AI
      addLog("Step 3: Sending enriched data for Bangla translation and refinement...", "info");
      const secondPrompt = `Return ONLY a valid JSON array of objects. NO introductory or concluding text. NO conversational filler.

Each object in the array must have these EXACT keys:
- "partOfSpeech": (string) The part of speech in English.
- "word": (string) The English word provided.
- "banglaMeaning": (string) A refined Bangla meaning/definition (not just a literal translation).
- "example": (string) The English use example sentence. IF the input data has an example, you can use or refine it. IF there is no example provided, you MUST create one yourself.
- "exampleBangla": (string) Bangla translation of the example sentence.

Special Instruction: IF there is no example of the word provided to you, then make one yourself and attach the bangla translation.

Input Data: ${JSON.stringify(enrichedWords)}`;

      const translationResponse = await fetchOpenRouter(secondPrompt);
      addLog("Translation received from AI.", "success");

      const finalJson = parseJsonFromAi(translationResponse);

      // Map keys if necessary (AI might name keys differently)
      const formattedResult: WordData[] = finalJson.map((item: any) => ({
        word: item.word || item.english_word || "",
        banglaMeaning: item.bangla_meaning || item.meaning_bangla || item.meaning || "",
        partOfSpeech: item.part_of_speech || item.pos || "",
        example: item.use_example || item.example || item.example_en || "",
        exampleBangla: item.bangla_translation_of_example || item.example_bn || item.example_bangla || ""
      }));

      setCurrentResult(formattedResult);
      addLog("Automation sequence completed successfully!", "success");

      // Save to records
      const newRecord: AutomationRecord = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        data: formattedResult
      };

      const updatedRecords = [newRecord, ...records];
      setRecords(updatedRecords);
      localStorage.setItem("automation_records", JSON.stringify(updatedRecords));
      addLog("Record saved to local storage.", "info");

    } catch (error: any) {
      addLog(`ERROR: ${error.message}`, "error");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecords = () => {
    setView("records");
  };

  const clearRecords = () => {
    localStorage.removeItem("automation_records");
    setRecords([]);
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
              Automation
            </h1>
            <p className="text-muted-foreground font-mono text-[10px] md:text-sm truncate">
              {"// Educational content generation system"}
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
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                : "bg-surface-1 border border-border text-muted-foreground hover:border-primary/50"
            )}
          >
            {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
            Start Automation
          </button>
          <button
            onClick={handleRecords}
            disabled={isProcessing}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg",
              view === "records"
                ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-accent/20"
                : "bg-surface-1 border border-border text-muted-foreground hover:border-primary/50"
            )}
          >
            <History size={20} />
            View Records
          </button>
        </div>

        {/* Live Logs */}
        {logs.length > 0 && view === "start" && (
          <div className="terminal-window mb-10">
            <div className="terminal-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-primary" />
                <span className="text-xs font-mono font-bold">LIVE_PROCESS_LOGS</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-border" />
                <div className="w-2 h-2 rounded-full bg-border" />
              </div>
            </div>
            <div className="p-4 bg-black/40 font-mono text-xs md:text-sm space-y-2">
              {logs.map((log, i) => (
                <div key={i} className={cn(
                  "flex gap-2",
                  log.type === "success" && "text-primary",
                  log.type === "error" && "text-destructive",
                  log.type === "process" && "text-accent",
                  log.type === "info" && "text-muted-foreground"
                )}>
                  <span className="shrink-0">{">"}</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="space-y-8 min-h-[400px]">
          {view === "start" ? (
            currentResult ? (
              <div className="animate-fade-in space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-mono text-primary flex items-center gap-2">
                    <CheckCircle2 size={24} />
                    GENERATION_COMPLETE
                  </h3>
                </div>
                <div className="grid gap-6">
                  {currentResult.map((item, idx) => (
                    <WordCard key={idx} item={item} index={idx} />
                  ))}
                </div>
              </div>
            ) : !isProcessing && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-surface-1 border border-border flex items-center justify-center mb-4 text-muted-foreground/30">
                  <Play size={40} />
                </div>
                <h3 className="text-xl font-mono text-muted-foreground">Ready to start</h3>
                <p className="text-sm text-muted-foreground/60 max-w-xs">
                  Click the "Start Automation" button to begin the educational content generation process.
                </p>
              </div>
            )
          ) : (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-mono text-accent">PAST_RECORDS</h3>
                {records.length > 0 && (
                  <button
                    onClick={clearRecords}
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
                      <div className="grid gap-6">
                        {record.data.map((item, idx) => (
                          <WordCard key={idx} item={item} index={idx} />
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
                  <p className="text-sm text-muted-foreground/60 max-w-xs">
                    Completed generations will appear here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const WordCard = ({ item, index }: { item: WordData; index: number }) => (
  <div className="terminal-window bg-card/40 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
    <div className="terminal-header flex items-center justify-between py-2 px-4">
      <span className="text-[10px] font-mono text-primary">WORD::{item.word.toUpperCase()}</span>
      <span className="text-[10px] font-mono text-muted-foreground italic">{item.partOfSpeech}</span>
    </div>
    <div className="p-6 space-y-4">
      <div className="space-y-1">
        <h4 className="text-2xl font-bold">{item.word}</h4>
        <p className="text-xl font-bangla text-primary">{item.banglaMeaning}</p>
      </div>
      <div className="space-y-2 pt-2 border-t border-border/30">
        <p className="text-sm text-muted-foreground italic">"{item.example}"</p>
        <p className="text-sm font-bangla text-muted-foreground/80">{item.exampleBangla}</p>
      </div>
    </div>
  </div>
);

export default Automation;
