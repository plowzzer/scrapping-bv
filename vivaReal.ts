import * as puppeteer from "puppeteer";
import * as fs from "fs";

interface Property {
  constructionCompany: string;
  title: string;
  url: string;
  address: string;
  price: string;
  area: string;
  rooms: string;
  bathrooms: string;
  garage: string;
}

const scrape = async () => {
  const url =
    "https://www.vivareal.com.br/imoveis-lancamento/ribeirao-preto/apartamento_residencial/status-na-planta/?__vt=gv:a#onde=BR-Sao_Paulo-NULL-Ribeirao_Preto&tipos-lancamento=apartamento_residencial";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const result = await page.evaluate(() => {
    const myData: Array<Property> = [];
    document
      .querySelectorAll(".results-list .property-card__container")
      .forEach((element) => {
        let data: Property = {};

        let constructionCompany = element.querySelector("picture img");
        data["constructionCompany"] = constructionCompany?.alt;

        let propertyTitle = element.querySelector(
          ".property-card__header > .property-card__title"
        );
        data["title"] = propertyTitle?.innerText;
        data["url"] = propertyTitle?.href;

        let propertyPlace = element.querySelector(
          ".property-card__header > .property-card__address"
        );
        data["address"] = propertyPlace?.innerText;

        let price = element.querySelector(
          ".property-card__values > .property-card__price"
        );
        data["price"] = price?.innerText;

        let detailsM2 = element.querySelector(
          ".property-card__detail-area .property-card__detail-value"
        );
        data["area"] = detailsM2?.innerText;
        let detailRoom = element.querySelector(
          ".property-card__detail-room .property-card__detail-value"
        );
        data["rooms"] = detailRoom?.innerText;
        let detailBathroom = element.querySelector(
          ".property-card__detail-bathroom .property-card__detail-value"
        );
        data["bathrooms"] = detailBathroom?.innerText;
        let garage = element.querySelector(
          ".property-card__detail-garage .property-card__detail-value"
        );
        garage?.innerText === "--"
          ? (data["garage"] = "")
          : (data["garage"] = garage?.innerText);

        console.log(element);

        myData.push(data);
      });

    return myData;
  });

  fs.writeFile("tmp/vivaReal.json", JSON.stringify(result, null, 2), (err) => {
    if (err) {
      throw err;
    }
    console.log("JSON file is saved.");
  });

  await browser.close();

  return result;
};

scrape().then((response) => {
  console.log(response);
});
