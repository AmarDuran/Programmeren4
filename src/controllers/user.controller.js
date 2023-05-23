const database = require('../util/inmem-db');
const logger = require('../util/utils').logger;
const assert = require('assert');
const pool = require('../util/mysql-db');
const jwt = require('jsonwebtoken');

const userController = {
  getAllUsers: (req, res, next) => {
    logger.info('Get all users');

    let sqlStatement = 'SELECT * FROM `user`';
    // Hier wil je misschien iets doen met mogelijke filterwaarden waarop je zoekt.
    if (req.query.isactive) {
      // voeg de benodigde SQL code toe aan het sql statement
      // bv sqlStatement += " WHERE `isActive=?`"
    }

    pool.getConnection(function (err, conn) {
      // Do something with the connection
      if (err) {
        logger.error(err.code, err.syscall, err.address, err.port);
        next({
          code: 500,
          message: err.code
        });
      }
      if (conn) {
        conn.query(sqlStatement, function (err, results, fields) {
          if (err) {
            logger.err(err.message);
            next({
              code: 409,
              message: err.message
            });
          }
          if (results) {
            logger.info('Found', results.length, 'results');
            res.status(200).json({
              code: 200,
              message: 'User getAll endpoint',
              data: results
            });
          }
        });
        pool.releaseConnection(conn);
      }
    });
  },
  createUser: (req, res) => {
    let newUser = req.body;
    let { firstName, lastName, emailAddress } = req.body;

    try {
      assert(typeof firstName === 'string', 'firstName must be string')
      assert(typeof lastName === 'string', 'lastName must be string')
      assert(typeof emailAddress === 'string', 'emailAddress must be string')
      index = database.index + 1;
      newUser = {
        id: index,
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
      };
      database.users.push(newUser);
      res.status(201).json({
        status: 201,
        message: `User met ID ${index} is toegevoegd`,
        data: newUser,
      });
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: err.toString(),
        data: {},
      })
    }
  },

  getUser: (req, res) => {
    let userId = req.params.userId;
    let user = database.users.filter((item) => item.id == userId);
    if (user[0]) {
      res.status(200).json({
        status: 200,
        message: `User met ID ${userId} is gevonden`,
        data: user[0],
      })
    } else {
      res.status(400).json({
        status: 400,
        message: `User met ID ${userId} niet gevonden`,
        data: {},
      });
    }
  },

  getUserProfile: (req, res, next) => {
    req.userId = 1;
    logger.trace('Get user profile for user', req.userId);

    let sqlStatement = 'SELECT * FROM `user` WHERE id=?';

    pool.getConnection(function (err, conn) {
      // Do something with the connection
      if (err) {
        logger.error(err.code, err.syscall, err.address, err.port);
        next({
          code: 500,
          message: err.code
        });
      }
      if (conn) {
        conn.query(sqlStatement, [req.userId], (err, results, fields) => {
          if (err) {
            logger.error(err.message);
            next({
              code: 409,
              message: err.message
            });
          }
          if (results) {
            logger.trace('Found', results.length, 'results');
            res.status(200).json({
              code: 200,
              message: 'Get User profile',
              data: results[0]
            });
          }
        });
        pool.releaseConnection(conn);
      }
    });
  },

  createUser: (req, res, next) => {
    logger.info('Register user');

    // De usergegevens zijn meegestuurd in de request body.
    const user = req.body;
    logger.trace('user = ', user);

    // Hier zie je hoe je binnenkomende user info kunt valideren.
    try {
      // assert(user === {}, 'Userinfo is missing');
      assert(typeof user.firstName === 'string', 'firstName must be a string');
      assert(
        typeof user.emailAdress === 'string',
        'emailAddress must be a string'
      );
    } catch (err) {
      logger.warn(err.message.toString());
      // Als één van de asserts failt sturen we een error response.
      next({
        code: 400,
        message: err.message.toString(),
        data: undefined
      });

      // Nodejs is asynchroon. We willen niet dat de applicatie verder gaat
      // wanneer er al een response is teruggestuurd.
      return;
    }

    // Zorg dat de id van de nieuwe user toegevoegd wordt
    // en hoog deze op voor de volgende insert.
    user.id = database.index++;
    // User toevoegen aan database
    database['users'].push(user);
    logger.info('New user added to database');

    // Stuur het response terug
    res.status(200).json({
      status: 200,
      message: `User met id ${user.id} is toegevoegd`,
      // Wat je hier retourneert is een keuze; misschien wordt daar in het
      // ontwerpdocument iets over gezegd.
      data: user
    });
  },
  updateUser: (req, res) => {
    try {
      const { emailaddress, firstName, lastName } = req.body;
      const userIndex = database.users.findIndex(
        (user) => user.emailaddress === emailaddress
      );

      if (userIndex === -1) {
        throw new Error('Gebruiker niet gevonden');
      }

      const { firstname, lastname } = updateData;

      if (firstname && !firstname.trim()) {
        throw new Error('Voornaam is verplicht');
      }

      if (lastname && !lastname.trim()) {
        throw new Error('Achternaam is verplicht');
      }

      // Werk de gebruikersgegevens bij met de opgegeven updateData

      if (firstname) user.firstname = firstname;
      if (lastname) user.lastname = lastname;

      // Sla de bijgewerkte gebruiker op in de database
      database.users[userIndex] = user;
      res.status(200).json({
        status: 200,
        message: 'Gebruiker is met succes bijgewerkt',
        data: user,
      });
    } catch (err) {
      let statusCode = 400;
      if (err.message === 'Gebruiker niet gevonden') {
        statusCode = 404;
      }
      res.status(statusCode).json({
        status: statusCode,
        message: err.message.toString(),
        data: {},
      });
    }
  },

  deleteUser: (req, res) => {
    let userId = req.params.userId;
    let user = database.users.filter((item) => item.id == userId);

    if (user[0]) {
      database.users.splice(user.id - 1);
      res.status(200).json({
        status: 200,
        message: `User met ID ${userId} is verwijderd`,
        data: {},
      });
    } else {
      res.status(404).json({
        status: 404,
        message: 'Gebruiker bestaat niet',
        data: {},
      });
    };
  },

  updateMeal: (req, res, next) => {
    const { mealId, token, newData } = req.body;
    logger.trace('Updating meal data for meal', mealId);
    // Step 1: Validate user token
    if (!token) {
      return next({
        code: 401,
        message: 'Unauthorized'
      });
    }

    // Step 2: Validate incoming data
    if (!newData || Object.keys(newData).length === 0) {
      return next({
        code: 400,
        message: 'Invalid data'
      });
    }

    // Step 3: Find the meal in the system
    Meal.findById(mealId, (err, meal) => {
      if (err) {
        logger.error(err.message);
        return next({
          code: 500,
          message: err.message
        });
      }

      if (!meal) {
        return next({
          code: 404,
          message: 'Meal not found'
        });
      }

      // Step 4: Validate user ownership
      if (meal.userId !== req.userId) {
        return next({
          code: 403,
          message: 'User does not own the meal'
        });
      }

      // Step 5: Update meal data
      meal.update(newData, (err, updatedMeal) => {
        if (err) {
          logger.error(err.message);
          return next({
            code: 500,
            message: err.message
          });
        }

        logger.trace('Meal data updated:', updatedMeal);

        res.status(200).json({
          code: 200,
          message: 'Meal data updated',
          data: updatedMeal
        });
      });
    });
  },
};


module.exports = userController;
