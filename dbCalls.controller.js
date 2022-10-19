const mysql = require("mysql");
const dotenv = require("dotenv");
const { pool } = require("./index");
const bcrypt = require("bcrypt");

const userExists = async (username) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        resolve(true);
      }
      conn.query(
        "SELECT * from `users` where `username`=?",
        username,
        (error, data) => {
          conn.release();
          if (error) resolve(false);
          if (data && data.length) {
            resolve(true);
          } else resolve(false);
        }
      );
    });
  });
};
const addUser = async (user) => {
  return new Promise((resolve, reject) => {
    let insertQuery = "INSERT INTO users SET ?";
    pool.getConnection((err, conn) => {
      conn.query(insertQuery, user, (err, idUser) => {
        conn.release();
        if (err) {
          console.log(err);
          resolve(0);
        }
        console.log(idUser);
        resolve(idUser);
      });
    });
  });
};
const fetchAllMovies = async () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        resolve([]);
      }
      conn.query("SELECT * FROM movies", (error, result) => {
        conn.release();
        if (error) resolve([]);
        resolve(result);
      });
    });
  });
};
const checkPassword = async (username, password) => {
  return new Promise((resolve, reject) => {
    if (!userExists) resolve(false);
    pool.getConnection((err, conn) => {
      if (err) resolve(false);
      conn.query(
        "SELECT password from users where username=?",
        username,
        (error, result) => {
          conn.release();
          if (error) resolve(false);
          if (!bcrypt.compareSync(password, result[0].password)) resolve(false);
          resolve(true);
        }
      );
    });
  });
};
const areMovieIdsValid = async (ids) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) resolve(false);
      ids.forEach((id) => {
        conn.query("SELECT * FROM movies WHERE id=?", id, (error, result) => {
          if (error || !result) {
            conn.release();
            resolve(false);
          }
        });
      });
      conn.release();
      resolve(true);
    });
  });
};
const addMoviesToUserFavourites = async (username, ids) => {
  if (!(await areMovieIdsValid(ids))) return false;

  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) resolve(false);
      conn.query(
        "UPDATE users SET movies=? WHERE username=?",
        [JSON.stringify(ids), username],
        (error, result) => {
          conn.release();
          if (error) resolve(false);
          resolve(true);
        }
      );
    });
  });
};
const editMovie = async (id, movie) => {
  if (!(await areMovieIdsValid([id]))) return false;
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) resolve(false);
      conn.query(
        "UPDATE movies SET ? where id=?",
        [movie, id],
        (error, result) => {
          conn.release();
          if (error) resolve(false);
          resolve(true);
        }
      );
    });
  });
};
const deleteMovie = async (id) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) resolve(false);
      conn.query("DELETE FROM movies WHERE id=?", id, (error, result) => {
        conn.release();
        if (error) resolve(false);
        if (result.affectedRows == 1) resolve(true);
        resolve(false);
      });
    });
  });
};
const addMovie = async (movie) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        conn.release();
        resolve(false);
      }
      conn.query("INSERT INTO movies SET ?", movie, (error, result) => {
        conn.release();
        if (error) resolve(false);
        if (result.affectedRows == 1) resolve(true);
        resolve(false);
      });
    });
  });
};
const fetchMoviesByUser = async (username) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        conn.release();
        resolve([]);
      }
      conn.query(
        "SELECT movies FROM users WHERE username=?",
        username,
        (error, resultUser) => {
          if (error) {
            conn.release();
            resolve([]);
          }
          const ids = resultUser[0].movies
            .toString()
            .replace("[", "(")
            .replace("]", ")");
          conn.query(
            "SELECT * FROM movies WHERE id IN " + ids,
            (errorFetch, resultMovies) => {
              conn.release();
              if (errorFetch) {
                console.log(errorFetch);
                resolve([]);
              }
              resolve(resultMovies);
            }
          );
        }
      );
    });
  });
};
module.exports = {
  addUser,
  userExists,
  fetchAllMovies,
  checkPassword,
  addMoviesToUserFavourites,
  editMovie,
  deleteMovie,
  addMovie,
  fetchMoviesByUser,
};
