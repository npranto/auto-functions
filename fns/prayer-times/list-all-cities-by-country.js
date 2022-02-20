const puppeteer = require("puppeteer");
const path = require("path");
const writeToFile = require("../../utils/writeToFile.js");

const scrapeCities = async (page, url, cities = []) => {
  // open new page
  // go to the url
  await page.goto(url);

  // wait for element for scrape
  await page.waitForSelector("#all-cities");

  // scrape all the cities and save it under cities variable
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
  cities = [...cities, ...cityInfo];

  // find next page url
  const nextPageLink = await page.evaluate(() => {
    const nextPageLinkElem = document.querySelector(
      ".pagination .pagination-next a"
    );
    return nextPageLinkElem?.href || null;
  });

  console.log(">>>>>>>>>>");
  console.log(cityInfo, nextPageLink);
  console.log(">>>>>>>>>>");

  // if it exists
  if (nextPageLink !== null) {
    return await scrapeCities(page, nextPageLink, cities);
    // recursively call this function by passing the next page url and the latest cities list
  } else {
    // otherwise, return cities
    return cities;
  }
};

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // await page.setViewport({ width: 1920, height: 1080 });

  const allCities = await scrapeCities(
    page,
    "https://www.islamicfinder.org/world/vatican-city/",
    []
  );

  writeToFile(
    path.join(__dirname, "..", "..", "data", "list-all-cities-by-country.json"),
    JSON.stringify(
      { "https://www.islamicfinder.org/world/vatican-city/": allCities },
      null,
      2
    )
  );

  await browser.close();
})();
