const express = require("express")
const userRouter = require("../server/routes/course")
const app = express()

app.use(express.json());

app.use('/course' , userRouter)

app.listen(4000, 'localhost', () => {
    console.log('Server is running on 4000');
});