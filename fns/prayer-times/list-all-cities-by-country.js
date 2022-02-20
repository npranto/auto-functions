const puppeteer = require("puppeteer");
const path = require("path");
const writeToFile = require("../../utils/writeToFile.js");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // await page.setViewport({ width: 1920, height: 1080 });

  await page.goto("https://www.islamicfinder.org/world/united-states/");

  let limit = 1;

  while (limit !== 2) {
    await page.waitForSelector("#all-cities");

    const cityInfo = await page.evaluate(() => {
      const links = document.querySelectorAll("#all-cities a");
      const info = Array.from(links).map((link) => {
        return {
          country: (link?.innerText || "").trim(),
          linkToCities: link.href,
        };
      });
      return info;
    });

    const nextPageLink = await page.evaluate(() => {
      const nextPageLinkElem = document.querySelector(
        ".pagination .pagination-next a"
      );
      return nextPageLinkElem || null;
    });

    console.log(">>>>>>>>>>");
    console.log(cityInfo, nextPageLink);
    console.log(">>>>>>>>>>");

    if (nextPageLink !== null) {
      page.click(".pagination .pagination-next a");
      // nextPageLink.click();
      // page.goto(nextPageLink);
    }

    limit = limit + 1;
  }

  // writeToFile(
  //   path.join(
  //     __dirname,
  //     "..",
  //     "..",
  //     "data",
  //     "prayer-times-list-all-countries.json"
  //   ),
  //   JSON.stringify(countryInfo, null, 2)
  // );

  // await browser.close();
})();
