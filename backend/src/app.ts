import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/', (_req, res) => {
  res.send('ку');
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on http://localhost:3000');
});

export default app;
