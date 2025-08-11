import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

const filePath = path.join(process.cwd(), "public", "data", "news.json");

function ensureFileExists() {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  ensureFileExists();

  if (req.method === "GET") {
    try {
      const json = fs.readFileSync(filePath, "utf-8");
      return res.status(200).json(JSON.parse(json));
    } catch (error) {
      console.error("Fehler beim Lesen:", error);
      return res.status(500).json({ error: "Fehler beim Lesen der News" });
    }
  }

  if (req.method === "POST") {
    try {
      fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      return res.status(500).json({ error: "Fehler beim Speichern der News" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Methode nicht erlaubt" });
}
