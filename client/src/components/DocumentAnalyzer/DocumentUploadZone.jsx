import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  X,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_POSTS } from '../../utils/sampleData';

export default function DocumentUploadZone({
  onExtractSuccess,
  onSelectSample,
  isExtracting,
  fileMetadata,
  onRemoveFile,
  showToast,
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    const validExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'webp'];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!validExtensions.includes(extension)) {
      showToast({
        type: 'error',
        message: `Unsupported file (.${extension}). Please upload a PDF, PNG, JPG, or WebP.`,
      });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      showToast({
        type: 'error',
        message: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Max limit is 25MB.`,
      });
      return;
    }

    onExtractSuccess(file);
  };

  return (
    <div className="saas-card" style={{ padding: '22px', marginBottom: '20px' }}>
      {/* Header Info */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
          Analyze your social-media post
        </h1>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Upload a PDF or image and we'll extract the content, calculate objective metrics, and optimize engagement.
        </p>
      </div>

      {/* Upload Box (or Uploaded File Row if file exists) */}
      {!fileMetadata ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `1.5px dashed ${isDragOver ? 'var(--primary)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '28px 16px',
            textAlign: 'center',
            backgroundColor: isDragOver ? 'var(--primary-light)' : 'var(--bg-subtle)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {isExtracting ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <Loader2 size={24} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                Extracting text and running OCR...
              </p>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Parsing characters and structure
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  boxShadow: 'var(--shadow-xs)',
                  marginBottom: '4px',
                }}
              >
                <UploadCloud size={20} />
              </div>

              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                <span style={{ fontWeight: '600' }}>Drop your file here</span>, or{' '}
                <span style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline' }}>
                  browse files
                </span>
              </div>

              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                PDF · PNG · JPG · JPEG · Max 25 MB
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Compact File Row when uploaded */
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={18} style={{ color: 'var(--success-text)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                {fileMetadata.fileName}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {fileMetadata.extractionType} · {(fileMetadata.fileSize / 1024).toFixed(1)} KB
                {fileMetadata.confidence ? ` · ${fileMetadata.confidence}% OCR confidence` : ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn-ghost"
              onClick={() => fileInputRef.current?.click()}
              style={{ fontSize: '0.78rem' }}
            >
              Replace
            </button>
            <button
              className="btn-ghost"
              onClick={onRemoveFile}
              style={{ fontSize: '0.78rem', color: 'var(--danger-text)' }}
            >
              <X size={14} /> Remove
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>
      )}

      {/* Instant Presets */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '14px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', fontWeight: '600' }}>
          ⚡ Or try a sample:
        </span>
        {SAMPLE_POSTS.map((sample) => (
          <button
            key={sample.id}
            onClick={() => onSelectSample(sample)}
            style={{
              fontSize: '0.74rem',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            {sample.title}
          </button>
        ))}
      </div>
    </div>
  );
}
