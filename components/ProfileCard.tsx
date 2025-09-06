'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { formatNumber } from '@/lib/utils'

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
  languages: Record<string, number>
  totalStars: number
  experienceYears: number
  recentActivity: boolean
}

interface ProfileCardProps {
  profile: Profile
  isSelected: boolean
  onClick: () => void
}

const ScoreChart: React.FC<{ score: number }> = ({ score }) => {
  const circumference = 2 * Math.PI * 20
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`
  
  const getScoreColor = (score: number): string => {
    if (score >= 90) return '#10b981'
    if (score >= 80) return '#f59e0b'
    if (score >= 70) return '#3b82f6'
    return '#6b7280'
  }
  
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth="4"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold">{score}%</span>
      </div>
    </div>
  )
}

export function ProfileCard({ profile, isSelected, onClick }: ProfileCardProps) {
  const getStatusColor = (status: string): string => {
    if (status.toLowerCase().includes('open')) return 'bg-green-100 text-green-700'
    if (status.toLowerCase().includes('available')) return 'bg-blue-100 text-blue-700'
    if (status.toLowerCase().includes('freelance')) return 'bg-purple-100 text-purple-700'
    return 'bg-gray-100 text-gray-700'
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onClick()
  }

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    window.open(url, '_blank')
  }

  return (
    <div 
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'bg-blue-50 border-blue-200 shadow-md' : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <img 
          src={profile.avatar} 
          alt={`${profile.name} avatar`}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 truncate">{profile.name}</h4>
              <p className="text-sm text-gray-600">@{profile.username}</p>
            </div>
            <ScoreChart score={profile.score} />
          </div>
          
          <div className="mb-2">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
              {profile.status}
            </span>
          </div>
          
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {profile.readme}
          </p>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
                </svg>
              </div>
              {formatNumber(profile.repositories)}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 12.052c-2.52 0-5.007-.947-6.75-2.653a.75.75 0 111.05-1.072C3.7 9.48 5.773 10.302 8 10.302s4.3-.822 5.7-1.975a.75.75 0 111.05 1.072c-1.743 1.706-4.23 2.653-6.75 2.653z"/>
                  <path d="M8 7a3 3 0 100-6 3 3 0 000 6z"/>
                </svg>
              </div>
              {formatNumber(profile.followers)}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8.22 1.754a.25.25 0 00-.44 0L5.354 5.12l-3.955.576a.25.25 0 00-.138.427L3.735 8.4 3.042 12.342a.25.25 0 00.363.263l3.595-1.89 3.594 1.89a.25.25 0 00.364-.263L10.265 8.4l2.474-2.277a.25.25 0 00-.138-.427L8.646 5.12 6.22 1.754z"/>
                </svg>
              </div>
              {formatNumber(profile.totalStars)}
            </span>
          </div>
          
          {/* Skills */}
          <div className="flex flex-wrap gap-1 mb-3">
            {profile.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                {skill}
              </Badge>
            ))}
            {profile.skills.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{profile.skills.length - 3}
              </Badge>
            )}
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => handleLinkClick(e, profile.github)} 
              className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
              title="GitHub Profile"
            >
              <div className="w-4 h-4">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </div>
            </button>
            <button 
              onClick={(e) => handleLinkClick(e, profile.linkedin)} 
              className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
              title="LinkedIn Profile"
            >
              <div className="w-4 h-4">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 01.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                </svg>
              </div>
            </button>
            <button 
              onClick={(e) => handleLinkClick(e, `mailto:${profile.email}`)} 
              className="p-1 text-gray-600 hover:text-green-600 transition-colors"
              title="Send Email"
            >
              <div className="w-4 h-4">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2a2 2 0 00-2 2v.654l8 4.2 8-4.2V4a2 2 0 00-2-2H2zm0 2.002L8 8.655l6-4.653V4a0 0 0 010 0H2v.002zM14 5.293L8 9.293l-6-4v6.414A2 2 0 004 13.707h8A2 2 0 0014 11.707V5.293z"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}