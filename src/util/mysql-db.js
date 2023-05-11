const mysql = require('mysql2');
const logger = require('../util/utils').logger;

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  database: process.env.DB_DATABASE || 'shareameal',
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0
});

pool.on('connection', function (connection) {
  logger.info(
    `Connected to db '${connection.config.database}' on ${connection.config.host}`
  );
});

pool.on('acquire', function (connection) {
  logger.trace('Connection %d acquired', connection.threadId);
});

pool.on('release', function (connection) {
  logger.trace('Connection %d released', connection.threadId);
});



// simple query
pool.getConnection(function (err, conn) {
    // Do something with the connection
    if (err) {
      console.log('error', err);
    }
    if (conn) {
      conn.query(
        'SELECT `id`, `name` FROM `meal`',
        function (err, results, fields) {
          if (err) {
            console.log(err.sqlMessage, ' ', err.errno, '', err.code);
          }
          console.log('results: ', results);
        }
      );
      pool.releaseConnection(conn);
    }
  });
  
  module.exports = pool;