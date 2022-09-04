const errorHandlingMiddleware = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformed id" });
  }

  next(error);
};

const unknownUrlMiddleware = (request, response, next) => {
  response.status(404).send({ error: "URL not found" });
};

module.exports = { errorHandlingMiddleware, unknownUrlMiddleware };
