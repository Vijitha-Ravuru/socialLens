import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Sparkles,
  Palette,
  Check,
  Copy,
  Loader2,
  Hash,
  X,
  RotateCw,
  AlertCircle,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
} from 'lucide-react';
import { analyzeImageAndCaption } from '../../utils/api';

export default function VisualAndCaptionStudio({ showToast }) {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatusText, setAnalysisStatusText] = useState('');
  const [visionResult, setVisionResult] = useState(null);
  const [activeCaptionTab, setActiveCaptionTab] = useState(0);
  const [copiedKey, setCopiedKey] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  // Handle fresh image selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast({
          type: 'error',
          message: 'Please upload a valid image file (PNG, JPG, JPEG, WebP).',
        });
        return;
      }
      resetAndLoadImage(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      resetAndLoadImage(file);
    }
  };

  // Fresh reset when a new image is loaded
  const resetAndLoadImage = (file) => {
    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setImagePreviewUrl(url);

    // Reset previous image outputs to prevent stale caption data
    setVisionResult(null);
    setAnalysisError(null);
    setCopiedKey(null);
    setActiveCaptionTab(0);
  };

  // Remove current image
  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
    setImagePreviewUrl(null);
    setVisionResult(null);
    setAnalysisError(null);
    setCopiedKey(null);
    setCaption('');
  };

  // Run image analysis
  const handleRunAnalysis = async () => {
    if (!selectedImage) {
      showToast({
        type: 'error',
        message: 'Please upload an image first.',
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisStatusText('Analyzing your image visual details...');

    const timer = setTimeout(() => {
      setAnalysisStatusText('Generating grounded captions & hashtags...');
    }, 1200);

    try {
      const res = await analyzeImageAndCaption(selectedImage, caption);
      setVisionResult(res.visionAnalysis);
      setActiveCaptionTab(0);
      showToast({
        type: 'success',
        message: 'Your captions are ready.',
      });
    } catch (err) {
      console.error('Visual analysis error:', err);
      setAnalysisError('Couldn’t analyze this image. Please try again.');
      showToast({
        type: 'error',
        message: 'Couldn’t analyze this image. Please try again.',
      });
    } finally {
      clearTimeout(timer);
      setIsAnalyzing(false);
      setAnalysisStatusText('');
    }
  };

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast({
      type: 'success',
      message: 'Copied to clipboard.',
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyAllHashtags = () => {
    if (!visionResult?.recommendedHashtags) return;
    const tagString = visionResult.recommendedHashtags.join(' ');
    handleCopy(tagString, 'hashtags');
  };

  // Active caption text
  const currentCaptionObj = visionResult?.recommendedCaptions?.[activeCaptionTab];
  const currentCaptionText = currentCaptionObj?.caption || '';
  const currentHashtagsText = visionResult?.recommendedHashtags?.join(' ') || '';

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '30px' }}>
      {/* Studio Header */}
      <div className="saas-card" style={{ padding: '22px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          Visual & Caption Studio
        </h1>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Upload an image to analyze the true subject, styling, and atmosphere, and generate authentic social media captions.
        </p>
      </div>

      {/* 1. Upload & Caption Input */}
      <div className="saas-card" style={{ padding: '22px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
          1. Upload Social Media Image
        </h2>

        {/* Drop Area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '1.5px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            minHeight: '180px',
            backgroundColor: 'var(--bg-subtle)',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            marginBottom: '14px',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          {imagePreviewUrl ? (
            <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={imagePreviewUrl}
                alt="Uploaded"
                style={{ maxHeight: '240px', maxWidth: '100%', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
              />
              <button
                onClick={handleRemoveImage}
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <UploadCloud size={24} style={{ color: 'var(--primary)', margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.86rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                Drop your image here, or browse
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                JPG, PNG, WebP up to 25MB
              </div>
            </div>
          )}
        </div>

        {/* Optional Caption Input */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Accompanying Caption or Context <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add context if helpful (e.g. 'Diwali celebration with family' or 'Wearing my favorite saree')..."
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontSize: '0.84rem',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Action Button & Loading Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <button
            className="btn-primary"
            onClick={handleRunAnalysis}
            disabled={!selectedImage || isAnalyzing}
            style={{
              opacity: !selectedImage ? 0.5 : 1,
              cursor: !selectedImage ? 'not-allowed' : 'pointer',
            }}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                <span>{analysisStatusText || 'Analyzing image...'}</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>{visionResult ? 'Regenerate Captions' : 'Analyze Picture & Generate Captions'}</span>
              </>
            )}
          </button>

          {analysisError && (
            <span style={{ fontSize: '0.78rem', color: 'var(--danger-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={14} /> {analysisError}
            </span>
          )}
        </div>
      </div>

      {/* 2. Visual Analysis & Generated Captions (Only shown when analysis is ready) */}
      {visionResult && (
        <>
          {/* Image Analysis Breakdown */}
          <div className="saas-card" style={{ padding: '22px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
              2. Visual Analysis
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Visual Quality</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)', marginTop: '2px' }}>
                  {visionResult.visualScore} <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>/ 100</span>
                </div>
                <span className="badge badge-indigo" style={{ fontSize: '0.66rem', marginTop: '2px' }}>
                  {visionResult.aestheticRating || 'Engaging'}
                </span>
              </div>

              {visionResult.visualElements?.focalPoint && (
                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Detected Subject</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: '600', marginTop: '4px', lineHeight: 1.4 }}>
                    {visionResult.visualElements.focalPoint}
                  </div>
                </div>
              )}
            </div>

            {visionResult.visualElements?.colorPaletteMood && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <strong>Atmosphere & Colors: </strong>{visionResult.visualElements.colorPaletteMood}
              </div>
            )}
          </div>

          {/* 3. Captions, Hashtags & Synchronized Live Preview */}
          <div className="saas-card" style={{ padding: '22px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
              3. AI-Generated Captions & Preview
            </h2>

            {/* Style Selector Tabs */}
            <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '14px', overflowX: 'auto' }}>
              {visionResult.recommendedCaptions.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCaptionTab(idx)}
                  style={{
                    fontSize: '0.8rem',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: activeCaptionTab === idx ? 'var(--primary-light)' : 'transparent',
                    color: activeCaptionTab === idx ? 'var(--primary-text)' : 'var(--text-muted)',
                    fontWeight: activeCaptionTab === idx ? '600' : '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                  }}
                >
                  {c.style}
                </button>
              ))}
            </div>

            {/* 2-Column: Caption & Hashtags Left, Synchronized Live Preview Right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Left: Caption Text & Actions */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Caption ({currentCaptionObj?.style}):
                </div>
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.86rem',
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                    minHeight: '80px',
                    marginBottom: '10px',
                  }}
                >
                  {currentCaptionText}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '14px' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => handleCopy(currentCaptionText, `caption-${activeCaptionTab}`)}
                  >
                    {copiedKey === `caption-${activeCaptionTab}` ? <Check size={13} style={{ color: 'var(--success-text)' }} /> : <Copy size={13} />}
                    <span>{copiedKey === `caption-${activeCaptionTab}` ? 'Copied!' : 'Copy Caption'}</span>
                  </button>
                </div>

                {/* Hashtag Pack */}
                {visionResult.recommendedHashtags && (
                  <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Hash size={13} style={{ color: 'var(--primary)' }} />
                        Relevant Hashtags
                      </span>
                      <button
                        className="btn-ghost"
                        onClick={copyAllHashtags}
                        style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                      >
                        {copiedKey === 'hashtags' ? 'Copied' : 'Copy All'}
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {visionResult.recommendedHashtags.map((tag, idx) => (
                        <span key={idx} className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Synchronized Live Social Preview */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '320px',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Mockup Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)' }} />
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)' }}>your_post</div>
                  </div>

                  {/* Synchronized Uploaded Image */}
                  {imagePreviewUrl && (
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                    />
                  )}

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Heart size={14} style={{ color: 'var(--danger-text)' }} />
                      <MessageCircle size={14} />
                      <Send size={14} />
                    </div>
                    <Bookmark size={14} />
                  </div>

                  {/* Synchronized Caption & Hashtags */}
                  <div style={{ padding: '4px 10px 10px', fontSize: '0.76rem', lineHeight: 1.4, color: 'var(--text-primary)' }}>
                    <strong>your_post</strong> {currentCaptionText}
                    {currentHashtagsText && (
                      <div style={{ color: 'var(--primary-text)', marginTop: '4px', fontSize: '0.72rem' }}>
                        {currentHashtagsText}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
