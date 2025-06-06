import express from 'express';
import { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Vercel!');
});

export default app; // ✅ No app.listen()
