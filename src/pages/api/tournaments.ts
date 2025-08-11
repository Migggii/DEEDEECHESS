import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

type Tournament = {
  day: number;
  month: number; // 0-basiert: Januar = 0, Dezember = 11
  year: number;
  title: string;
  link: string;
  image: string;
};

const filePath = path.join(process.cwd(), "data", "tournaments.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const tournaments = JSON.parse(data);
      res.status(200).json(tournaments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Fehler beim Lesen der Turniere." });
    }
  } else if (req.method === "POST") {
    try {
      // 🔧 Der Client sendet Monate bereits 0-basiert (0–11)
      const tournaments = (req.body as Tournament[]).map((t) => ({
        ...t,
        month: t.month,
      }));

      fs.writeFileSync(filePath, JSON.stringify(tournaments, null, 2));
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Fehler beim Speichern der Turniere." });
    }
  } else {
    res.status(405).json({ error: "Methode nicht erlaubt." });
  }
}
