const puppeteer = require("puppeteer");
const robotsParser = require("robots-parser");
const fetch = require("node-fetch");

async function crawlUrl({ url }) {
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
      data[queueUrl] = textData;

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
  return data;
}

module.exports = {
  crawlUrlAndVectorize: async ({ url }) => {
    try {
      const crawledData = await crawlUrl({ url });
      return { ok: true, data: crawledData };
    } catch (err) {
      console.error(
        "Error in crawlerService: crawlUrlAndVectorize:",
        err.stack
      );
      return { ok: false, err: err.stack };
    }
  },
};
