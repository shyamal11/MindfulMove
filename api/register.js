import axios from 'axios';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust '*' to the specific domain of your frontend in production
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    // Preflight request. Reply successfully.
    return res.status(200).end();
  }

  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUserResponse = await axios.post('https://data.mongodb-api.com/app/data-sicwcur/endpoint/data/v1/action/findOne', {
      dataSource: "Cluster0",
      database: "test",
      collection: "users",
      filter: { username },
      projection: { username: 1 }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MONGODB_API_KEY
      }
    });

    if (existingUserResponse.data.document) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register the new user
    await axios.post('https://data.mongodb-api.com/app/data-sicwcur/endpoint/data/v1/action/insertOne', {
      dataSource: "Cluster0",
      database: "test",
      collection: "users",
      document: {
        username,
        password: hashedPassword
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MONGODB_API_KEY
      }
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}
