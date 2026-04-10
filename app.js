/**
 * Research Vector Synthesis App
 * TF-IDF embeddings + Cosine similarity + Meta-prompting
 */

// ============================================
// EMBEDDED MOCK DATA (CORS-free)
// ============================================
const mockSources = [
    {
        id: "arxiv-2401.001",
        title: "Meta-Prompting: Enhancing Language Models with Task-Agnostic Scaffolding",
        source: "arXiv",
        url: "https://arxiv.org/abs/2401.001",
        abstract: "We introduce meta-prompting, a scaffolding technique that enables language models to dynamically modify their own prompts based on task context. Our approach achieves 23% improvement on composite reasoning tasks.",
        authors: ["Sarah Chen", "David Park"],
        published: "2024-01-15",
        citations: 45
    },
    {
        id: "arxiv-2401.002",
        title: "Vector Database Optimization for High-Dimensional Semantic Search",
        source: "arXiv",
        url: "https://arxiv.org/abs/2401.002",
        abstract: "Novel indexing strategies for vector databases that reduce query latency by 40% while maintaining 99.2% recall on billion-scale embeddings. We introduce HNSW++ with adaptive clustering.",
        authors: ["Michael Zhang", "Lisa Kumar"],
        published: "2024-01-20",
        citations: 128
    },
    {
        id: "github-meta-prompt",
        title: "meta-prompt-engine: Production-grade meta-prompting framework",
        source: "GitHub",
        url: "https://github.com/example/meta-prompt-engine",
        abstract: "Open-source framework implementing meta-prompting patterns with built-in chain-of-thought, self-consistency, and dynamic prompt optimization. 3.2k stars, used by 150+ projects.",
        authors: ["open-source-contributors"],
        published: "2023-11-10",
        stars: 3200
    },
    {
        id: "arxiv-2312.089",
        title: "TF-IDF Revisited: Modern Embeddings Meet Classical IR",
        source: "arXiv",
        url: "https://arxiv.org/abs/2312.089",
        abstract: "Hybrid retrieval combining TF-IDF sparse vectors with dense embeddings outperforms pure dense systems on out-of-domain queries. Comprehensive benchmark across 12 domains.",
        authors: ["James Wilson", "Anna Lee"],
        published: "2023-12-05",
        citations: 89
    },
    {
        id: "github-vector-db",
        title: "vectordb-lite: Lightweight vector database for edge deployment",
        source: "GitHub",
        url: "https://github.com/example/vectordb-lite",
        abstract: "Embedded vector database with HNSW indexing, runs on mobile devices. Supports 1M vectors with <50ms query time. WASM bindings for browser deployment.",
        authors: ["edge-ai-team"],
        published: "2024-02-01",
        stars: 1850
    },
    {
        id: "arxiv-2402.112",
        title: "Cosine Similarity at Scale: Billion-Vector Nearest Neighbor Search",
        source: "arXiv",
        url: "https://arxiv.org/abs/2402.112",
        abstract: "GPU-accelerated cosine similarity search achieving 10M queries/second on A100. Novel quantization reduces memory by 8x with <1% accuracy loss.",
        authors: ["Robert Taylor", "Emma Davis"],
        published: "2024-02-18",
        citations: 34
    }
];

// ============================================
// TF-IDF & VECTOR UTILITIES
// ============================================

/**
 * Tokenize text into words (fixed regex)
 */
function tokenize(text) {
    return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\W+/)
        .filter(w => w.length > 2);
}

/**
 * Build document frequency map
 */
function buildDocFreq(docs) {
    const df = {};
    docs.forEach(doc => {
        const tokens = new Set(tokenize(doc));
        tokens.forEach(t => {
            df[t] = (df[t] || 0) + 1;
        });
    });
    return df;
}

/**
 * Compute TF-IDF vector for a document
 */
function tfidfEmbed(text, docFreq, N) {
    const tokens = tokenize(text);
    const tf = {};
    tokens.forEach(t => {
        tf[t] = (tf[t] || 0) + 1;
    });
    
    const vec = {};
    Object.keys(tf).forEach(t => {
        const idf = Math.log((N + 1) / (docFreq[t] + 1)) + 1;
        vec[t] = tf[t] * idf;
    });
    return vec;
}

/**
 * Compute cosine similarity between two vectors
 */
function cosineSim(v1, v2) {
    let dot = 0, norm1 = 0, norm2 = 0;
    const allKeys = new Set([...Object.keys(v1), ...Object.keys(v2)]);
    
    allKeys.forEach(k => {
        const a = v1[k] || 0;
        const b = v2[k] || 0;
        dot += a * b;
        norm1 += a * a;
        norm2 += b * b;
    });
    
    if (norm1 === 0 || norm2 === 0) return 0;
    return dot / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

// ============================================
// META-PROMPT TEMPLATE
// ============================================

function metaPromptTemplate(goal, topSources) {
    const sourcesText = topSources.map((s, i) => 
        `[${i + 1}] ${s.title} (${s.source})\n${s.abstract}`
    ).join('\n\n');

    return `You are a research synthesis engine. Given a user's research goal and relevant sources, produce a "steelpoint" synthesis: concise, actionable, evidence-backed insights.

USER GOAL: ${goal}

RELEVANT SOURCES:
${sourcesText}

INSTRUCTIONS:
1. Synthesize key findings across sources
2. Identify consensus and contradictions
3. Provide actionable recommendations
4. Cite sources using [1], [2], etc.
5. Output 3-5 bullet points maximum

STEELPOINT SYNTHESIS:`;
}

// ============================================
// SIMULATED AI SYNTHESIS
// ============================================

function generateSynthesis(goal, sources) {
    const keywords = tokenize(goal);
    const keyTerms = keywords.slice(0, 3).join(', ');
    
    const templates = [
        `Based on current research, **${keyTerms}** shows strong promise with demonstrated improvements of 20-40% over baseline approaches [1][2]. Key implementations include production-grade frameworks with 3K+ GitHub stars and edge-deployment capabilities [3][4].`,
        
        `The convergence of **${keyTerms}** enables billion-scale vector search with <50ms latency and 99%+ recall [2][5]. Hybrid approaches combining classical TF-IDF with dense embeddings outperform pure neural methods on out-of-domain queries [4].`,
        
        `For **${keyTerms}**, researchers recommend: (1) HNSW++ indexing for large-scale deployment [2], (2) GPU acceleration achieving 10M queries/second [5], (3) Meta-prompt scaffolding for 23% reasoning improvements [1].`,
        
        `**${keyTerms}** research indicates three critical factors: indexing efficiency (40% latency reduction) [2], quantization techniques (8x memory savings) [5], and hybrid retrieval strategies [4]. Production systems should prioritize these optimizations.`
    ];
    
    // Select template based on goal hash for consistency
    const hash = goal.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return templates[hash % templates.length];
}

// ============================================
// CORE APPLICATION LOGIC
// ============================================

let docFreq = null;
let sourceVectors = null;

/**
 * Initialize vector embeddings for all sources
 */
function initVectors() {
    const docs = mockSources.map(s => `${s.title} ${s.abstract}`);
    docFreq = buildDocFreq(docs);
    const N = docs.length;
    
    sourceVectors = mockSources.map(s => ({
        ...s,
        vector: tfidfEmbed(`${s.title} ${s.abstract}`, docFreq, N)
    }));
}

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Simulate fetching research (with shuffle for "live" feel)
 */
async function fetchResearch() {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    
    // Return shuffled mock data for variety
    return shuffle(mockSources);
}

/**
 * Find top-k similar sources using cosine similarity
 */
function findTopK(goal, k = 3) {
    const goalVec = tfidfEmbed(goal, docFreq, mockSources.length);
    
    const scored = sourceVectors.map(s => ({
        ...s,
        similarity: cosineSim(goalVec, s.vector)
    }));
    
    scored.sort((a, b) => b.similarity - a.similarity);
    return scored.slice(0, k);
}

/**
 * Calculate confidence level based on similarity scores
 */
function calculateConfidence(topSources) {
    const avgSim = topSources.reduce((sum, s) => sum + s.similarity, 0) / topSources.length;
    
    if (avgSim > 0.5) return { level: 'high', score: avgSim, label: 'HIGH' };
    if (avgSim > 0.3) return { level: 'medium', score: avgSim, label: 'MEDIUM' };
    return { level: 'low', score: avgSim, label: 'LOW' };
}

// ============================================
// UI UPDATES
// ============================================

function showLoading(show) {
    document.getElementById('loading').hidden = !show;
    document.getElementById('synthesize-btn').disabled = show;
}

function showError(message) {
    const errorSection = document.getElementById('error');
    document.getElementById('error-message').textContent = message;
    errorSection.hidden = false;
    document.getElementById('results').hidden = true;
}

function hideError() {
    document.getElementById('error').hidden = true;
}

function updateConfidenceBadge(confidence) {
    const badge = document.getElementById('confidence-display');
    const value = document.getElementById('confidence-value');
    
    badge.className = `confidence-badge confidence-${confidence.level}`;
    value.textContent = `${confidence.label} (${(confidence.score * 100).toFixed(1)}%)`;
}

function renderSynthesis(synthesis) {
    const content = document.getElementById('synthesis-content');
    content.innerHTML = synthesis
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

function renderMatches(matches) {
    const container = document.getElementById('matches-list');
    container.innerHTML = matches.map(m => `
        <div class="match-card">
            <div class="match-header">
                <span class="match-title">${escapeHtml(m.title)}</span>
                <span class="similarity-score">${(m.similarity * 100).toFixed(1)}%</span>
            </div>
            <div class="match-source">${m.source} • ${m.published}</div>
            <div class="match-abstract">${escapeHtml(m.abstract.substring(0, 150))}...</div>
        </div>
    `).join('');
}

function renderCitations(matches) {
    const list = document.getElementById('citations-list');
    list.innerHTML = matches.map((m, i) => {
        const author = m.authors ? m.authors[0] : m.authors;
        const metric = m.citations ? `${m.citations} citations` : `${m.stars} stars`;
        return `
            <li>
                <strong>[${i + 1}]</strong> 
                <a href="${m.url}" target="_blank" rel="noopener">${escapeHtml(m.title)}</a>
                <br>
                <small>${author} et al. • ${m.source} • ${metric}</small>
            </li>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// MAIN PROCESS
// ============================================

async function processGoal() {
    const goalInput = document.getElementById('goal-input');
    const goal = goalInput.value.trim();
    
    if (!goal) {
        showError('Please enter a research goal');
        return;
    }
    
    hideError();
    showLoading(true);
    document.getElementById('results').hidden = true;
    
    try {
        // Fetch research (simulated with shuffled mock data)
        const sources = await fetchResearch();
        
        // Re-initialize vectors with current corpus
        initVectors();
        
        // Find top-k matches using cosine similarity
        const topMatches = findTopK(goal, 3);
        
        // Calculate confidence
        const confidence = calculateConfidence(topMatches);
        
        // Generate synthesis
        const synthesis = generateSynthesis(goal, topMatches);
        
        // Update UI
        updateConfidenceBadge(confidence);
        renderSynthesis(synthesis);
        renderMatches(topMatches);
        renderCitations(topMatches);
        
        document.getElementById('results').hidden = false;
        
    } catch (error) {
        console.error('Processing error:', error);
        showError('Failed to process research goal. Please try again.');
    } finally {
        showLoading(false);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize vectors on load
    initVectors();
    
    // Button click handler
    document.getElementById('synthesize-btn').addEventListener('click', processGoal);
    
    // Enter key handler (fixed)
    document.getElementById('goal-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            processGoal();
        }
    });
});
