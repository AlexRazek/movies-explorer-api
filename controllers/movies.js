// const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/errors/errors');
const { CREATED, SUCCESS } = require('../utils/success');
const messages = require('../utils/constants');

const Movie = require('../models/movie');
const BadRequestError = require('../utils/errors/bad-request-error');
const NotFoundError = require('../utils/errors/not-found-error');
const Forbidden = require('../utils/errors/forbidden');

// возвращает все сохраненные пользователем фильмы
const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(SUCCESS).send(movies))
    .catch(next);
};

// добавление фильма
const addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((newMovie) => {
      res.status(CREATED).send(newMovie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(messages.invalidDataCreateMovie));
      } else {
        next(err);
      }
    });
};

// удаление фильма и запрет на удаление не своего фильма
const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params._id)
    // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError(messages.invalidMovieId));
      }
      if (req.user._id !== movie.owner.toString()) {
        return next(new Forbidden(messages.tryDeleteMovie));
      }
      // return Card.findByIdAndRemove(req.params.cardId)
      return Movie.deleteOne(movie)
        .then(() => res.status(SUCCESS).send({ movie }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(messages.invalidDataDeleteMovie));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovieById,
};
