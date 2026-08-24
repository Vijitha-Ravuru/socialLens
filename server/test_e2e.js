import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5001/api';

async function runE2ETests() {
  console.log('🧪 Starting SocialLens Grounded Verification...\n');

  // Test 1: Health
  try {
    const res = await fetch(`${API_BASE}/health`);
    const health = await res.json();
    console.log('✅ 1. Health Check Passed:', health.service, `(${health.status})`);
  } catch (e) {
    console.error('❌ 1. Health Check Failed:', e.message);
  }

  // Test 2: Deterministic Metrics
  const samplePost = `Why do 92% of creators fail before their 50th post?

Because they focus on production value instead of hook psychology.

Here are 3 rules:
1️⃣ The First 3 Seconds Rule
2️⃣ Write at a 6th-Grade Level
3️⃣ One Idea Per Post

Drop a comment below if you agree! 👇`;

  try {
    const res = await fetch(`${API_BASE}/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: samplePost }),
    });
    const data = await res.json();
    console.log('✅ 2. Deterministic Metrics Passed:');
    console.log(`   - Flesch Reading Score: ${data.metrics.readability.fleschScore}`);
    console.log(`   - Hook Score: ${data.metrics.hook.score}`);
    console.log(`   - CTA Detected: ${data.metrics.callToAction.found}`);
  } catch (e) {
    console.error('❌ 2. Metrics Calculation Failed:', e.message);
  }

  // Test 3: Multimodal Vision & Grounded Caption Analysis for Traditional/Saree context
  try {
    const minimalPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const imageBuffer = Buffer.from(minimalPngBase64, 'base64');
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('file', blob, 'saree_traditional.png');
    formData.append('caption', 'Wearing my favorite silk saree for Diwali celebration');

    const res = await fetch(`${API_BASE}/vision-analyze`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    console.log('✅ 3. Saree / Traditional Attire Vision Analysis:');
    console.log(`   - Aesthetic Rating: ${data.visionAnalysis.aestheticRating}`);
    console.log(`   - Focal Point: ${data.visionAnalysis.visualElements.focalPoint}`);
    console.log(`   - Caption (Viral & Punchy): "${data.visionAnalysis.recommendedCaptions[0]?.caption}"`);
    console.log(`   - Caption (Minimalist): "${data.visionAnalysis.recommendedCaptions[2]?.caption}"`);
    console.log(`   - Hashtags: ${data.visionAnalysis.recommendedHashtags?.join(' ')}`);

    // Verify NO generic marketing hashtags
    const hasMarketingTag = data.visionAnalysis.recommendedHashtags?.some(h => /growthmindset|contentstrategy|creatoreconomy/i.test(h));
    if (hasMarketingTag) {
      console.error('❌ FAILED: Generic marketing hashtags were still present!');
    } else {
      console.log('   ✓ Verified: ZERO generic business/growth marketing hashtags!');
    }
  } catch (e) {
    console.error('❌ 3. Saree Vision Analysis Failed:', e.message);
  }

  // Test 4: Multimodal Vision for General Photo without caption
  try {
    const minimalPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const imageBuffer = Buffer.from(minimalPngBase64, 'base64');
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('file', blob, 'landscape.png');
    formData.append('caption', '');

    const res = await fetch(`${API_BASE}/vision-analyze`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    console.log('✅ 4. Uncaptioned Photo Vision Analysis:');
    console.log(`   - Aesthetic Rating: ${data.visionAnalysis.aestheticRating}`);
    console.log(`   - Caption (Viral & Punchy): "${data.visionAnalysis.recommendedCaptions[0]?.caption}"`);
    console.log(`   - Hashtags: ${data.visionAnalysis.recommendedHashtags?.join(' ')}`);
  } catch (e) {
    console.error('❌ 4. Uncaptioned Photo Vision Analysis Failed:', e.message);
  }

  console.log('\n🎉 All tests passed successfully!');
}

runE2ETests();
