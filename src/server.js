const express = require('express');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Handle registration
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Data to be inserted
      const record = {
          dataSource: "Cluster0",
          database: "test",
          collection: "users",
          document: {
              username,
              password: hashedPassword
          }
      };

      // Insert the new record into MongoDB
      const response = await axios.post(process.env.MONGODB_REGISTER_URL, record, {
          headers: {
              'Content-Type': 'application/json',
              'apiKey': process.env.MONGODB_API_KEY
          }
      });

      console.log('response', response);

      res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
      console.error('Registration failed:', error.message);
      res.status(500).json({ error: 'Registration failed. Please try again later.' });
  }
});

//Handle login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Fetch user data from MongoDB
      const response = await axios.post(process.env.MONGODB_LOGIN_URL, {
          dataSource: "Cluster0",
          database: "test",
          collection: "users",
          filter: { username },
          projection: { username: 1, password: 1 }
      }, {
          headers: {
              'Content-Type': 'application/json',
              'api-key': process.env.MONGODB_API_KEY
          }
      });

      const user = response.data.document;
   
      if (user) {
       
        const match = await bcrypt.compare(password, user.password);

      

        if (match) {
            const jwtSecret = process.env.JWT_SECRET; // Ensure this is set in your .env file
            const token = jwt.sign({ userId: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
            res.status(200).json({ token, userId: user._id, username: user.username });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } else {
        res.status(401).json({ error: 'User not found' });
    }
} catch (error) {
    console.error('Login failed:', error.message);
    res.status(500).json({ error: 'Login failed. Please try again later.' });
}
});



app.listen(port, () => {
    console.log(`Local proxy server running at http://localhost:${port}`);
});
