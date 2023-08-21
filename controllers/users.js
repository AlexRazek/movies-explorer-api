require('dotenv').config();
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const { CREATED, SUCCESS } = require('../utils/success');

const SALT_ROUNDS = 10;

// eslint-disable-next-line max-len
const { JWT_SECRET, NODE_ENV } = process.env;

const User = require('../models/user');
const BadRequestError = require('../utils/errors/bad-request-error');
const NotFoundError = require('../utils/errors/not-found-error');
const ConflictRequest = require('../utils/errors/conflict-request-error');
const messages = require('../utils/constants');

// // получение всех пользователей
// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(SUCCESS).send(users));
// };

// получение данных о своем id
const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(messages.notFoundUser));
      }
      return res.status(SUCCESS).send(user);
    })
    .catch(next);
};

// обновление данных Профиля пользователя
const updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((userProfile) => res.send(userProfile))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(messages.invalidDataUpdateProfile));
      } else {
        next(err);
      }
    });
};

// регистрация пользователя
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  // хешируем пароль через bcrypt
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => {
      res.status(CREATED).send({
        name, email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictRequest(messages.emailAlredyExist));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(messages.invalidDataCreateUser));
      } else {
        next(err);
      }
    });
};

// авторизация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'develop-key', { expiresIn: '7d' });
      // отправим токен, браузер сохранит его в куках
      res
        .cookie('jwt', token, {
          // token - наш JWT токен, который мы отправляем
          maxAge: 3600000,
          httpOnly: true,
          // sameSite: true,
          // используется none т.к. не проходят куки с сервера ВМ на localHost
          sameSite: 'None',
          secure: true,
        });
      // .end(); // если у ответа нет тела, можно использовать метод end
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

// удаление Куки/cookie, при выходе из аккаунта
const loginOut = (req, res, next) => {
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  // .send(messages.successExit);
  res.send(messages.successExit).catch(next);
};

module.exports = {
  // getUsers,
  getUserMe,
  updateUserProfile,
  createUser,
  login,
  loginOut,
};
