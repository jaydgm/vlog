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

    const [[checkEmail]] = await req.db.query(
      `SELECT email FROM Users WHERE email = :email`,
      {email}
    )

    if (checkEmail) {
      res.json({success: false, err: 'email already in use'})
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await req.db.query( 
        `INSERT INTO Users (name, email, password) 
        VALUES (:name, :email, :hashedPassword);`, 
        { name, email, hashedPassword }
      )
      const [[userData]] = await req.db.query(
        `SELECT user_id, email FROM Users WHERE email = :email`, {email}
      );
      // create payload for the jwt
      const payload = {
        user_id: userData.user_id,
        email: userData.email
      }

      // creates the jwt for the user
      // makes jwt unique for all users since all users would 
      // have same JWY_KEY
      jwtEncodedUser = jwt.sign(payload, process.env.JWT_KEY)

      console.log(jwtEncodedUser)

      // response with the jwt and userData
      res.json({jwt: jwtEncodedUser, success: true, userData: payload})
    }
  } catch (err) {
    res.json({success: false, message: err})
    console.log(`Error creating user ${err}`)
  }
})

app.post('/signin', async(req,res) => {
  try {
    const {email, password: userEnteredPassword } = req.body

    const [[user]] = await req.db.query(
      `SELECT name, email, password FROM Users WHERE email = :email`, {email}
    )

    if (!user) {
      res.json({success: false, err: 'no user found'})
      return;
    }

    // hash user password and compare with entered password
    const hashedPassword = `${user.password}`
    const passwordMatches = await bcrypt.compare(userEnteredPassword, hashedPassword)

    // if passsword matches, create payload for 
    // the jwt with the user info
    if (!passwordMatches) {
      res.json({ success: false, err: "Invalid Credentials" });
    } else {
      const payload = {
        userId: user.id,
        email: user.email,
      }

      const jwtEncodedUser = jwt.sign(payload, process.env.JWT_KEY)
      res.json({success: true, jwt: jwtEncodedUser, data: payload})
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

app.use(async function verifyJwt(req,res,next) {
  const { authorization: authHeader } = req.headers;

  if (!authHeader) {
    res.json('Invalid authorization, no authorization headers')
  }

  const [scheme, jwtToken] = authHeader.split(' ')

  if (scheme !== 'Bearer') {
    res.json('Invalid authorization, invalid authorization scheme')
    return
  }

  try {
    const decodedJwtObject = jwt.verify(jwtToken, process.env.JWT_KEY);

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
  await next();
})

// endpoint for only registered users to access scheduler page
app.get("/scheduler", async function(req, res) {
  // Only authenticated users can access this endpoint
  try {
    res.json({success: true, message: "Scheduler page accessed successfully" });
  } catch (error) {
    res.json({success: false, error: error})
  }
});

// endpoint to get all members
app.post('/members', async function(req, res) {
  try {
    const [rows] = await req.db.query(`SELECT * FROM Members`)
    
    res.json({success: true, data: rows})
  } catch (error) {
    console.log('error fetching members')
    res.json({success: false, error: error})
  }
})

// endpoint to get all users
app.get('/users', async function(req, res) {
  try {

  const [rows] = await req.db.query('SELECT * FROM Users')

  // send fetched data to client
  res.json({success: true, data: rows})
  } catch (err) {
    // handle errors
    console.error('error fetching users:', err)
    res.json({success: false, message: 'internal server error'})
  }
});

app.post('/schedule-visitation', async function(req, res) { 
  try {
    const { user_id: host_id } = req.user;
    const { visit_date, attendee: visitor_id } = req.body;

    await req.db.query(`
      INSERT INTO Visitations(host_id, visitor_id, visit_date)
      VALUES (:host_id, :visitor_id, :visit_date);
    `, {host_id, visitor_id, visit_date
    });

    res.json({ success: true, message: 'Visitation created successfully' });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Internal server error' });
  }
});


app.get('/visitations', async function(req, res) {
  const { user_id: visitor } = req.user;
  const { member, visit_date, attendee: name } = req.body;
  try {
    const [rows] = await req.db.query( `SELECT
                                        Visitations.visit_date,
                                        Members.name AS host_name,
                                        GROUP_CONCAT(Users.name) AS attendee_names
                                      FROM
                                        Visitations
                                      INNER JOIN
                                        Members ON Visitations.host_id = Members.member_id
                                      INNER JOIN
                                        Attendees ON Visitations.visitation_id = Attendees.visit_id
                                      INNER JOIN
                                        Users ON Attendees.attendee_id = Users.user_id
                                      WHERE
                                        Visitations.visit_date = :visit_date AND
                                        Members.name = :member AND
                                        Users.name = :attendee
                                      GROUP BY
                                        Visitations.visitation_id;
                                      ;`, {
                                        visit_date, member, attendee: name
                                      })
      res.json({success: true, data: rows})
    } catch (err) {
      console.log(err)
      res.json({success: false, message: 'internal server error'})
    }
  })

  app.post('/add-attendee', async function(req, res) {
    try {
      const { user_id } = req.user;
      const { visit_id, attendee_id } = req.body;

      await req.db.query(`
                          INSERT INTO Attendees (visit_id, attendee_id)
                          VALUES (:visit_id, :attendee_id)`, {
                            visit_id, attendee_id
                          })

      res.json({ success: true, message: 'Attendee added successfully' });
    } catch (err) {
      console.log(err)
      res.json({ success: false, err: err});
    }
  })

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
