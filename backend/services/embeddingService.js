const { GoogleGenAI } = require("@google/genai");

// ========================================
// GEMINI EMBEDDING CONFIGURATION
// ========================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ========================================
// GENERATE EMBEDDING
// ========================================

const generateEmbedding = async (text) => {
  try {
    if (!text || !text.trim()) {
      throw new Error(
        "Text is required to generate embedding"
      );
    }

    const result = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: text.trim(),
    });

    if (
      !result ||
      !result.embeddings ||
      !result.embeddings[0] ||
      !result.embeddings[0].values
    ) {
      throw new Error(
        "Gemini returned an invalid embedding"
      );
    }

    return result.embeddings[0].values;

  } catch (error) {
    console.error(
      "Embedding Generation Error:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to generate embedding"
    );
  }
};

// ========================================
// COSINE SIMILARITY
// ========================================

const cosineSimilarity = (vectorA, vectorB) => {
  if (!vectorA || !vectorB) {
    return 0;
  }

  if (vectorA.length !== vectorB.length) {
    return 0;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];

    magnitudeA += vectorA[i] * vectorA[i];

    magnitudeB += vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (
    magnitudeA === 0 ||
    magnitudeB === 0
  ) {
    return 0;
  }

  return (
    dotProduct /
    (magnitudeA * magnitudeB)
  );
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  generateEmbedding,
  cosineSimilarity,
};