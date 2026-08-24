import express from 'express';
import multer from 'multer';
import {
  validateFile,
  extractTextFromPDF,
  extractTextFromImage,
} from '../services/documentService.js';
import { calculateContentMetrics } from '../services/metricsService.js';
import {
  analyzeEngagement,
  generateImprovedPost,
  analyzeVisionAndCaption,
} from '../services/aiService.js';

const router = express.Router();

// Configure Multer storage in memory for instant buffer processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max limit
  },
});

/**
 * POST /api/extract
 * Extracts text from an uploaded PDF or Image file
 */
router.post('/extract', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const validated = validateFile(file);
    const startTime = Date.now();

    let result = {};

    if (validated.type === 'pdf') {
      const pdfData = await extractTextFromPDF(file.buffer);
      result = {
        text: pdfData.text,
        numPages: pdfData.numPages,
        confidence: 100, // digital text extraction
        extractionType: 'Digital PDF Extraction',
      };
    } else if (validated.type === 'image') {
      const ocrData = await extractTextFromImage(file.buffer);
      result = {
        text: ocrData.text,
        confidence: ocrData.confidence,
        extractionType: 'OCR Optical Character Recognition',
      };
    }

    const durationMs = Date.now() - startTime;

    return res.status(200).json({
      success: true,
      text: result.text || '',
      metadata: {
        fileName: validated.fileName,
        fileSize: validated.fileSize,
        fileType: validated.type,
        mimeType: validated.mimeType,
        numPages: result.numPages || 1,
        confidence: result.confidence,
        extractionType: result.extractionType,
        durationMs,
      },
    });
  } catch (error) {
    console.error('Extract endpoint error:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to extract content from file.',
    });
  }
});

/**
 * POST /api/metrics
 * Calculates deterministic content metrics on provided text
 */
router.post('/metrics', (req, res) => {
  try {
    const { text } = req.body;
    const metrics = calculateContentMetrics(text || '');
    return res.status(200).json({
      success: true,
      metrics,
    });
  } catch (error) {
    console.error('Metrics calculation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to calculate content metrics.',
    });
  }
});

/**
 * POST /api/ai-analyze
 * Performs AI engagement analysis on post text
 */
router.post('/ai-analyze', async (req, res) => {
  try {
    const { text, apiKey } = req.body;
    const customKey = req.headers['x-gemini-key'] || apiKey;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Text is required for AI analysis.',
      });
    }

    const analysis = await analyzeEngagement(text, customKey);
    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('AI analyze error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'AI engagement analysis failed.',
    });
  }
});

/**
 * POST /api/improve
 * Generates enhanced versions of the post across multiple formats
 */
router.post('/improve', async (req, res) => {
  try {
    const { text, platform, apiKey } = req.body;
    const customKey = req.headers['x-gemini-key'] || apiKey;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Text is required to generate improved variations.',
      });
    }

    const variations = await generateImprovedPost(text, platform || 'all', customKey);
    return res.status(200).json({
      success: true,
      variations,
    });
  } catch (error) {
    console.error('Post improve error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate improved post variations.',
    });
  }
});

/**
 * POST /api/vision-analyze
 * Multimodal analysis of an image + optional caption
 */
router.post('/vision-analyze', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const caption = req.body.caption || '';
    const customKey = req.headers['x-gemini-key'] || req.body.apiKey;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'Image file is required for visual analysis.',
      });
    }

    const validated = validateFile(file);
    if (validated.type !== 'image') {
      return res.status(400).json({
        success: false,
        error: 'Visual analysis requires an image file (PNG, JPG, JPEG, WebP).',
      });
    }

    const visionAnalysis = await analyzeVisionAndCaption(
      file.buffer,
      file.mimetype,
      caption,
      customKey
    );

    return res.status(200).json({
      success: true,
      visionAnalysis,
      imageMetadata: {
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
      },
    });
  } catch (error) {
    console.error('Vision analysis error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Visual analysis failed.',
    });
  }
});

export default router;
