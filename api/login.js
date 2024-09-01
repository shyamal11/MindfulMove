import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { username, password } = req.body;

  try {
    const response = await axios.post('https://data.mongodb-api.com/app/data-sicwcur/endpoint/data/v1/action/findOne', {
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

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token, userId: user._id, username: user.username });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}
