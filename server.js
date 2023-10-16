require('dotenv').config();
const path=require('path');
const {logger}=require('./middleware/logEvents.js');
const express=require('express');
const app=express();
const cors=require('cors');
const errorHandler=require('./middleware/errorHandler.js');
const corsOptions=require('./config/corsOptions');
const verfiyJWT=require('./middleware/verfiyJWT')
const cookieParser=require('cookie-parser');
const credentials=require('./middleware/credentials.js');
const mongoose=require('mongoose');
const connectDB=require('./config/dbConn');
const PORT=process.env.PORT||3500;

//connect to Mongo DB
connectDB();


// custom mildleware logger
//Writing logs
app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));

//built in middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json()); 
//middleware for cookie
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'/public')));

//Routers
app.use('/',require('./routes/root'));
app.use('/register',require('./routes/register'));
app.use('/auth',require('./routes/auth'));
app.use('/refresh',require('./routes/refresh'))
app.use('/logout',require('./routes/logout'))
app.use(verfiyJWT);
app.use('/employees',require('./routes/api/employees'));


//express custom middleware for 404 not found directing 
app.all('*',(req,res)=>
{
    res.status(404)
    if(req.accepts('html'))
    {
        res.sendFile(path.join(__dirname,'views','404.html'));
    }
    else if(req.accepts('json'))
    {
        res.json({error:"404 Not Found"});
    }
    else
    {
        res.type('text').send("404 Not Found");
    }
})

//custom middleware for error handleing and writing errorlogs 
app.use(errorHandler);


//Putting the server on if we connected to the DB

mongoose.connection.once('open',()=>
{
    console.log('Connnected to the MongoDB')
    app.listen(PORT,()=>console.log(`server running on port ${PORT}`));
});


 
