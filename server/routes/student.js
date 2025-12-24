const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = require('../db/pool');
const authenticate = require('../utils/auth');
const { success, error } = require('../utils/result');
const { JWT_SECRET } = require('../utils/config');

const router = express.Router();

/**
 * ======================================
 * STUDENT SIGNUP
 * ======================================
 */
router.post('/signup', async (req, res) => {
  const { name, email, password, course_id, mobile_no } = req.body;

  try {
    // Check if user already exists
    const [existingUser] = await pool
      .promise()
      .query('SELECT email FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.send(error('User already exists'));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ Insert into users
    await pool.promise().query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'student']
    );

    // 2️⃣ Insert into students
    await pool.promise().query(
      `INSERT INTO students (name, email, course_id, mobile_no)
       VALUES (?, ?, ?, ?)`,
      [name, email, course_id, mobile_no]
    );

    res.send(success('Student registered successfully'));
  } catch (err) {
    console.log('SIGNUP ERROR:', err);
    res.send(error(err.message));
  }
  
});

/**
 * ======================================
 * STUDENT LOGIN (OPTIONAL – Common login preferred)
 * ======================================
 */
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool
      .promise()
      .query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.send(error('User not found'));
    }

    const user = users[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.send(error('Invalid password'));
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.send(success({ token }));
  } catch (err) {
    console.error(err);
    res.send(error('Login failed'));
  }
});

/**
 * ======================================
 * GET STUDENT PROFILE (Protected)
 * ======================================
 */
router.get('/profile', authenticate, async (req, res) => {
  try {
    const email = req.user.email;

    const [data] = await pool.promise().query(
      `SELECT s.reg_no, s.name, s.email, s.mobile_no,
              c.course_name, c.fees
       FROM students s
       JOIN courses c ON s.course_id = c.course_id
       WHERE s.email = ?`,
      [email]
    );

    if (data.length === 0) {
      return res.send(error('Student not found'));
    }

    res.send(success(data[0]));
  } catch (err) {
    console.error(err);
    res.send(error('Failed to fetch profile'));
  }
});

module.exports = router;
