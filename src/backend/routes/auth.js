const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { register, login, verify } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/verify', auth, verify);

module.exports = router;
