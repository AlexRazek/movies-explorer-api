const generalRoutes = require('express').Router();

require('dotenv').config();
const { createUser, login, loginOut } = require('../controllers/users');
const { SigninValidationJoi, SignupValidationJoi } = require('./auth');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errors/not-found-error');

const routerUser = require('./users');
const routerMovie = require('./movies');

generalRoutes.post('/signup', SignupValidationJoi, createUser);
generalRoutes.post('/signin', SigninValidationJoi, login);
generalRoutes.post('/signout', loginOut);

generalRoutes.use('/users', auth, routerUser);
generalRoutes.use('/movies', auth, routerMovie);
generalRoutes.all('*', (req, res, next) => {
  next(new NotFoundError('Путь не существует'));
});

module.exports = { generalRoutes };
