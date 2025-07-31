import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

const filePath = path.join(process.cwd(), "data", "news.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const news = JSON.parse(data);
      res.status(200).json(news);
    } catch (err) {
      res.status(500).json({ error: "Fehler beim Lesen der News." });
    }
  } else if (req.method === "POST") {
    try {
      const news = req.body;
      fs.writeFileSync(filePath, JSON.stringify(news, null, 2));
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Fehler beim Speichern der News." });
    }
  } else {
    res.status(405).json({ error: "Methode nicht erlaubt." });
  }
}
