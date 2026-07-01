import express from 'express';
import cors from 'cors';
import { initDb } from './db';
import usersRouter from './routes/users';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

initDb();

app.use('/api/users', usersRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
