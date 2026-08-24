# SocialLens — Social Media Content Analyzer

A full-stack web application that analyzes social media posts and suggests engagement improvements. Upload a PDF or image containing your post, extract the text, analyze it for engagement metrics, and receive AI-powered recommendations and improved post variations.

---

## Project Overview

SocialLens solves a real problem for content creators and social media managers: **knowing whether a post will actually perform before publishing it.** The application accepts document uploads (PDF files and scanned images), extracts the post text, calculates objective readability and engagement metrics, and uses AI to recommend improvements and generate stronger post variants.

---

## Features

| Feature | Status |
|---|---|
| PDF file upload | ✅ Implemented |
| Image file upload (JPG, PNG, WebP) | ✅ Implemented |
| Drag-and-drop upload | ✅ Implemented |
| File picker (click to browse) | ✅ Implemented |
| File validation (type + size) | ✅ Implemented |
| PDF text extraction (pdf-parse) | ✅ Implemented |
| OCR for image/scanned documents (Tesseract.js) | ✅ Implemented |
| OCR confidence score display | ✅ Implemented |
| Extracted text review and editing | ✅ Implemented |
| Deterministic engagement metrics | ✅ Implemented |
| Flesch Reading Ease & Grade Level | ✅ Implemented |
| Hook power analysis | ✅ Implemented |
| Call-to-action detection | ✅ Implemented |
| Sentiment & tone analysis | ✅ Implemented |
| Hashtag & mention counting | ✅ Implemented |
| Platform character limit checker (X, LinkedIn) | ✅ Implemented |
| AI-powered engagement analysis | ✅ Implemented |
| Strengths & weaknesses diagnostic | ✅ Implemented |
| Actionable improvement recommendations | ✅ Implemented |
| AI-generated improved post variations | ✅ Implemented |
| Platform filter (LinkedIn, Instagram, X, Facebook) | ✅ Implemented |
| Tone filter (Professional, Friendly, Educational, Casual, Exciting) | ✅ Implemented |
| Hook alternative suggestions | ✅ Implemented |
| Platform feed preview (LinkedIn, X, Instagram, Facebook) | ✅ Implemented |
| Visual & Caption Studio (image analysis + caption generation) | ✅ Implemented |
| Image-grounded caption generation (no generic hallucinations) | ✅ Implemented |
| Relevant hashtag pack per image subject | ✅ Implemented |
| Loading states throughout | ✅ Implemented |
| Error handling throughout | ✅ Implemented |
| Light / Dark theme toggle | ✅ Implemented |
| Smart offline fallback (works without API key) | ✅ Implemented |

---

## Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI component framework |
| Vite 6 | Development server and build tool |
| Lucide React | Icon library |
| CSS Variables | Theming and design system |
| Plus Jakarta Sans (Google Fonts) | Typography |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express 4 | REST API web server |
| Multer | Multipart file upload handling |
| pdf-parse | PDF text extraction |
| Tesseract.js 5 | OCR — optical character recognition for images |
| @google/generative-ai | Google Gemini 1.5 Flash AI integration |
| dotenv | Environment variable management |
| CORS | Cross-origin request handling |

---

## Project Structure

```
socialLens-anti/
├── client/                         # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx                 # Root component, global state, step workflow
│   │   ├── index.css               # Design system tokens and global styles
│   │   ├── main.jsx                # React entry point
│   │   ├── components/
│   │   │   ├── Header.jsx          # Navigation: Analyze Post / Visual Studio / theme toggle
│   │   │   ├── Toast.jsx           # Global notification toasts
│   │   │   ├── DocumentAnalyzer/
│   │   │   │   ├── DocumentUploadZone.jsx   # Drag-drop / file picker upload panel
│   │   │   │   ├── TextEditorSection.jsx    # Extracted text editor + word/char counters
│   │   │   │   ├── MetricsDashboard.jsx     # Post at a Glance: engagement score + 6-metric grid
│   │   │   │   ├── AIReportSection.jsx      # Strengths vs improvements + apply tip action
│   │   │   │   ├── PostTransformer.jsx      # Generate improved post variations
│   │   │   │   └── PlatformPreviews.jsx     # Realistic social feed mockups
│   │   │   └── VisualStudio/
│   │   │       └── VisualAndCaptionStudio.jsx  # Image upload + AI caption generation
│   │   └── utils/
│   │       ├── api.js              # All backend API calls (fetch wrappers)
│   │       └── sampleData.js       # Built-in sample posts for instant testing
│   ├── index.html                  # HTML entry point with SEO meta tags
│   ├── vite.config.js              # Vite config with /api proxy to backend
│   └── package.json
│
├── server/                         # Node.js + Express backend
│   ├── src/
│   │   ├── server.js               # Express app setup, CORS, request logger
│   │   ├── routes/
│   │   │   └── analyzeRoutes.js    # REST API routes: /extract /metrics /ai-analyze /improve /vision-analyze
│   │   └── services/
│   │       ├── documentService.js  # PDF parsing (pdf-parse) + OCR (Tesseract.js)
│   │       ├── metricsService.js   # Deterministic: readability, hook, CTA, sentiment, platform fit
│   │       └── aiService.js        # Gemini AI integration + smart offline heuristic fallback
│   ├── test_e2e.js                 # End-to-end backend verification script
│   ├── .env                        # Local environment variables (NOT committed to git)
│   └── package.json
│
├── README.md                       # This file
├── APPROACH.md                     # 200-word technical approach write-up (assessment deliverable)
├── GITHUB_READINESS.md             # Pre-submission readiness audit
├── GITHUB_SETUP.md                 # Beginner-friendly GitHub setup guide
├── .gitignore                      # Excludes node_modules, .env, dist, and secrets
└── package.json                    # Root workspace scripts
```

---

## Setup Instructions

### Prerequisites
- Node.js v18 or later — download from [nodejs.org](https://nodejs.org)
- Git — download from [git-scm.com](https://git-scm.com)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Set up the backend (server)
```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:
```bash
# server/.env
PORT=5001
GEMINI_API_KEY=       # Optional — leave blank to use smart offline mode
```

Start the backend:
```bash
npm run dev
```
The backend will start at: `http://localhost:5001`

### 3. Set up the frontend (client)
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
The frontend will start at: `http://localhost:5173`

### 4. Open the application
Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Backend server port. Defaults to `5001`. |
| `GEMINI_API_KEY` | No | Google Gemini API key for AI-powered analysis. If left empty, the application automatically falls back to accurate built-in heuristics. |

**Where to get a free Gemini API key:** [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

> The application is fully functional **without** a Gemini API key using the built-in smart heuristics engine.

---

## How It Works

```
User uploads PDF or image
       ↓
Backend validates file (type + size)
       ↓
PDF → pdf-parse text extraction
Image → Tesseract.js OCR
       ↓
Extracted text displayed for user review/editing
       ↓
Deterministic metrics calculated (Flesch readability, hook strength, CTA, sentiment, hashtags, platform fit)
       ↓
AI engagement diagnostic runs (Gemini 1.5 Flash, or smart heuristics fallback)
       ↓
Results: engagement score + strengths + weaknesses + actionable recommendations
       ↓
User requests improved post (with platform and tone selection)
       ↓
AI generates 4 format variations + 3 hook alternatives
       ↓
Platform preview: see the post in LinkedIn / X / Instagram / Facebook feeds
```

**Visual & Caption Studio (separate workflow):**
```
User uploads social media image
       ↓
AI analyzes actual visual content (subject, attire, colors, mood, composition)
       ↓
3 caption styles generated (Viral & Punchy / Story-Driven / Minimalist)
       ↓
Relevant hashtag pack generated (matched to actual image subject)
       ↓
Live synchronized preview shows image + caption + hashtags
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend health check |
| `POST` | `/api/extract` | Upload PDF or image → returns extracted text + metadata |
| `POST` | `/api/metrics` | Submit text → returns deterministic engagement metrics |
| `POST` | `/api/ai-analyze` | Submit text → returns AI engagement diagnostic |
| `POST` | `/api/improve` | Submit text + platform → returns improved post variations |
| `POST` | `/api/vision-analyze` | Upload image + optional caption → returns visual analysis + AI captions |

---

## Error Handling

- File type validation: rejected immediately with a clear user message
- File size validation: max 25MB, rejected with a size-specific message
- OCR confidence indicator: warns the user when text recognition confidence is below 70%
- All API calls wrapped in try/catch with user-facing error toasts
- AI service failures fall back gracefully to offline heuristics with no service interruption
- Global Express error handler catches unhandled backend errors

---

## Loading States

- `Extracting text and running OCR...` — during file upload processing
- `Analyzing engagement opportunities...` — during AI diagnostic
- `Generating Improved Version...` — during post variation generation
- `Analyzing your image...` / `Generating captions...` — during visual studio analysis
- All buttons disable during their respective loading states

---

## AI Approach

The application uses a two-layer AI strategy:

**Layer 1 — Deterministic Metrics (always available, no API key needed):**
Flesch Reading Ease, Flesch-Kincaid Grade Level, hook power score (opening sentence analysis), CTA detection (keyword pattern matching), sentiment polarity, hashtag/mention counting, and platform character limit checking. These are rule-based and produce instant, consistent results.

**Layer 2 — Gemini AI (when API key is configured):**
Google Gemini 1.5 Flash is used for nuanced engagement analysis, post rewriting, and image-grounded caption generation. If the Gemini API is unavailable or not configured, the system automatically falls back to Layer 1 extended heuristics that cover the same output structure.

No custom machine-learning model was trained. All AI capabilities use the Gemini 1.5 Flash model via Google AI Studio's free tier.

---

## Testing

The backend includes an end-to-end verification script:

```bash
cd server
node test_e2e.js
```

This tests:
1. Backend health endpoint
2. Deterministic metrics calculation
3. Traditional attire image analysis (verifies no generic marketing hallucinations)
4. Uncaptioned photo visual analysis

Manual test scenarios verified:
- PDF upload and text extraction
- Image OCR with confidence reporting
- Metrics dashboard with all 6 metric cards
- AI engagement diagnostic (strengths/weaknesses/suggestions)
- Post improvement generation with platform/tone selection
- Platform feed previews for LinkedIn, X, Instagram, Facebook
- Visual studio with fashion/traditional, food, and nature images
- Light and dark theme toggle

---

## Limitations

- OCR accuracy depends on image quality — very low resolution or handwritten documents may produce poor results
- Gemini AI operates on a free-tier quota — heavy usage may hit rate limits
- Platform previews are visual mockups only; they do not connect to real social networks
- The application does not store or transmit user data beyond the current browser session

---

## License

This project was created as a technical assessment submission. All code is original.
