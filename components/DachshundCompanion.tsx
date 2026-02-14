"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LICK_DURATION_MS = 3000;

type DachshundCompanionProps = {
  isSuccess: boolean;
};

export default function DachshundCompanion({ isSuccess }: DachshundCompanionProps) {
  const [showLickAnimation, setShowLickAnimation] = useState(false);

  useEffect(() => {
    if (!isSuccess) return;

    setShowLickAnimation(true);

    const timeoutId = window.setTimeout(() => {
      setShowLickAnimation(false);
    }, LICK_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isSuccess]);

  // ESCENARIO A: Estado inicial — perro caminando de izquierda a derecha (loop)
  if (!isSuccess) {
    return (
      <motion.div
        className="fixed bottom-0 left-0 z-40 pointer-events-none"
        initial={false}
        animate={{
          x: ["-100vw", "100vw"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <img
          src="/gifs/salchichas-beso.gif"
          alt="Perro salchicha caminando"
          className="h-24 w-auto sm:h-28 md:h-32 object-contain"
          draggable={false}
        />
      </motion.div>
    );
  }

  // ESCENARIO B: Transición del lametazo — zoom dramático desde abajo
  if (showLickAnimation) {
    return (
      <AnimatePresence>
        <motion.div
          key="lick"
          className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none"
          initial={false}
        >
          <motion.div
            className="flex items-end justify-center w-full"
            initial={{ opacity: 0, y: "100%", scale: 0.5 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 2.5,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <img
              src="/gifs/perro-lamiendo-pantalla.gif"
              alt="Perro lamiendo la pantalla"
              className="max-h-[85vh] w-auto object-contain"
              draggable={false}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ESCENARIO C: Estado final — esquina con bocadillo "¡Te amo! 🐾" y perro tranquilo
  return (
    <AnimatePresence>
      <motion.div
        key="final"
        className="fixed bottom-4 right-4 z-40 flex flex-col items-end pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="mb-1 px-4 py-2 bg-white rounded-2xl rounded-br-md shadow-lg border border-rose-100 text-rose-800 font-handwriting text-lg sm:text-xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          ¡Te amo! 🐾
        </motion.div>
        <img
          src="/gifs/perro-final-teamo.gif"
          alt="Perro salchicha"
          className="h-20 w-auto sm:h-24 md:h-28 object-contain"
          draggable={false}
        />
      </motion.div>
    </AnimatePresence>
  );
}
