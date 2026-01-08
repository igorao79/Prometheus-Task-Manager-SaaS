"use client"

import { motion } from "framer-motion"

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Большой блюренный круг */}
        <motion.circle
          cx="200"
          cy="150"
          r="120"
          fill="rgba(59, 130, 246, 0.15)"
          filter="blur(20px)"
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Средний круг с плавной анимацией */}
        <motion.circle
          cx="800"
          cy="300"
          r="80"
          fill="rgba(147, 51, 234, 0.12)"
          filter="blur(15px)"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -50, 30, 0],
            y: [0, 40, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Маленький круг */}
        <motion.circle
          cx="600"
          cy="500"
          r="60"
          fill="rgba(16, 185, 129, 0.1)"
          filter="blur(25px)"
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -50, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Прямоугольник */}
        <motion.rect
          x="100"
          y="400"
          width="150"
          height="100"
          rx="20"
          fill="rgba(245, 101, 101, 0.08)"
          filter="blur(35px)"
          initial={{ rotate: 0 }}
          animate={{
            rotate: [0, 5, 0],
            x: [0, 20, -15, 0],
            y: [0, -30, 25, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Еще один круг с медленным движением */}
        <motion.circle
          cx="1000"
          cy="200"
          r="90"
          fill="rgba(251, 191, 36, 0.07)"
          filter="blur(45px)"
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 35, -45, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Маленький прямоугольник */}
        <motion.rect
          x="300"
          y="600"
          width="80"
          height="60"
          rx="15"
          fill="rgba(139, 69, 19, 0.06)"
          filter="blur(20px)"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -10, 0],
            x: [0, 25, -20, 0],
            y: [0, -35, 30, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Большой овал */}
        <motion.ellipse
          cx="500"
          cy="100"
          rx="180"
          ry="90"
          fill="rgba(6, 182, 212, 0.06)"
          filter="blur(50px)"
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [0, 50, -40, 0],
            y: [0, -60, 45, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Маленький круг с быстрой анимацией */}
        <motion.circle
          cx="900"
          cy="600"
          r="40"
          fill="rgba(236, 72, 153, 0.1)"
          filter="blur(15px)"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 30, 0],
            y: [0, 25, -35, 0],
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
