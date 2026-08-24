import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  Sun,
  Moon,
} from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
}) {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-surface)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '10px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1180px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: '800',
            }}
          >
            S
          </div>
          <span
            style={{
              fontSize: '1.05rem',
              fontWeight: '700',
              letterSpacing: '-0.3px',
              color: 'var(--text-primary)',
            }}
          >
            Social<span style={{ color: 'var(--primary)' }}>Lens</span>
          </span>
        </div>

        {/* Navigation Tabs */}
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
          <button
            onClick={() => setActiveTab('document')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: activeTab === 'document' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'document' ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'document' ? 'var(--shadow-xs)' : 'none',
            }}
          >
            <FileText size={14} />
            <span>Analyze Post</span>
          </button>

          <button
            onClick={() => setActiveTab('vision')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: activeTab === 'vision' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'vision' ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'vision' ? 'var(--shadow-xs)' : 'none',
            }}
          >
            <ImageIcon size={14} />
            <span>Visual Studio</span>
          </button>
        </div>

        {/* Right Tools (Theme Toggle only) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn-icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            style={{ width: '32px', height: '32px' }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}
