import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractTextFromImage } from './documentService.js';

/**
 * Helper to initialize Gemini Client if an API key is available
 * @param {string} customApiKey 
 */
function getGeminiClient(customApiKey) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey.trim());
}

/**
 * Analyzes social media text for engagement score, strengths, weaknesses, and recommendations.
 * @param {string} text 
 * @param {string} apiKey 
 */
export async function analyzeEngagement(text, apiKey = '') {
  if (!text || text.trim().length === 0) {
    throw new Error('Post content is empty. Please provide text to analyze.');
  }

  const gemini = getGeminiClient(apiKey);

  if (gemini) {
    try {
      const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are an elite social media growth strategist and algorithm expert for LinkedIn, X (Twitter), and Instagram.
Analyze the following social media post text objectively and provide an in-depth engagement breakdown.

Post content:
"""
${text}
"""

Return ONLY a valid, raw JSON object (with no markdown backticks, no \`\`\`json wrappers) in the exact following schema:
{
  "engagementScore": number (integer between 0 and 100 representing predicted algorithmic & human engagement),
  "viralityPotential": string ("High" | "Medium-High" | "Moderate" | "Niche / Specific"),
  "readabilityAssessment": string (1-2 sentences on flow, cadence, and line-spacing),
  "strengths": [array of 3-4 specific strings highlighting what works well],
  "weaknesses": [array of 2-3 specific strings highlighting friction points or lost opportunities],
  "actionableSuggestions": [
    {
      "category": string ("Hook" | "Formatting" | "CTA" | "Psychology" | "Hashtags"),
      "tip": string (concise actionable instruction),
      "impact": string ("High" | "Medium")
    }
  ],
  "audiencePersona": string (who this resonates with most),
  "bestTimeToPost": string (e.g. "Tuesday & Thursday 8:00 AM - 10:30 AM EST")
}
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedJson);
      return {
        ...parsed,
        source: 'gemini-ai',
      };
    } catch (err) {
      console.warn('Gemini AI API call failed or timed out, falling back to smart heuristic analysis:', err.message);
    }
  }

  // Fallback to intelligent deterministic heuristic engine
  return generateFallbackAnalysis(text);
}

/**
 * Generates improved versions of the post across multiple formats & tones
 * @param {string} text 
 * @param {string} platform 
 * @param {string} apiKey 
 */
export async function generateImprovedPost(text, platform = 'all', apiKey = '') {
  if (!text || text.trim().length === 0) {
    throw new Error('Post content is empty.');
  }

  const gemini = getGeminiClient(apiKey);

  if (gemini) {
    try {
      const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are a world-class copywriter who has written viral posts with millions of impressions.
Rewrite and optimize the following social media post into distinct, high-converting variations.

Original Post:
"""
${text}
"""

Target Platform Context: ${platform}

Return ONLY a valid raw JSON object (no markdown backticks, no \`\`\`json wrappers) matching this schema:
{
  "viralHook": string (a punchy, curiosity-driven version designed to maximize retweets/shares with short snappy lines),
  "thoughtLeader": string (a structured, value-driven LinkedIn authority post with clean spacing, key takeaways, and discussion question),
  "casualRelatable": string (a friendly, authentic, emoji-balanced version perfect for Instagram or Threads),
  "bulletThread": string (a scannable listicle / carousel outline format with numbered insights),
  "hookAlternatives": [
    { "type": "Curiosity Gap", "hook": string },
    { "type": "Contrarian / Bold Claim", "hook": string },
    { "type": "Question / Pain Point", "hook": string }
  ],
  "improvementSummary": string (1-2 sentences summarizing what was upgraded)
}
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedJson);
      return {
        ...parsed,
        source: 'gemini-ai',
      };
    } catch (err) {
      console.warn('Gemini AI post generator failed, using smart re-writer:', err.message);
    }
  }

  return generateFallbackImprovedVersions(text);
}

/**
 * Multimodal Visual & Caption Analysis for image uploads with optional caption
 * STRICTLY GROUNDED IN THE UPLOADED IMAGE (no generic career/study hallucinations)
 * @param {Buffer} imageBuffer 
 * @param {string} mimeType 
 * @param {string} caption 
 * @param {string} apiKey 
 */
export async function analyzeVisionAndCaption(imageBuffer, mimeType, caption = '', apiKey = '') {
  const gemini = getGeminiClient(apiKey);

  if (gemini && imageBuffer) {
    try {
      const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const base64Data = imageBuffer.toString('base64');

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType || 'image/jpeg',
        },
      };

      const prompt = `
You are an expert social media visual curator and caption creator.
Analyze this uploaded image with extreme precision and truthfulness.

User's optional caption / context: ${caption ? `"${caption}"` : '(No user caption provided)'}

CRITICAL RULES FOR ACCURACY AND ZERO HALLUCINATION:
1. Examine the actual image: Identify the true main subject (e.g., person wearing a saree / traditional clothing, casual outfit, portrait, food/dish, nature/landscape, architecture, event, vehicle, animal, etc.).
2. Focus on visible elements: Attire/clothing, colors, expressions, styling, setting, background, atmosphere, and mood.
3. DO NOT assume or hallucinate business, career, studies, productivity, growth mindset, or marketing themes unless explicitly visible in the image!
4. If a person is wearing traditional attire (like a saree, ethnic wear, lehenga, kurti, suit, or dress), generate captions highlighting elegance, timeless style, tradition, grace, colors, and authentic celebration.
5. If the image depicts food, scenery, or travel, generate captions matching that exact culinary or scenic context.
6. If the user provided an optional caption/context, incorporate it naturally with the visual details without inventing fake backstories.
7. All 3 caption styles must describe the SAME uploaded image with different writing tones:
   - "Viral & Punchy": Short, catchy, aesthetic, engaging with 1-2 fitting emojis.
   - "Story-Driven & Authentic": Warm, descriptive, emotionally connected to the visual moment.
   - "Minimalist & Aesthetic": Brief, elegant, poetic 1-line caption.
8. Generate 5-8 hashtags strictly relevant to the actual image subject (e.g. #SareeLove #TraditionalWear #EthnicVibes #IndianFashion #Elegance if traditional attire; #NatureLovers #TravelGram if scenery; #Foodie #Delicious if food). Never use generic marketing hashtags like #GrowthMindset or #ContentStrategy unless the image is literally an analytics document.

Return ONLY a valid, raw JSON object (with no markdown backticks, no \`\`\`json wrappers):
{
  "visualScore": number (integer 0 to 100 assessing aesthetic quality, visual hook, and scannability),
  "aestheticRating": string (e.g. "Traditional & Elegant", "Vibrant & Scenic", "Clean & Minimalist", "Warm & Atmospheric"),
  "visualElements": {
    "focalPoint": string (accurately describe what is actually visible in the image),
    "colorPaletteMood": string (the visible color tones and emotional vibe),
    "compositionFeedback": string (framing, balance, lighting)
  },
  "synergyScore": number (integer 0 to 100 on how well the caption complements the image visuals),
  "synergyFeedback": string (assessment of visual + text alignment),
  "recommendedCaptions": [
    {
      "style": "Viral & Punchy",
      "caption": string
    },
    {
      "style": "Story-Driven & Authentic",
      "caption": string
    },
    {
      "style": "Minimalist & Aesthetic",
      "caption": string
    }
  ],
  "recommendedHashtags": [array of 5-8 relevant hashtags matching the image subject, starting with #]
}
`;

      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text().trim();
      const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedJson);
      return {
        ...parsed,
        source: 'gemini-vision-ai',
      };
    } catch (err) {
      console.warn('Gemini Vision AI failed, falling back to grounded vision synthesis:', err.message);
    }
  }

  // Fallback grounded vision synthesis without business/study hallucinations
  return generateGroundedVisionAnalysis(imageBuffer, caption);
}

/**
 * Intelligent Grounded Vision Synthesis (Offline / Keyless Mode)
 * Strictly avoids generic business/study hallucinations and adapts to visual context.
 */
async function generateGroundedVisionAnalysis(imageBuffer, userCaption = '') {
  let ocrText = '';
  if (imageBuffer) {
    try {
      const ocrResult = await extractTextFromImage(imageBuffer);
      ocrText = ocrResult.text || '';
    } catch (e) {
      // OCR optional for pure photos
    }
  }

  const combinedText = `${userCaption} ${ocrText}`.toLowerCase();

  // Detect visual context themes from user caption or OCR text
  const isTraditionalWear = /(saree|sari|lehenga|kurta|kurti|ethnic|traditional|desi|diwali|wedding|festive|pooja|silk|dupatta)/i.test(combinedText);
  const isFood = /(food|coffee|cake|dish|pizza|dinner|lunch|breakfast|delicious|tasty|recipe|cafe|restaurant|tea)/i.test(combinedText);
  const isNatureOrTravel = /(nature|sunset|sunrise|mountain|beach|sea|sky|travel|trip|landscape|forest|view|outdoor|vacation)/i.test(combinedText);
  const isFashion = /(outfit|ootd|fashion|style|look|dress|dapper|chic|glam|model|posing)/i.test(combinedText);

  let visualScore = 88;
  let aestheticRating = 'Elegance & Visual Harmony';
  let focalPoint = 'Central subject with clean framing and distinct aesthetic focus.';
  let colorPaletteMood = 'Balanced natural lighting with rich, harmonious color tones.';
  let compositionFeedback = 'Well-proportioned framing with natural breathing room and attractive contrast.';
  let captions = [];
  let hashtags = [];

  if (isTraditionalWear) {
    aestheticRating = 'Traditional & Graceful Elegance';
    focalPoint = 'Traditional attire with intricate textures, vibrant drape, and cultural grace.';
    colorPaletteMood = 'Rich festive tones with radiant warmth and timeless beauty.';
    captions = [
      {
        style: 'Viral & Punchy',
        caption: userCaption 
          ? `Elegance never goes out of style ✨ Celebrating ${userCaption}. Drop a ❤️ if you love traditional vibes!`
          : 'Tradition, confidence, and timeless grace ✨ Drop a ❤️ if you love traditional elegance!',
      },
      {
        style: 'Story-Driven & Authentic',
        caption: userCaption
          ? `There is something truly magical about wearing traditional attire for ${userCaption}. A blend of heritage, comfort, and timeless beauty that always feels like home.`
          : 'There is a special charm in wearing traditional attire—a quiet confidence, rich heritage, and timeless beauty woven into every detail.',
      },
      {
        style: 'Minimalist & Aesthetic',
        caption: 'Elegance in every detail. ✨ #TraditionalStyle #Grace',
      }
    ];
    hashtags = ['#TraditionalWear', '#SareeStyle', '#EthnicElegance', '#IndianFashion', '#TimelessGrace', '#OOTD', '#FestiveVibes'];
  } else if (isFood) {
    aestheticRating = 'Delicious & Appetizing';
    focalPoint = 'Appetizing culinary presentation with rich colors and textures.';
    colorPaletteMood = 'Warm, inviting food photography tones.';
    captions = [
      {
        style: 'Viral & Punchy',
        caption: userCaption ? `${userCaption} 🍽️ Tag someone you’d share this with!` : 'Good food, good mood, and great company 🍽️ Drop a 🔥 if this looks delicious!',
      },
      {
        style: 'Story-Driven & Authentic',
        caption: userCaption ? `Savoring every bite of ${userCaption}. Sometimes the best moments in life happen around a table with good food and great memories.` : 'The best memories are often made gathered around great food. Savoring every single flavor.',
      },
      {
        style: 'Minimalist & Aesthetic',
        caption: 'Savoring the simple pleasures. ✨ #Foodie #GoodFood',
      }
    ];
    hashtags = ['#Foodie', '#FoodPhotography', '#Delicious', '#CulinaryDelight', '#FoodLovers', '#TasteOfTheDay'];
  } else if (isNatureOrTravel) {
    aestheticRating = 'Scenic & Atmospheric';
    focalPoint = 'Scenic landscape with natural depth and open perspective.';
    colorPaletteMood = 'Serene natural hues with golden atmosphere and tranquil lighting.';
    captions = [
      {
        style: 'Viral & Punchy',
        caption: userCaption ? `${userCaption} 🌍 Where should the next adventure be?` : 'Nature never fails to take my breath away 🌿 Where is your favorite escape?',
      },
      {
        style: 'Story-Driven & Authentic',
        caption: userCaption ? `Standing here at ${userCaption} reminds me how important it is to slow down, explore, and breathe in the beauty around us.` : 'Moments in nature remind us to slow down, embrace the horizon, and appreciate the beauty all around us.',
      },
      {
        style: 'Minimalist & Aesthetic',
        caption: 'Finding peace in the beauty of the outdoors. 🌿✨',
      }
    ];
    hashtags = ['#NatureLovers', '#TravelDiaries', '#ScenicView', '#Wanderlust', '#LandscapePhotography', '#ExploreMore'];
  } else if (isFashion) {
    aestheticRating = 'Chic & Fashion-Forward';
    focalPoint = 'Curated outfit styling with strong personal presence and balanced framing.';
    colorPaletteMood = 'Modern, stylish contrast with crisp visual clarity.';
    captions = [
      {
        style: 'Viral & Punchy',
        caption: userCaption ? `${userCaption} ✨ Rate this look from 1 to 10!` : 'Fit check ✨ Confidence is the best accessory you can wear.',
      },
      {
        style: 'Story-Driven & Authentic',
        caption: userCaption ? `Styling this look for ${userCaption}. Fashion is not just what you wear—it’s how you express your individuality every day.` : 'Style is a way to express who you are without having to say a word. Loving this vibe today.',
      },
      {
        style: 'Minimalist & Aesthetic',
        caption: 'Simplicity, confidence, and effortless style. ✨',
      }
    ];
    hashtags = ['#OOTD', '#FashionInspo', '#StyleDiaries', '#StreetStyle', '#Aesthetic', '#OutfitGoals'];
  } else {
    // Universal aesthetic & moment captions (NO business/career/study assumptions)
    aestheticRating = 'Clean, High-Contrast & Engaging';
    focalPoint = userCaption ? `Visual composition complementing "${userCaption}"` : 'Clear central visual subject with balanced framing.';
    captions = [
      {
        style: 'Viral & Punchy',
        caption: userCaption 
          ? `${userCaption} ✨ Double tap if this made you smile today!`
          : 'Capturing moments that speak for themselves ✨ What’s one word to describe this vibe?',
      },
      {
        style: 'Story-Driven & Authentic',
        caption: userCaption
          ? `Grateful for moments like this: ${userCaption}. It’s the little details and genuine feelings that make life so special.`
          : 'Some moments don’t need long explanations—just good energy, natural beauty, and a memory to cherish.',
      },
      {
        style: 'Minimalist & Aesthetic',
        caption: userCaption ? `${userCaption} ✨` : 'Beauty in the simple moments. ✨ #Aesthetic #GoodVibes',
      }
    ];
    hashtags = ['#AestheticVibes', '#PhotoOfTheDay', '#GoodEnergy', '#VisualStories', '#MomentsInTime', '#InstaDaily'];
  }

  return {
    visualScore,
    aestheticRating,
    visualElements: {
      focalPoint,
      colorPaletteMood,
      compositionFeedback,
    },
    synergyScore: userCaption ? 92 : 80,
    synergyFeedback: userCaption
      ? `The caption context ("${userCaption}") aligns naturally with the visual subject and aesthetic.`
      : 'Visual has strong standalone appeal. Captions highlight the natural style and atmosphere of the image.',
    recommendedCaptions: captions,
    recommendedHashtags: hashtags,
    source: 'grounded-vision-synthesis',
  };
}

/**
 * Intelligent Fallback Heuristic Analysis (Offline / Keyless Mode)
 */
function generateFallbackAnalysis(text) {
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const hasQuestion = text.includes('?');
  const hasNumbers = /\d+/.test(text);
  const hasCTA = /(comment|share|link|save|dm|tell me|follow|let me know)/i.test(text);
  const hasEmoji = /[\p{Extended_Pictographic}]/u.test(text);

  let score = 65;
  if (hasQuestion) score += 8;
  if (hasNumbers) score += 7;
  if (hasCTA) score += 10;
  if (hasEmoji) score += 5;
  if (wordCount >= 40 && wordCount <= 250) score += 5;
  score = Math.min(94, Math.max(45, score));

  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  if (hasQuestion) {
    strengths.push('Engaging conversational hook that invites curiosity.');
  } else {
    weaknesses.push('Opening hook lacks an immediate intrigue question or bold statement.');
    suggestions.push({
      category: 'Hook',
      tip: 'Start with a provocative question or counter-intuitive insight in the first line.',
      impact: 'High',
    });
  }

  if (hasCTA) {
    strengths.push('Clear call-to-action encouraging reader participation.');
  } else {
    weaknesses.push('Missing explicit Call to Action (CTA) at the bottom to drive algorithm comments.');
    suggestions.push({
      category: 'CTA',
      tip: 'End with a low-friction question (e.g. "What is your #1 strategy for this? Drop a comment below 👇").',
      impact: 'High',
    });
  }

  if (text.includes('\n\n')) {
    strengths.push('Clean paragraph breaks creating great mobile scannability.');
  } else {
    weaknesses.push('Text block is dense. Mobile readers may bounce without line breaks.');
    suggestions.push({
      category: 'Formatting',
      tip: 'Break large paragraphs into 1-2 sentence digestible chunks with generous whitespace.',
      impact: 'Medium',
    });
  }

  if (hasNumbers) {
    strengths.push('Uses concrete numbers and data points which boosts credibility.');
  } else {
    suggestions.push({
      category: 'Psychology',
      tip: 'Incorporate specific metrics or step-by-step numbers to give readers tangible takeaways.',
      impact: 'Medium',
    });
  }

  if (strengths.length === 0) {
    strengths.push('Solid foundational topic with strong potential for expansion.');
  }

  return {
    engagementScore: score,
    viralityPotential: score >= 80 ? 'High' : score >= 65 ? 'Medium-High' : 'Moderate',
    readabilityAssessment: `Post has ${wordCount} words with ${text.split('\n').length} lines. Well-suited for fast mobile consumption.`,
    strengths,
    weaknesses,
    actionableSuggestions: suggestions,
    audiencePersona: 'Audience seeking clear, engaging, and authentic social content.',
    bestTimeToPost: 'Tuesday & Thursday 8:30 AM - 11:00 AM (Peak morning engagement window)',
    source: 'smart-heuristics',
  };
}

/**
 * Intelligent Fallback Post Improver (Offline / Keyless Mode)
 */
function generateFallbackImprovedVersions(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const mainIdea = lines[0] || 'Unlocking high-impact social content';
  const bodyIdea = lines.slice(1).join(' ') || text;

  const viralHook = `🚨 Most people get this completely backwards:

${mainIdea.replace(/[.?!]$/, '')} isn't about working harder—it's about leverage.

Here is the exact 3-step breakdown:
1️⃣ Focus on clear, high-contrast ideas
2️⃣ Cut 30% of unnecessary filler words
3️⃣ Give your audience a reason to comment immediately

👉 Save this post so you can reference it later!`;

  const thoughtLeader = `A hard truth I've learned over the years:

${mainIdea}

When you analyze what separates average content from industry-defining posts, it comes down to 3 principles:

• Clarity over complexity
• Actionable frameworks over vague inspiration
• Respecting the reader's time with clean formatting

${bodyIdea.slice(0, 180)}...

What has been your biggest takeaway when communicating this? Let's discuss in the comments.`;

  const casualRelatable = `Okay, can we talk about this for a second? 👀

${mainIdea.toLowerCase()}

${bodyIdea.slice(0, 140)}

Honestly, once you see it, you can't unsee it ✨
Drop a ❤️ if you agree or share your experience below!`;

  const bulletThread = `🧵 Quick Masterclass on "${mainIdea.slice(0, 40)}":

1/ The core challenge:
Most creators overcomplicate their message.

2/ The solution:
${bodyIdea.slice(0, 120)}

3/ Key Takeaway:
Consistency + ruthless editing = unstoppable growth.

Bookmark this 📌 | Follow for daily actionable breakdowns!`;

  return {
    viralHook,
    thoughtLeader,
    casualRelatable,
    bulletThread,
    hookAlternatives: [
      { type: 'Curiosity Gap', hook: `The single biggest mistake people make with ${mainIdea.slice(0, 30)} (and how to fix it):` },
      { type: 'Contrarian / Bold Claim', hook: `Unpopular opinion: Everything you were taught about ${mainIdea.slice(0, 25)} is outdated.` },
      { type: 'Question / Pain Point', hook: `Struggling to get traction with your content? Here is what nobody tells you:` },
    ],
    improvementSummary: 'Enhanced formatting with white space, punchy opening hooks, and high-conversion engagement prompts.',
    source: 'smart-heuristics',
  };
}
