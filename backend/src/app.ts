import { errors } from 'celebrate';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import config from './config';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';
import notFound from './middlewares/not-found';
import routes from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, './public')));

mongoose
  .connect(config.DB_ADDRESS)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Подключились к MongoDB');
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Ошибка подключения к MongoDB:', error);
  });

app.use(routes);

app.use(errors());

app.use(errorLogger);
app.use(notFound);
app.use(errorHandler);

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${config.PORT}`);
});

export default app;
