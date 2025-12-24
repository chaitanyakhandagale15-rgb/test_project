const express = require("express")
const userRouter = require("../server/routes/course")
const videosRouter = require('./routes/video');
const adminRouter = require('./routes/admin')
const cors = require('cors');
const config = require('./utils/config');

const app = express()

app.use(express.json());

const studentRoutes = require('./routes/student');
const authRoutes = require('./routes/auth');
app.use('/course' , userRouter)
app.use('/videos', videosRouter);
app.use('/admin', adminRouter);


const PORT = config.PORT || 4000;


app.listen(4000, 'localhost', () => {
    console.log('Server is running on 4000');

});