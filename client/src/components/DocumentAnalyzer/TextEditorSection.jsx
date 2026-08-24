import React from 'react';
import {
  Copy,
  Trash2,
  Sparkles,
  AlignLeft,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function TextEditorSection({
  text,
  setText,
  onAnalyzeAI,
  isAnalyzingAI,
  fileMetadata,
  showToast,
}) {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    showToast({
      type: 'success',
      message: 'Post text copied to clipboard.',
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCleanWhitespace = () => {
    if (!text) return;
    const cleaned = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line, i, arr) => line !== '' || (arr[i - 1] !== '' && i > 0))
      .join('\n');
    setText(cleaned);
    showToast({
      type: 'info',
      message: 'Whitespace formatted and cleaned.',
    });
  };

  const handleClear = () => {
    setText('');
    showToast({
      type: 'info',
      message: 'Text editor cleared.',
    });
  };

  const charCount = text.length;
  const wordCount = (text.match(/[\p{L}\p{N}'-]+/gu) || []).length;
  const sentencesCount = text
    ? text.split(/(?<=[.?!])\s+|\n+/).filter((s) => s.trim().length > 0).length
    : 0;

  const isLowOcr = fileMetadata?.confidence && fileMetadata.confidence < 70;

  return (
    <div className="saas-card" style={{ padding: '22px', marginBottom: '20px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Extracted Post
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Review or edit your text before analysis.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            className="btn-secondary"
            onClick={handleCleanWhitespace}
            title="Clean redundant blank lines"
            style={{ fontSize: '0.78rem', padding: '5px 10px' }}
          >
            <AlignLeft size={13} />
            <span>Format</span>
          </button>

          <button
            className="btn-secondary"
            onClick={handleCopy}
            disabled={!text.trim()}
            style={{ fontSize: '0.78rem', padding: '5px 10px' }}
          >
            {isCopied ? <Check size={13} style={{ color: 'var(--success-text)' }} /> : <Copy size={13} />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            className="btn-ghost"
            onClick={handleClear}
            disabled={!text.trim()}
            style={{ fontSize: '0.78rem', padding: '5px 8px' }}
            title="Clear text area"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Low OCR Warning if applicable */}
      {isLowOcr && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--warning-bg)',
            color: 'var(--warning-text)',
            border: '1px solid var(--warning-border)',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '10px',
          }}
        >
          <AlertCircle size={14} />
          <span>OCR confidence is {fileMetadata.confidence}%. Some text may need manual verification.</span>
        </div>
      )}

      {/* Editor Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Extracted text will appear here. You can also paste or type your draft post directly..."
        rows={7}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-input)',
          color: 'var(--text-primary)',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          fontFamily: 'var(--font-sans)',
          resize: 'vertical',
          outline: 'none',
          transition: 'border-color 0.15s ease',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
      />

      {/* Footer Meta & Primary Analyze Action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '10px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {/* Clean Meta Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>
            <strong style={{ color: 'var(--text-primary)' }}>{charCount.toLocaleString()}</strong> chars
          </span>
          <span>·</span>
          <span>
            <strong style={{ color: 'var(--text-primary)' }}>{wordCount.toLocaleString()}</strong> words
          </span>
          <span>·</span>
          <span>
            <strong style={{ color: 'var(--text-primary)' }}>{sentencesCount}</strong> sentences
          </span>
          {fileMetadata?.confidence && (
            <>
              <span>·</span>
              <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                {fileMetadata.confidence}% OCR
              </span>
            </>
          )}
        </div>

        {/* Primary Action */}
        <button
          className="btn-primary"
          onClick={onAnalyzeAI}
          disabled={!text.trim() || isAnalyzingAI}
          style={{
            opacity: !text.trim() ? 0.5 : 1,
            cursor: !text.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {isAnalyzingAI ? (
            <>
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Analyzing Post...</span>
            </>
          ) : (
            <>
              <Sparkles size={14} />
              <span>Analyze Post</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
