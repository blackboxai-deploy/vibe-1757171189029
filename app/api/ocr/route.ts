import { NextRequest, NextResponse } from 'next/server'
import { OCRService } from '@/lib/ocr'
import { AIService } from '@/lib/ai'

const ocrService = new OCRService()
const aiService = new AIService()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file
    const validation = ocrService.validateFile(file)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Extract text from file
    const ocrResult = await ocrService.processFile(file)
    
    // Extract structured information using AI
    const extractedInfo = await aiService.extractTextFromDocument(ocrResult.text)

    return NextResponse.json({
      success: true,
      data: {
        extracted_text: ocrResult.text,
        confidence: ocrResult.confidence,
        processing_time: ocrResult.processing_time,
        structured_data: extractedInfo
      }
    })
  } catch (error) {
    console.error('OCR processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    )
  }
}