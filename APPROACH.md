## Approach — SocialLens: Social Media Content Analyzer

The core challenge was building a reliable pipeline that accepts raw document uploads and produces actionable engagement insights without requiring complex infrastructure.

**Architecture:** The application uses a React/Vite frontend communicating with an Express backend over a clean REST API. This separation keeps document processing and AI logic entirely server-side.

**Document Extraction:** PDF files are processed using `pdf-parse`, which extracts structured text while preserving line breaks. Images and scanned documents are processed using `Tesseract.js` for OCR, returning extracted text alongside a confidence score shown to the user.

**Content Analysis:** The system first calculates deterministic metrics — Flesch Reading Ease, hook strength, call-to-action detection, sentiment polarity, hashtag density, and platform character limits — which run instantly without any API dependency.

**AI Layer:** Google Gemini 1.5 Flash adds qualitative engagement analysis: engagement score, strengths, weaknesses, and actionable recommendations. If the API is unavailable or unconfigured, the system falls back to smart heuristics that mirror the same output structure, keeping the application fully functional offline.

**Error Handling and Loading States:** Every API call includes try/catch handling with user-facing error messages. Loading spinners and status text appear during extraction, analysis, and generation.
