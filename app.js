require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const { createUser, login, loginOut } = require('./controllers/users');
// const { SigninValidationJoi, SignupValidationJoi } = require('./middlewares/auth-validation');
// const { requestLogger, errorLogger } = require('./middlewares/logger');
// const auth = require('./middlewares/auth');
// const NotFoundError = require('./utils/errors/not-found-error');

const app = express();

app.use(cors({
  origin: true,
  // origin: 'http://localhost:3000',
  credentials: true,
})); const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const { PORT = 3000, MONGO_URI = 'mongodb://localhost:27017' } = process.env;
// const { PORT = 3000, MONGO_URI = 'mongodb://localhost:27017' } = process.env;

app.use(cookieParser());

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://localhost:3000',
  'https://localhost:3000',
  'localhost:3000',
  'localhost:3001',
  'http://127.0.0.1:3000',
  'http://api.alexmesto.nomoredomains.work',
  'https://api.alexmesto.nomoredomains.work',
  'http://alexmesto.nomoredomains.work',
  'https://alexmesto.nomoredomains.work',
];

app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    // res.header('Access-Control-Allow-Origin', '*');
  }

  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  }

  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }
  return next();
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// const routerUser = require('./routes/users');
// const routerCard = require('./routes/cards');
// const errorHandler = require('./middlewares/error-handler');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
// });

// MongoDB URL в .env
mongoose.connect(
  `${MONGO_URI}/mestodb`,
  {
    useNewUrlParser: true,
  },
  // eslint-disable-next-line no-console
  console.log('connected with MongoDB'),
);

// app.use(requestLogger); // подключаем логгер запросов
// apiLimiter подключаем после логера запросов,иначе заблокированные запросы небудут записаны в логи
app.use(apiLimiter);

// app.post('/signup', SignupValidationJoi, createUser);
// app.post('/signin', SigninValidationJoi, login);
// app.post('/signout', loginOut);

// app.use('/users', auth, routerUser);
// app.use('/cards', auth, routerCard);
// app.all('*', (req, res, next) => {
//   next(new NotFoundError('Путь не существует'));
// });

// app.use(errorLogger); // подключаем логгер ошибок

// app.use(errors());
// app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('server is running on port 3000');
});
