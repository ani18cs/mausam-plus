import { KNOWLEDGE_BASE_DOCUMENTS, KnowledgeDocument } from './knowledgeBase';
import { AIAuditChunk } from '@mausam/shared-types';

export interface DocumentChunk {
  id: string;
  docId: string;
  title: string;
  source: string;
  category: string;
  content: string;
  vector?: number[];
}

/**
 * Clean text into word tokens
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'are', 'was', 'were',
  'will', 'been', 'about', 'what', 'when', 'where', 'which', 'who', 'how', 'than',
  'into', 'more', 'some', 'such', 'only', 'other', 'then', 'also', 'over', 'these',
]);

class VectorStore {
  private chunks: DocumentChunk[] = [];
  private vocabulary: Map<string, number> = new Map();
  private docVectors: number[][] = [];
  private idf: Map<string, number> = new Map();

  constructor() {
    this.initialize();
  }

  private initialize() {
    // 1. Chunk documents by paragraph
    let chunkIndex = 0;
    for (const doc of KNOWLEDGE_BASE_DOCUMENTS) {
      const paragraphs = doc.content
        .split('\n\n')
        .map((p) => p.trim())
        .filter((p) => p.length > 30);

      for (const p of paragraphs) {
        this.chunks.push({
          id: `chunk-${++chunkIndex}`,
          docId: doc.id,
          title: doc.title,
          source: doc.source,
          category: doc.category,
          content: p,
        });
      }
    }

    // 2. Build Vocabulary & IDF
    const totalDocs = this.chunks.length;
    const docFreq: Map<string, number> = new Map();

    const chunkTokens = this.chunks.map((c) => {
      const tokens = tokenize(`${c.title} ${c.content}`);
      const uniqueTokens = new Set(tokens);
      for (const t of uniqueTokens) {
        docFreq.set(t, (docFreq.get(t) || 0) + 1);
      }
      return tokens;
    });

    let termIndex = 0;
    for (const [term, freq] of docFreq.entries()) {
      this.vocabulary.set(term, termIndex++);
      this.idf.set(term, Math.log((totalDocs + 1) / (freq + 1)) + 1);
    }

    // 3. Compute TF-IDF Vectors for all chunks
    const vocabSize = this.vocabulary.size;
    this.docVectors = chunkTokens.map((tokens) => {
      const vec = new Array(vocabSize).fill(0);
      const tf: Map<string, number> = new Map();
      for (const t of tokens) {
        tf.set(t, (tf.get(t) || 0) + 1);
      }

      for (const [term, count] of tf.entries()) {
        const idx = this.vocabulary.get(term);
        const idfVal = this.idf.get(term) || 1;
        if (idx !== undefined) {
          vec[idx] = (count / tokens.length) * idfVal;
        }
      }

      // Normalize vector
      return this.normalizeVector(vec);
    });

    console.log(`📚 [RAG Vector Store] Indexed ${this.chunks.length} knowledge chunks across ${vocabSize} vocabulary terms.`);
  }

  private normalizeVector(vec: number[]): number[] {
    const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    if (norm === 0) return vec;
    return vec.map((val) => val / norm);
  }

  private vectorizeQuery(query: string): number[] {
    const tokens = tokenize(query);
    const vocabSize = this.vocabulary.size;
    const vec = new Array(vocabSize).fill(0);
    const tf: Map<string, number> = new Map();

    for (const t of tokens) {
      tf.set(t, (tf.get(t) || 0) + 1);
    }

    for (const [term, count] of tf.entries()) {
      const idx = this.vocabulary.get(term);
      const idfVal = this.idf.get(term);
      if (idx !== undefined && idfVal !== undefined) {
        vec[idx] = (count / Math.max(1, tokens.length)) * idfVal;
      }
    }

    return this.normalizeVector(vec);
  }

  private cosineSimilarity(v1: number[], v2: number[]): number {
    let dot = 0;
    const len = Math.min(v1.length, v2.length);
    for (let i = 0; i < len; i++) {
      dot += v1[i] * v2[i];
    }
    return dot;
  }

  /**
   * Searches knowledge base for top K relevant passages
   */
  search(query: string, topK = 4): AIAuditChunk[] {
    const queryVec = this.vectorizeQuery(query);

    const scored = this.chunks.map((chunk, i) => {
      const sim = this.cosineSimilarity(queryVec, this.docVectors[i]);
      return { chunk, score: sim };
    });

    // Sort by descending score
    scored.sort((a, b) => b.score - a.score);

    // If highest score is very low, still provide top general safety guidelines
    const topScored = scored.slice(0, topK);

    return topScored.map((item) => ({
      id: item.chunk.id,
      title: item.chunk.title,
      source: item.chunk.source,
      snippet: item.chunk.content,
      score: Math.round(item.score * 100) / 100,
    }));
  }
}

export const vectorStore = new VectorStore();
