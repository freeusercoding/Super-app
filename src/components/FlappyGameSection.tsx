import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Volume2, VolumeX, RotateCcw, Copy, Check, ArrowLeft, Fuel, Sparkles, AlertCircle } from 'lucide-react';
import contentData from '../data/contentData.json';

// Declare global callbacks on window
declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

// Game Constants from Document Specification
const WIN_SCORE = contentData.gameConfig.winScore || 20;
const GRAVITY = contentData.gameConfig.gravity || 0.28;
const JUMP_FORCE = contentData.gameConfig.jumpForce || -6.2;
const PIPE_SPEED = contentData.gameConfig.pipeSpeed || 2.2;
const PIPE_GAP = contentData.gameConfig.pipeGap || 170;
const PIPE_INTERVAL = 110; // frames between pipes
const VOUCHER_TEXT = contentData.gameConfig.voucherText || "Voucher 2 lít xăng";
const BRAND_NAME = contentData.gameConfig.brandName || "VietinBank";
const GAME_TITLE = contentData.gameConfig.title || "Chờ vui – Chơi hay – Nhận quà liền tay";

interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
}

export const FlappyGameSection: React.FC<{ onBackToHome?: () => void }> = ({ onBackToHome }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Game States
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'WIN' | 'LOSE'>('START');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('flappy_high_score') || '0', 10);
  });
  const [latestVoucher, setLatestVoucher] = useState<string | null>(() => {
    return localStorage.getItem('flappy_latest_voucher') || null;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  // Audio Context (Synthesized sounds, no external files)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthSound = useCallback((type: 'jump' | 'score' | 'win' | 'lose') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'jump') {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'score') {
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'win') {
        // Arpeggio
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'lose') {
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // Audio fallback silent
    }
  }, [soundEnabled]);

  // Game Engine physics refs
  const birdRef = useRef({
    x: 70,
    y: 180,
    velocity: 0,
    radius: 18,
    angle: 0
  });

  const pipesRef = useRef<Pipe[]>([]);
  const frameCountRef = useRef<number>(0);
  const currentScoreRef = useRef<number>(0);

  // Generate Voucher code: VB-XXXXXX (6 random digits)
  const generateVoucherCode = (): string => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `VB-${randomDigits}`;
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Win Game
  const winGame = useCallback(() => {
    setGameState('WIN');
    const newVoucher = generateVoucherCode();
    setLatestVoucher(newVoucher);
    localStorage.setItem('flappy_latest_voucher', newVoucher);
    localStorage.setItem('flappy_high_score', '20');
    setHighScore(20);
    playSynthSound('win');

    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Webapp callback
    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: WIN_SCORE,
        voucherCode: newVoucher,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString()
      });
    }
  }, [playSynthSound]);

  // End Game (Lose)
  const endGame = useCallback((finalScore: number) => {
    setGameState('LOSE');
    setShake(true);
    setTimeout(() => setShake(false), 400);
    playSynthSound('lose');

    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('flappy_high_score', finalScore.toString());
    }

    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString()
      });
    }
  }, [highScore, playSynthSound]);

  // Reset Game
  const resetGame = useCallback(() => {
    birdRef.current = {
      x: 70,
      y: 180,
      velocity: 0,
      radius: 18,
      angle: 0
    };
    pipesRef.current = [];
    frameCountRef.current = 0;
    currentScoreRef.current = 0;
    setScore(0);
  }, []);

  // Start Game
  const startGame = useCallback(() => {
    resetGame();
    setGameState('PLAYING');
    playSynthSound('jump');
  }, [resetGame, playSynthSound]);

  // Flap / Jump action
  const flap = useCallback(() => {
    if (gameState === 'START') {
      startGame();
      return;
    }
    if (gameState === 'PLAYING') {
      birdRef.current.velocity = JUMP_FORCE;
      playSynthSound('jump');
    }
  }, [gameState, startGame, playSynthSound]);

  // Keyboard and touch handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        flap();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flap]);

  // Main Canvas Render & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isActive = true;

    const render = () => {
      if (!isActive) return;

      const width = canvas.width;
      const height = canvas.height;

      // Draw Sky & Gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, '#bae6fd'); // sky light
      skyGradient.addColorStop(0.7, '#e0f2fe');
      skyGradient.addColorStop(1, '#f0fdf4');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw distant bank city skyline
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(20, height - 120, 45, 90);
      ctx.fillRect(90, height - 150, 60, 120);
      ctx.fillRect(180, height - 130, 50, 100);
      ctx.fillRect(260, height - 165, 55, 135);
      ctx.fillRect(340, height - 110, 40, 80);

      // Draw ground
      const groundHeight = 36;
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, height - groundHeight, width, 4);
      ctx.fillStyle = '#005596';
      ctx.fillRect(0, height - groundHeight + 4, width, groundHeight - 4);

      // Grass stripe on ground
      ctx.fillStyle = '#38bdf8';
      for (let i = 0; i < width; i += 24) {
        ctx.fillRect(i, height - groundHeight + 4, 12, 4);
      }

      if (gameState === 'PLAYING') {
        frameCountRef.current++;

        // Bird physics
        birdRef.current.velocity += GRAVITY;
        birdRef.current.y += birdRef.current.velocity;
        birdRef.current.angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, birdRef.current.velocity * 0.08));

        // Spawn Pipes
        if (frameCountRef.current % PIPE_INTERVAL === 0) {
          const minPipe = 50;
          const maxPipe = height - groundHeight - PIPE_GAP - minPipe;
          const topHeight = Math.floor(Math.random() * (maxPipe - minPipe + 1)) + minPipe;
          pipesRef.current.push({
            x: width,
            topHeight,
            passed: false
          });
        }

        // Update Pipes
        const pipeWidth = 54;
        for (let i = pipesRef.current.length - 1; i >= 0; i--) {
          const pipe = pipesRef.current[i];
          pipe.x -= PIPE_SPEED;

          // Check passing score
          if (!pipe.passed && pipe.x + pipeWidth < birdRef.current.x) {
            pipe.passed = true;
            currentScoreRef.current += 1;
            const newScore = currentScoreRef.current;
            setScore(newScore);
            playSynthSound('score');

            if (newScore >= WIN_SCORE) {
              winGame();
              return;
            }
          }

          // Check Collision
          const bird = birdRef.current;
          const birdBox = {
            left: bird.x - bird.radius + 3,
            right: bird.x + bird.radius - 3,
            top: bird.y - bird.radius + 3,
            bottom: bird.y + bird.radius - 3
          };

          // Pipe Top Collision
          if (
            birdBox.right > pipe.x &&
            birdBox.left < pipe.x + pipeWidth &&
            birdBox.top < pipe.topHeight
          ) {
            endGame(currentScoreRef.current);
            return;
          }

          // Pipe Bottom Collision
          const bottomPipeTop = pipe.topHeight + PIPE_GAP;
          if (
            birdBox.right > pipe.x &&
            birdBox.left < pipe.x + pipeWidth &&
            birdBox.bottom > bottomPipeTop
          ) {
            endGame(currentScoreRef.current);
            return;
          }

          // Remove off-screen pipes
          if (pipe.x + pipeWidth < -10) {
            pipesRef.current.splice(i, 1);
          }
        }

        // Check Ground / Ceiling collision
        if (birdRef.current.y + birdRef.current.radius >= height - groundHeight) {
          endGame(currentScoreRef.current);
          return;
        }
        if (birdRef.current.y - birdRef.current.radius <= 0) {
          birdRef.current.y = birdRef.current.radius;
          birdRef.current.velocity = 0;
        }
      }

      // Draw Pipes
      const pipeWidth = 54;
      pipesRef.current.forEach((pipe) => {
        // Top Pipe body
        const gradTop = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
        gradTop.addColorStop(0, '#005596');
        gradTop.addColorStop(0.5, '#0284c7');
        gradTop.addColorStop(1, '#00386b');
        ctx.fillStyle = gradTop;
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);

        // Top Pipe lip
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(pipe.x - 3, pipe.topHeight - 16, pipeWidth + 6, 16);
        ctx.strokeStyle = '#082f49';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(pipe.x - 3, pipe.topHeight - 16, pipeWidth + 6, 16);

        // Bottom Pipe body
        const bottomTop = pipe.topHeight + PIPE_GAP;
        const bottomHeight = height - groundHeight - bottomTop;
        const gradBottom = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
        gradBottom.addColorStop(0, '#005596');
        gradBottom.addColorStop(0.5, '#0284c7');
        gradBottom.addColorStop(1, '#00386b');
        ctx.fillStyle = gradBottom;
        ctx.fillRect(pipe.x, bottomTop, pipeWidth, bottomHeight);

        // Bottom Pipe lip
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(pipe.x - 3, bottomTop, pipeWidth + 6, 16);
        ctx.strokeRect(pipe.x - 3, bottomTop, pipeWidth + 6, 16);
      });

      // Draw Bird / Flying VietinBank Card Mascot
      const bird = birdRef.current;
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(bird.angle);

      // Card / Mascot Body (VietinBank Blue Rounded Card with Red Star accent)
      ctx.fillStyle = '#005596';
      ctx.beginPath();
      ctx.roundRect(-22, -14, 44, 28, 6);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Golden Chip
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-16, -6, 8, 12);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-16, -6, 8, 12);

      // Wing (Flapping)
      const wingY = Math.sin(frameCountRef.current * 0.25) * 4;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(-2, wingY, 9, 5, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      // Mascot Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(12, -4, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(14, -4, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Brand Red Accent Star / Dot
      ctx.fillStyle = '#ed1c24';
      ctx.beginPath();
      ctx.arc(0, 5, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      isActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, endGame, winGame, playSynthSound]);

  // Handle canvas sizing responsive
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const containerWidth = Math.min(containerRef.current.clientWidth, 480);
      canvasRef.current.width = containerWidth;
      canvasRef.current.height = 480;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Motivation message based on score
  const getCheerMessage = () => {
    if (score < 5) return contentData.gameConfig.cheerMessages.under5;
    if (score < 10) return contentData.gameConfig.cheerMessages['5to9'];
    if (score < 15) return contentData.gameConfig.cheerMessages['10to14'];
    if (score < 20) return contentData.gameConfig.cheerMessages['15to19'];
    return contentData.gameConfig.cheerMessages.win;
  };

  return (
    <div id="flappy-voucher-game" className="max-w-2xl mx-auto px-4 py-4 sm:py-8">
      {/* Header bar of Game */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#005596] bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs font-medium border transition-all ${
              soundEnabled
                ? 'bg-blue-50 text-[#005596] border-blue-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Kỷ lục</span>
            <span className="text-sm font-black text-[#005596]">{highScore}/20</span>
          </div>
        </div>
      </div>

      {/* Main Game Frame Container */}
      <div 
        ref={containerRef}
        className={`relative w-full max-w-[480px] mx-auto bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-200 game-canvas-container select-none ${
          shake ? 'animate-bounce' : ''
        }`}
        style={{ height: '480px', touchAction: 'none' }}
        onClick={gameState === 'PLAYING' ? flap : undefined}
        onTouchStart={(e) => {
          if (gameState === 'PLAYING') {
            e.preventDefault();
            flap();
          }
        }}
      >
        {/* The HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          className="block w-full h-full"
        />

        {/* HUD Overlay when Playing */}
        {gameState === 'PLAYING' && (
          <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none flex flex-col items-center">
            {/* Score & Progress */}
            <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md border border-sky-100 flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">Thử thách:</span>
              <span className="text-lg font-black text-[#005596]">Điểm: {score}/{WIN_SCORE}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-48 h-2 bg-slate-200/80 rounded-full mt-2 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 via-[#005596] to-emerald-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
              />
            </div>

            {/* Dynamic Cheer Message */}
            <span className="mt-2 text-xs font-extrabold text-amber-600 bg-white/90 px-3 py-0.5 rounded-full shadow-sm animate-pulse">
              {getCheerMessage()}
            </span>
          </div>
        )}

        {/* Screen 1: Start Screen */}
        {gameState === 'START' && (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/80 via-blue-950/85 to-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#005596] to-[#0072ce] flex items-center justify-center shadow-lg border border-sky-300/40 mb-3 animate-pulse">
              <Fuel className="w-8 h-8 text-amber-300" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
              {GAME_TITLE}
            </h2>

            <div className="mt-3 bg-amber-400/20 border border-amber-300/40 rounded-xl px-4 py-2 text-amber-200 text-xs sm:text-sm font-semibold">
              🎁 {contentData.gameConfig.description}
            </div>

            <p className="mt-3 text-xs text-sky-200/80 max-w-xs">
              {contentData.gameConfig.instructions}
            </p>

            <button
              onClick={startGame}
              className="mt-6 w-full max-w-xs py-3.5 px-6 rounded-xl font-black text-base text-white bg-gradient-to-r from-[#ed1c24] to-[#f43f5e] hover:from-[#c81017] hover:to-[#e11d48] shadow-lg shadow-red-500/30 transition-transform active:scale-95"
            >
              Bắt đầu chơi
            </button>

            {latestVoucher && (
              <div className="mt-4 pt-3 border-t border-white/10 text-xs text-sky-200 flex items-center gap-2">
                <span>Mã voucher gần nhất:</span>
                <span className="font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded">
                  {latestVoucher}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Screen 2: Lose Screen */}
        {gameState === 'LOSE' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-3">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white">
              Rất tiếc, bạn đã vượt qua {score}/{WIN_SCORE} thử thách
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xs">
              {contentData.gameConfig.loseMessage}
            </p>

            <div className="mt-6 flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={startGame}
                className="w-full py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#005596] to-[#0072ce] hover:brightness-110 shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>
              <button
                onClick={onBackToHome}
                className="w-full py-2.5 px-5 rounded-xl font-semibold text-xs text-slate-300 bg-white/10 hover:bg-white/20 transition-all"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        )}

        {/* Screen 3: Win Screen */}
        {gameState === 'WIN' && (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-950/90 via-blue-950/95 to-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-amber-900 flex items-center justify-center mb-2 shadow-lg shadow-amber-400/30 animate-bounce">
              <Trophy className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-black text-amber-300 tracking-tight">
              Chúc mừng!
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-200 max-w-xs">
              Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận {VOUCHER_TEXT}.
            </p>

            {/* Voucher Code Box */}
            <div className="mt-4 w-full max-w-xs bg-white text-slate-900 rounded-xl p-4 shadow-xl border-2 border-amber-400 relative">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#005596] block mb-1">
                Mã Nhận Quà Tặng VietinBank
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-[#ed1c24] py-1 bg-rose-50 rounded-lg border border-rose-200">
                {latestVoucher || 'VB-868868'}
              </div>

              <div className="mt-2 text-[11px] text-slate-500 font-medium leading-relaxed">
                {contentData.gameConfig.voucherInstruction}
              </div>

              <button
                onClick={() => latestVoucher && copyVoucherCode(latestVoucher)}
                className="mt-3 w-full py-2 px-3 rounded-lg text-xs font-bold text-[#005596] bg-sky-50 hover:bg-sky-100 border border-sky-200 flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép mã!' : 'Sao chép mã'}</span>
              </button>
            </div>

            <div className="mt-4 flex gap-3 w-full max-w-xs">
              <button
                onClick={startGame}
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all"
              >
                Chơi lại
              </button>
              <button
                onClick={onBackToHome}
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-[#005596] hover:bg-[#004077] transition-all"
              >
                Về menu chính
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Helpful Hint Below Canvas */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500">
          💡 Chơi trực tiếp trên màn hình cảm ứng hoặc click chuột / nhấn phím cách (Space).
        </p>
      </div>
    </div>
  );
};
