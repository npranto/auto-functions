const puppeteer = require("puppeteer");
const path = require("path");
const writeToFile = require("../../utils/writeToFile.js");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://www.islamicfinder.org/world/");

  await page.waitForSelector("#all-countries");

  const countryInfo = await page.evaluate(() => {
    const links = document.querySelectorAll("#all-countries a");
    const info = Array.from(links).map((link) => {
      return {
        country: (link?.innerText || "").trim(),
        linkToCities: link.href,
      };
    });
    return info;
  });

  writeToFile(
    path.join(
      __dirname,
      "..",
      "..",
      "data",
      "prayer-times-list-all-countries.json"
    ),
    JSON.stringify(countryInfo, null, 2)
  );

  await browser.close();
})();
