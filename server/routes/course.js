const express = require('express')
const cryptojs = require('crypto-js')
const pool = require('../db/pool')
const result = require('../utils/result')


const router = express.Router()





router.get("/all-active_courses", (req, res) => {
  const sql = `SELECT * FROM Courses WHERE end_date > CURDATE()`

  pool.query(sql, (error, data) => {
    res.send(result.createResult(error, data))
  })
})



router.get("/all-courses", (req, res) => {
  const { start_date, end_date } = req.query

  let sql = `SELECT * FROM Courses WHERE 1=1`
  const params = []

  if (start_date) {
    sql += ` AND start_date >= ?`
    params.push(start_date)
  }

  if (end_date) {
    sql += ` AND end_date <= ?`
    params.push(end_date)
  }

  pool.query(sql, params, (error, data) => {
    res.send(result.createResult(error, data))
  })
})


router.post('/add' , (req,res) => {

   const  {course_name, descrip , fees, start_date , end_date, video_expire_days} = req.body

   const sql = `INSERT INTO Courses(course_name, descrip , fees, start_date , end_date, video_expire_days) VALUES(?,?,?,?,?,?)`

   pool.query(sql , [course_name, descrip , fees, start_date , end_date, video_expire_days] , (error , data) => {

    res.send(result.createResult(error,data))
   })

})

router.put('/update/:course_id' , (req,res) => {
  const course_id = req.params.course_id
  const{course_name, descrip , fees, start_date , end_date, video_expire_days} = req.body

  const sql = `
    UPDATE Courses
    SET
      course_name = ?,
      descrip = ?,
      fees = ?,
      start_date = ?,
      end_date = ?,
      video_expire_days = ?
    WHERE course_id = ?
  `

   pool.query(sql , [course_name, descrip , fees, start_date , end_date, video_expire_days , course_id] , (error , data) => {

    res.send(result.createResult(error,data))
   })
})


router.delete('/delete/:course_id' , (req,res)=>{

 const course_id = req.params.course_id
 const sql = `DELETE FROM Courses WHERE course_id = ?`

 pool.query(sql, [course_id], (error, data) => {
        res.send(result.createResult(error, data))
    })

})

module.exports = router