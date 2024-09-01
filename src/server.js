const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://vercel-admin-user:EPH52vgHmDMtqzEj@cluster0.8awyqnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User schema and model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Define Report schema and model
const ReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phq9Score: Number,
  gad7Score: Number,
  phq9Severity: String,
  gad7Severity: String,
  timestamp: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', ReportSchema);

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    // If username is not taken, proceed to hash the password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User registered');
  } catch (error) {
    console.error( error);
    res.status(500).send('');
  }
});




app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).send('Invalid credentials');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send('Invalid credentials');
  }

  const jwtSecret = 'aa00335ebc227bb226d97c7a1d2ba94e3a5f643353a6c17da3608c3483ad8eac67f4702a922b8fe618733e5745dfa295bc22fcb8fb19da20f2b35ac537ca6388';
  const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
  res.status(200).json({ token, userId: user._id, username: user.username });
});

app.post('/api/save-report', async (req, res) => {
  const { userId, phq9Score, gad7Score, phq9Severity, gad7Severity } = req.body;

  try {
    // Save report data to the Report collection
    const newReport = new Report({
      userId,
      phq9Score,
      gad7Score,
      phq9Severity,
      gad7Severity,
    });

    await newReport.save();

    res.status(201).json({ message: 'Report saved successfully' });
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

app.get('/api/fetch-report/:userId', async (req, res) => {
  const userId = req.params.userId;
  // Log userId to verify it's being received correctly

  try {
    console.log("sssss",userId)
    const reports = await Report.find({ userId }).sort({ timestamp: -1 });
   
    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: 'No reports found for this user' });
    }
    
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
