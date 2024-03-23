const puppeteer = require("puppeteer");
const robotsParser = require("robots-parser");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { preprocessText } = require("../utils/helper");
const { vectorizeText } = require("./vectorize");
const { insertVector } = require("./qdrant");

async function crawlUrl({ url }) {
  try {
    const data = {};
    let bfsQueue = [url];
    const browser = await puppeteer.launch();
    const robotsTxtURL = `${new URL(url).origin}/robots.txt`;
    let robotsTxtContent;
    try {
      robotsTxtContent = await fetch(robotsTxtURL).then((res) => res.text());
    } catch (error) {
      console.error("Error fetching robots.txt:", error);
      robotsTxtContent = "";
    }
    const robotsTxt = robotsParser(robotsTxtURL, robotsTxtContent);
    while (bfsQueue.length) {
      const queueUrl = bfsQueue.pop();
      console.log("crawling current url:", queueUrl);
      const page = await browser.newPage();
      try {
        await page.goto(queueUrl, { waitUntil: "networkidle2" });

        // commenting as of now will check this later
        // if (robotsTxt && !robotsTxt.isAllowed(queueUrl)) {
        //   console.log(`URL ${queueUrl} is disallowed by robots.txt`);
        //   continue;
        // }

        const textData = await page.$eval("*", (el) => el.innerText);
        const preprocessedText = preprocessText(textData);
        data[queueUrl] = preprocessedText;

        const hrefs = await page.$$eval("a", (anchorEls) =>
          anchorEls.map((a) => a.href)
        );

        const filteredHrefs = hrefs.filter(
          (href) =>
            new URL(href).origin === new URL(url).origin &&
            data[href] === undefined
        );
        bfsQueue.push(...filteredHrefs);
        bfsQueue = [...new Set(bfsQueue)];
        await page.close();
      } catch (error) {
        console.error("Error while crawling:", error);
        data[queueUrl] = `Error: ${error.message}`;
        await page.close();
      }
    }
    await browser.close();
    return { ok: true, data };
  } catch (err) {
    console.error("Error in crawlerService: crawlUrl:", err.message);
    return { ok: false, err: err.message };
  }
}

module.exports = {
  crawlUrlAndVectorize: async ({ url }) => {
    try {
      const crawledData = await crawlUrl({ url });
      if (!crawledData?.ok || crawledData?.data.length === 0) {
        return { ok: false, err: crawledData.err };
      }
      const crawledContent = Object.values(crawledData.data);
      console.log("Done with Crawling and preprocessing the url");
      const vector = await vectorizeText({ text: crawledContent });
      if (!vector.ok) {
        return { ok: false, err: vector.err };
      }
      const insertedVector = await insertVector({
        content: crawledContent,
        vector: vector.data,
      });
      if (!insertedVector.ok) {
        return { ok: false, err: insertedVector.err };
      }
      return { ok: true, data: "Data Crawling Completed" };
    } catch (err) {
      console.error(
        "Error in crawlerService: crawlUrlAndVectorize:",
        err.stack
      );
      return { ok: false, err: err.message };
    }
  },
};
