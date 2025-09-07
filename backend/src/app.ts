import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import routes from './routes';
import startCleanupScheduler from './utils/cleanup';

const app = express();
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

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/images', express.static(path.join(__dirname, '../uploads/products')));

app.use(routes);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on http://localhost:3000');
});

startCleanupScheduler();

export default app;
