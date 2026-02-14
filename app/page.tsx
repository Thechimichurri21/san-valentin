"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="font-handwriting text-3xl sm:text-4xl md:text-5xl text-rose-800"
              >
                ¡Sabía que dirías que sí! 😍
                ¡Feliz San Valentín, mi vida!
              </motion.h1>

              <motion.section
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="pt-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {recuerdos.map((nombreArchivo, i) => (
                    <motion.div
                      key={nombreArchivo}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.8 + i * 0.1,
                        duration: 0.5,
                      }}
                      className="overflow-hidden rounded-2xl shadow-lg aspect-[2/3] bg-rose-100"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={`/recuerdos/${nombreArchivo}`}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
