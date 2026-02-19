import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, Trophy, Settings, X, Maximize, Minimize, Zap, Route, Shuffle, Ghost, ShoppingBag, Dices, Radar, Expand, Play, Waypoints, Footprints, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// --- Types ---
type CellType = "wall" | "path" | "start" | "exit";

interface Position {
  x: number;
  y: number;
}

// --- Constants ---
const INITIAL_VIEWPORT_SIZE = 13; // Number of cells visible in each dimension
const INITIAL_MAZE_SIZE = 11; // Must be odd
const DUCK_COLOR = "#FFD700";
const BEAK_COLOR = "#FF8C00";
const EYE_COLOR = "#000000";

// --- Duck Pixel Art (8x8) ---
// 1: Duck Color, 2: Beak Color, 3: Eye Color
const DUCK_PIXELS = {
  right: [
    [0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 3, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 2, 2],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  left: [
    [0, 0, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 3, 1, 1, 0, 0],
    [2, 2, 1, 1, 1, 1, 1, 0],
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
    [0, 1, 3, 1, 1, 3, 1, 0],
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
  const [pulseCycle, setPulseCycle] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showModStore, setShowModStore] = useState(false);
  const [mods, setMods] = useState({
    superSpeed: localStorage.getItem("maze_mod_speed") === "true",
    ghostDuck: localStorage.getItem("maze_mod_ghost") === "true",
    pathFinder: localStorage.getItem("maze_mod_path") === "true",
    randomExit: localStorage.getItem("maze_random_exit") === "true",
    visionPulse: localStorage.getItem("maze_mod_vision") === "true",
    eagleEye: localStorage.getItem("maze_mod_eagle") === "true",
    autoPilot: localStorage.getItem("maze_mod_auto") === "true",
    warpPortals: localStorage.getItem("maze_mod_warp") === "true",
    trailBlazer: localStorage.getItem("maze_mod_trail") === "true",
    wallBreaker: localStorage.getItem("maze_mod_breaker") === "true",
  });
  const [exitPos, setExitPos] = useState<Position>({ x: 0, y: 0 });
  const [portals, setPortals] = useState<Position[]>([]);
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set());
  const [solutionPath, setSolutionPath] = useState<Position[]>([]);
  const [jumpLevel, setJumpLevel] = useState("");
  const moveIntervalRef = useRef<any>(null);

  // --- Maze Generation (Recursive Backtracking) ---
  const generateMaze = useCallback((lvl: number, isRandomExit: boolean) => {
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

    // Set Exit
    let finalExitPos: Position;
    if (isRandomExit) {
      const paths: Position[] = [];
      for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
          if (newMaze[y][x] === "path" && (x > size / 2 || y > size / 2)) {
            paths.push({ x, y });
          }
        }
      }
      finalExitPos = paths[Math.floor(Math.random() * paths.length)];
      newMaze[finalExitPos.y][finalExitPos.x] = "exit";
    } else {
      finalExitPos = { x: size - 2, y: size - 2 };
      newMaze[finalExitPos.y][finalExitPos.x] = "exit";
    }

    // Set Portals
    const paths: Position[] = [];
    for (let y = 1; y < size - 1; y++) {
      for (let x = 1; x < size - 1; x++) {
        if (newMaze[y][x] === "path" && !(x === 1 && y === 1) && !(x === finalExitPos.x && y === finalExitPos.y)) {
          paths.push({ x, y });
        }
      }
    }
    if (paths.length >= 2) {
      const p1 = paths.splice(Math.floor(Math.random() * paths.length), 1)[0];
      const p2 = paths.splice(Math.floor(Math.random() * paths.length), 1)[0];
      setPortals([p1, p2]);
    } else {
      setPortals([]);
    }

    setMaze(newMaze);
    setExitPos(finalExitPos);
    setPlayerPos({ x: 1, y: 1 });
    setVisitedCells(new Set(["1,1"]));
    setGameWon(false);
  }, []);

  const randomizePosition = useCallback(() => {
    if (maze.length === 0) return;
    const paths: Position[] = [];
    for (let y = 1; y < maze.length - 1; y++) {
      for (let x = 1; x < maze[0].length - 1; x++) {
        if (maze[y][x] === "path") {
          paths.push({ x, y });
        }
      }
    }
    if (paths.length > 0) {
      const newPos = paths[Math.floor(Math.random() * paths.length)];
      setPlayerPos(newPos);
    }
  }, [maze]);

  useEffect(() => {
    generateMaze(level, mods.randomExit);
  }, [level, mods.randomExit, generateMaze]);

  const findPath = useCallback((currentMaze: CellType[][], start: Position, end: Position) => {
    if (!currentMaze.length || !start || !end) return [];
    const queue: { pos: Position; path: Position[] }[] = [{ pos: start, path: [start] }];
    const visited = new Set<string>();
    visited.add(`${start.x},${start.y}`);

    while (queue.length > 0) {
      const { pos, path } = queue.shift()!;
      if (pos.x === end.x && pos.y === end.y) return path;

      const dirs = [
        { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
        { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
      ];

      for (const d of dirs) {
        const nx = pos.x + d.dx;
        const ny = pos.y + d.dy;
        if (
          nx >= 0 && nx < currentMaze[0].length &&
          ny >= 0 && ny < currentMaze.length &&
          currentMaze[ny][nx] !== "wall" &&
          !visited.has(`${nx},${ny}`)
        ) {
          visited.add(`${nx},${ny}`);
          queue.push({ pos: { x: nx, y: ny }, path: [...path, { x: nx, y: ny }] });
        }
      }
    }
    return [];
  }, []);

  // --- Movement ---
  const move = useCallback((dir: "up" | "down" | "left" | "right") => {
    if (gameWon || maze.length === 0) return;

    setDirection(dir);
    setIsMoving(true);
    setTimeout(() => setIsMoving(false), 150);

    setPlayerPos(prev => {
      let currentPos = { ...prev };

      const getNext = (p: Position) => {
        const n = { ...p };
        if (dir === "up") n.y -= 1;
        if (dir === "down") n.y += 1;
        if (dir === "left") n.x -= 1;
        if (dir === "right") n.x += 1;
        return n;
      };

      const isWall = (p: Position) => {
        if (p.x < 0 || p.x >= maze[0].length || p.y < 0 || p.y >= maze.length) return true;
        return maze[p.y][p.x] === "wall";
      };

      const handlePortal = (p: Position) => {
        if (mods.warpPortals && portals.length === 2) {
          if (p.x === portals[0].x && p.y === portals[0].y) return portals[1];
          if (p.x === portals[1].x && p.y === portals[1].y) return portals[0];
        }
        return p;
      };

      if (mods.ghostDuck) {
        let nextPos = getNext(currentPos);
        if (isWall(nextPos)) {
          while (isWall(nextPos)) {
            nextPos = getNext(nextPos);
            if (nextPos.x < 0 || nextPos.x >= maze[0].length || nextPos.y < 0 || nextPos.y >= maze.length) {
              return prev;
            }
          }
        }
        if (maze[nextPos.y][nextPos.x] === "exit") {
          setGameWon(true);
          setTimeout(() => setLevel(l => l + 1), 1500);
        }
        const teleported = handlePortal(nextPos);
        return teleported;
      }

      if (mods.superSpeed) {
        let nextPos = getNext(currentPos);
        while (!isWall(nextPos)) {
          currentPos = nextPos;
          if (maze[currentPos.y][currentPos.x] === "exit") break;
          nextPos = getNext(currentPos);
        }
        if (currentPos.x === prev.x && currentPos.y === prev.y) return prev;

        if (maze[currentPos.y][currentPos.x] === "exit") {
          setGameWon(true);
          setTimeout(() => setLevel(l => l + 1), 1500);
        }
        return currentPos;
      }

      const nextPos = getNext(currentPos);
      if (!isWall(nextPos)) {
        if (maze[nextPos.y][nextPos.x] === "exit") {
          setGameWon(true);
          setTimeout(() => setLevel(l => l + 1), 1500);
        }
        const teleported = handlePortal(nextPos);
        return teleported;
      }
      return prev;
    });
  }, [gameWon, maze, mods]);

  useEffect(() => {
    if ((mods.pathFinder || mods.autoPilot) && maze.length > 0 && exitPos) {
      setSolutionPath(findPath(maze, playerPos, exitPos));
    } else {
      setSolutionPath([]);
    }
  }, [mods.pathFinder, mods.autoPilot, playerPos, maze, exitPos, findPath]);

  useEffect(() => {
    if (mods.autoPilot && !gameWon && solutionPath.length > 1) {
      const timer = setTimeout(() => {
        const nextCell = solutionPath[1];
        if (nextCell.x > playerPos.x) move("right");
        else if (nextCell.x < playerPos.x) move("left");
        else if (nextCell.y > playerPos.y) move("down");
        else if (nextCell.y < playerPos.y) move("up");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [mods.autoPilot, gameWon, solutionPath, playerPos.x, playerPos.y, move]);

  useEffect(() => {
    if (mods.trailBlazer) {
      setVisitedCells(v => {
        const key = `${playerPos.x},${playerPos.y}`;
        if (v.has(key)) return v;
        const next = new Set(v);
        next.add(key);
        return next;
      });
    }
  }, [playerPos.x, playerPos.y, mods.trailBlazer]);

  useEffect(() => {
    localStorage.setItem("maze_level", level.toString());
    localStorage.setItem("maze_random_exit", mods.randomExit.toString());
    localStorage.setItem("maze_mod_speed", mods.superSpeed.toString());
    localStorage.setItem("maze_mod_ghost", mods.ghostDuck.toString());
    localStorage.setItem("maze_mod_path", mods.pathFinder.toString());
    localStorage.setItem("maze_mod_vision", mods.visionPulse.toString());
    localStorage.setItem("maze_mod_eagle", mods.eagleEye.toString());
    localStorage.setItem("maze_mod_auto", mods.autoPilot.toString());
    localStorage.setItem("maze_mod_warp", mods.warpPortals.toString());
    localStorage.setItem("maze_mod_trail", mods.trailBlazer.toString());
    localStorage.setItem("maze_mod_breaker", mods.wallBreaker.toString());
  }, [level, mods]);

  // --- Animation Loop ---
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setFrame(f => (f + 1) % 60);
      setPulseCycle(p => (p + 1) % 180); // 3 second cycle at 60fps
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

    const viewportSize = mods.eagleEye ? 25 : (level > 100 ? 21 : INITIAL_VIEWPORT_SIZE);
    const canvasWidth = canvas.width;
    const cellSize = canvasWidth / viewportSize;

    // Camera follow
    let cameraX = playerPos.x - Math.floor(viewportSize / 2);
    let cameraY = playerPos.y - Math.floor(viewportSize / 2);

    // Clamp camera
    cameraX = Math.max(0, Math.min(cameraX, maze[0].length - viewportSize));
    cameraY = Math.max(0, Math.min(cameraY, maze.length - viewportSize));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Maze
    for (let y = 0; y < viewportSize; y++) {
      for (let x = 0; x < viewportSize; x++) {
        const mazeX = cameraX + x;
        const mazeY = cameraY + y;
        const cell = maze[mazeY]?.[mazeX];

        if (!cell || cell === "wall") {
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

          // Draw Trail Blazer
          if (mods.trailBlazer && visitedCells.has(`${mazeX},${mazeY}`)) {
            ctx.fillStyle = "#22C55E";
            ctx.globalAlpha = 0.2;
            ctx.fillRect(x * cellSize + 2, y * cellSize + 2, cellSize - 4, cellSize - 4);
            ctx.globalAlpha = 1.0;
          }
        }
      }
    }

    // Draw Warp Portals
    if (mods.warpPortals && portals.length === 2) {
      portals.forEach((p, i) => {
        const screenX = (p.x - cameraX) * cellSize + cellSize / 2;
        const screenY = (p.y - cameraY) * cellSize + cellSize / 2;
        const pulse = Math.sin(frame * 0.1) * 0.3 + 0.7;

        ctx.save();
        ctx.beginPath();
        ctx.arc(screenX, screenY, (cellSize / 3) * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = i === 0 ? "#8B5CF6" : "#EC4899"; // Purple and Pink
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.globalAlpha = 0.3;
        ctx.fillStyle = i === 0 ? "#8B5CF6" : "#EC4899";
        ctx.fill();
        ctx.restore();
      });
    }

    // Draw Path Finder
    if (mods.pathFinder && solutionPath.length > 0) {
      ctx.strokeStyle = "#22C55E";
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.4;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      solutionPath.forEach((p, i) => {
        const screenX = (p.x - cameraX) * cellSize + cellSize / 2;
        const screenY = (p.y - cameraY) * cellSize + cellSize / 2;
        if (i === 0) ctx.moveTo(screenX, screenY);
        else ctx.lineTo(screenX, screenY);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1.0;
    }

    // Draw Player (Duck)
    const playerScreenX = (playerPos.x - cameraX) * cellSize;
    const playerScreenY = (playerPos.y - cameraY) * cellSize;

    // Draw Vision Pulse Darkness
    if (mods.visionPulse) {
      const playerCenterX = playerScreenX + cellSize / 2;
      const playerCenterY = playerScreenY + cellSize / 2;

      let revealRadius = cellSize * 1.2; // Min visibility around duck
      if (pulseCycle < 60) {
        // Expanding pulse effect
        revealRadius = (pulseCycle / 60) * canvasWidth * 1.2;
      }

      ctx.save();
      ctx.fillStyle = "#000000";
      ctx.globalAlpha = 0.98;
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.arc(playerCenterX, playerCenterY, revealRadius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();

      // Draw a subtle pulse ring
      if (pulseCycle < 60) {
        ctx.save();
        ctx.strokeStyle = "#22C55E";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1 - (pulseCycle / 60);
        ctx.beginPath();
        ctx.arc(playerCenterX, playerCenterY, revealRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    const pixelSize = cellSize / 8;
    const duckPixels = DUCK_PIXELS[direction];

    // Animation wobble
    const wobble = isMoving ? Math.round(Math.sin(frame * 0.3) * 2) : 0;

    duckPixels.forEach((row, rowIdx) => {
      row.forEach((pixel, colIdx) => {
        if (pixel === 0) return;

        let color = DUCK_COLOR;
        if (pixel === 2) color = BEAK_COLOR;
        if (pixel === 3) color = EYE_COLOR;

        ctx.fillStyle = color;
        const x = Math.floor(playerScreenX + colIdx * pixelSize);
        const y = Math.floor(playerScreenY + rowIdx * pixelSize + wobble);
        const w = Math.floor(playerScreenX + (colIdx + 1) * pixelSize) - x;
        const h = Math.floor(playerScreenY + (rowIdx + 1) * pixelSize + wobble) - y;
        ctx.fillRect(x, y, w, h);
      });
    });

  }, [maze, playerPos, direction, frame, pulseCycle, isMoving, mods, solutionPath, level]);

  const breakWall = useCallback(() => {
    if (!mods.wallBreaker || maze.length === 0) return;

    const targetX = playerPos.x + (direction === "left" ? -1 : direction === "right" ? 1 : 0);
    const targetY = playerPos.y + (direction === "up" ? -1 : direction === "down" ? 1 : 0);

    if (
      targetX > 0 && targetX < maze[0].length - 1 &&
      targetY > 0 && targetY < maze.length - 1 &&
      maze[targetY][targetX] === "wall"
    ) {
      setMaze(prev => {
        const next = [...prev.map(row => [...row])];
        next[targetY][targetX] = "path";
        return next;
      });
    }
  }, [mods.wallBreaker, maze, playerPos, direction]);

  const startMoving = (dir: "up" | "down" | "left" | "right") => {
    stopMoving();
    move(dir);
    const interval = mods.superSpeed ? 80 : 150;
    moveIntervalRef.current = setInterval(() => move(dir), interval);
  };

  const stopMoving = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      stopMoving();
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
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
        <div className="flex gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-surface-1 border border-border hover:border-primary transition-all active:scale-95 group hidden md:flex"
          >
            {isFullscreen ? (
              <Minimize size={18} className="text-muted-foreground group-hover:text-primary" />
            ) : (
              <Maximize size={18} className="text-muted-foreground group-hover:text-primary" />
            )}
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg bg-surface-1 border border-border hover:border-primary transition-all active:scale-95 group"
          >
            <Settings size={18} className="text-muted-foreground group-hover:text-primary" />
          </button>
          <button
            onClick={() => generateMaze(level, mods.randomExit)}
            className="p-2 rounded-lg bg-surface-1 border border-border hover:border-accent transition-all active:scale-95 group"
          >
            <RotateCcw size={18} className="text-muted-foreground group-hover:text-accent" />
          </button>
        </div>
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative w-full max-w-xs bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-primary">SETTINGS</h3>
              <button onClick={() => setShowSettings(false)} className="text-muted-foreground hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowSettings(false);
                  setShowModStore(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary/10 border border-primary/20 rounded-xl text-xs font-bold text-primary hover:bg-primary/20 transition-all"
              >
                <ShoppingBag size={14} />
                MOD_STORE
              </button>

              <div className="space-y-2">
                <span className="text-xs">JUMP_TO_LEVEL</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={jumpLevel}
                    onChange={(e) => setJumpLevel(e.target.value)}
                    placeholder="Level #"
                    className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => {
                      const lvl = parseInt(jumpLevel);
                      if (!isNaN(lvl) && lvl > 0) {
                        setLevel(lvl);
                        setShowSettings(false);
                      }
                    }}
                    className="px-4 py-2 bg-primary text-black font-bold rounded-lg text-xs"
                  >
                    GO
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  toggleFullscreen();
                  setShowSettings(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl text-xs font-bold md:hidden"
              >
                {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
                {isFullscreen ? "EXIT_FULLSCREEN" : "ENTER_FULLSCREEN"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mod Store Modal */}
      {showModStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModStore(false)} />
          <div className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] no-scrollbar">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-primary flex items-center gap-2 text-sm">
                <ShoppingBag size={18} />
                MOD_STORE
              </h3>
              <button onClick={() => setShowModStore(false)} className="text-muted-foreground hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-3">
              {/* Super Speed */}
              <ModItem
                icon={Zap}
                title="SUPER SPEED"
                description="Duck runs faster and overshoots until hitting a wall."
                pros="Significantly faster movement."
                cons="Cannot stop at junctions; must hit a wall to turn."
                active={mods.superSpeed}
                onToggle={() => setMods(m => ({ ...m, superSpeed: !m.superSpeed }))}
              />

              {/* Random Placement */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800 text-primary">
                      <Dices size={18} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold">RANDOM PLACEMENT</h4>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Spawn the duck randomly anywhere in the maze.</p>
                    </div>
                  </div>
                  <button
                    onClick={randomizePosition}
                    className="px-3 py-1 bg-primary text-black text-[9px] font-bold rounded-lg hover:bg-primary/90 active:scale-95 transition-all"
                  >
                    ACTIVATE
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[8px]">
                  <div className="text-green-500/80">PROS:: CAN BYPASS LARGE SECTIONS.</div>
                  <div className="text-red-500/80">CONS:: MIGHT TELEPORT FURTHER AWAY.</div>
                </div>
              </div>

              {/* Path Finder */}
              <ModItem
                icon={Route}
                title="PATH FINDER"
                description="Show the optimal path to the exit."
                pros="Guaranteed route to the finish."
                cons="Removes the challenge of exploration."
                active={mods.pathFinder}
                onToggle={() => setMods(m => ({ ...m, pathFinder: !m.pathFinder }))}
              />

              {/* Random Exit */}
              <ModItem
                icon={Shuffle}
                title="RANDOM EXIT"
                description="Exit spawns at a random path location."
                pros="More unpredictable level generation."
                cons="Exit might be closer than expected."
                active={mods.randomExit}
                onToggle={() => setMods(m => ({ ...m, randomExit: !m.randomExit }))}
              />

              {/* Ghost Duck */}
              <ModItem
                icon={Ghost}
                title="GHOST DUCK"
                description="Phase through walls to reach adjacent paths."
                pros="Can take shortcuts through walls."
                cons="Cannot stop inside walls; must reach a path."
                active={mods.ghostDuck}
                onToggle={() => setMods(m => ({ ...m, ghostDuck: !m.ghostDuck }))}
              />

              {/* Vision Pulse */}
              <ModItem
                icon={Radar}
                title="VISION PULSE"
                description="The maze is dark, revealed only by periodic sonar pulses."
                pros="Adds a thrilling, high-stakes atmosphere."
                cons="Extremely difficult to navigate in the dark."
                active={mods.visionPulse}
                onToggle={() => setMods(m => ({ ...m, visionPulse: !m.visionPulse }))}
              />

              {/* Eagle Eye */}
              <ModItem
                icon={Expand}
                title="EAGLE EYE"
                description="Zoom out to see a much larger portion of the maze."
                pros="Easier to plan long routes."
                cons="Smaller view; harder to see details."
                active={mods.eagleEye}
                onToggle={() => setMods(m => ({ ...m, eagleEye: !m.eagleEye }))}
              />

              {/* Auto-Pilot */}
              <ModItem
                icon={Play}
                title="AUTO-PILOT"
                description="The duck automatically moves toward the exit."
                pros="Perfect for effortless navigation."
                cons="Removes the challenge entirely."
                active={mods.autoPilot}
                onToggle={() => setMods(m => ({ ...m, autoPilot: !m.autoPilot }))}
              />

              {/* Warp Portals */}
              <ModItem
                icon={Waypoints}
                title="WARP PORTALS"
                description="Randomly spawns two interconnected teleportation portals."
                pros="Can skip massive sections of the maze."
                cons="Placement is random and might be inconvenient."
                active={mods.warpPortals}
                onToggle={() => setMods(m => ({ ...m, warpPortals: !m.warpPortals }))}
              />

              {/* Trail Blazer */}
              <ModItem
                icon={Footprints}
                title="TRAIL BLAZER"
                description="Leave a permanent glowing trail on visited cells."
                pros="Excellent for tracking visited paths."
                cons="Visual clutter in dense levels."
                active={mods.trailBlazer}
                onToggle={() => setMods(m => ({ ...m, trailBlazer: !m.trailBlazer }))}
              />

              {/* Wall Breaker */}
              <ModItem
                icon={Flame}
                title="WALL BREAKER"
                description="Fire a beam to break walls in front of you."
                pros="Can create shortcuts through walls."
                cons="Might bypass intended puzzle logic."
                active={mods.wallBreaker}
                onToggle={() => setMods(m => ({ ...m, wallBreaker: !m.wallBreaker }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Controller Area */}
      <div className="h-[300px] shrink-0 bg-zinc-900/50 border-t border-white/10 p-6 flex items-center justify-center relative">
        <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full max-w-[240px]">
          <div />
          <ControlButton icon={ChevronUp} onStart={() => startMoving("up")} onStop={stopMoving} className="col-start-2" />
          <div />

          <ControlButton icon={ChevronLeft} onStart={() => startMoving("left")} onStop={stopMoving} className="row-start-2 col-start-1" />
          <div className="flex items-center justify-center">
             {mods.wallBreaker ? (
               <button
                 onClick={breakWall}
                 className="w-full aspect-square rounded-2xl bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center active:scale-95 active:bg-red-500/40 active:border-red-500 transition-all shadow-lg"
               >
                 <Flame size={24} className="text-red-500 animate-pulse" />
               </button>
             ) : (
               <div className="w-4 h-4 rounded-full bg-primary/20 animate-pulse" />
             )}
          </div>
          <ControlButton icon={ChevronRight} onStart={() => startMoving("right")} onStop={stopMoving} className="row-start-2 col-start-3" />

          <div />
          <ControlButton icon={ChevronDown} onStart={() => startMoving("down")} onStop={stopMoving} className="row-start-3 col-start-2" />
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

interface ModItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  pros: string;
  cons: string;
  active: boolean;
  onToggle: () => void;
}

const ModItem = ({ icon: Icon, title, description, pros, cons, active, onToggle }: ModItemProps) => (
  <div className="bg-black/40 border border-white/5 rounded-xl p-3 space-y-3">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg bg-zinc-800", active ? "text-primary" : "text-zinc-500")}>
          <Icon size={18} />
        </div>
        <div>
          <h4 className="text-[11px] font-bold">{title}</h4>
          <p className="text-[9px] text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          "w-8 h-4 rounded-full transition-colors relative shrink-0 mt-1",
          active ? "bg-primary" : "bg-zinc-700"
        )}
      >
        <div className={cn(
          "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all",
          active ? "left-[18px]" : "left-0.5"
        )} />
      </button>
    </div>
    <div className="grid grid-cols-2 gap-2 text-[8px]">
      <div className="text-green-500/80 uppercase">PROS:: {pros}</div>
      <div className="text-red-500/80 uppercase">CONS:: {cons}</div>
    </div>
  </div>
);

const ControlButton = ({ icon: Icon, onStart, onStop, className }: { icon: any, onStart: () => void, onStop: () => void, className?: string }) => (
  <button
    onMouseDown={(e) => { e.preventDefault(); onStart(); }}
    onTouchStart={(e) => { e.preventDefault(); onStart(); }}
    onMouseUp={(e) => { e.preventDefault(); onStop(); }}
    onMouseLeave={(e) => { e.preventDefault(); onStop(); }}
    onTouchEnd={(e) => { e.preventDefault(); onStop(); }}
    className={cn(
      "w-full aspect-square rounded-2xl bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center active:scale-95 active:bg-primary/20 active:border-primary transition-all shadow-lg",
      className
    )}
  >
    <Icon size={32} className="text-zinc-400" />
  </button>
);

export default MazeGame;
