const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
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

app.post('/signup', async (req,res) => {
  try {
    const {name, email, password} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await req.db.query( 
      `INSERT INTO Users (name, email, password) 
      VALUES (:name, :email, :hashedPassword);`, 
      { name, email, hashedPassword }
    )

    const [[userData]] = await req.db.query(`SELECT user_id, email FROM Users WHERE email = :email`, {
      email
    });

    // create payload for the jwt
    const payload = {
      user_id: userData.user_id,
      email: userData.email
    }

    // creates the jwt for the user
    // makes jwt unique for all users since all users would 
    // have same JWY_KEY
    jwtEncodedUser = jwt.sign(payload, process.env.JWT_KEY)

    // response with the jwt and userData
    res.json({jwt: jwtEncodedUser, success: true, userData: payload})
  } catch (err) {
    res.json({success: false, message: err})
    console.log(`Error creating user ${err}`)
  }
})

app.post('/signin', async(req,res) => {
  try {
    const {email, password: userEnteredPassword } = req.body

    const [user] = req.db.query(
      `SELECT name, email, password FROM Users WHERE email = :email`
    )

    if (!user) {
      res.json({success: false, err: 'no user found'})
      return;
    }

    const hashedPassword = `${user.password}`
    const passwordMatches = await bcrypt.compare(userEnteredPassword, hashedPassword)

    // if passsword matches, create payload for 
    // the jwt with the user info
    if (passwordMatches) {
      const payload = {
        userId: user.id,
        email: user.email,
      }

      const jwtEncodedUser = jwt.sign(payload, process.env.JWT_KEY)
      res.json({success: true, jwt: jwtToken, data: payload})
    } else {
      res.json({success: false, err: 'Passsword is incorrect'})
    }
    
  } catch (err) {
    console.log('Error in /authenticate', err)
  }
})

app.delete('/users/:userId', async function(req,res) {
  try {
    const userId = req.params.userId;
    
    await req.db.query('DELETE FROM Users WHERE user_id = ?', [userId])
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.log('Error deleting user: ', err)
    res.status(500).json({success: false, message: err})
  }
})

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


app.use(async function verifyJwt(req,res,next) {
  const { authorization: authHeader } = req.headers;

  if (!authHeader) {
    res.json('Invalid authorization, no authorization headers')
  }

  const [scheme, jwtToken] = authHeader.split(' ')

  if (scheme !== 'Bearer') {
    res.json('Invalid authorization, invalid authorization scheme')
  }

  try {
    const decodedJwtObject = jwt.verify(jwtToken,process.env.JWT_KEY);
    req.user = decodedJwtObject;
  } catch (err) {
    console.log(err)
    if (
      err.message && 
      (err.message.toUpperCase() === 'INVALID TOKEN' || 
      err.message.toUpperCase() === 'JWT EXPIRED')
    ) {

      req.status = err.status || 500;
      req.body = err.message;
      req.app.emit('jwt-error', err, req);
    } else {

      throw((err.status || 500), err.message);
    }
  }
})

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
