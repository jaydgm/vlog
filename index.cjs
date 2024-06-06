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
      `SELECT user_id, name, email, password FROM Users WHERE email = :email`, {email}
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
        user_id: user.user_id,
        email: user.email,
      }

      const jwtEncodedUser = jwt.sign(payload, process.env.JWT_KEY)
      res.json({success: true, jwt: jwtEncodedUser, data: payload})
    }
    
  } catch (err) {
    console.log('Error in /authenticate', err)
  }
})

app.delete('/users/:user_id', async function(req,res) {
  try {
    const user_id = req.params.user_id;
    
    await req.db.query('DELETE FROM Users WHERE user_id = ?', [user_id])
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

    req.user = {
      user_id: decodedJwtObject.user_id,
      email: decodedJwtObject.email,
    }

    await next();

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

// endpoint to get the logged-in user's data
app.get('/user', async function(req, res) {
  try {
    const { user_id } = req.user;

    const [data] = await req.db.query('SELECT * FROM Users WHERE user_id = ?', [user_id]);

    // send fetched data to client
    res.json({ success: true, data: data });
    console.log(data)
  } catch (err) {
    // handle errors
    console.error('error fetching user data:', err);
    res.json({ success: false, message: 'internal server error' });
  }
});


// endpoint to add a scheduled visitation
app.post('/schedule-visitation', async function(req, res) { 
  try {
    console.log(req.user)
    const { host_id, visit_date, visit_time} = req.body;
    const visitor_id = req.user.user_id

    // Inserting the new visitation record
    const [result] = await req.db.query(`
      INSERT INTO Visitations (host_id, visitor_id, visit_date, visit_time)
      VALUES (:host_id, :visitor_id, :visit_date, :visit_time);
    `, {
      host_id,
      visitor_id,
      visit_date,
      visit_time
    });

    // Extracting the generated visitation_id from the result
    const visitation_id = result.insertId;

    // Sending back the visitation_id in the response
    res.json({ success: true, visitation_id, message: 'Visitation created successfully' });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Internal server error' });
  }
});

app.get('/show-visitations', async function(req, res) {
  try {
    const [rows] = await req.db.query( `
      SELECT
        Visitations.visitation_id,
        Visitations.visit_date,
        Visitations.visit_time,
        Members.member,
        GROUP_CONCAT(DISTINCT Users.name) as attendees
      FROM
        Visitations
      INNER JOIN
        Members ON Visitations.host_id = Members.member_id
      INNER JOIN
        Attendees ON Visitations.visitation_id = Attendees.visit_id
      INNER JOIN
        Users ON Attendees.attendee_id = Users.user_id
      GROUP BY
        Visitations.visitation_id,
        Visitations.visit_date,
        Visitations.visit_time,
        Members.member;
    `);
    
    res.json({ success: true, data: rows });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'internal server error' });
  }
});


  // endpoint to add an attendee 
  app.post('/add-attendees', async function(req, res) {
    try {
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

  app.delete('/delete-visitation', async function(req, res) {
    try {

      const { visitation_id } = req.query
    
      await req.db.beginTransaction();

      // Delete attendees first
      await req.db.query('DELETE FROM Attendees WHERE visit_id = :visitation_id', {visitation_id});

      // Delete the visitation record
      await req.db.query('DELETE FROM Visitations WHERE visitation_id = :visitation_id', {visitation_id});

            // Commit the transaction
      await req.db.commit();
      res.json({ success: true, message: 'Visitation deleted successfully' });
    } catch (err) {
      console.log(err)
      res.json({success: false, err: err})
    }
  })

  app.put('/change-password', async function(req, res) {
    try {
        const { email } = req.user;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.json({ success: false, message: 'Missing password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await req.db.query(
            'UPDATE Users SET password = :hashedPassword WHERE email = :email', 
              { hashedPassword, email }
        );

        res.json({ success: true, message: 'Successfully changed password' });
    } catch (err) {
        console.error('Error:', err); // Debugging: Log error
        res.json({ success: false, message: err.message });
    }
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
