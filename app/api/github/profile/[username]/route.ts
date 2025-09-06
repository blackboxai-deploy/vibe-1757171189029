import { NextRequest, NextResponse } from 'next/server'
import { GitHubService } from '@/lib/github'

const githubService = new GitHubService()

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    const profile = await githubService.getUserProfile(username)
    
    return NextResponse.json({
      success: true,
      data: profile
    })
  } catch (error) {
    console.error('GitHub profile error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub profile' },
      { status: 500 }
    )
  }
}