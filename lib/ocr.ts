export interface OCRResult {
  text: string
  confidence: number
  processing_time: number
}

export class OCRService {
  async extractTextFromPDF(buffer: any): Promise<OCRResult> {
    const startTime = Date.now()
    
    try {
      // For now, return a mock implementation for PDFs
      // In production, you would use pdf-parse or another PDF processing library
      const processingTime = Date.now() - startTime
      
      return {
        text: "Mock text extracted from PDF. We are looking for a Senior Full Stack Developer with expertise in React, Node.js, TypeScript, and cloud technologies. The ideal candidate should have 5+ years of experience building scalable web applications and working with modern DevOps practices.",
        confidence: 0.95,
        processing_time: processingTime
      }
    } catch (error) {
      console.error('Error extracting text from PDF:', error)
      throw new Error('Failed to extract text from PDF')
    }
  }

  async extractTextFromImage(buffer: any): Promise<OCRResult> {
    const startTime = Date.now()
    
    try {
      // For now, return a mock implementation for images
      // In production, you would use tesseract.js or another OCR service
      const processingTime = Date.now() - startTime
      
      return {
        text: "Mock text extracted from image. OCR implementation needed.",
        confidence: 0.75,
        processing_time: processingTime
      }
    } catch (error) {
      console.error('Error extracting text from image:', error)
      throw new Error('Failed to extract text from image')
    }
  }

  async processFile(file: File): Promise<OCRResult> {
    const buffer = await file.arrayBuffer()
    
    if (file.type === 'application/pdf') {
      return this.extractTextFromPDF(buffer)
    } else if (file.type.startsWith('image/')) {
      return this.extractTextFromImage(buffer)
    } else {
      throw new Error(`Unsupported file type: ${file.type}`)
    }
  }

  async processBuffer(buffer: any, mimeType: string): Promise<OCRResult> {
    if (mimeType === 'application/pdf') {
      return this.extractTextFromPDF(buffer)
    } else if (mimeType.startsWith('image/')) {
      return this.extractTextFromImage(buffer)
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`)
    }
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ]

    if (file.size > maxSize) {
      return { valid: false, error: 'File size too large. Maximum size is 10MB.' }
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Unsupported file type. Please upload PDF or image files.' }
    }

    return { valid: true }
  }
}