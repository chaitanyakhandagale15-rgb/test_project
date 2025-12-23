const express = require('express');
const router = express.Router();

const pool = require('../db/pool');
const result = require('../utils/result');


//GET ALL VIDEOS BY COURSE

router.get('/all-videos', (req, res) => {
  const { courseId } = req.query;

  const sql = 'SELECT * FROM videos WHERE course_id = ?';
  pool.query(sql, [courseId], (err, videos) => {
    res.send(result.createResult(err, videos));
  });
});

// ADD VIDEO

router.post('/add', (req, res) => {
  const {courseId, title, youtubeURL, description } = req.body;

  const sql = `
    INSERT INTO videos (course_id, title, descrip, youtube_url, added_at)
    VALUES (?, ?, ?, ?, CURDATE())
  `;

  pool.query(
    sql,
    [courseId, title, description, youtubeURL],
    (error, data) => {
      res.send(result.createResult(error, data));
    }
  );
});


// UPDATE VIDEO
router.put('/update/:videoId', (req, res) => {
  const { videoId } = req.params;
  const { courseId, title, youtubeURL, description } = req.body;

  const sql = `
    UPDATE videos
    SET course_id = ?, title = ?, descrip = ?, youtube_url = ?
    WHERE video_id = ?
  `;

  pool.query(
    sql,
    [courseId, title, description, youtubeURL, videoId],
    (error, data) => {
      res.send(result.createResult(error, data));
    }
  );
});


//DELETE VIDEO
router.delete('/delete/:videoId', (req, res) => {
  const { videoId } = req.params;

  const sql = 'DELETE FROM videos WHERE video_id = ?';
  pool.query(sql, [videoId], (error, data) => {
    res.send(result.createResult(error, data));
  });
});


//ENROLLED STUDENTS
// router.get('/enrolled-students', (req, res) => {
//   const { courseId } = req.query;

//   const sql = 'SELECT * FROM students WHERE course_id = ?';
//   pool.query(sql, [courseId], (err, students) => {
//     res.send(result.createResult(err, students));
//   });
// });


module.exports = router;
