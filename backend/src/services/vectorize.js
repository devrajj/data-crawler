require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");
let model;
async function loadModel() {
  model = await use.load();
}
async function vectorizeText({ text }) {
  try {
    if (!Array.isArray(text)) {
      return { ok: false, err: "Embedding needs to be an array." };
    }
    if (!model) {
      await loadModel();
    }
    const embeddings = await model.embed(text);
    const embeddingsArray = embeddings.arraySync()[0];
    return { ok: true, data: embeddingsArray };
  } catch (err) {
    console.error("Error in vectorizeText service:", err.stack);
    return { ok: false, err: err.message };
  }
}
exports.vectorizeText = vectorizeText;
