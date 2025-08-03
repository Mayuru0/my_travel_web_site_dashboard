"use client"

import { useState, useEffect } from "react"

interface PandaProps {
  mousePosition: { x: number; y: number }
}

export const CutePanda = ({ mousePosition }: PandaProps) => {
  const [pandaPosition, setPandaPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const pandaElement = document.getElementById("cute-panda")
    if (pandaElement) {
      const rect = pandaElement.getBoundingClientRect()
      const pandaCenterX = rect.left + rect.width / 2
      const pandaCenterY = rect.top + rect.height / 2

      setPandaPosition({ x: pandaCenterX, y: pandaCenterY })
    }
  }, [mousePosition])

  const pandaRotation =
    pandaPosition.x !== 0
      ? (Math.atan2(mousePosition.y - pandaPosition.y, mousePosition.x - pandaPosition.x) * 180) / Math.PI
      : 0

  // Calculate distance for bounce effect
  const distance = Math.sqrt(
    Math.pow(mousePosition.x - pandaPosition.x, 2) + Math.pow(mousePosition.y - pandaPosition.y, 2),
  )
  const bounceScale = Math.max(0.9, Math.min(1.2, 1 + (300 - Math.min(distance, 300)) / 1000))

  return (
    <div
      id="cute-panda"
      className="fixed right-8 top-1/2 transform -translate-y-1/2 z-20 transition-all duration-300 ease-out cursor-pointer"
      style={{
        transform: `translateY(-50%) rotate(${pandaRotation * 0.05}deg) scale(${bounceScale})`,
      }}
    >
      <div className="relative">
        {/* Panda Body */}
        <div className="w-24 h-28 bg-gradient-to-b from-gray-100 to-white rounded-3xl relative shadow-xl border-2 border-gray-200">
          {/* Panda Head */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-b from-gray-100 to-white rounded-full border-2 border-gray-200 shadow-lg">
            {/* Ears */}
            <div className="absolute -top-3 left-2 w-6 h-6 bg-black rounded-full shadow-md transform rotate-12"></div>
            <div className="absolute -top-3 right-2 w-6 h-6 bg-black rounded-full shadow-md transform -rotate-12"></div>

            {/* Inner ears */}
            <div className="absolute -top-1 left-3 w-3 h-3 bg-pink-300 rounded-full"></div>
            <div className="absolute -top-1 right-3 w-3 h-3 bg-pink-300 rounded-full"></div>

            {/* Eyes */}
            <div className="flex justify-center items-center h-full gap-3 mt-2">
              <div className="relative">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <div
                    className="w-4 h-4 bg-white rounded-full transition-transform duration-200 flex items-center justify-center"
                    style={{
                      transform: `translateX(${Math.cos((pandaRotation * Math.PI) / 180) * 3}px) translateY(${Math.sin((pandaRotation * Math.PI) / 180) * 3}px)`,
                    }}
                  >
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <div
                    className="w-4 h-4 bg-white rounded-full transition-transform duration-200 flex items-center justify-center"
                    style={{
                      transform: `translateX(${Math.cos((pandaRotation * Math.PI) / 180) * 3}px) translateY(${Math.sin((pandaRotation * Math.PI) / 180) * 3}px)`,
                    }}
                  >
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nose */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rounded-full"></div>

            {/* Mouth */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-2 border-b-2 border-black rounded-b-full"></div>
            </div>
          </div>

          {/* Belly */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-b from-gray-50 to-gray-100 rounded-full border border-gray-200">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-200 rounded-full"></div>
          </div>

          {/* Panda Arms */}
          <div
            className="absolute -left-6 top-8 w-5 h-12 bg-gradient-to-b from-gray-100 to-white rounded-full border border-gray-200 shadow-md transition-transform duration-300"
            style={{
              transform: `rotate(${pandaRotation * 0.1 + 15}deg)`,
            }}
          >
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black rounded-full"></div>
          </div>
          <div
            className="absolute -right-6 top-8 w-5 h-12 bg-gradient-to-b from-gray-100 to-white rounded-full border border-gray-200 shadow-md transition-transform duration-300"
            style={{
              transform: `rotate(${-pandaRotation * 0.1 - 15}deg)`,
            }}
          >
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black rounded-full"></div>
          </div>

          {/* Panda Legs */}
          <div className="absolute -bottom-3 left-3 w-4 h-8 bg-gradient-to-b from-gray-100 to-white rounded-full border border-gray-200">
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-3 bg-black rounded-full"></div>
          </div>
          <div className="absolute -bottom-3 right-3 w-4 h-8 bg-gradient-to-b from-gray-100 to-white rounded-full border border-gray-200">
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-3 bg-black rounded-full"></div>
          </div>
        </div>

        {/* Floating hearts when close to mouse */}
        {distance < 200 && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="text-pink-400 text-lg animate-pulse">💕</div>
          </div>
        )}

        {/* Speech Bubble */}
        <div
          className="absolute -left-32 -top-8 bg-white rounded-lg px-4 py-3 shadow-xl border border-gray-200 transition-all duration-300"
          style={{
            opacity: distance < 150 ? 1 : 0,
            transform: `scale(${distance < 150 ? 1 : 0.8})`,
          }}
        >
          <div className="text-sm text-gray-700 whitespace-nowrap font-medium">
            {distance < 100 ? "So close! 🥰" : distance < 150 ? "Hello traveler! 🐼" : ""}
          </div>
          <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-white border-t-2 border-b-2 border-t-transparent border-b-transparent" />
        </div>

        {/* Bamboo stick */}
        <div
          className="absolute -right-8 top-4 w-1 h-16 bg-green-600 rounded-full transition-transform duration-300"
          style={{
            transform: `rotate(${pandaRotation * 0.08}deg)`,
          }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full"></div>
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full"></div>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full"></div>
        </div>

        {/* Panda name tag */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          Travel Buddy 🐼
        </div>
      </div>
    </div>
  )
}
