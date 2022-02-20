const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const path = require("path");
const writeToFile = require("../utils/writeToFile.js");

require("dotenv").config();

(async () => {
  console.log("Starting cities-in-us.js...");
  try {
    // launch browser + setup page
    console.log("> Launching browser and creating a new page");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log(`> Opening page - "${process.env.CITIES_IN_US_URL}"`);
    await page.goto(process.env.CITIES_IN_US_URL);

    // setup DOM for page query
    console.log("> Setting up DOM to query target page");
    const dom = await page.content();
    const $ = cheerio.load(dom);

    const stateContainerTargetId = ".topic-content > section";
    const stateNameTargetId = "h2 > a";
    const cityNameTargetId = ".topic-list > li a";

    // extract out all the cities
    console.log("> Extracting out all the cities and states");
    const citiesInfo = $(stateContainerTargetId)
      .map((_, section) => {
        // extract name of the state
        const state = $(section)?.find(stateNameTargetId)?.text();
        // extract list of all the cities within the state
        const cities = $(section)
          .find(cityNameTargetId)
          .map((_, link) => $(link).text())
          .get();
        // map each city to its corresponding state
        return cities.map((city) => {
          return {
            state,
            city,
          };
        });
      })
      .get();

    console.log(
      `> Creating and writing to file - ${path.join(
        __dirname,
        "..",
        "data",
        "cities-in-us.json"
      )}`
    );
    writeToFile(
      path.join(__dirname, "..", "data", "cities-in-us.json"),
      JSON.stringify(citiesInfo, null, 2)
    );
    console.log("Exiting cities-in-us.js");

    await browser.close();
  } catch (error) {
    throw error;
  }
})();
