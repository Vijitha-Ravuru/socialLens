import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Users,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function AIReportSection({
  aiAnalysis,
  isAnalyzingAI,
  onApplySuggestion,
}) {
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  if (isAnalyzingAI) {
    return (
      <div className="saas-card" style={{ padding: '24px', marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={22} style={{ color: 'var(--primary)', animation: 'spin 2s linear infinite' }} />
          <h3 style={{ fontSize: '0.96rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Analyzing engagement opportunities...
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Evaluating retention psychology, clarity, and platform dynamics.
          </p>
        </div>
      </div>
    );
  }

  if (!aiAnalysis) return null;

  const {
    strengths = [],
    weaknesses = [],
    actionableSuggestions = [],
    audiencePersona = '',
    bestTimeToPost = '',
  } = aiAnalysis;

  const visibleSuggestions = showAllSuggestions
    ? actionableSuggestions
    : actionableSuggestions.slice(0, 3);

  return (
    <div className="saas-card" style={{ padding: '22px', marginBottom: '20px' }}>
      {/* Section Header */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          Strengths & Improvement Opportunities
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Key highlights and prioritized actions to increase readership and engagement.
        </p>
      </div>

      {/* 2-Column: What's Working vs What Could Improve */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
          marginBottom: '18px',
        }}
      >
        {/* Strengths */}
        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--success-text)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <CheckCircle2 size={15} />
            <span>What's Working</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', margin: 0, padding: 0 }}>
            {strengths.map((item, idx) => (
              <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.4 }}>
                <span style={{ color: 'var(--success-text)', marginTop: '1px' }}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What Could Improve */}
        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--warning-text)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <AlertCircle size={15} />
            <span>What Could Improve</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', margin: 0, padding: 0 }}>
            {weaknesses.map((item, idx) => (
              <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.4 }}>
                <span style={{ color: 'var(--warning-text)', marginTop: '1px' }}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Opportunities */}
      {actionableSuggestions.length > 0 && (
        <div style={{ marginTop: '14px' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={15} style={{ color: 'var(--primary)' }} />
            <span>Actionable Recommendations</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {visibleSuggestions.map((sug, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>
                      {sug.category || 'Tip'}
                    </span>
                    {sug.impact === 'High' && (
                      <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                        High Impact
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                    {sug.tip}
                  </p>
                </div>

                {onApplySuggestion && (
                  <button
                    className="btn-secondary"
                    onClick={() => onApplySuggestion(sug.tip)}
                    style={{ fontSize: '0.74rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
                  >
                    <span>Apply tip</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {actionableSuggestions.length > 3 && (
            <button
              className="btn-ghost"
              onClick={() => setShowAllSuggestions(!showAllSuggestions)}
              style={{ fontSize: '0.78rem', marginTop: '8px', padding: '4px 8px' }}
            >
              {showAllSuggestions ? (
                <>
                  <span>Show top 3 only</span> <ChevronUp size={13} />
                </>
              ) : (
                <>
                  <span>See all {actionableSuggestions.length} recommendations</span> <ChevronDown size={13} />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Target Audience & Best Time Footer */}
      {(audiencePersona || bestTimeToPost) && (
        <div
          style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          {audiencePersona && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={14} style={{ color: 'var(--primary)' }} />
              <span>
                <strong>Audience:</strong> {audiencePersona}
              </span>
            </div>
          )}
          {bestTimeToPost && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} style={{ color: 'var(--primary)' }} />
              <span>
                <strong>Best Time:</strong> {bestTimeToPost}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
