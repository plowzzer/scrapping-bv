import "./config/env";
import * as puppeteer from "puppeteer";
import { readFile, updateFile } from "./utils/utils";
import Mail from "./services/Mail";
import hastaPublicaMailTemplate from "./views/hastaPublica";

export interface Bid {
  status: string;
  name: string;
  type: string;
  place: string;
  description: string;
  prices: object;
  link: string;
}

const scrape = async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  const urls = [
    "https://www.hastapublica.com.br/busca?id_categoria=2&id_sub_categoria=85&localidade=&data=&id_leilao=&palavra=",
  ];
  const allData = [];

  async function pageQnt() {
    // var recursive = true;
    while (true) {
      await page.goto(urls[urls.length - 1]);
      const evaReturn = await page.evaluate(() => {
        const pagination = document.querySelectorAll(
          ".pageLeilao .pagination a .fa-angle-right"
        );
        if (pagination.length > 0) {
          return pagination[0].parentElement.parentElement.href;
        } else {
          return null;
        }
      });

      if (evaReturn !== null) {
        urls.push(evaReturn);
      } else {
        return;
      }
    }
  }

  async function scrapePages() {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      await page.goto(url);
      const results = await page.evaluate(() => {
        const bids: Array<Object> = [];

        document
          .querySelectorAll(".pageLeilao .card-leilao")
          .forEach((element) => {
            let data: Bid = {} as Bid;

            let status = element.querySelectorAll(".card-header .col-md-9 dd");
            let type = element.querySelectorAll(".card-header .col-md-9 dt");
            let name = element.querySelectorAll(".card-header .col-md-12 dt");
            data["status"] = status[0].textContent!;
            data["type"] = type[0].textContent!;
            data["name"] = name[0].textContent!;

            let place = element.querySelectorAll(".card-body .fullwidth dt");
            let description = element.querySelectorAll(
              ".card-body .fullwidth dd"
            );
            data["place"] = place[0].textContent!;
            data["description"] = description[0].textContent!;

            let pricesNode = element.querySelectorAll(".card-body .col-md-6");
            let priceToFilter = [...pricesNode];
            let pricesArray = [];

            for (let i = 1; i < priceToFilter.length; i = i + 2) {
              let price = {
                date: priceToFilter[i].innerText,
                value: priceToFilter[i + 1].getElementsByTagName("dd")[0]
                  .innerText,
              };
              pricesArray.push(price);
            }
            data["prices"] = pricesArray;

            let link: NodeListOf<HTMLLinkElement> = element.querySelectorAll(
              ".card-footer a"
            );
            data["link"] = link[0].href;

            bids.push(data);
          });

        return bids;
      });
      results.forEach((result) => {
        allData.push(result);
      });
    }

    await browser.close();

    return allData;
  }

  try {
    await pageQnt(urls[0]);
    await scrapePages();
    return allData;
  } catch (error) {
    console.error("error: ", error);
  }

  await browser.close();
};

(async () => {
  const dataFile = "./src/data/hastaPublica.json";
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
      Mail.to = "pedro.pizzo@bild.com.br, diogenes.oliveira@bild.com.br";
      Mail.subject = "NAVE SENTINELA - Encontramos novos Leilões";
      Mail.message = hastaPublicaMailTemplate(newData);
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
