'use client'

import React, { useRef, useEffect } from 'react'

interface Profile {
  id: number
  username: string
  name: string
  avatar: string
  score: number
  repositories: number
  followers: number
  following: number
  status: string
  readme: string
  linkedin: string
  github: string
  email: string
  skills: string[]
  x: number
  y: number
  languages: Record<string, number>
  totalStars: number
  experienceYears: number
  recentActivity: boolean
}

interface TalentVisualizationProps {
  profiles: Profile[]
  onProfileSelect: (profile: Profile) => void
  selectedProfile: Profile | null
}

export function TalentVisualization({ profiles, onProfileSelect, selectedProfile }: TalentVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const getScoreColor = (score: number): string => {
    if (score >= 90) return '#10b981' // green-500
    if (score >= 80) return '#f59e0b' // amber-500
    if (score >= 70) return '#3b82f6' // blue-500
    return '#6b7280' // gray-500
  }

  const drawVisualization = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw connections between nearby profiles
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    for (let i = 0; i < profiles.length; i++) {
      for (let j = i + 1; j < profiles.length; j++) {
        const profile1 = profiles[i]
        const profile2 = profiles[j]
        const distance = Math.sqrt(
          Math.pow(profile1.x - profile2.x, 2) + Math.pow(profile1.y - profile2.y, 2)
        )
        if (distance < 200) {
          ctx.beginPath()
          ctx.moveTo(profile1.x, profile1.y)
          ctx.lineTo(profile2.x, profile2.y)
          ctx.stroke()
        }
      }
    }

    // Draw profile nodes
    profiles.forEach(profile => {
      const radius = 20 + (profile.score - 70) * 0.5
      const isSelected = selectedProfile?.id === profile.id
      
      // Highlight selected profile
      if (isSelected) {
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(profile.x, profile.y, radius + 5, 0, 2 * Math.PI)
        ctx.stroke()
      }
      
      // Node circle
      ctx.fillStyle = getScoreColor(profile.score)
      ctx.beginPath()
      ctx.arc(profile.x, profile.y, radius, 0, 2 * Math.PI)
      ctx.fill()
      
      // Score text
      ctx.fillStyle = 'white'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${profile.score}%`, profile.x, profile.y + 4)
      
      // Username label
      ctx.fillStyle = isSelected ? '#3b82f6' : '#374151'
      ctx.font = isSelected ? 'bold 11px sans-serif' : '11px sans-serif'
      ctx.fillText(profile.username, profile.x, profile.y + radius + 15)
    })
  }

  useEffect(() => {
    if (profiles.length > 0) {
      drawVisualization()
    }
  }, [profiles, selectedProfile])

  useEffect(() => {
    const handleResize = () => {
      if (profiles.length > 0) {
        setTimeout(drawVisualization, 100)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [profiles, selectedProfile])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    profiles.forEach(profile => {
      const distance = Math.sqrt(
        Math.pow(x - profile.x, 2) + Math.pow(y - profile.y, 2)
      )
      if (distance < 30) {
        onProfileSelect(profile)
      }
    })
  }

  if (profiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p>No profiles to display</p>
          <p className="text-sm">Start a search to see talent matches</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-pointer"
        style={{ height: '100%' }}
      />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border">
        <h4 className="text-sm font-semibold mb-2">Compatibility Score</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>90%+ Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>80-89% Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>70-79% Fair</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>&lt;70% Poor</span>
          </div>
        </div>
      </div>
    </div>
  )
}