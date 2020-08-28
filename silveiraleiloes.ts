import * as puppeteer from "puppeteer";
import { readFile, whiteFile } from "./utils/utils";
import Mail from "./services/Mail";
import mailer from "./config/mailer";

//{ headless: false }
interface Bid {
  status: string;
  name: string;
  type: string;
  description: string;
  prices: string;
  link: string;
}

const scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://silveiraleiloes.com.br/");

  const result = await page.evaluate(() => {
    const home = [];

    document.querySelectorAll(".leilao").forEach((element) => {
      let data: Bid = {};

      let type = element.querySelectorAll("article > .home-titulo > p");

      if (
        type[1].innerHTML.toLowerCase().includes("gleba") ||
        type[1].innerHTML.toLowerCase().includes("terreno")
      ) {
        let name = element.querySelectorAll("article > .home-titulo > h1");
        data["name"] = name[0].innerHTML;

        let status = element.querySelectorAll(".home-button > a .text-left");
        data["status"] = status[0]?.textContent;

        let type = element.querySelectorAll("article > .home-titulo > p");
        data["type"] = type[0].innerHTML;
        data["description"] = type[1].innerHTML;

        let prices = element.querySelectorAll(".home-pracas > p");
        let pricesArray = [];
        prices.forEach((price) => {
          pricesArray.push(price.textContent);
        });
        data["prices"] = pricesArray;

        let link = element.querySelectorAll(".home-button > a");
        data["link"] = link[0].href;

        home.push(data);
      }
    });

    return home;
  });

  await browser.close();

  return result;
};

async function main() {
  const oldData = readFile("data/silveiraLeiloes.json");
  try {
    const newData = [];
    const result = await scrape();
    result.forEach((element) => {
      let elementChecker = oldData.find(
        (oldElements: Bid) => oldElements.description === element.description
      );
      if (!elementChecker) {
        newData.push(element);
      }
    });

    Mail.to = "pedro.pizzo@bild.com.br";
    Mail.subject = "NAVE PROBE Leiloes";
    Mail.message = "test message";
    const mailResult = Mail.sendMail();

    console.log(`----------RESULTS----------\n`);
    console.log(`Total New: ${newData.length}`);
    console.log(`Total Scraped: ${result.length}`);
    console.log(`Total Saved: ${oldData.length + newData.length}`);
    console.log(`---------------------------\n\n`);

    console.log(`-----------MAIL-----------`);

    console.log(mailResult);
  } catch (error) {
    console.error("something went wrong:", error);
  }
}

// main();

function mailerTest() {
  Mail.to = "pedro.pizzo@bild.com.br";
  Mail.subject = "NAVE PROBE - Encontramos novos Leilões";
  Mail.message = `
    
  `;
  const mailResult = Mail.sendMail();

  console.log(`-----------MAIL-----------`);
  console.log(mailResult);
}

mailerTest();
