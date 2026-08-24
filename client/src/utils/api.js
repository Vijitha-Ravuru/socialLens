/**
 * API Client for SocialLens Backend Services
 */

const API_BASE = '/api';

/**
 * Retrieve saved API key from localStorage
 */
export function getSavedApiKey() {
  return localStorage.getItem('sociallens_gemini_key') || '';
}

/**
 * Save custom API key to localStorage
 */
export function saveApiKey(key) {
  if (!key) {
    localStorage.removeItem('sociallens_gemini_key');
  } else {
    localStorage.setItem('sociallens_gemini_key', key.trim());
  }
}

/**
 * Common headers with optional custom API Key
 */
function getHeaders(customHeaders = {}) {
  const apiKey = getSavedApiKey();
  const headers = { ...customHeaders };
  if (apiKey) {
    headers['x-gemini-key'] = apiKey;
  }
  return headers;
}

/**
 * Upload and extract text from PDF or Image file
 * @param {File} file 
 */
export async function uploadAndExtractFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/extract`, {
    method: 'POST',
    headers: getHeaders(),
    body: formData,
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to extract content from file.');
  }
  return data;
}

/**
 * Calculate deterministic content metrics on post text
 * @param {string} text 
 */
export async function calculateMetrics(text) {
  const response = await fetch(`${API_BASE}/metrics`, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ text }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to calculate metrics.');
  }
  return data.metrics;
}

/**
 * Run AI Engagement Diagnostic on post text
 * @param {string} text 
 */
export async function runAIEngagementAnalysis(text) {
  const response = await fetch(`${API_BASE}/ai-analyze`, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ text, apiKey: getSavedApiKey() }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to run AI engagement analysis.');
  }
  return data.analysis;
}

/**
 * Generate improved variations of the post
 * @param {string} text 
 * @param {string} platform 
 */
export async function generatePostVariations(text, platform = 'all') {
  const response = await fetch(`${API_BASE}/improve`, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ text, platform, apiKey: getSavedApiKey() }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to generate improved post.');
  }
  return data.variations;
}

/**
 * Multimodal Visual & Caption Analysis
 * @param {File} imageFile 
 * @param {string} caption 
 */
export async function analyzeImageAndCaption(imageFile, caption = '') {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('caption', caption);
  if (getSavedApiKey()) {
    formData.append('apiKey', getSavedApiKey());
  }

  const response = await fetch(`${API_BASE}/vision-analyze`, {
    method: 'POST',
    headers: getHeaders(),
    body: formData,
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Visual analysis failed.');
  }
  return data;
}

/**
 * Check backend service health
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}
