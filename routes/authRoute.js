const routerAuth = require('express').Router();
const { signupValidationJoi, signinValidationJoi } = require('../utils/validations');

const {
  createUser,
  login,
  loginOut,
} = require('../controllers/users');

routerAuth.post('/signup', signupValidationJoi, createUser);
routerAuth.post('/signin', signinValidationJoi, login);
routerAuth.get('/signout', loginOut);

module.exports = routerAuth;
