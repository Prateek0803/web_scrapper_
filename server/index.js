import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import Crawler from "./scrapper.js";
import MySQLConnection from "./db.js";
import clientRoutes from "./clientRoutes.js";
import ElasticsearchConfig from "./elasticsearchConfig.js";

const app = express();
const crawler = new Crawler("https://bit.ly/3lmNMTA");
const mysqlConnection = new MySQLConnection();
const elasticsearchConfig = new ElasticsearchConfig("http://localhost:9200");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

app.use("/", clientRoutes);

app.get("/scrape", async (req, res) => {
  console.log("Starting scraping...");
  try {
    await scrape();
    console.log("Data scraped successfully");
    res.status(200).send("Data scraped successfully");
  } catch (error) {
    console.error("Error scraping data:", error);
    res.status(500).send("Error scraping data");
  }
});

const scrape = async () => {
  await crawler.ScrapeData();
};

app.listen(process.env.PORT, async () => {
  await elasticsearchConfig.connect();
  mysqlConnection.connect();
  console.log("Server started");
});
