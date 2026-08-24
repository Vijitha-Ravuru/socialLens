import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';

/**
 * Supported MIME types and extensions
 */
export const SUPPORTED_MIME_TYPES = {
  'application/pdf': 'pdf',
  'image/png': 'image',
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/webp': 'image',
  'image/gif': 'image',
};

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

/**
 * Validates uploaded file MIME type and size
 * @param {Express.Multer.File} file 
 */
export function validateFile(file) {
  if (!file) {
    throw new Error('No file was uploaded. Please select a PDF or image file.');
  }

  const mimeType = file.mimetype?.toLowerCase();
  if (!SUPPORTED_MIME_TYPES[mimeType]) {
    throw new Error(
      `Unsupported file type: "${file.mimetype}". Only PDF, JPG, JPEG, PNG, and WebP files are supported.`
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File size exceeds 25MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`
    );
  }

  return {
    type: SUPPORTED_MIME_TYPES[mimeType],
    mimeType,
    fileName: file.originalname,
    fileSize: file.size,
  };
}

/**
 * Extracts raw text from a PDF Buffer
 * @param {Buffer} buffer 
 * @returns {Promise<{text: string, numPages: number, info: object}>}
 */
export async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    const cleanedText = cleanExtractedText(data.text || '');
    return {
      text: cleanedText,
      numPages: data.numpages || 1,
      info: data.info || {},
      rawLength: cleanedText.length,
    };
  } catch (error) {
    throw new Error(`Failed to parse PDF document: ${error.message}`);
  }
}

/**
 * Extracts text from an Image Buffer via OCR (Tesseract.js)
 * @param {Buffer} buffer 
 * @returns {Promise<{text: string, confidence: number}>}
 */
export async function extractTextFromImage(buffer) {
  try {
    const result = await Tesseract.recognize(buffer, 'eng', {
      logger: () => {}, // suppress verbose progress in standard output
    });

    const text = cleanExtractedText(result.data.text || '');
    return {
      text,
      confidence: Math.round(result.data.confidence || 0),
      rawLength: text.length,
    };
  } catch (error) {
    throw new Error(`OCR processing failed: ${error.message}`);
  }
}

/**
 * Clean up text artifacts from PDF or OCR parsing
 * @param {string} text 
 * @returns {string}
 */
export function cleanExtractedText(text) {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove null bytes and strange control chars
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize excessive line breaks (more than 2 to 2)
    .replace(/\n{3,}/g, '\n\n')
    // Clean trailing/leading spaces on each line
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .trim();
}
