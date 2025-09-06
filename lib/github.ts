import { Octokit } from 'octokit'

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
})

export interface GitHubUser {
  id: number
  login: string
  name?: string | null
  avatar_url: string
  bio?: string | null
  location?: string | null
  email?: string | null
  public_repos?: number
  followers?: number
  following?: number
  created_at?: string
  updated_at?: string
  html_url: string
}

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description?: string | null
  language?: string | null
  languages_url?: string
  stargazers_count: number
  forks_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  html_url: string
  clone_url?: string
  owner?: {
    login: string
  }
}

export interface RepositoryLanguages {
  [language: string]: number
}

export interface UserProfile {
  user: GitHubUser
  repositories: GitHubRepository[]
  languages: RepositoryLanguages
  totalStars: number
  totalForks: number
  primaryLanguages: string[]
  recentActivity: boolean
  experienceYears: number
  skills: string[]
  readme?: string
}

export class GitHubService {
  async searchUsers(query: string, page = 1, perPage = 10): Promise<GitHubUser[]> {
    try {
      const response = await octokit.rest.search.users({
        q: query,
        page,
        per_page: perPage,
        sort: 'repositories',
        order: 'desc'
      })
      return response.data.items.map(item => ({
        id: item.id,
        login: item.login,
        name: item.name || null,
        avatar_url: item.avatar_url,
        bio: item.bio || null,
        location: item.location || null,
        email: item.email || null,
        public_repos: item.public_repos || 0,
        followers: item.followers || 0,
        following: item.following || 0,
        created_at: item.created_at || '',
        updated_at: item.updated_at || '',
        html_url: item.html_url
      }))
    } catch (error) {
      console.error('Error searching users:', error)
      throw new Error('Failed to search GitHub users')
    }
  }

  async getUser(username: string): Promise<GitHubUser> {
    try {
      const response = await octokit.rest.users.getByUsername({
        username
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching user ${username}:`, error)
      throw new Error(`Failed to fetch user: ${username}`)
    }
  }

  async getUserRepositories(username: string, page = 1, perPage = 100): Promise<GitHubRepository[]> {
    try {
      const response = await octokit.rest.repos.listForUser({
        username,
        page,
        per_page: perPage,
        sort: 'updated',
        direction: 'desc'
      })
      return response.data.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || null,
        language: repo.language || null,
        languages_url: repo.languages_url || '',
        stargazers_count: repo.stargazers_count || 0,
        forks_count: repo.forks_count || 0,
        created_at: repo.created_at || '',
        updated_at: repo.updated_at || '',
        pushed_at: repo.pushed_at || repo.updated_at || '',
        html_url: repo.html_url,
        clone_url: repo.clone_url || '',
        owner: repo.owner ? { login: repo.owner.login } : undefined
      }))
    } catch (error) {
      console.error(`Error fetching repositories for ${username}:`, error)
      throw new Error(`Failed to fetch repositories for: ${username}`)
    }
  }

  async getRepositoryLanguages(owner: string, repo: string): Promise<RepositoryLanguages> {
    try {
      const response = await octokit.rest.repos.listLanguages({
        owner,
        repo
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching languages for ${owner}/${repo}:`, error)
      return {}
    }
  }

  async getRepositoryReadme(owner: string, repo: string): Promise<string | null> {
    try {
      const response = await octokit.rest.repos.getReadme({
        owner,
        repo
      })
      
      if (response.data.content) {
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8')
        return content
      }
      return null
    } catch (error) {
      console.error(`Error fetching README for ${owner}/${repo}:`, error)
      return null
    }
  }

  async getUserProfile(username: string): Promise<UserProfile> {
    try {
      const user = await this.getUser(username)
      const repositories = await this.getUserRepositories(username)
      
      // Get languages for all repositories
      const languagePromises = repositories.slice(0, 20).map(repo => 
        this.getRepositoryLanguages(repo.owner?.login || username, repo.name)
      )
      const languageResults = await Promise.all(languagePromises)
      
      // Aggregate languages
      const languages: RepositoryLanguages = {}
      languageResults.forEach(repoLanguages => {
        Object.entries(repoLanguages).forEach(([lang, bytes]) => {
          languages[lang] = (languages[lang] || 0) + bytes
        })
      })

      // Calculate metrics
      const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)
      const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0)
      
      const primaryLanguages = Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([lang]) => lang)

      // Calculate experience years based on account age and activity
      const accountAge = user.created_at ? new Date().getFullYear() - new Date(user.created_at).getFullYear() : 1
      const recentActivity = repositories.some(repo => 
        repo.pushed_at && new Date(repo.pushed_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 // 30 days
      )
      const experienceYears = Math.max(1, Math.min(accountAge, 15))

      // Extract skills from languages and repositories
      const skills = this.extractSkillsFromProfile(repositories, languages, user.bio)

      // Try to get user's README if they have a profile repository
      let readme: string | undefined
      try {
        readme = await this.getRepositoryReadme(username, username) || undefined
      } catch {
        // Profile README doesn't exist, which is fine
      }

      return {
        user,
        repositories,
        languages,
        totalStars,
        totalForks,
        primaryLanguages,
        recentActivity,
        experienceYears,
        skills,
        readme
      }
    } catch (error) {
      console.error(`Error building user profile for ${username}:`, error)
      throw new Error(`Failed to build user profile: ${username}`)
    }
  }

  private extractSkillsFromProfile(
    repositories: GitHubRepository[], 
    languages: RepositoryLanguages,
    bio: string | null | undefined
  ): string[] {
    const skills = new Set<string>()

    // Add primary languages
    Object.keys(languages).forEach(lang => skills.add(lang))

    // Add framework/technology keywords from repository names and descriptions
    const techKeywords = [
      'react', 'vue', 'angular', 'nodejs', 'express', 'fastapi', 'django', 'flask',
      'typescript', 'javascript', 'python', 'java', 'golang', 'rust', 'php',
      'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'terraform', 'jenkins',
      'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
      'nextjs', 'nuxt', 'svelte', 'tailwind', 'bootstrap', 'material-ui',
      'graphql', 'rest', 'api', 'microservices', 'serverless'
    ]

    repositories.forEach(repo => {
      const text = `${repo.name} ${repo.description || ''}`.toLowerCase()
      techKeywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          skills.add(keyword)
        }
      })
    })

    // Add skills from bio
    if (bio) {
      const bioText = bio.toLowerCase()
      techKeywords.forEach(keyword => {
        if (bioText.includes(keyword.toLowerCase())) {
          skills.add(keyword)
        }
      })
    }

    return Array.from(skills).slice(0, 15) // Limit to top 15 skills
  }
}