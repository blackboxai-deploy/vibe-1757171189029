import { NextRequest, NextResponse } from 'next/server'
import { GitHubService } from '@/lib/github'

const githubService = new GitHubService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '10')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const users = await githubService.searchUsers(query, page, perPage)
    
    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        per_page: perPage,
        total: users.length
      }
    })
  } catch (error) {
    console.error('GitHub search error:', error)
    return NextResponse.json(
      { error: 'Failed to search GitHub users' },
      { status: 500 }
    )
  }
}