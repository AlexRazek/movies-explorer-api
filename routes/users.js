const { celebrate, Joi } = require('celebrate');
const routerUser = require('express').Router();

const {
  // getUsers,
  getUserMe,
  updateUserProfile,
} = require('../controllers/users');

// routerUser.get('/', getUsers);

routerUser.get('/me', getUserMe);

routerUser.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
}), updateUserProfile);

module.exports = routerUser;
