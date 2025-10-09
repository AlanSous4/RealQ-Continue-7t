"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Microscope, Search, Award, FileCheck, ClipboardCheck, CheckCircle } from "lucide-react"

type Icon = {
  id: string
  x: number
  y: number
  icon: number
  scale: number
  rotation: number
  opacity: number
  duration: number
  isPermanent: boolean
  color: string
  velocityX: number
  velocityY: number
  createdAt?: number // Timestamp for when the icon was created
}

export function AnimatedBackground() {
  const [icons, setIcons] = useState<Icon[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isInitializedRef = useRef(false)

  // Create a random icon
  const createRandomIcon = (id: string, x?: number, y?: number, isPermanent = false): Icon => {
    const containerWidth = containerRef.current?.clientWidth || window.innerWidth
    const containerHeight = containerRef.current?.clientHeight || window.innerHeight

    // Determine if the icon should start from an edge
    const startFromEdge = Math.random() > 0.5 && !x && !y
    let iconX = x ?? Math.random() * containerWidth
    let iconY = y ?? Math.random() * containerHeight

    // If starting from edge, pick a random edge
    if (startFromEdge) {
      const edge = Math.floor(Math.random() * 4) // 0: top, 1: right, 2: bottom, 3: left

      switch (edge) {
        case 0: // top
          iconY = -50
          iconX = Math.random() * containerWidth
          break
        case 1: // right
          iconX = containerWidth + 50
          iconY = Math.random() * containerHeight
          break
        case 2: // bottom
          iconY = containerHeight + 50
          iconX = Math.random() * containerWidth
          break
        case 3: // left
          iconX = -50
          iconY = Math.random() * containerHeight
          break
      }
    }

    // Generate a random color between blue and purple
    const hue = Math.floor(Math.random() * 60) + 220 // 220-280 covers blue to purple
    const saturation = Math.floor(Math.random() * 30) + 70 // 70-100%
    const lightness = Math.floor(Math.random() * 20) + 50 // 50-70%
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`

    // Faster animations (reduced duration)
    const duration = Math.random() * 12 + 6 // Animation duration between 6 and 18 seconds

    // Create smooth velocity for permanent icons
    const velocityX = (Math.random() * 2 - 1) * 0.5 // Between -0.5 and 0.5
    const velocityY = (Math.random() * 2 - 1) * 0.5 // Between -0.5 and 0.5

    return {
      id,
      x: iconX,
      y: iconY,
      icon: Math.floor(Math.random() * 6), // 6 different icons
      scale: Math.random() * 0.5 + 0.5, // Scale between 0.5 and 1
      rotation: Math.random() * 360, // Random rotation
      opacity: Math.random() * 0.4 + 0.6, // Opacity between 0.6 and 1.0
      duration: duration,
      isPermanent,
      color,
      velocityX,
      velocityY,
      createdAt: Date.now(), // Add timestamp for when the icon was created
    }
  }

  // Generate initial icons
  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return
    isInitializedRef.current = true

    // Create fewer initial icons (reduced from 40 to 20)
    const initialIcons = Array.from({ length: 20 }, (_, i) =>
      createRandomIcon(`initial-${i}`, undefined, undefined, true),
    )
    setIcons(initialIcons)

    // Set up animation loop for smooth movement of permanent icons
    const animateIcons = () => {
      if (!containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const containerWidth = containerRect.width
      const containerHeight = containerRect.height
      const currentTime = Date.now()

      setIcons((prevIcons) => {
        return prevIcons
          .map((icon) => {
            // Only animate permanent icons with smooth movement
            if (icon.isPermanent) {
              let newX = icon.x + icon.velocityX
              let newY = icon.y + icon.velocityY

              // Bounce off edges with a small buffer
              if (newX < -20 || newX > containerWidth + 20) {
                icon.velocityX = -icon.velocityX
                newX = icon.x + icon.velocityX
              }
              if (newY < -20 || newY > containerHeight + 20) {
                icon.velocityY = -icon.velocityY
                newY = icon.y + icon.velocityY
              }

              return { ...icon, x: newX, y: newY }
            }

            // For non-permanent icons, just return as is
            return icon
          })
          .filter((icon) => {
            // Filter out non-permanent icons that have moved outside the container bounds
            // or have been around for more than 10 seconds
            if (!icon.isPermanent) {
              const isInBounds =
                icon.x > -100 && icon.x < containerWidth + 100 && icon.y > -100 && icon.y < containerHeight + 100

              // Remove icons that have been around for more than 10 seconds
              const isExpired = icon.createdAt && currentTime - icon.createdAt > 10000

              return isInBounds && !isExpired
            }
            return true
          })
      })

      animationFrameRef.current = requestAnimationFrame(animateIcons)
    }

    animationFrameRef.current = requestAnimationFrame(animateIcons)

    // Add new permanent icons periodically to maintain visual interest
    const interval = setInterval(() => {
      if (icons.filter((icon) => icon.isPermanent).length < 25) {
        // Limit permanent icons
        const newIcon = createRandomIcon(`auto-${Date.now()}`, undefined, undefined, true)
        setIcons((prev) => [...prev, newIcon])
      }
    }, 3000)

    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      clearInterval(interval)
    }
  }, [])

  // Handle click to add more icons
  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Add 6-10 new icons near the click position (increased count)
    const newIconCount = Math.floor(Math.random() * 5) + 6
    const newIcons = Array.from({ length: newIconCount }, (_, i) => {
      // Wider spread of icons (increased from 60 to 100)
      const offsetX = Math.random() * 200 - 100
      const offsetY = Math.random() * 200 - 100
      // These icons are not permanent and will disappear when they leave the screen
      return createRandomIcon(`click-${Date.now()}-${i}`, x + offsetX, y + offsetY, false)
    })

    setIcons((prev) => [...prev, ...newIcons])

    // Remove oldest click-generated icons if we have too many
    setIcons((prev) => {
      const permanentIcons = prev.filter((icon) => icon.isPermanent)
      const clickIcons = prev.filter((icon) => !icon.isPermanent)

      // Keep all permanent icons but limit click icons to 60
      if (clickIcons.length > 60) {
        return [...permanentIcons, ...clickIcons.slice(clickIcons.length - 60)]
      }
      return prev
    })
  }

  // Render the appropriate icon component
  const renderIcon = (iconType: number, color: string) => {
    const IconComponent = (() => {
      switch (iconType) {
        case 0:
          return Microscope
        case 1:
          return Search
        case 2:
          return Award
        case 3:
          return FileCheck
        case 4:
          return ClipboardCheck
        case 5:
          return CheckCircle
        default:
          return Microscope
      }
    })()

    return <IconComponent style={{ color }} />
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden z-[-1]" // Set z-index to -1 to put it behind everything
      onClick={handleClick}
      style={{ pointerEvents: "all" }}
    >
      <AnimatePresence>
        {icons.map((icon) => (
          <motion.div
            key={icon.id}
            initial={{
              x: icon.x,
              y: icon.y,
              opacity: 0,
              scale: 0,
              rotate: 0,
            }}
            animate={{
              x: icon.x,
              y: icon.y,
              opacity: icon.opacity,
              scale: icon.scale,
              rotate: icon.rotation,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: icon.isPermanent ? 0.1 : icon.duration, // Quick updates for permanent icons
              ease: icon.isPermanent ? "linear" : "easeInOut",
            }}
            className="absolute w-8 h-8 md:w-12 md:h-12"
            style={{
              pointerEvents: "none",
              willChange: "transform, opacity",
            }}
          >
            {renderIcon(icon.icon, icon.color)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
