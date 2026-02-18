import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// --- Types ---
type CellType = "wall" | "path" | "start" | "exit";

interface Position {
  x: number;
  y: number;
}

// --- Constants ---
const VIEWPORT_SIZE = 9; // Number of cells visible in each dimension
const INITIAL_MAZE_SIZE = 11; // Must be odd
const DUCK_COLOR = "#FFD700";
const BEAK_COLOR = "#FF8C00";
const EYE_COLOR = "#000000";

// --- Duck Pixel Art (8x8) ---
const DUCK_PIXELS = {
  right: [
    [0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 0, 1, 2, 2],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  left: [
    [0, 0, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 0],
    [2, 2, 1, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  up: [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  down: [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 1, 1, 2, 2, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

const MazeGame = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- State ---
  const [level, setLevel] = useState<number>(() => {
    const saved = localStorage.getItem("maze_level");
    return saved ? parseInt(saved, 10) : 1;
  });
  const [maze, setMaze] = useState<CellType[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });
  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">("down");
  const [isMoving, setIsMoving] = useState(false);
  const [frame, setFrame] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // --- Maze Generation (Recursive Backtracking) ---
  const generateMaze = useCallback((lvl: number) => {
    const size = INITIAL_MAZE_SIZE + (lvl - 1) * 2;
    const newMaze: CellType[][] = Array(size).fill(null).map(() => Array(size).fill("wall"));

    const stack: Position[] = [];
    const start: Position = { x: 1, y: 1 };
    newMaze[start.y][start.x] = "path";
    stack.push(start);

    const getNeighbors = (p: Position) => {
      const neighbors: { pos: Position; wall: Position }[] = [];
      const dirs = [
        { dx: 0, dy: -2, wx: 0, wy: -1 },
        { dx: 0, dy: 2, wx: 0, wy: 1 },
        { dx: -2, dy: 0, wx: -1, wy: 0 },
        { dx: 2, dy: 0, wx: 1, wy: 0 },
      ];

      for (const d of dirs) {
        const nx = p.x + d.dx;
        const ny = p.y + d.dy;
        if (nx > 0 && nx < size - 1 && ny > 0 && ny < size - 1 && newMaze[ny][nx] === "wall") {
          neighbors.push({ pos: { x: nx, y: ny }, wall: { x: p.x + d.wx, y: p.y + d.wy } });
        }
      }
      return neighbors;
    };

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = getNeighbors(current);

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        newMaze[next.wall.y][next.wall.x] = "path";
        newMaze[next.pos.y][next.pos.x] = "path";
        stack.push(next.pos);
      } else {
        stack.pop();
      }
    }

    // Set Exit (usually bottom right-ish)
    let exitPos = { x: size - 2, y: size - 2 };
    // Make sure it's reachable (it should be in this algorithm)
    newMaze[exitPos.y][exitPos.x] = "exit";

    setMaze(newMaze);
    setPlayerPos({ x: 1, y: 1 });
    setGameWon(false);
  }, []);

  useEffect(() => {
    generateMaze(level);
  }, [level, generateMaze]);

  useEffect(() => {
    localStorage.setItem("maze_level", level.toString());
  }, [level]);

  // --- Animation Loop ---
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setFrame(f => (f + 1) % 60);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // --- Rendering ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || maze.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const cellSize = canvasWidth / VIEWPORT_SIZE;

    // Camera follow
    let cameraX = playerPos.x - Math.floor(VIEWPORT_SIZE / 2);
    let cameraY = playerPos.y - Math.floor(VIEWPORT_SIZE / 2);

    // Clamp camera
    cameraX = Math.max(0, Math.min(cameraX, maze[0].length - VIEWPORT_SIZE));
    cameraY = Math.max(0, Math.min(cameraY, maze.length - VIEWPORT_SIZE));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Maze
    for (let y = 0; y < VIEWPORT_SIZE; y++) {
      for (let x = 0; x < VIEWPORT_SIZE; x++) {
        const mazeX = cameraX + x;
        const mazeY = cameraY + y;
        const cell = maze[mazeY][mazeX];

        if (cell === "wall") {
          ctx.fillStyle = "#1a1a1a";
          ctx.fillRect(x * cellSize, y * cellSize, cellSize + 0.5, cellSize + 0.5);

          // Add some pixel texture to walls
          ctx.fillStyle = "#22C55E"; // Terminal Green
          ctx.globalAlpha = 0.1;
          ctx.fillRect(x * cellSize + 4, y * cellSize + 4, cellSize - 8, cellSize - 8);
          ctx.globalAlpha = 1.0;
        } else if (cell === "exit") {
          ctx.fillStyle = "#22C55E"; // Green exit
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          // Pulse effect
          const pulse = Math.sin(frame * 0.1) * 0.2 + 0.8;
          ctx.fillStyle = "white";
          ctx.globalAlpha = 0.3 * pulse;
          ctx.fillRect(x * cellSize + 5, y * cellSize + 5, cellSize - 10, cellSize - 10);
          ctx.globalAlpha = 1.0;
        } else {
          ctx.fillStyle = "#0a0a0a";
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    // Draw Player (Duck)
    const playerScreenX = (playerPos.x - cameraX) * cellSize;
    const playerScreenY = (playerPos.y - cameraY) * cellSize;

    const pixelSize = cellSize / 8;
    const duckPixels = DUCK_PIXELS[direction];

    // Animation wobble
    const wobble = isMoving ? Math.round(Math.sin(frame * 0.3) * 2) : 0;

    duckPixels.forEach((row, rowIdx) => {
      row.forEach((pixel, colIdx) => {
        if (pixel === 0) return;

        let color = DUCK_COLOR;
        if (pixel === 2) color = BEAK_COLOR;
        if (pixel === 1 && colIdx === 4 && direction === 'right') color = EYE_COLOR;
        if (pixel === 1 && colIdx === 3 && direction === 'left') color = EYE_COLOR;

        ctx.fillStyle = color;
        const x = Math.floor(playerScreenX + colIdx * pixelSize);
        const y = Math.floor(playerScreenY + rowIdx * pixelSize + wobble);
        const w = Math.floor(playerScreenX + (colIdx + 1) * pixelSize) - x;
        const h = Math.floor(playerScreenY + (rowIdx + 1) * pixelSize + wobble) - y;
        ctx.fillRect(x, y, w, h);
      });
    });

  }, [maze, playerPos, direction, frame, isMoving]);

  // --- Movement ---
  const move = (dir: "up" | "down" | "left" | "right") => {
    if (gameWon) return;

    setDirection(dir);
    setIsMoving(true);
    setTimeout(() => setIsMoving(false), 150);

    const newPos = { ...playerPos };
    if (dir === "up") newPos.y -= 1;
    if (dir === "down") newPos.y += 1;
    if (dir === "left") newPos.x -= 1;
    if (dir === "right") newPos.x += 1;

    if (
      newPos.x >= 0 &&
      newPos.x < maze[0].length &&
      newPos.y >= 0 &&
      newPos.y < maze.length &&
      maze[newPos.y][newPos.x] !== "wall"
    ) {
      setPlayerPos(newPos);
      if (maze[newPos.y][newPos.x] === "exit") {
        setGameWon(true);
        setTimeout(() => {
          setLevel(l => l + 1);
        }, 1500);
      }
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") move("up");
      if (e.key === "ArrowDown") move("down");
      if (e.key === "ArrowLeft") move("left");
      if (e.key === "ArrowRight") move("right");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [maze, playerPos, gameWon]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden font-mono">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-white/10 shrink-0">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-lg bg-surface-1 border border-border hover:border-primary transition-all active:scale-95 group"
        >
          <ArrowLeft size={18} className="text-muted-foreground group-hover:text-primary" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold text-primary">MAZE_RUNNER_v1.0</h1>
          <p className="text-[10px] text-muted-foreground">LVL: {level}</p>
        </div>
        <button
          onClick={() => generateMaze(level)}
          className="p-2 rounded-lg bg-surface-1 border border-border hover:border-accent transition-all active:scale-95 group"
        >
          <RotateCcw size={18} className="text-muted-foreground group-hover:text-accent" />
        </button>
      </header>

      {/* Game Screen */}
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={432}
          height={432}
          className="max-w-full aspect-square border-2 border-primary/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
        />

        {gameWon && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <Trophy size={64} className="text-primary mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-primary">LEVEL_COMPLETE!</h2>
            <p className="text-muted-foreground mt-2">Generating next level...</p>
          </div>
        )}
      </div>

      {/* Controller Area */}
      <div className="h-[300px] shrink-0 bg-zinc-900/50 border-t border-white/10 p-6 flex items-center justify-center relative">
        <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full max-w-[240px]">
          <div />
          <ControlButton icon={ChevronUp} onClick={() => move("up")} className="col-start-2" />
          <div />

          <ControlButton icon={ChevronLeft} onClick={() => move("left")} className="row-start-2 col-start-1" />
          <div className="flex items-center justify-center">
             <div className="w-4 h-4 rounded-full bg-primary/20 animate-pulse" />
          </div>
          <ControlButton icon={ChevronRight} onClick={() => move("right")} className="row-start-2 col-start-3" />

          <div />
          <ControlButton icon={ChevronDown} onClick={() => move("down")} className="row-start-3 col-start-2" />
          <div />
        </div>

        {/* Level Indicator for Mobile */}
        <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground font-mono bg-black/40 px-2 py-1 rounded border border-white/5">
          STATUS::OK
        </div>
      </div>
    </div>
  );
};

const ControlButton = ({ icon: Icon, onClick, className }: { icon: any, onClick: () => void, className?: string }) => (
  <button
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    onTouchStart={(e) => { e.preventDefault(); onClick(); }}
    className={cn(
      "w-full aspect-square rounded-2xl bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center active:scale-95 active:bg-primary/20 active:border-primary transition-all shadow-lg",
      className
    )}
  >
    <Icon size={32} className="text-zinc-400" />
  </button>
);

export default MazeGame;
