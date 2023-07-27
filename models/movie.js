const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');
const messages = require('../utils/constants');
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
      message: messages.invalidLinkForPoster,
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (isValid) => isUrl(isValid),
      message: messages.invalidLinkForTrailer,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (isValid) => isUrl(isValid),
      message: messages.invalidMiniImage,
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
