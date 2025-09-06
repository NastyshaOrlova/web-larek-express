import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import routes from './routes';

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

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

app.use(cookieParser());
app.use(routes);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on http://localhost:3000');
});

export default app;
