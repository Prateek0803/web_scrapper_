import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Crawler from "./scrapper.js";
import MySQLConnection from "./db.js";
import clientRoutes from "./clientRoutes.js";

const app = express();
const crawler = new Crawler("https://bit.ly/3lmNMTA");
const mysqlConnection = new MySQLConnection();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(clientRoutes);

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

app.listen(8000, () => {
  mysqlConnection.connect();
  console.log("Server started");
});
