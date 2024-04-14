import axios from "axios";
import * as cheerio from "cheerio";
import moment from "moment";
import MySQLConnection from "./db.js";

class Crawler {
  constructor(url = "") {
    this.companyLinks = [];
    this.url = url;
    this.baseUrl = "https://www.companydetails.in";
    this.scrapedData = [];
    this.mysqlConnection = new MySQLConnection();
  }

  async ScrapeData() {
    try {
      const response = await axios.get(this.url);
      const $ = cheerio.load(response.data);
      $("a.fs-6.text-uppercase").map(async (idx, element) => {
        let link = $(element).attr("href");
        let modifiedLinkToProcessThePage = `${this.baseUrl}${link}`;
        let processedData = await this.ProcessAndStoreScrappedData(
          modifiedLinkToProcessThePage
        );
        await this.ValidateAndInsertData(processedData);
      });
    } catch (error) {
      console.log("error scareData method>>", error);
    }
  }

  async ProcessAndStoreScrappedData(url) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      let dataObj = {};
      $('div[id="basicdetails"]')
        .children()
        .each((idx, elem) => {
          if (!$(elem).hasClass("mt-5")) {
            let key = $(elem)
              .find("div > div > div > a")
              .text()
              .toLowerCase()
              .split(" ")
              .join("")
              .trim();
            let value = $(elem).find("div > div > div > h6").text().trim();
            if (key) {
              dataObj[key] = value;
            }
          } else if ($(elem).hasClass("mt-5")) {
            $(elem)
              .children()
              .each((_, nestElem) => {
                let key = $(nestElem)
                  .find("div > div > div > a")
                  .text()
                  .toLowerCase()
                  .split(" ")
                  .join("")
                  .trim();
                let value = $(nestElem)
                  .find("div > div > div > h6")
                  .text()
                  .trim();
                if (key) {
                  dataObj[key] = value;
                }
              });
          }
        });
      return dataObj;
    } catch (error) {
      console.log(error);
    }
  }

  async ValidateAndInsertData(data) {
    const fieldDataTypes = {
      registrationdate: "DATE",
      authorisedcapital: "INT",
      paidupcapital: "INT",
      pincode: "INT",
      lastannualgeneralmeetingdate: "DATE",
      latestdateofbalancesheet: "DATE",
    };

    const validatedData =
      data?.cin?.length === 21 && data?.pincode?.length === 6;

    if (!validatedData) {
      console.log(
        "Data validation failed. CIN and PIN lengths must be 21 and 6, respectively."
      );
      return;
    }

    Object.keys(data).forEach((field) => {
      if (fieldDataTypes[field]) {
        if (fieldDataTypes[field] === "DATE") {
          if (data[field]) {
            data[field] = moment
              .utc(data[field], "DD-MMM-YYYY")
              .format("YYYY-MM-DD");
          } else {
            data[field] = null;
          }
        } else if (fieldDataTypes[field] === "INT") {
          data[field] = parseInt(data[field]);
        }
      }
    });

    await this.mysqlConnection.insertData(data);
  }
}

export default Crawler;
