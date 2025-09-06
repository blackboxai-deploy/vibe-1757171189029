import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function getScoreColor(score: number): string {
  if (score >= 90) return '#10b981' // green-500
  if (score >= 80) return '#f59e0b' // amber-500
  if (score >= 70) return '#3b82f6' // blue-500
  return '#6b7280' // gray-500
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function calculateCompatibilityScore(
  userSkills: string[],
  requiredSkills: string[],
  userExperience: number,
  requiredExperience: number
): number {
  // Skills matching (60% weight)
  const skillsMatch = userSkills.filter(skill => 
    requiredSkills.some(req => req.toLowerCase().includes(skill.toLowerCase()) || 
                            skill.toLowerCase().includes(req.toLowerCase()))
  ).length
  const skillsScore = Math.min((skillsMatch / requiredSkills.length) * 100, 100)

  // Experience matching (40% weight)
  const experienceScore = Math.min((userExperience / requiredExperience) * 100, 100)

  return Math.round(skillsScore * 0.6 + experienceScore * 0.4)
}