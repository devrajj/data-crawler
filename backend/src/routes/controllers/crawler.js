const crawlerService = require("../../services/crawler");

module.exports = {
  crawlUrl: async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.invalid({ msg: "url is required" });
      }
      const response = await crawlerService.crawlUrl({ url });
      if (response.ok) {
        return res.success({ data: response.data });
      }
      return res.failure({ msg: response.err });
    } catch (err) {
      console.error("error in crawlUrl:", err.stack);
      return res.failure({ msg: err.stack });
    }
  },
};
