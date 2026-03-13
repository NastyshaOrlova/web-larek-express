# Web Larek Express

Бэкенд интернет-магазина "Веб Ларёк". REST API с аутентификацией, управлением товарами, заказами и загрузкой файлов.

## Стек технологий

- **Runtime:** Node.js, TypeScript
- **Framework:** Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT (access + refresh tokens), cookie-parser, bcrypt
- **Validation:** Celebrate (Joi)
- **Logging:** Winston
- **Files:** Multer (загрузка изображений)
- **Security:** CORS, auth middleware, централизованная обработка ошибок
- **DevOps:** Docker, Nginx
- **Code Quality:** ESLint (Airbnb), Prettier

## Функциональность

### Auth
- `POST /auth/login` — авторизация
- `POST /auth/register` — регистрация
- `GET /auth/token` — обновление токена
- `GET /auth/user` — данные текущего пользователя
- `GET /auth/logout` — выход

### Products
- `GET /product` — каталог товаров
- `POST /product` — создание товара
- `PATCH /product/:id` — обновление товара
- `DELETE /product/:id` — удаление товара

### Orders
- `POST /order` — оформление заказа

### Upload
- `POST /upload` — загрузка изображений (Multer)

## Архитектура

- `backend/src/controllers/` — Бизнес-логика (auth, product, order, upload)
- `backend/src/routes/` — Маршруты Express
- `backend/src/models/` — Mongoose-схемы (User, Product)
- `backend/src/middlewares/` — Auth, CORS, статика, обработка ошибок
- `backend/src/validation/` — Celebrate/Joi-схемы
- `backend/src/errors/` — Кастомные ошибки (NotFound, Unauthorized)
- `nginx/` — Конфигурация Nginx

## Ключевые решения

- **JWT с refresh-токенами** — access в заголовке, refresh в httpOnly cookie
- **Очистка временных файлов** — автоматический scheduler для удаления temp-загрузок
- **File cleanup hooks** — удаление файлов при удалении товара из БД

## Запуск

```bash
# Docker (рекомендуется)
docker compose up

# Или вручную
cd backend
npm install
npm run dev
