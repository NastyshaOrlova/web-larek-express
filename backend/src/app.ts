import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import orderRoutes from './routes/orderRoutes';
import productRoutes from './routes/productRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

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

app.use('/', productRoutes);
app.use('/', orderRoutes);

app.get('/', (_req, res) => {
  res.send('ку');
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on http://localhost:3000');
});

export default app;
