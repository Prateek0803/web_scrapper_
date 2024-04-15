import axios from "axios";
import * as cheerio from "cheerio";
import moment from "moment";
import MySQLConnection from "./db.js";
import ElasticsearchConfig from "./elasticsearchConfig.js";

class Crawler {
  constructor(url = "") {
    this.companyLinks = [];
    this.url = url;
    this.baseUrl = "https://www.companydetails.in";
    this.scrapedData = [];
    this.mysqlConnection = new MySQLConnection();
    this.elasticsearchClient = new ElasticsearchConfig("http://localhost:9200");
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
        await this.InsertDataToElasticsearch(processedData);
      });
    } catch (error) {
      console.log("ScrapeDataFailed", error);
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

  async InsertDataToElasticsearch(data) {
    try {
      const index = "company_data";
      const client = this.elasticsearchClient.getClient();
      const mapping = {
        companyname: { type: "text" },
        companyactivity: { type: "text" },
        cin: { type: "keyword" },
        registrationdate: { type: "date", format: "yyyy-MM-dd" },
        category: { type: "text" },
        subcategory: { type: "text" },
        companyclass: { type: "text" },
        roc: { type: "text" },
        companystatus: { type: "text" },
        authorisedcapital: { type: "integer" },
        paidupcapital: { type: "integer" },
        lastannualgeneralmeetingdate: { type: "text" },
        latestdateofbalancesheet: { type: "text" },
        state: { type: "text" },
        pincode: { type: "keyword" },
        country: { type: "text" },
        address: { type: "text" },
        email: { type: "keyword" },
      };

      const indexExists = await client.indices.exists({
        index,
      });

      if (!indexExists) {
        await client.indices.create({
          index,
          body: { mappings: { properties: mapping } },
        });
      } else {
        console.log(`Index '${index}' already exists.`);
      }

      if (data.registrationdate) {
        data.registrationdate = moment(
          data.registrationdate,
          "DD-MMM-YYYY"
        ).format("YYYY-MM-DD");
      }

      await client.index({
        index,
        body: data,
      });

      console.log("Data inserted into Elasticsearch successfully.");
    } catch (error) {
      console.error("Error inserting data into Elasticsearch:", error);
    }
  }
}

export default Crawler;
