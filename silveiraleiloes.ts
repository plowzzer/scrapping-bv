import * as puppeteer from "puppeteer";
import * as fs from "fs";

//{ headless: false }

const scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://silveiraleiloes.com.br/");

  const result = await page.evaluate(() => {
    const home = [];

    document.querySelectorAll(".leilao").forEach((element) => {
      let data = {};
      let status = element.querySelectorAll(".home-button > a .text-left");
      data["status"] = status[0].textContent;

      let name = element.querySelectorAll("article > .home-titulo > h1");
      data["name"] = name[0].innerHTML;

      let type = element.querySelectorAll("article > .home-titulo > p");
      data["type"] = type[0].innerHTML;
      data["description"] = type[1].innerHTML;

      let prices = element.querySelectorAll(".home-pracas > p");
      let pricesArray = [];
      prices.forEach((price) => {
        pricesArray.push(price.textContent);
      });

      let link = element.querySelectorAll(".home-button > a");
      data["link"] = link[0].href;

      home.push(data);
    });

    return home;
  });

  fs.writeFile("tmp/export.json", JSON.stringify(result, null, 2), (err) => {
    if (err) {
      throw err;
    }
    console.log("JSON file is saved.");
  });

  await browser.close();

  return result;
};

scrape().then((value) => {
  console.log(value);
});
