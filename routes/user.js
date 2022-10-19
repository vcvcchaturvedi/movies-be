const Express = require("express");
const router = Express.Router();
const {
  addMoviesToUserFavourites,
  editMovie,
  deleteMovie,
  addMovie,
  fetchMoviesByUser,
} = require("../dbCalls.controller");
const { movieValidation } = require("../schemas/validator");
router.get("/movies", async (req, res) => {
  let movies = await fetchMoviesByUser(req.user.username);
  res.send(movies);
});
router.post("/movies", async (req, res) => {
  const ids = req.body.ids;
  if (!ids || !ids.length)
    return res.status(400).send({
      status: "failure",
      message:
        "Please send correct parameters for adding movies to favourites list",
    });
  const username = req.user.username;
  let result = await addMoviesToUserFavourites(username, ids);
  if (result)
    return res.send({
      status: "Success",
      message: "Successfully added movies to list.",
    });
  res.status(500).send({
    status: "failure",
    message: "Internal error in adding movies to favourites list",
  });
});
router.put("/movies/:id", async (req, res) => {
  const movie = req.body;
  const id = req.params.id;
  const { error } = movieValidation.validate(movie);
  if (error)
    return res.status(400).send({ status: "failure", message: error.message });
  movie.cast = JSON.stringify(movie.cast);
  console.log(movie.cast);
  const result = await editMovie(id, movie);
  if (result)
    return res.send({
      status: "success",
      message: "Successfully edited the movie",
    });
  res.status(500).send({
    status: "failure",
    message: "Unable to edit the movie because of internal server error",
  });
});
router.delete("/movies/:id", async (req, res) => {
  let result = await deleteMovie(req.params.id);
  if (result)
    return res.send({
      status: "Success",
      message: "Successfully deleted movie",
    });
  res
    .status(500)
    .send({ status: "failure", message: "Server error in deleting movie" });
});
router.post("/movie", async (req, res) => {
  const movie = req.body;
  const { error } = movieValidation.validate(movie);
  if (error)
    return res.status(400).send({ status: "failure", message: error.message });
  movie.cast = JSON.stringify(movie.cast);
  const result = await addMovie(movie);
  if (result)
    return res.send({
      status: "Success",
      message: "Successfully added movie",
    });
  res
    .status(500)
    .send({ status: "failure", message: "Server error in adding movie" });
});
module.exports = router;
