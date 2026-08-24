import React, { useState } from 'react';
import {
  Activity,
  Zap,
  BookOpen,
  MousePointerClick,
  Smile,
  Hash,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

export default function MetricsDashboard({ metrics }) {
  const [showExplanation, setShowExplanation] = useState(false);

  if (!metrics || metrics.rawLength === 0) return null;

  const {
    healthScore,
    readability,
    hook,
    callToAction,
    sentiment,
    counts,
    hashtags,
    mentions,
    platformFit,
  } = metrics;

  const getScoreRating = (score) => {
    if (score >= 80) return { label: 'High Potential', color: 'var(--success-text)', bg: 'var(--success-bg)', border: 'var(--success-border)' };
    if (score >= 60) return { label: 'Above Average', color: 'var(--primary-text)', bg: 'var(--primary-light)', border: 'rgba(99, 102, 241, 0.2)' };
    if (score >= 40) return { label: 'Average', color: 'var(--warning-text)', bg: 'var(--warning-bg)', border: 'var(--warning-border)' };
    return { label: 'Needs Improvement', color: 'var(--danger-text)', bg: 'var(--danger-bg)', border: 'var(--danger-border)' };
  };

  const rating = getScoreRating(healthScore);

  return (
    <div className="saas-card" style={{ padding: '22px', marginBottom: '20px' }}>
      {/* Title & Score Summary */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Your Post at a Glance
            </h2>
            <span
              className="badge"
              style={{
                background: rating.bg,
                color: rating.color,
                border: `1px solid ${rating.border}`,
              }}
            >
              {rating.label}
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Objective linguistic & engagement metrics calculated from your text.
          </p>
        </div>

        {/* Engagement Score Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            background: 'var(--bg-subtle)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}
        >
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Engagement Score
          </span>
          <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary)' }}>
            {healthScore}
          </span>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-subtle)' }}>/ 100</span>
        </div>
      </div>

      {/* Expandable Explanation */}
      <div style={{ marginTop: '10px', marginBottom: '14px' }}>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: 0,
          }}
        >
          <Info size={13} />
          <span>How is this score calculated?</span>
          {showExplanation ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {showExplanation && (
          <div
            style={{
              marginTop: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-subtle)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              border: '1px solid var(--border-color)',
            }}
          >
            This score is a deterministic heuristic indicator based on Flesch readability (25%), opening hook strength & brevity (35%), call-to-action presence (25%), and paragraph structure (15%). It reflects structural best practices rather than a guarantee of actual platform reach.
          </div>
        )}
      </div>

      {/* Compact Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
        }}
      >
        <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Words</div>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
            {counts.wordCount}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{counts.readingTimeFormatted}</div>
        </div>

        <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Readability</div>
          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
            {readability.label.split('(')[0].trim()}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Grade {readability.gradeLevel}</div>
        </div>

        <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Hook Power</div>
          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
            {hook.score} / 100
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{hook.tags[0] || 'Standard'}</div>
        </div>

        <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Call to Action</div>
          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: callToAction.found ? 'var(--success-text)' : 'var(--warning-text)', marginTop: '2px' }}>
            {callToAction.found ? 'Present' : 'Missing'}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
            {callToAction.detectedTypes[0] || 'None detected'}
          </div>
        </div>

        <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Tone & Sentiment</div>
          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
            {sentiment.toneCategory.split('&')[0].trim()}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{hashtags.count} hashtags · {mentions.count} @</div>
        </div>

        <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Platform Fit</div>
          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
            {platformFit.twitter.isWithinLimit ? 'Fits X' : 'Thread'} · {counts.charactersWithSpaces <= 1600 ? 'LinkedIn' : 'Long'}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{counts.charactersWithSpaces} chars total</div>
        </div>
      </div>
    </div>
  );
}
