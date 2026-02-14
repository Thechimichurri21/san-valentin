"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DachshundCompanion from "@/components/DachshundCompanion";

// Nombres de archivos en public/recuerdos/ (extensión .jpeg)
const recuerdos = [
  "foto1.jpeg",
  "foto2.jpeg",
  "foto3.jpeg",
  "foto4.jpeg",
  "foto5.jpeg",
  "foto6.jpeg",
  "foto7.jpeg",
];

const mensajes = [
  "Te amo Valeria",
  "Valeria la mejor novia del mundo",
  "Eres mi todo",
  "Siempre juntos",
  "Gracias por existir",
  "Te amo mi flaca",
  "Mi niña hermosa",
];

const NUM_HEARTS = 18;

/** Sistema de slots: cuadrícula para evitar superposiciones */
const GRID_COLS = 3;
const GRID_ROWS = 5;
const JITTER_PERCENT = 5;

type Slot = { col: number; row: number };

function getAvailableSlots(): Slot[] {
  const centerCol = Math.floor(GRID_COLS / 2);
  const centerRow = Math.floor(GRID_ROWS / 2);
  const slots: Slot[] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const inCenter = col === centerCol && row === centerRow;
      if (!inCenter) slots.push({ col, row });
    }
  }
  return slots;
}

function getSlotPosition(slot: Slot): { left: number; top: number } {
  const leftBase = ((slot.col + 0.5) / GRID_COLS) * 100;
  const topBase = ((slot.row + 0.5) / GRID_ROWS) * 100;
  const jitter = () => (Math.random() - 0.5) * 2 * JITTER_PERCENT;
  return {
    left: Math.max(10, Math.min(90, leftBase + jitter())),
    top: Math.max(10, Math.min(90, topBase + jitter())),
  };
}

function shuffle<T>(array: T[]): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function useConfetti() {
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return useCallback(() => {
    if (typeof window === "undefined") return;
    import("canvas-confetti")
      .then((confettiModule) => {
        const confetti = confettiModule.default;
        if (!mounted.current || !confetti) return;
        const count = 200;
        const defaults = { origin: { y: 0.6 }, zIndex: 9999 };
        function fire(particleRatio: number, opts: Record<string, unknown>) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        }
        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      })
      .catch(() => {
        console.warn(
          "canvas-confetti no está disponible. Ejecuta: npm install canvas-confetti"
        );
      });
  }, []);
}

function getRandomPosition(): { x: number; y: number } {
  if (typeof window === "undefined") return { x: 200, y: 200 };
  const padding = 100;
  const x = padding + Math.random() * (window.innerWidth - padding * 2);
  const y = padding + Math.random() * (window.innerHeight - padding * 2);
  return { x, y };
}

export default function SanValentinPage() {
  const [accepted, setAccepted] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 200, y: 200 });
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const fireConfetti = useConfetti();

  useEffect(() => {
    setNoButtonPos(getRandomPosition());
  }, []);

  const handleYes = useCallback(() => {
    fireConfetti();
    setAccepted(true);
  }, [fireConfetti]);

  const handleNoHoverOrClick = useCallback(() => {
    setNoButtonPos(getRandomPosition());
  }, []);

  const handleNoTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      setNoButtonPos(getRandomPosition());
    },
    []
  );

  const heartConfigs = useMemo(() => {
    if (!accepted) return [];
    return Array.from({ length: NUM_HEARTS }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      opacity: 0.2 + Math.random() * 0.3,
      duration: 18 + Math.random() * 12,
      delay: Math.random() * 8,
      size: 16 + Math.random() * 24,
    }));
  }, [accepted]);

  const floatingItems = useMemo(() => {
    if (!accepted) return [];
    const imageItems = recuerdos.map((nombreArchivo) => ({
      type: "image" as const,
      id: nombreArchivo,
      src: `/recuerdos/${nombreArchivo}`,
    }));
    const textItems = mensajes.map((text, i) => ({
      type: "text" as const,
      id: `msg-${i}`,
      text,
    }));
    const combined = shuffle([...imageItems, ...textItems]);
    const slots = shuffle(getAvailableSlots());
    return combined.slice(0, slots.length).map((item, i) => {
      const { left, top } = getSlotPosition(slots[i]);
      return {
        ...item,
        left,
        top,
        rotate: -6 + Math.random() * 12,
        duration: 3 + Math.random() * 3,
      };
    });
  }, [accepted]);

  return (
    <main className="min-h-screen overflow-x-hidden py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto text-center">
        <AnimatePresence mode="wait">
          {!accepted ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <motion.img
                src="/gifs/perros-flores.gif"
                alt="Perritos con flores"
                className="w-full max-w-xs h-48 mx-auto block rounded-xl shadow-md mb-4 object-cover"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              />
              <h1 className="font-handwriting text-3xl sm:text-4xl md:text-5xl text-rose-800 drop-shadow-sm">
                ¿Quieres ser mi San Valentín? ❤️
              </h1>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative min-h-[120px] sm:min-h-[80px]">
                <motion.button
                  onClick={handleYes}
                  className="relative z-10 px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-rose-500 text-white font-semibold text-xl sm:text-2xl shadow-lg hover:bg-rose-600 active:scale-95 transition-colors"
                  animate={{
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ¡SÍ!
                </motion.button>

                {!accepted && (
                  <motion.button
                    ref={noButtonRef}
                    onMouseEnter={handleNoHoverOrClick}
                    onClick={handleNoHoverOrClick}
                    onTouchStart={handleNoTouchStart}
                    className="fixed z-20 px-6 py-3 rounded-xl bg-slate-300 text-slate-600 font-medium text-lg shadow cursor-default select-none"
                    style={{
                      left: noButtonPos.x,
                      top: noButtonPos.y,
                      transform: "translate(-50%, -50%)",
                      transition: "left 0.25s ease-out, top 0.25s ease-out",
                    }}
                    initial={false}
                  >
                    No
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              {/* Fondo de corazones flotantes */}
              <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {heartConfigs.map((heart) => (
                  <motion.div
                    key={heart.id}
                    className="absolute text-rose-400"
                    style={{
                      left: `${heart.left}%`,
                      width: heart.size,
                      height: heart.size,
                      opacity: heart.opacity,
                    }}
                    initial={{ top: "100vh" }}
                    animate={{ top: "-10%" }}
                    transition={{
                      duration: heart.duration,
                      repeat: Infinity,
                      ease: "linear",
                      delay: heart.delay,
                    }}
                  >
                    <HeartIcon className="w-full h-full" />
                  </motion.div>
                ))}
              </div>

              {/* Galería flotante: fotos + mensajes (sistema de slots, posiciones en %) */}
              <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
                {floatingItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${item.left}%`,
                      top: `${item.top}%`,
                      rotate: item.rotate,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className={item.type === "text" ? "relative z-20" : "relative z-10"}
                      style={{ rotate: item.rotate }}
                      animate={{
                        y: [0, -15, 0],
                        rotate: [item.rotate - 5, item.rotate + 5, item.rotate - 5],
                      }}
                      transition={{
                        duration: item.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {item.type === "image" ? (
                        <div className="w-40 sm:w-48 md:w-64 lg:w-72 aspect-[3/4] overflow-hidden rounded-2xl shadow-lg bg-rose-100/80">
                          <img
                            src={item.src}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <span className="inline-block px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-sm font-handwriting text-rose-600 text-xl md:text-3xl lg:text-4xl whitespace-nowrap drop-shadow-lg shadow-rose-200/50">
                          {item.text}
                        </span>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Contenido principal (título) por encima de la galería */}
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-20 text-center"
              >
                <motion.h1
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="font-handwriting text-3xl sm:text-4xl md:text-5xl text-rose-800 drop-shadow-sm"
                >
                  ¡Sabía que dirías que sí! 😍
                  <br />
                  ¡Feliz San Valentín, mi vida!
                </motion.h1>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      <DachshundCompanion isSuccess={accepted} />
    </main>
  );
}
