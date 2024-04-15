import { Client, HttpConnection } from "@elastic/elasticsearch";
import dotenv from "dotenv";

dotenv.config();

class ElasticsearchConfig {
  constructor(nodeUrl) {
    this.client = new Client({
      node: nodeUrl.toString(),
      Connection: HttpConnection,
      auth: {
        username: process.env.ELASTIC_USER,
        password: process.env.ELASTIC_PASSWORD,
      },
    });
  }

  async connect() {
    try {
      await this.client.ping();
      console.log("Connected to Elasticsearch");
    } catch (error) {
      console.error("Elasticsearch connection failed:", error);
    }
  }

  getClient() {
    return this.client;
  }
}

export default ElasticsearchConfig;
