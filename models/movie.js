const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');
// const validator = require('validator'); // импортируем validator

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (isValid) => isUrl(isValid),
      message: 'Ссылка на постер к фильму введена не корректно',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (isValid) => isUrl(isValid),
      message: 'Ссылка на трейлер к фильму введена не корректно',
    },
  },
  trumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (isValid) => isUrl(isValid),
      message: 'Мини изображение постера к фильму не корректно',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
