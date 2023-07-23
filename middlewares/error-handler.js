// централизованный обработчик ошибок, ловит ошибки
const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send('На сервере произошла ошибка');
  }
  next();
};

module.exports = errorHandler;
