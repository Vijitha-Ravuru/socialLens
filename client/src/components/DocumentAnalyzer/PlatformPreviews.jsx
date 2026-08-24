import React, { useState } from 'react';
import {
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Heart,
  MessageSquare,
  Repeat,
  Send,
  ThumbsUp,
  Share2,
  Bookmark,
  BadgeCheck,
  MoreHorizontal,
} from 'lucide-react';

export default function PlatformPreviews({ text }) {
  const [platform, setPlatform] = useState('linkedin');

  if (!text || !text.trim()) return null;

  const platforms = [
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { id: 'twitter', label: 'X (Twitter)', icon: Twitter },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'facebook', label: 'Facebook', icon: Facebook },
  ];

  return (
    <div className="saas-card" style={{ padding: '22px', marginBottom: '20px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Platform Preview
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Preview how your formatted post renders in native social feeds.
          </p>
        </div>

        {/* Platform Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-subtle)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            gap: '2px',
          }}
        >
          {platforms.map((p) => {
            const Icon = p.icon;
            const isActive = platform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: isActive ? 'var(--bg-surface)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={13} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Mockup */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        {platform === 'linkedin' && <LinkedInMockup text={text} />}
        {platform === 'twitter' && <TwitterMockup text={text} />}
        {platform === 'instagram' && <InstagramMockup text={text} />}
        {platform === 'facebook' && <FacebookMockup text={text} />}
      </div>
    </div>
  );
}

function LinkedInMockup({ text }) {
  const [showFull, setShowFull] = useState(false);
  const isLong = text.length > 200;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '520px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        padding: '14px',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.85rem',
            }}
          >
            SL
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', fontSize: '0.86rem' }}>
              Alex Rivera <BadgeCheck size={13} style={{ color: '#0a66c2' }} />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Growth Strategist · 1st
            </div>
          </div>
        </div>
        <MoreHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
      </div>

      {/* Body */}
      <div style={{ fontSize: '0.84rem', lineHeight: 1.5, whiteSpace: 'pre-wrap', color: 'var(--text-primary)', marginBottom: '12px' }}>
        {isLong && !showFull ? (
          <>
            {text.slice(0, 180)}...{' '}
            <button
              onClick={() => setShowFull(true)}
              style={{ background: 'none', border: 'none', color: '#0a66c2', fontWeight: '600', cursor: 'pointer', padding: 0, fontSize: '0.84rem' }}
            >
              ...see more
            </button>
          </>
        ) : (
          text
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '8px',
          fontSize: '0.76rem',
          fontWeight: '600',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <ThumbsUp size={14} /> Like
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <MessageSquare size={14} /> Comment
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <Repeat size={14} /> Repost
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <Send size={14} /> Send
        </span>
      </div>
    </div>
  );
}

function TwitterMockup({ text }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '500px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        padding: '14px',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--text-primary)',
      }}
    >
      <div style={{ display: 'flex', gap: '10px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#1d9bf0',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.85rem',
            flexShrink: 0,
          }}
        >
          SL
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem' }}>
            <strong>Alex Rivera</strong>
            <BadgeCheck size={13} style={{ color: '#1d9bf0' }} />
            <span style={{ color: 'var(--text-muted)' }}>@alex_lens · 1h</span>
          </div>

          <div style={{ fontSize: '0.85rem', lineHeight: 1.5, whiteSpace: 'pre-wrap', marginTop: '4px', marginBottom: '10px' }}>
            {text}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.76rem', maxWidth: '360px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MessageSquare size={13} /> 24
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Repeat size={13} /> 82
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Heart size={13} /> 340
            </span>
            <Bookmark size={13} />
            <Share2 size={13} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InstagramMockup({ text }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)' }} />
        <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>sociallens.ai</div>
      </div>

      {/* Graphic Placeholder */}
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          background: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          color: 'var(--primary-text)',
          fontWeight: '700',
          fontSize: '0.9rem',
          textAlign: 'center',
        }}
      >
        {text.slice(0, 60)}...
      </div>

      {/* Caption */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: '0.8rem', lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
          <strong>sociallens.ai</strong> {text}
        </div>
      </div>
    </div>
  );
}

function FacebookMockup({ text }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '500px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        padding: '14px',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--text-primary)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: '#1877f2',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.85rem',
          }}
        >
          f
        </div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '0.84rem' }}>Alex Rivera</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Just now · 🌐</div>
        </div>
      </div>

      <div style={{ fontSize: '0.84rem', lineHeight: 1.5, whiteSpace: 'pre-wrap', marginBottom: '10px' }}>
        {text}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '8px',
          fontSize: '0.76rem',
          fontWeight: '600',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <ThumbsUp size={14} /> Like
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <MessageSquare size={14} /> Comment
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <Share2 size={14} /> Share
        </span>
      </div>
    </div>
  );
}
