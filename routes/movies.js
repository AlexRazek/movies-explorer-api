const { celebrate, Joi } = require('celebrate');
const routerMovie = require('express').Router();
const urlPattern = require('../utils/pattern/url-pattern');

const {
  getMovies,
  addMovie,
  deleteMovieById,
} = require('../controllers/movies');

routerMovie.get('/', getMovies);
routerMovie.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlPattern),
    trailerLink: Joi.string().required().pattern(urlPattern),
    trumbnail: Joi.string().required().pattern(urlPattern),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),

  }),
}), addMovie);

routerMovie.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovieById);

module.exports = routerMovie;
