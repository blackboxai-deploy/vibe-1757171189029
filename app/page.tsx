'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Github, Linkedin, Mail, Users, GitBranch, Star, MapPin, Loader2, Send, Upload, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { TalentVisualization } from '@/components/TalentVisualization'
import { ProfileCard } from '@/components/ProfileCard'
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
  x: number
  y: number
  languages: Record<string, number>
  totalStars: number
  experienceYears: number
  recentActivity: boolean
}

interface SearchState {
  query: string
  isSearching: boolean
  searchType: 'text' | 'file'
  uploadedFile: File | null
  extractedText: string
}

export default function TalentMapApp() {
  const [currentView, setCurrentView] = useState<'search' | 'loading' | 'results'>('search')
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    isSearching: false,
    searchType: 'text',
    uploadedFile: null,
    extractedText: ''
  })
  const [loadingText, setLoadingText] = useState('Analyzing requirements...')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [jobRequirements, setJobRequirements] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock data for demonstration - will be replaced with real GitHub data
  const mockProfiles: Profile[] = [
    {
      id: 1,
      username: 'alexdev',
      name: 'Alexandre Dubois',
      avatar: 'https://placehold.co/100x100?text=Professional+developer+avatar+portrait',
      score: 95,
      repositories: 42,
      followers: 1250,
      following: 320,
      status: 'Open to work',
      readme: 'Full-stack developer passionate about React, Node.js, and cloud architecture. 5+ years building scalable web applications.',
      linkedin: 'https://linkedin.com/in/alexdev',
      github: 'https://github.com/alexdev',
      email: 'alex.dubois@email.com',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
      x: 150,
      y: 200,
      languages: { TypeScript: 45000, JavaScript: 32000, Python: 18000 },
      totalStars: 287,
      experienceYears: 5,
      recentActivity: true
    },
    {
      id: 2,
      username: 'marie_frontend',
      name: 'Marie Laurent',
      avatar: 'https://placehold.co/100x100?text=Frontend+specialist+developer+portrait',
      score: 88,
      repositories: 38,
      followers: 890,
      following: 156,
      status: 'Available for freelance',
      readme: 'Frontend specialist with expertise in modern JavaScript frameworks and UI/UX design principles.',
      linkedin: 'https://linkedin.com/in/marielaurent',
      github: 'https://github.com/marie_frontend',
      email: 'marie.laurent@email.com',
      skills: ['Vue.js', 'React', 'CSS3', 'Figma', 'JavaScript'],
      x: 300,
      y: 180,
      languages: { JavaScript: 52000, Vue: 31000, CSS: 24000 },
      totalStars: 156,
      experienceYears: 4,
      recentActivity: true
    },
    {
      id: 3,
      username: 'backend_guru',
      name: 'Thomas Martin',
      avatar: 'https://placehold.co/100x100?text=Backend+architecture+expert+portrait',
      score: 92,
      repositories: 55,
      followers: 2100,
      following: 89,
      status: 'Senior Engineer at TechCorp',
      readme: 'Backend architect specializing in microservices, databases, and DevOps. Love solving complex scalability challenges.',
      linkedin: 'https://linkedin.com/in/thomasmartin',
      github: 'https://github.com/backend_guru',
      email: 'thomas.martin@email.com',
      skills: ['Python', 'Django', 'PostgreSQL', 'Kubernetes', 'Redis'],
      x: 480,
      y: 220,
      languages: { Python: 78000, Go: 25000, SQL: 15000 },
      totalStars: 434,
      experienceYears: 8,
      recentActivity: true
    }
  ]

  const loadingMessages = [
    'Analyzing requirements...',
    'Searching GitHub repositories...',
    'Processing code embeddings...',
    'Matching talent profiles...',
    'Calculating compatibility scores...',
    'Finalizing results...'
  ]

  useEffect(() => {
    if (currentView === 'loading') {
      let messageIndex = 0
      const interval = setInterval(() => {
        setLoadingText(loadingMessages[messageIndex])
        messageIndex = (messageIndex + 1) % loadingMessages.length
      }, 1000)

      const timer = setTimeout(() => {
        clearInterval(interval)
        setProfiles(mockProfiles)
        setCurrentView('results')
      }, 6000)

      return () => {
        clearInterval(interval)
        clearTimeout(timer)
      }
    }
  }, [currentView])

  const handleSearch = async () => {
    if (!searchState.query.trim() && !searchState.uploadedFile) return

    setSearchState(prev => ({ ...prev, isSearching: true }))
    setCurrentView('loading')
    
    try {
      // Here will be the actual API calls to analyze requirements and find matches
      // For now, we'll use mock data
      console.log('Searching with query:', searchState.query)
    } catch (error) {
      console.error('Search error:', error)
      setCurrentView('search')
    } finally {
      setSearchState(prev => ({ ...prev, isSearching: false }))
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSearchState(prev => ({ ...prev, uploadedFile: file }))

    try {
      // Here will be the OCR processing
      const formData = new FormData()
      formData.append('file', file)
      
      console.log('Processing file:', file.name)
      // Mock extracted text for demo
      setSearchState(prev => ({ 
        ...prev, 
        extractedText: `We are looking for a Senior Full Stack Developer with expertise in React, Node.js, TypeScript, and cloud technologies. 
        The ideal candidate should have 5+ years of experience building scalable web applications and working with modern DevOps practices.`
      }))
    } catch (error) {
      console.error('File processing error:', error)
    }
  }

  const removeFile = () => {
    setSearchState(prev => ({ 
      ...prev, 
      uploadedFile: null, 
      extractedText: '' 
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (currentView === 'search') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-slate-800 mb-4">
              <span className="text-blue-600">Stratos</span>
            </h1>
            <h2 className="text-3xl font-semibold text-slate-700 mb-2">
              AI-Powered Talent Discovery
            </h2>
            <p className="text-lg text-slate-600">
              Find the perfect developers using intelligent GitHub analysis and semantic matching
            </p>
          </div>
          
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Describe Your Ideal Candidate</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={searchState.searchType} 
                onValueChange={(value) => setSearchState(prev => ({ ...prev, searchType: value as 'text' | 'file' }))}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <Search size={16} />
                    Text Description
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <Upload size={16} />
                    Upload Document
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-query">Job Description or Requirements</Label>
                    <Textarea
                      id="search-query"
                      value={searchState.query}
                      onChange={(e) => setSearchState(prev => ({ ...prev, query: e.target.value }))}
                      placeholder="Describe your ideal candidate: tech stack, domain, company size, technical needs, required skills, experience level, etc.

Example: 'Looking for a senior full-stack developer with React and Node.js experience. Should have worked with TypeScript, AWS, and modern DevOps practices. Minimum 5 years experience building scalable web applications in a startup environment.'"
                      className="min-h-32 resize-none"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="file" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Upload Job Description (PDF or Image)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      {searchState.uploadedFile ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <FileText size={24} />
                            <span className="font-medium">{searchState.uploadedFile.name}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={removeFile}
                              className="ml-2"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                          {searchState.extractedText && (
                            <div className="text-left bg-gray-50 p-4 rounded-md">
                              <Label className="text-sm font-medium text-gray-700">Extracted Text Preview:</Label>
                              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                                {searchState.extractedText}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-2">
                            Drop your file here or click to browse
                          </p>
                          <p className="text-sm text-gray-500">
                            Supports PDF, JPG, PNG, WEBP (Max 10MB)
                          </p>
                          <Input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-4"
                          >
                            Select File
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleSearch}
                  disabled={(!searchState.query.trim() && !searchState.uploadedFile) || searchState.isSearching}
                  size="lg"
                  className="px-8"
                >
                  {searchState.isSearching ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  {searchState.isSearching ? 'Processing...' : 'Find Talent'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentView === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-8">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Processing Your Request</h2>
            <p className="text-slate-600">{loadingText}</p>
          </div>
          <div className="max-w-md mx-auto">
            <Progress value={((loadingMessages.indexOf(loadingText) + 1) / loadingMessages.length) * 100} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel - Visualization */}
      <div className="flex-1 p-6">
        <Card className="h-full">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Talent Network Map</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Interactive visualization of matched profiles
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('search')}
              >
                New Search
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <TalentVisualization
              profiles={profiles}
              onProfileSelect={setSelectedProfile}
              selectedProfile={selectedProfile}
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Profile List */}
      <div className="w-96 p-6">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">
              Top Matches ({profiles.length})
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Profiles ranked by compatibility score
            </p>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full pr-6">
              <div className="space-y-4 p-6 pt-0">
                {profiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    isSelected={selectedProfile?.id === profile.id}
                    onClick={() => setSelectedProfile(profile)}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}