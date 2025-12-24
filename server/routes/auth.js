const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = require('../db/pool');
const { success, error } = require('../utils/result');
const { JWT_SECRET } = require('../utils/config');

const router = express.Router();

/**
 * ======================================
 * LOGIN (STUDENT / ADMIN)
 * ======================================
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool
      .promise()
      .query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.send(error('User not found'));
    }

    const user = users[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.send(error('Invalid password'));
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.send(success({
      token,
      role: user.role
    }));
  } catch (err) {
    console.log(err);
    res.send(error('Login failed'));
  }
});

module.exports = router;
