import express from "express";
import cors from "cors";
import { readFile } from "fs/promises";
import { configDotenv } from "dotenv";
import { CrawlerCore, crawlStart } from "./core.js";
import { defaultConfig } from './config.js'

configDotenv();

const app = express();
const port = Number(process.env.API_PORT) || 4000;
const hostname = process.env.API_HOST || "localhost";

app.use(cors());
app.use(express.json());

// Define a POST route to accept config and run the crawler
app.post("/crawl", async (req, res) => {
  let config = req.body;
  config = config?.url ? config : defaultConfig
  console.log("config", config);

  try {
    await crawlStart(config);

    const outputFileContent = await readFile(`./storage/key_value_stores/default/OUTPUT.json`, "utf-8");
    res.contentType("application/json");
    return res.send(outputFileContent);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred during crawling", error });
  }
});

app.listen(port, hostname, () => {
  console.log(`API server listening at http://${hostname}:${port}`);
});

export default app;
