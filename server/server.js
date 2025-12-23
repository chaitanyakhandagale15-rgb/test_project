const express = require("express")
const userRouter = require("../server/routes/course")
const videosRouter = require('./routes/video');
const adminRouter = require('./routes/admin')
const app = express()

app.use(express.json());

app.use('/course' , userRouter)
app.use('/videos', videosRouter);
app.use('/admin', adminRouter);





app.listen(4000, 'localhost', () => {
    console.log('Server is running on 4000');

});