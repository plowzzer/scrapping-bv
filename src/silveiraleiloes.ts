import "./config/env";
import * as puppeteer from "puppeteer";
import { readFile, updateFile } from "./utils/utils";
import Mail from "./services/Mail";
import silveiraMailTemplate from "./views/silveira";

export interface Bid {
  status: string;
  name: string;
  type: string;
  description: string;
  prices: object;
  link: string;
}

const scrape = async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto("https://silveiraleiloes.com.br/");

  const result = await page.evaluate(() => {
    const home: Array<Object> = [];

    document.querySelectorAll(".leilao").forEach((element) => {
      let data: Bid = {} as Bid;

      let type = element.querySelectorAll("article > .home-titulo > p");

      if (
        type[1].innerHTML.toLowerCase().includes("gleba") ||
        type[1].innerHTML.toLowerCase().includes("terreno")
      ) {
        let name = element.querySelectorAll("article > .home-titulo > h1");
        data["name"] = name[0].innerHTML;

        let status = element.querySelectorAll(".home-button > a .text-left");
        data["status"] = status[0].textContent!;

        let type = element.querySelectorAll("article > .home-titulo > p");
        data["type"] = type[0].innerHTML;
        data["description"] = type[1].innerHTML;

        let prices = element.querySelectorAll(".home-pracas > p");
        let pricesArray: Array<string> = [];
        prices.forEach((price) => {
          console.log(price.innerHTML);
          if (price.innerHTML !== "&nbsp;") {
            let info = price.innerText.replace("-", "").split("R$ ");
            pricesArray.push({
              date: info[0],
              value: info[1],
            });
          }
        });

        data["prices"] = pricesArray;

        let link: NodeListOf<HTMLLinkElement> = element.querySelectorAll(
          ".home-button > a"
        );
        data["link"] = link[0].href;

        home.push(data);
      }
    });

    return home;
  });

  await browser.close();

  return result;
};

(async () => {
  const dataFile = "./data/silveiraLeiloes.json";
  const oldData = readFile(dataFile);
  const newData: any = [];
  try {
    const result = await scrape();
    result.forEach((element) => {
      let elementChecker = oldData.find(
        (oldElements: Bid) => oldElements.description === element.description
      );
      if (!elementChecker) {
        newData.push(element);
      }
    });

    if (newData.length > 0) {
      Mail.from = "rpa.csc@bild.com.br";
      Mail.to =
        "pedro.pizzo@bild.com.br, diogenes.oliveira@bild.com.br, marlon@bild.com.br, heribert.schmidt@bild.com.br";
      Mail.subject = "NAVE SENTINELA - Encontramos novos Leilões";
      Mail.message = silveiraMailTemplate(newData);
      const sender = Mail.sendMail();

      sender && updateFile(dataFile, newData);
    }

    console.log(`----------RESULTS----------\n`);
    console.log(`Total New: ${newData.length}`);
    console.log(`Total Scraped: ${result.length}`);
    console.log(`Total Saved: ${oldData.length + newData.length}`);
    console.log(`---------------------------\n\n`);
  } catch (error) {
    console.error("something went wrong:", error);
  }
})();
