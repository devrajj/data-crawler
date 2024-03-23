const crawlerService = require("../../services/crawler");

module.exports = {
  crawlUrlAndVectorize: async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.invalid({ msg: "url is required" });
      }
      const response = await crawlerService.crawlUrlAndVectorize({ url });
      if (response.ok) {
        return res.success({ data: response.data });
      }
      return res.failure({ msg: response.err });
    } catch (err) {
      console.error("error in crawlUrlAndVectorize:", err.stack);
      return res.failure({ msg: err.message });
    }
  },
};
