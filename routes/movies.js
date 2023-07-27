const routerMovie = require('express').Router();
const { addMovieValidationJoi, deleteMovieValidationJoi } = require('../utils/validations');

const {
  getMovies,
  addMovie,
  deleteMovieById,
} = require('../controllers/movies');

routerMovie.get('/', getMovies);
routerMovie.post('/', addMovieValidationJoi, addMovie);
routerMovie.delete('/:_id', deleteMovieValidationJoi, deleteMovieById);

module.exports = routerMovie;
