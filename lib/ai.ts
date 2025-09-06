export interface AIAnalysisRequest {
  prompt: string
  userProfiles?: any[]
  context?: string
}

export interface AIAnalysisResponse {
  analysis: string
  matches: MatchedProfile[]
  summary: string
}

export interface MatchedProfile {
  username: string
  score: number
  reasoning: string
  strengths: string[]
  potential_concerns: string[]
}

export class AIService {
  private endpoint = process.env.BLACKBOX_API_ENDPOINT!
  private customerId = process.env.BLACKBOX_CUSTOMER_ID!
  private authToken = process.env.BLACKBOX_AUTH_TOKEN!

  async analyzeJobRequirements(prompt: string): Promise<{
    skills: string[]
    experience_level: string
    technologies: string[]
    domain: string
    summary: string
  }> {
    const systemPrompt = `You are an expert technical recruiter and software engineer. Analyze the job requirements and extract structured information.

Return a JSON object with:
- skills: Array of required technical skills
- experience_level: junior/mid/senior/lead
- technologies: Array of specific technologies/frameworks mentioned
- domain: Industry/domain (e.g., fintech, healthcare, e-commerce)
- summary: Brief summary of what they're looking for

Be specific and comprehensive in your analysis.`

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'customerId': this.customerId,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
        body: JSON.stringify({
          model: 'openrouter/openai/gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      })

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error('No content in AI response')
      }

      return JSON.parse(content)
    } catch (error) {
      console.error('Error analyzing job requirements:', error)
      throw new Error('Failed to analyze job requirements')
    }
  }

  async matchProfiles(jobRequirements: any, profiles: any[]): Promise<MatchedProfile[]> {
    const systemPrompt = `You are an expert technical recruiter. You need to match candidate profiles against job requirements and provide compatibility scores.

Job Requirements:
${JSON.stringify(jobRequirements, null, 2)}

For each candidate profile, analyze:
1. Technical skill alignment
2. Experience level match  
3. Technology stack compatibility
4. Domain experience relevance
5. Recent activity and project quality

Return a JSON array of matches with:
- username: GitHub username
- score: Compatibility score (0-100)
- reasoning: Brief explanation of the match
- strengths: Array of candidate strengths for this role
- potential_concerns: Array of potential gaps or concerns

Be thorough and honest in your assessment. Consider both hard skills and project experience.`

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'customerId': this.customerId,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
        body: JSON.stringify({
          model: 'openrouter/openai/gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { 
              role: 'user', 
              content: `Analyze these ${profiles.length} candidate profiles:\n\n${JSON.stringify(profiles, null, 2)}` 
            }
          ],
          temperature: 0.2,
          max_tokens: 4000
        })
      })

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error('No content in AI response')
      }

      return JSON.parse(content)
    } catch (error) {
      console.error('Error matching profiles:', error)
      throw new Error('Failed to match profiles')
    }
  }

  async generateProfileSummary(profile: any): Promise<string> {
    const systemPrompt = `You are an expert technical recruiter. Create a concise, professional summary of this developer's profile based on their GitHub data.

Focus on:
- Primary technologies and expertise
- Notable projects and contributions
- Experience level and specializations
- Unique strengths and capabilities

Keep it under 100 words and professional.`

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'customerId': this.customerId,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
        body: JSON.stringify({
          model: 'openrouter/openai/gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { 
              role: 'user', 
              content: `Generate a professional summary for this developer profile:\n\n${JSON.stringify(profile, null, 2)}` 
            }
          ],
          temperature: 0.4,
          max_tokens: 200
        })
      })

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'Professional developer with diverse technical skills.'
    } catch (error) {
      console.error('Error generating profile summary:', error)
      return 'Experienced developer with strong technical background.'
    }
  }

  async extractTextFromDocument(text: string): Promise<{
    skills: string[]
    requirements: string[]
    company_info: string
    role_type: string
    summary: string
  }> {
    const systemPrompt = `You are an expert document parser for job descriptions and requirements. Extract structured information from the provided text.

Return a JSON object with:
- skills: Array of technical skills mentioned
- requirements: Array of specific requirements or qualifications
- company_info: Brief company description if available
- role_type: Type of role (frontend, backend, fullstack, devops, etc.)
- summary: Clean summary of the position and requirements

Be thorough in extracting all relevant technical information.`

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'customerId': this.customerId,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
        body: JSON.stringify({
          model: 'openrouter/openai/gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Extract information from this document:\n\n${text}` }
          ],
          temperature: 0.2,
          max_tokens: 1000
        })
      })

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error('No content in AI response')
      }

      return JSON.parse(content)
    } catch (error) {
      console.error('Error extracting document text:', error)
      throw new Error('Failed to extract document information')
    }
  }
}