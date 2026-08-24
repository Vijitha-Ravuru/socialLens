/**
 * Deterministic Content Metrics Service
 * Calculates objective readability, hook strength, CTA presence, sentiment, and platform fit.
 */

/**
 * Calculates syllable count for a word using English linguistic heuristics
 * @param {string} word 
 * @returns {number}
 */
function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;

  // Replace common silent endings
  const clean = w
    .replace(/(?:[^laeiouy]|ed|es|e)$/, '')
    .replace(/^y/, '');

  const matches = clean.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

/**
 * Calculates total syllables in text
 * @param {string[]} words 
 * @returns {number}
 */
function getTotalSyllables(words) {
  return words.reduce((sum, word) => sum + countSyllables(word), 0);
}

/**
 * Sentiment word banks for deterministic polarity analysis
 */
const POSITIVE_WORDS = new Set([
  'great', 'awesome', 'excellent', 'amazing', 'proven', 'boost', 'growth', 'win',
  'winning', 'success', 'successful', 'love', 'happy', 'best', 'valuable', 'insight',
  'transform', 'inspire', 'breakthrough', 'easy', 'effective', 'strategy', 'master',
  'secret', 'scale', 'opportunity', 'thrive', 'accelerate', 'power', 'powerful',
  'solution', 'revolution', 'smart', 'supercharge', 'high-converting', 'impact'
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'worst', 'fail', 'failure', 'mistake', 'avoid', 'trap',
  'stop', 'waste', 'lose', 'losing', 'ruin', 'poor', 'hard', 'struggle',
  'pain', 'frustrating', 'problem', 'risk', 'danger', 'burnout', 'scam', 'fatal'
]);

const URGENCY_WORDS = new Set([
  'now', 'today', 'immediately', 'urgent', 'limited', 'stop', 'warning',
  'critical', 'deadline', 'before', 'never', 'must', 'essential', 'don\'t wait'
]);

const CTA_PATTERNS = [
  { pattern: /\b(?:link\s+in\s+bio|check\s+(?:the\s+)?link|click\s+(?:the\s+)?link|bio\s+link)\b/i, type: 'Link Click' },
  { pattern: /\b(?:comment\s+below|drop\s+a\s+comment|leave\s+a\s+comment|tell\s+me\s+in\s+the\s+comments|what\s+do\s+you\s+think)\b/i, type: 'Comment / Engagement' },
  { pattern: /\b(?:share\s+this|repost\s+this|spread\s+the\s+word|retweet)\b/i, type: 'Share / Repost' },
  { pattern: /\b(?:save\s+this|bookmark\s+this|save\s+for\s+later)\b/i, type: 'Save / Bookmark' },
  { pattern: /\b(?:dm\s+me|send\s+(?:me\s+)?a\s+message|direct\s+message|reach\s+out)\b/i, type: 'Direct Message' },
  { pattern: /\b(?:follow\s+me|subscribe|join\s+(?:the|our)|sign\s+up)\b/i, type: 'Follow / Subscribe' },
  { pattern: /\b(?:tag\s+(?:a\s+friend|someone)|let\s+me\s+know|vote\s+below)\b/i, type: 'Social Tagging' },
];

/**
 * Calculates comprehensive deterministic metrics from social media post text
 * @param {string} text 
 */
export function calculateContentMetrics(text = '') {
  const cleanText = text.trim();
  if (!cleanText) {
    return getEmptyMetrics();
  }

  // 1. Basic counts
  const charactersWithSpaces = cleanText.length;
  const charactersWithoutSpaces = cleanText.replace(/\s+/g, '').length;
  
  // Extract words
  const words = cleanText.match(/[\p{L}\p{N}'-]+/gu) || [];
  const wordCount = words.length;

  // Extract sentences (handles ?, !, ., and newlines)
  const sentences = cleanText
    .split(/(?<=[.?!])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  const sentenceCount = Math.max(1, sentences.length);

  // Paragraphs
  const paragraphs = cleanText
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  const paragraphCount = Math.max(1, paragraphs.length);

  // Reading time (average 200 words per minute for online reading)
  const readingTimeSeconds = Math.max(1, Math.round((wordCount / 200) * 60));

  // 2. Readability: Flesch Reading Ease & Flesch-Kincaid Grade Level
  const totalSyllables = getTotalSyllables(words);
  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = wordCount > 0 ? totalSyllables / wordCount : 1;

  // Flesch Reading Ease formula: 206.835 - (1.015 * ASL) - (84.6 * ASW)
  let fleschScore = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
  fleschScore = Math.max(0, Math.min(100, Math.round(fleschScore)));

  // Flesch-Kincaid Grade Level: (0.39 * ASL) + (11.8 * ASW) - 15.59
  let gradeLevel = (0.39 * wordsPerSentence) + (11.8 * syllablesPerWord) - 15.59;
  gradeLevel = Math.max(1, Math.min(18, Math.round(gradeLevel * 10) / 10));

  let readabilityLabel = 'Conversational & Engaging';
  let readabilityTone = 'optimal';
  if (fleschScore >= 80) {
    readabilityLabel = 'Very Easy (Viral, mass-appeal)';
    readabilityTone = 'easy';
  } else if (fleschScore >= 60) {
    readabilityLabel = 'Standard Social (Ideal for LinkedIn & X)';
    readabilityTone = 'optimal';
  } else if (fleschScore >= 45) {
    readabilityLabel = 'Moderately Complex (Technical / In-depth)';
    readabilityTone = 'moderate';
  } else {
    readabilityLabel = 'Academic / Dense (Consider shortening sentences)';
    readabilityTone = 'complex';
  }

  // 3. Hook Strength Analysis (Evaluating first sentence & opening 20 words)
  const firstSentence = sentences[0] || '';
  const firstLineWords = firstSentence.split(/\s+/).filter(Boolean);
  
  let hookScore = 50; // base
  const hookTags = [];
  const hookTips = [];

  // Short punchy opening (<14 words)
  if (firstLineWords.length <= 12 && firstLineWords.length > 2) {
    hookScore += 15;
    hookTags.push('Punchy & Scannable');
  } else if (firstLineWords.length > 25) {
    hookScore -= 15;
    hookTips.push('Opening sentence is long. Shorten it to under 15 words to stop the scroll.');
  }

  // Questions in hook
  if (firstSentence.includes('?') || /^(why|how|what|is\s+it|have\s+you|are\s+you)\b/i.test(firstSentence)) {
    hookScore += 15;
    hookTags.push('Curiosity Question');
  }

  // Numbers in hook (e.g., "7 steps", "$100k", "93%")
  if (/\b\d+(?:%|\$|k|M|x|\+)?\b/i.test(firstSentence)) {
    hookScore += 15;
    hookTags.push('Specific Numbers / Data');
  }

  // Intrigue & Curiosity keywords
  const curiosityRegex = /\b(?:secret|mistake|stop|truth|unpopular|nobody|hack|lesson|warning|reason|framework|blueprint|transform)\b/i;
  if (curiosityRegex.test(firstSentence)) {
    hookScore += 12;
    hookTags.push('High Curiosity Trigger');
  }

  // Emoji in the hook for visual anchor
  const emojiRegex = /[\p{Extended_Pictographic}]/u;
  if (emojiRegex.test(firstSentence)) {
    hookScore += 8;
    hookTags.push('Visual Hook Emoji');
  }

  hookScore = Math.max(15, Math.min(98, Math.round(hookScore)));

  // 4. Call to Action (CTA) Detection
  const detectedCTAs = [];
  let ctaFound = false;
  let ctaScore = 30; // base score if no CTA

  for (const item of CTA_PATTERNS) {
    if (item.pattern.test(cleanText)) {
      detectedCTAs.push(item.type);
      ctaFound = true;
    }
  }

  if (ctaFound) {
    ctaScore = 85;
    // Check if CTA is in the last 25% of the text (ideal position)
    const lastSentence = sentences[sentences.length - 1] || '';
    const secondLastSentence = sentences[sentences.length - 2] || '';
    const lastPortion = `${secondLastSentence} ${lastSentence}`;
    
    let inClosing = false;
    for (const item of CTA_PATTERNS) {
      if (item.pattern.test(lastPortion)) {
        inClosing = true;
        break;
      }
    }
    if (inClosing) {
      ctaScore = 95;
    }
  }

  // 5. Hashtags & Mentions
  const hashtags = (cleanText.match(/#[a-zA-Z0-9_]+/g) || []);
  const mentions = (cleanText.match(/@[a-zA-Z0-9_]+/g) || []);
  const hashtagCount = hashtags.length;
  const mentionCount = mentions.length;

  let hashtagRating = 'Optimal';
  if (hashtagCount === 0) {
    hashtagRating = 'None (Recommended 2-5 for discoverability)';
  } else if (hashtagCount > 8) {
    hashtagRating = 'High / Crowded (May look spammy on LinkedIn/X)';
  }

  // 6. Emojis
  const allEmojis = cleanText.match(/[\p{Extended_Pictographic}]/gu) || [];
  const emojiCount = allEmojis.length;
  const emojiDensityPer100Words = wordCount > 0 ? Math.round((emojiCount / wordCount) * 100) : 0;

  // 7. Deterministic Sentiment & Tone Analysis
  let positiveScore = 0;
  let negativeScore = 0;
  let urgencyScore = 0;

  for (const w of words) {
    const lower = w.toLowerCase();
    if (POSITIVE_WORDS.has(lower)) positiveScore++;
    if (NEGATIVE_WORDS.has(lower)) negativeScore++;
    if (URGENCY_WORDS.has(lower)) urgencyScore++;
  }

  const netSentiment = positiveScore - negativeScore;
  let toneCategory = 'Balanced & Informative';
  let sentimentScore = 60; // 0 to 100

  if (netSentiment >= 3) {
    toneCategory = 'Inspiring & Enthusiastic';
    sentimentScore = Math.min(95, 70 + netSentiment * 5);
  } else if (netSentiment <= -2) {
    toneCategory = 'Critical & Problem-Focused';
    sentimentScore = Math.max(30, 50 + netSentiment * 5);
  } else if (urgencyScore >= 2) {
    toneCategory = 'Action-Oriented & Urgent';
    sentimentScore = 75;
  }

  // 8. Social Platform Fit Analysis
  const platformFit = {
    twitter: {
      platform: 'Twitter / X',
      characterLimit: 280,
      currentLength: charactersWithSpaces,
      isWithinLimit: charactersWithSpaces <= 280,
      status: charactersWithSpaces <= 280 ? 'Fits in single post' : `Exceeds by ${charactersWithSpaces - 280} chars (Needs thread format)`,
      score: charactersWithSpaces <= 280 ? Math.min(100, Math.round((charactersWithSpaces / 240) * 100)) : 60,
    },
    linkedIn: {
      platform: 'LinkedIn',
      optimalRange: '800 - 1,600 characters',
      currentLength: charactersWithSpaces,
      isWithinLimit: charactersWithSpaces <= 3000,
      status: charactersWithSpaces >= 600 && charactersWithSpaces <= 1800 
        ? 'Sweet spot length for algorithmic engagement' 
        : charactersWithSpaces < 600 
          ? 'Short post (Good for quick tips, but lower dwell time)' 
          : 'Long-form deep dive (Ensure strong scannability with bullet points)',
      score: charactersWithSpaces >= 600 && charactersWithSpaces <= 1800 ? 95 : 75,
    },
    instagram: {
      platform: 'Instagram Caption',
      optimalRange: '150 - 300 characters or full storytelling',
      currentLength: charactersWithSpaces,
      isWithinLimit: charactersWithSpaces <= 2200,
      status: charactersWithSpaces <= 2200 ? 'Well within 2,200 char limit' : 'Exceeds Instagram caption limit',
      score: charactersWithSpaces <= 1000 ? 90 : 80,
    },
    threads: {
      platform: 'Threads',
      characterLimit: 500,
      currentLength: charactersWithSpaces,
      isWithinLimit: charactersWithSpaces <= 500,
      status: charactersWithSpaces <= 500 ? 'Fits single thread post' : `Exceeds single post by ${charactersWithSpaces - 500} chars`,
      score: charactersWithSpaces <= 500 ? 92 : 65,
    }
  };

  // Overall Deterministic Health Score (0 - 100)
  const healthScore = Math.round(
    (fleschScore * 0.25) +
    (hookScore * 0.35) +
    (ctaScore * 0.25) +
    (Math.min(100, (paragraphCount > 1 ? 90 : 50)) * 0.15)
  );

  return {
    rawLength: charactersWithSpaces,
    counts: {
      charactersWithSpaces,
      charactersWithoutSpaces,
      wordCount,
      sentenceCount,
      paragraphCount,
      readingTimeSeconds,
      readingTimeFormatted: readingTimeSeconds < 60 ? `${readingTimeSeconds}s read` : `${Math.ceil(readingTimeSeconds / 60)} min read`,
    },
    readability: {
      fleschScore,
      gradeLevel,
      label: readabilityLabel,
      tone: readabilityTone,
      wordsPerSentence: Math.round(wordsPerSentence * 10) / 10,
      syllablesPerWord: Math.round(syllablesPerWord * 100) / 100,
    },
    hook: {
      openingText: firstSentence.slice(0, 140),
      firstLineWordCount: firstLineWords.length,
      score: hookScore,
      tags: hookTags.length > 0 ? hookTags : ['Standard Opening'],
      tips: hookTips,
    },
    callToAction: {
      found: ctaFound,
      score: ctaScore,
      detectedTypes: detectedCTAs,
      recommendation: ctaFound 
        ? `Great CTA detected: "${detectedCTAs.join(', ')}"` 
        : 'Add a clear call to action at the end (e.g., "What are your thoughts?", "Save this for later", "Link in bio").',
    },
    sentiment: {
      polarityScore: sentimentScore,
      toneCategory,
      positiveWordCount: positiveScore,
      negativeWordCount: negativeScore,
      urgencyWordCount: urgencyScore,
    },
    hashtags: {
      count: hashtagCount,
      items: hashtags,
      rating: hashtagRating,
    },
    mentions: {
      count: mentionCount,
      items: mentions,
    },
    emojis: {
      count: emojiCount,
      densityPer100Words: emojiDensityPer100Words,
      status: emojiCount === 0 ? 'No emojis (consider adding 1-3 for visual breathing room)' : emojiCount <= 6 ? 'Balanced visual spacing' : 'High emoji density',
    },
    platformFit,
    healthScore,
  };
}

/**
 * Returns empty metrics structure when text is empty
 */
function getEmptyMetrics() {
  return {
    rawLength: 0,
    counts: {
      charactersWithSpaces: 0,
      charactersWithoutSpaces: 0,
      wordCount: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      readingTimeSeconds: 0,
      readingTimeFormatted: '0s read',
    },
    readability: {
      fleschScore: 0,
      gradeLevel: 0,
      label: 'No content yet',
      tone: 'neutral',
      wordsPerSentence: 0,
      syllablesPerWord: 0,
    },
    hook: {
      openingText: '',
      firstLineWordCount: 0,
      score: 0,
      tags: [],
      tips: [],
    },
    callToAction: {
      found: false,
      score: 0,
      detectedTypes: [],
      recommendation: 'Upload a document or type your post to analyze.',
    },
    sentiment: {
      polarityScore: 50,
      toneCategory: 'Neutral',
      positiveWordCount: 0,
      negativeWordCount: 0,
      urgencyWordCount: 0,
    },
    hashtags: {
      count: 0,
      items: [],
      rating: 'None',
    },
    mentions: {
      count: 0,
      items: [],
    },
    emojis: {
      count: 0,
      densityPer100Words: 0,
      status: 'No emojis',
    },
    platformFit: {
      twitter: { platform: 'Twitter / X', characterLimit: 280, currentLength: 0, isWithinLimit: true, status: 'Ready', score: 0 },
      linkedIn: { platform: 'LinkedIn', optimalRange: '800 - 1,600 chars', currentLength: 0, isWithinLimit: true, status: 'Ready', score: 0 },
      instagram: { platform: 'Instagram Caption', optimalRange: '150 - 300 chars', currentLength: 0, isWithinLimit: true, status: 'Ready', score: 0 },
      threads: { platform: 'Threads', characterLimit: 500, currentLength: 0, isWithinLimit: true, status: 'Ready', score: 0 },
    },
    healthScore: 0,
  };
}
