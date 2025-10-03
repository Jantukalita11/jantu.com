import { Router } from 'express';
import multer from 'multer';

export const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/transcribe', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Missing file' });
  // Placeholder: run STT
  return res.json({
    text: 'Transcribed text goes here.',
    language: 'en',
    words: [
      { word: 'Transcribed', start: 0.0, end: 0.3, speaker: 'S1' },
    ]
  });
});
