import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());

mongoose
  .connect('mongodb://127.0.0.1:27017/weblarek')
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Подключились к MongoDB');
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Ошибка подключения к MongoDB:', error);
  });

app.get('/', (_req, res) => {
  res.send('ку');
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on http://localhost:3000');
});

export default app;
