import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Toast from './components/Toast';
import DocumentUploadZone from './components/DocumentAnalyzer/DocumentUploadZone';
import TextEditorSection from './components/DocumentAnalyzer/TextEditorSection';
import MetricsDashboard from './components/DocumentAnalyzer/MetricsDashboard';
import AIReportSection from './components/DocumentAnalyzer/AIReportSection';
import PostTransformer from './components/DocumentAnalyzer/PostTransformer';
import PlatformPreviews from './components/DocumentAnalyzer/PlatformPreviews';
import VisualAndCaptionStudio from './components/VisualStudio/VisualAndCaptionStudio';
import {
  uploadAndExtractFile,
  calculateMetrics,
  runAIEngagementAnalysis,
  generatePostVariations,
} from './utils/api';
import { SAMPLE_POSTS } from './utils/sampleData';

export default function App() {
  // App-level state
  const [activeTab, setActiveTab] = useState('document'); // 'document' | 'vision'
  const [theme, setTheme] = useState('light');
  const [toast, setToast] = useState(null);

  // Document Analyzer state
  const [text, setText] = useState('');
  const [fileMetadata, setFileMetadata] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [variations, setVariations] = useState(null);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);

  // Theme sync
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (toastData) => {
    setToast(toastData);
  };

  // Recalculate deterministic metrics on text change (debounced)
  useEffect(() => {
    if (!text.trim()) {
      setMetrics(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const result = await calculateMetrics(text);
        setMetrics(result);
      } catch (err) {
        console.error('Error calculating metrics:', err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [text]);

  // File upload & OCR handler
  const handleExtractFile = async (file) => {
    setIsExtracting(true);
    try {
      const data = await uploadAndExtractFile(file);
      setText(data.text);
      setFileMetadata(data.metadata);

      showToast({
        type: 'success',
        message: `Extracted content from ${data.metadata.fileName}.`,
      });

      // Auto-trigger AI Engagement analysis for seamless user flow
      triggerAIAnalysis(data.text);
    } catch (error) {
      showToast({
        type: 'error',
        message: error.message || 'Extraction failed. Please check the file.',
      });
    } finally {
      setIsExtracting(false);
    }
  };

  // Remove uploaded file
  const handleRemoveFile = () => {
    setFileMetadata(null);
    setText('');
    setMetrics(null);
    setAiAnalysis(null);
    setVariations(null);
    showToast({
      type: 'info',
      message: 'File removed.',
    });
  };

  // Sample preset selection
  const handleSelectSample = (sample) => {
    setText(sample.text);
    setFileMetadata({
      fileName: `${sample.id}.pdf`,
      fileSize: 14200,
      fileType: 'Sample Preset',
      extractionType: 'Digital PDF Extraction',
      confidence: 100,
      durationMs: 38,
    });
    showToast({
      type: 'info',
      message: `Loaded "${sample.title}"`,
    });
    triggerAIAnalysis(sample.text);
  };

  // Run AI Engagement Diagnostic
  const triggerAIAnalysis = async (contentToAnalyze) => {
    const postText = contentToAnalyze || text;
    if (!postText || !postText.trim()) return;

    setIsAnalyzingAI(true);
    try {
      const analysis = await runAIEngagementAnalysis(postText);
      setAiAnalysis(analysis);
    } catch (error) {
      showToast({
        type: 'error',
        message: error.message || 'AI analysis failed.',
      });
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // Generate Post Variations (with platform & tone context)
  const handleGenerateVariations = async (options = {}) => {
    if (!text.trim()) {
      showToast({
        type: 'error',
        message: 'Please provide post text first.',
      });
      return;
    }

    setIsGeneratingVariations(true);
    try {
      const platformParam = options.platform ? `${options.platform} (Tone: ${options.tone || 'Professional'})` : 'all';
      const res = await generatePostVariations(text, platformParam);
      setVariations(res);
      showToast({
        type: 'success',
        message: 'Generated improved post variations.',
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: error.message || 'Failed to generate variations.',
      });
    } finally {
      setIsGeneratingVariations(false);
    }
  };

  // Apply variation back to main editor
  const handleApplyToEditor = (newText) => {
    setText(newText);
    triggerAIAnalysis(newText);
  };

  // Apply single suggestion to editor
  const handleApplySuggestion = (suggestionTip) => {
    if (!suggestionTip) return;
    const updated = `${text.trim()}\n\n# Tip Applied: ${suggestionTip}`;
    setText(updated);
    showToast({
      type: 'success',
      message: 'Suggestion applied to post.',
    });
  };

  // Determine current active step for the progress bar
  const hasText = text && text.trim().length > 0;
  const hasAnalysis = Boolean(aiAnalysis || metrics);
  const hasVariations = Boolean(variations);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Container */}
      <main style={{ flex: 1, padding: '24px 16px', maxWidth: '880px', margin: '0 auto', width: '100%' }}>
        {activeTab === 'document' ? (
          <div>
            {/* Step Progress Bar (Breadcrumb) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                padding: '8px 12px',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                overflowX: 'auto',
                gap: '8px',
              }}
            >
              <div className={`step-item ${!hasText ? 'active' : 'completed'}`}>
                <span className="step-circle">{hasText ? '✓' : '1'}</span>
                <span>Upload</span>
              </div>
              <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>→</span>

              <div className={`step-item ${hasText && !hasAnalysis ? 'active' : hasAnalysis ? 'completed' : ''}`}>
                <span className="step-circle">{hasAnalysis ? '✓' : '2'}</span>
                <span>Review</span>
              </div>
              <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>→</span>

              <div className={`step-item ${hasAnalysis ? 'active' : ''}`}>
                <span className="step-circle">{hasAnalysis ? '✓' : '3'}</span>
                <span>Analyze</span>
              </div>
              <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>→</span>

              <div className={`step-item ${hasVariations ? 'active' : ''}`}>
                <span className="step-circle">{hasVariations ? '✓' : '4'}</span>
                <span>Improve</span>
              </div>
              <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>→</span>

              <div className={`step-item ${hasText ? 'completed' : ''}`}>
                <span className="step-circle">5</span>
                <span>Preview</span>
              </div>
            </div>

            {/* 1. Upload */}
            <DocumentUploadZone
              onExtractSuccess={handleExtractFile}
              onSelectSample={handleSelectSample}
              isExtracting={isExtracting}
              fileMetadata={fileMetadata}
              onRemoveFile={handleRemoveFile}
              showToast={showToast}
            />

            {/* 2. Review (Extracted Text Editor) */}
            <TextEditorSection
              text={text}
              setText={setText}
              onAnalyzeAI={() => triggerAIAnalysis(text)}
              isAnalyzingAI={isAnalyzingAI}
              fileMetadata={fileMetadata}
              showToast={showToast}
            />

            {/* Progressive Disclosure: Only show metrics, AI, improve, preview when text exists */}
            {hasText && (
              <>
                {/* 3. Analyze: Post at a Glance */}
                <MetricsDashboard metrics={metrics} />

                {/* 4. Strengths & Opportunities */}
                <AIReportSection
                  aiAnalysis={aiAnalysis}
                  isAnalyzingAI={isAnalyzingAI}
                  onApplySuggestion={handleApplySuggestion}
                />

                {/* 5. Improve My Post */}
                <PostTransformer
                  variations={variations}
                  onGenerateVariations={handleGenerateVariations}
                  isGenerating={isGeneratingVariations}
                  onApplyToEditor={handleApplyToEditor}
                  showToast={showToast}
                />

                {/* 6. Platform Preview */}
                <PlatformPreviews text={text} />
              </>
            )}
          </div>
        ) : (
          /* Mode 2: Visual & Caption Studio */
          <VisualAndCaptionStudio showToast={showToast} />
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '16px 20px',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <span>
            <strong>SocialLens</strong> · Social Media Content & Visual Analyzer
          </span>
          <span>
            Modular OCR, Deterministic Linguistics & Gemini AI
          </span>
        </div>
      </footer>

      {/* Global Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
