module.exports = {
  crawlUrl: async ({ url }) => {
    try {
      return { ok: true, data: url };
    } catch (err) {
      console.error("Error in crawlerService: crawlUrl:", err.stack);
      return { ok: false, err: err.stack };
    }
  },
};
