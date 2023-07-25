// проверка  авторизован или нет
const jwt = require('jsonwebtoken');
const Unauthorized = require('../utils/errors/unauthorized');
const messages = require('../utils/constants');

const { JWT_SECRET, NODE_ENV } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  const tokenCookie = req.cookies.jwt;

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  if (!tokenCookie) {
    next(new Unauthorized(messages.invalidLoginOrPassword));
  }

  // const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // payload = jwt.verify(token, JWT_SECRET);
    payload = jwt.verify(tokenCookie, NODE_ENV === 'production' ? JWT_SECRET : 'develop-key');
  } catch (err) {
    next(new Unauthorized(messages.invalidLoginOrPassword));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
