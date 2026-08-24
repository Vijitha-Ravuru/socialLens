import React, { useState } from 'react';
import {
  Wand2,
  Copy,
  Check,
  ArrowRight,
  RotateCw,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function PostTransformer({
  variations,
  onGenerateVariations,
  isGenerating,
  onApplyToEditor,
  showToast,
}) {
  const [activeTab, setActiveTab] = useState('viralHook');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [copiedKey, setCopiedKey] = useState(null);

  const platforms = [
    { id: 'all', label: 'All Platforms' },
    { id: 'LinkedIn', label: 'LinkedIn' },
    { id: 'Instagram', label: 'Instagram' },
    { id: 'X', label: 'X / Twitter' },
    { id: 'Facebook', label: 'Facebook' },
  ];

  const tones = ['Professional', 'Friendly', 'Educational', 'Casual', 'Exciting'];

  const tabs = [
    { id: 'viralHook', label: 'Viral & Punchy' },
    { id: 'thoughtLeader', label: 'LinkedIn Authority' },
    { id: 'casualRelatable', label: 'Casual & Relatable' },
    { id: 'bulletThread', label: 'Bullet Thread' },
    { id: 'hookAlternatives', label: 'Alternative Hooks' },
  ];

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast({
      type: 'success',
      message: 'Improved post copied to clipboard.',
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApply = (text) => {
    if (!text) return;
    onApplyToEditor(text);
    showToast({
      type: 'success',
      message: 'Applied improved version to editor.',
    });
  };

  const handleGenerateClick = () => {
    onGenerateVariations({ platform: selectedPlatform, tone: selectedTone });
  };

  return (
    <div className="saas-card" style={{ padding: '22px', marginBottom: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          Improve My Post
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Turn your current draft into a stronger version with punchier hooks and clear formatting while keeping your original meaning.
        </p>
      </div>

      {/* Filter Controls: Platform & Tone */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-color)',
          marginBottom: '16px',
        }}
      >
        {/* Platform Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', minWidth: '60px' }}>
            Platform:
          </span>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                style={{
                  fontSize: '0.76rem',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: selectedPlatform === p.id ? 'var(--primary)' : 'var(--border-color)',
                  background: selectedPlatform === p.id ? 'var(--primary-light)' : 'var(--bg-surface)',
                  color: selectedPlatform === p.id ? 'var(--primary-text)' : 'var(--text-secondary)',
                  fontWeight: selectedPlatform === p.id ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', minWidth: '60px' }}>
            Tone:
          </span>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {tones.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTone(t)}
                style={{
                  fontSize: '0.76rem',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: selectedTone === t ? 'var(--primary)' : 'var(--border-color)',
                  background: selectedTone === t ? 'var(--primary-light)' : 'var(--bg-surface)',
                  color: selectedTone === t ? 'var(--primary-text)' : 'var(--text-secondary)',
                  fontWeight: selectedTone === t ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
          <button
            className="btn-primary"
            onClick={handleGenerateClick}
            disabled={isGenerating}
            style={{ fontSize: '0.84rem', padding: '7px 16px' }}
          >
            {isGenerating ? (
              <>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Generating Improved Version...</span>
              </>
            ) : (
              <>
                <Wand2 size={14} />
                <span>{variations ? 'Regenerate with Selected Tone' : 'Generate Improved Post'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Result Container */}
      {variations && (
        <div style={{ marginTop: '16px' }}>
          {/* Format Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '8px',
              marginBottom: '12px',
              overflowX: 'auto',
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontSize: '0.8rem',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--primary-text)' : 'var(--text-muted)',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'hookAlternatives' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Array.isArray(variations.hookAlternatives) &&
                variations.hookAlternatives.map((h, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <span className="badge badge-indigo" style={{ fontSize: '0.68rem', marginBottom: '2px' }}>
                        {h.type || `Option ${idx + 1}`}
                      </span>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: '600', margin: '4px 0 0' }}>
                        "{h.hook}"
                      </p>
                    </div>
                    <button
                      className="btn-secondary"
                      onClick={() => handleCopy(h.hook, `hook-${idx}`)}
                      style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                    >
                      {copiedKey === `hook-${idx}` ? <Check size={12} style={{ color: 'var(--success-text)' }} /> : <Copy size={12} />}
                      <span>{copiedKey === `hook-${idx}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div>
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  minHeight: '110px',
                  marginBottom: '12px',
                }}
              >
                {variations[activeTab] || 'Variant content ready.'}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  onClick={() => handleCopy(variations[activeTab], activeTab)}
                  disabled={!variations[activeTab]}
                >
                  {copiedKey === activeTab ? <Check size={13} style={{ color: 'var(--success-text)' }} /> : <Copy size={13} />}
                  <span>{copiedKey === activeTab ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  className="btn-primary"
                  onClick={() => handleApply(variations[activeTab])}
                  disabled={!variations[activeTab]}
                >
                  <ArrowRight size={13} />
                  <span>Use this version</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
