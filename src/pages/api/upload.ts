import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const uploadDir = path.join(process.cwd(), '/public/uploads');

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const file = files.file;
    type FormidableFile = { filepath?: string };
    const filePath = Array.isArray(file)
      ? file[0]?.filepath
      : file?.filepath;

    if (!filePath) {
      console.error('Fehler: Dateipfad konnte nicht bestimmt werden.');
      return res.status(400).json({ error: 'Dateipfad konnte nicht bestimmt werden.' });
    }

    const fileName = path.basename(filePath);

    console.log('Datei erfolgreich hochgeladen:', fileName);
    res.status(200).json({ path: "/uploads/" + fileName });
  });
}

{
  "newsPage": {
    "title": "Willkommen auf der News-Seite!",
    "content": "Hier finden Sie die neuesten Informationen, Updates und spannende Inhalte rund um DeeDeeChess."
  },
  "aboutPage": {
    "title": "Über uns",
    "content": "Erfahren Sie mehr über DeeDeeChess und unsere Mission."
  }
}

