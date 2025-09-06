import { NextRequest, NextResponse } from 'next/server'
import { AIService, MatchedProfile } from '@/lib/ai'

const aiService = new AIService()

export async function POST(request: NextRequest) {
  try {
    const { prompt, profiles } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // First, analyze the job requirements
    const requirements = await aiService.analyzeJobRequirements(prompt)
    
    let matches: MatchedProfile[] = []
    if (profiles && profiles.length > 0) {
      // Match profiles against requirements
      matches = await aiService.matchProfiles(requirements, profiles)
    }

    return NextResponse.json({
      success: true,
      data: {
        requirements,
        matches
      }
    })
  } catch (error) {
    console.error('AI analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze requirements' },
      { status: 500 }
    )
  }
}