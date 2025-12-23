const express = require('express');
const router = express.Router();

const pool = require('../db/pool');
const result = require('../utils/result');


//ENROLLED STUDENTS
router.get('/enrolled-students', (req, res) => {
  const { courseId } = req.query;

  const sql = 'SELECT * FROM students WHERE course_id = ?';
  pool.query(sql, [courseId], (err, students) => {
    res.send(result.createResult(err, students));
  });
});

module.exports = router