const { WordTokenizer, PorterStemmer } = require("natural");
const stopwords = require("stopwords").english;

function preprocessText(text) {
  text = text.toLowerCase();
  text = text.replace(/[^\w\s]/gi, "");
  const tokenizer = new WordTokenizer();
  const tokens = tokenizer.tokenize(text);
  const filteredTokens = tokens.filter((token) => !stopwords.includes(token));
  const stemmer = PorterStemmer;
  const lemmatizedTokens = filteredTokens.map((token) => stemmer.stem(token));
  const processedText = lemmatizedTokens.join(" ");
  return processedText;
}

module.exports = {
  preprocessText,
};
