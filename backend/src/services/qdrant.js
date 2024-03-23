const { QdrantClient } = require("@qdrant/qdrant-js");
async function insertVector({ content, vector }) {
  try {
    const client = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_KEY,
    });
    const collectionName = "crawled_content";
    const result = await client.getCollections();
    const collectionExists = result.collections.some(
      (collection) => collection.name === collectionName
    );
    if (!collectionExists) {
      console.log("Collection not found, creating:", collectionName);
      await client.createCollection(collectionName, {
        vectors: {
          size: vector.length,
          distance: "Cosine",
        },
      });
    }
    await client.upsert(collectionName, {
      wait: true,
      points: [
        {
          id: Date.now(),
          vector,
          payload: {
            content,
          },
        },
      ],
    });
    console.log("vector inserted successfully");
    return { ok: true, data: "Vector inserted successfully!" };
  } catch (err) {
    console.error("Error inserting vector:", err.stack);
    return { ok: false, err: err.message };
  }
}
module.exports = {
  insertVector,
};
