"use client"

import { motion } from "framer-motion"

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Большой блюренный круг */}
        <motion.circle
          cx="20"
          cy="15"
          r="12"
          fill="rgba(59, 130, 246, 0.15)"
          filter="blur(2px)"
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [0, 3, -2, 0],
            y: [0, -4, 2, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Средний круг с плавной анимацией */}
        <motion.circle
          cx="80"
          cy="30"
          r="8"
          fill="rgba(147, 51, 234, 0.12)"
          filter="blur(1.5px)"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -5, 3, 0],
            y: [0, 4, -3, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Маленький круг */}
        <motion.circle
          cx="60"
          cy="50"
          r="6"
          fill="rgba(16, 185, 129, 0.1)"
          filter="blur(2.5px)"
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [0, 4, -3, 0],
            y: [0, -5, 4, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Прямоугольник */}
        <motion.rect
          x="10"
          y="40"
          width="15"
          height="10"
          rx="2"
          fill="rgba(245, 101, 101, 0.08)"
          filter="blur(3.5px)"
          initial={{ rotate: 0 }}
          animate={{
            rotate: [0, 5, 0],
            x: [0, 2, -1.5, 0],
            y: [0, -3, 2.5, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Еще один круг с медленным движением */}
        <motion.circle
          cx="90"
          cy="20"
          r="9"
          fill="rgba(251, 191, 36, 0.07)"
          filter="blur(4.5px)"
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [0, -6, 4, 0],
            y: [0, 3.5, -4.5, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Маленький прямоугольник */}
        <motion.rect
          x="30"
          y="60"
          width="8"
          height="6"
          rx="1.5"
          fill="rgba(139, 69, 19, 0.06)"
          filter="blur(2px)"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -10, 0],
            x: [0, 2.5, -2, 0],
            y: [0, -3.5, 3, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Большой овал */}
        <motion.ellipse
          cx="50"
          cy="10"
          rx="18"
          ry="9"
          fill="rgba(6, 182, 212, 0.06)"
          filter="blur(5px)"
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [0, 5, -4, 0],
            y: [0, -6, 4.5, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Маленький круг с быстрой анимацией */}
        <motion.circle
          cx="85"
          cy="70"
          r="4"
          fill="rgba(236, 72, 153, 0.1)"
          filter="blur(1.5px)"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -2, 3, 0],
            y: [0, 2.5, -3.5, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  )
}
