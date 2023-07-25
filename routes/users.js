const routerUser = require('express').Router();
const { updateUserValidationJoi } = require('../utils/validations');

const {
  // getUsers,
  getUserMe,
  updateUserProfile,
} = require('../controllers/users');

// routerUser.get('/', getUsers);

routerUser.get('/me', getUserMe);

routerUser.patch('/me', updateUserValidationJoi, updateUserProfile);

module.exports = routerUser;
