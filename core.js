/**
 * KIM - Core Logic (Node.js compatible)
 * TF-IDF embeddings + Cosine similarity
 */

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

function tokenize(text) {
    return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\W+/)
        .filter(w => w.length > 2);
}

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

function generateResponse(query, sources) {
    const keywords = tokenize(query);
    const keyTerms = keywords.slice(0, 3).join(', ') || query;
    
    const templates = [
        `Based on current research, **${keyTerms}** shows strong promise with demonstrated improvements of 20-40% over baseline approaches. Key implementations include production-grade frameworks with 3K+ GitHub stars and edge-deployment capabilities.`,
        
        `The convergence of **${keyTerms}** enables billion-scale vector search with <50ms latency and 99%+ recall. Hybrid approaches combining classical TF-IDF with dense embeddings outperform pure neural methods on out-of-domain queries.`,
        
        `For **${keyTerms}**, researchers recommend: (1) HNSW++ indexing for large-scale deployment, (2) GPU acceleration achieving 10M queries/second, (3) Meta-prompt scaffolding for 23% reasoning improvements.`,
        
        `Research on **${keyTerms}** indicates three critical factors: indexing efficiency (40% latency reduction), quantization techniques (8x memory savings), and hybrid retrieval strategies. Production systems should prioritize these optimizations.`
    ];
    
    const hash = query.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return templates[hash % templates.length];
}

let docFreq = null;
let sourceVectors = null;

function initVectors() {
    const docs = mockSources.map(s => `${s.title} ${s.abstract}`);
    _docFreq = buildDocFreq(docs);
    const N = docs.length;
    
    _sourceVectors = mockSources.map(s => ({
        ...s,
        vector: tfidfEmbed(`${s.title} ${s.abstract}`, _docFreq, N)
    }));
}

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function fetchResearch() {
    await new Promise(r => setTimeout(r, 600));
    return shuffle(mockSources);
}

function findTopK(query, k = 3) {
    const queryVec = tfidfEmbed(query, _docFreq, mockSources.length);
    
    const scored = _sourceVectors.map(s => ({
        ...s,
        similarity: cosineSim(queryVec, s.vector)
    }));
    
    scored.sort((a, b) => b.similarity - a.similarity);
    return scored.slice(0, k);
}

function calculateConfidence(topSources) {
    const avgSim = topSources.reduce((sum, s) => sum + s.similarity, 0) / topSources.length;
    
    if (avgSim > 0.5) return { level: 'high', score: avgSim, label: 'HIGH' };
    if (avgSim > 0.3) return { level: 'medium', score: avgSim, label: 'MEDIUM' };
    return { level: 'low', score: avgSim, label: 'LOW' };
}

let _docFreq = null;
let _sourceVectors = null;

module.exports = {
    mockSources,
    tokenize,
    buildDocFreq,
    tfidfEmbed,
    cosineSim,
    generateResponse,
    initVectors,
    fetchResearch,
    findTopK,
    calculateConfidence,
    getDocFreq: () => _docFreq,
    getSourceVectors: () => _sourceVectors
};