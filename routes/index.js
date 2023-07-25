const generalRoutes = require('express').Router();

require('dotenv').config();
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errors/not-found-error');

const routerAuth = require('./authRoute');
const routerUser = require('./users');
const routerMovie = require('./movies');
const messages = require('../utils/constants');

generalRoutes.use('/', routerAuth);
generalRoutes.use('/users', auth, routerUser);
generalRoutes.use('/movies', auth, routerMovie);
generalRoutes.all('*', (req, res, next) => {
  next(new NotFoundError(messages.notFoundWay));
});

module.exports = { generalRoutes };
