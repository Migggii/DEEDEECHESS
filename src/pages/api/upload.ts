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
      ? (file[0] as FormidableFile)?.filepath
      : (file as FormidableFile)?.filepath;
    const fileName = filePath ? path.basename(filePath) : null;

    if (!fileName) {
      console.error('Fehler: Dateiname konnte nicht bestimmt werden.');
      return res.status(400).json({ error: 'Dateiname konnte nicht bestimmt werden.' });
    }

    console.log('Datei erfolgreich hochgeladen:', fileName);
    res.status(200).json({ path: "/uploads/" + fileName });
  });
}

