const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

// Allows us to access the .env
require('dotenv').config();

const app = express();
const port = process.env.PORT; // default port to listen

const corsOptions = {
   origin: '*', 
   credentials: true,  
   'access-control-allow-credentials': true,
   optionSuccessStatus: 200,
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use(cors(corsOptions));

// Makes Express parse the JSON body of any requests and adds the body to the req object
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  try {
    // Connecting to our SQL db. req gets modified and is available down the line in other middleware and endpoint functions
    req.db = await pool.getConnection();
    req.db.connection.config.namedPlaceholders = true;

    // Traditional mode ensures not null is respected for unsupplied fields, ensures valid JavaScript dates, etc.
    await req.db.query('SET SESSION sql_mode = "TRADITIONAL"');
    await req.db.query(`SET time_zone = '-8:00'`);

    // Moves the request on down the line to the next middleware functions and/or the endpoint it's headed for
    await next();

    // After the endpoint has been reached and resolved, disconnects from the database
    req.db.release();
  } catch (err) {
    // If anything downstream throw an error, we must release the connection allocated for the request
    console.log(err)
    // If an error occurs, disconnects from the database
    if (req.db) req.db.release();
    throw err;
  }
});

app.post('/users', async function(req, res) {
    try {
      const {name, username, email, password} = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
    
      const query = await req.db.query(
        `INSERT into Users (
          name,
          username,
          email,
          password
        )
        VALUES (
          :name,
          :username,
          :email,
          :password
        )`,
        {
          name,
          username,
          email,
          password: hashedPassword
        }
      );
    
      res.json({ success: true, message: 'User successfully created', data: null });
    } catch (err) {
      res.json({ success: false, message: err, data: null })
    }
  });

  app.get('/users', async function(req, res) {
    try {
    // query the database to fetch all cars where deleted_flag = 0
    const [rows] = await req.db.query('SELECT * FROM Users')
  
    // send fetched data to client
    res.json({success: true, data: rows})
    } catch (err) {
      // handle errors
      console.error('error fetching users:', err)
      res.status(500).json({success: false, message: 'internal server error'})
    }
  });

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
