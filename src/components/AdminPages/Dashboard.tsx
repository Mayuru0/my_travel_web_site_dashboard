"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Camera, Heart, Eye, TrendingUp, Globe, Users, Star, Plane, Mountain, Compass } from "lucide-react"
import { CutePanda } from "./cute-panda"
import Image from "next/image"


const Dashboard = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const stats = [
    {
      title: "Countries Visited",
      value: "47",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      trend: "+3 this month",
      progress: 78,
    },
    {
      title: "Travel Videos",
      value: "156",
      icon: Camera,
      color: "from-purple-500 to-pink-500",
      trend: "+12 this week",
      progress: 92,
    },
    {
      title: "Total Views",
      value: "2.4M",
      icon: Eye,
      color: "from-green-500 to-emerald-500",
      trend: "+15.2% growth",
      progress: 85,
    },
    {
      title: "Subscribers",
      value: "89.2K",
      icon: Users,
      color: "from-orange-500 to-red-500",
      trend: "+1.2K this month",
      progress: 67,
    },
  ]

  const recentDestinations = [
    { name: "Santorini, Greece", rating: 4.9, views: "124K", image: "/placeholder.svg?height=60&width=60" },
    { name: "Kyoto, Japan", rating: 4.8, views: "98K", image: "/placeholder.svg?height=60&width=60" },
    { name: "Banff, Canada", rating: 4.7, views: "156K", image: "/placeholder.svg?height=60&width=60" },
    { name: "Machu Picchu, Peru", rating: 5.0, views: "203K", image: "/placeholder.svg?height=60&width=60" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      </div>

      <div className="relative z-10 p-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <Compass className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Travel Vlog Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Welcome back, Explorer! ✈️ Track your adventures and engage with your travel community
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Live Streaming
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-300">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending Creator
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-500 cursor-pointer"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                transform: hoveredCard === index ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
                transition: "transform 0.3s ease-out",
              }}
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Animated border */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{stat.trend}</span>
                    <span className="text-gray-400">{stat.progress}%</span>
                  </div>
                  <Progress value={stat.progress} className="h-1.5 bg-white/10" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Destinations */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-xl text-white">Recent Destinations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentDestinations.map((destination, index) => (
                <div
                  key={index}
                  className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20"
                  style={{
                    transform: `translateY(${Math.sin((mousePosition.x + index * 100) * 0.01) * 2}px)`,
                    transition: "transform 0.1s ease-out",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20 group-hover:border-white/40 transition-colors"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm group-hover:text-blue-200 transition-colors">
                        {destination.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-300">{destination.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{destination.views}</span>
                    </div>
                    <Heart className="h-4 w-4 text-gray-400 hover:text-red-400 transition-colors cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg border-white/10 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Plane className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Plan New Trip</h3>
              <p className="text-gray-300 text-sm">Discover your next adventure</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg border-white/10 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Camera className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Upload Video</h3>
              <p className="text-gray-300 text-sm">Share your latest journey</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg border-white/10 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mountain className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Explore Trends</h3>
              <p className="text-gray-300 text-sm">See what&apos;s popular now</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Import and use the cute panda component */}
      <CutePanda mousePosition={mousePosition} />
    </div>
  )
}

export default Dashboard
