import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

const filePath = path.join(process.cwd(), "data", "tournaments.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const tournaments = JSON.parse(data);
      res.status(200).json(tournaments);
    } catch (err) {
      res.status(500).json({ error: "Fehler beim Lesen der Turniere." });
    }
  } else if (req.method === "POST") {
    try {
      // 🔧 Monat 1–12 wird zu 0–11 korrigiert
      const tournaments = req.body.map((t: any) => ({
        ...t,
        month: t.month - 1,
      }));

      fs.writeFileSync(filePath, JSON.stringify(tournaments, null, 2));
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Fehler beim Speichern der Turniere." });
    }
  } else {
    res.status(405).json({ error: "Methode nicht erlaubt." });
  }
}
