import express from 'express';
import cors from 'cors';
import MongooseconnectDB from './db/Mongoose.js';
import registerRouter from './routes/auth/register.js';
import loginRouter from './routes/auth/login.js';
import forgotPasswordRouter from './routes/auth/forgotpass.js';
import resetPasswordRouter from './routes/auth/reset.js';
import connectDB from './db/Mongo.js';
import urlRouter from './routes/auth/url.js';
import urlstic from './routes/auth/urlstc.js';
const server = express();

server.use(express.json());
server.use(cors());

await connectDB();
await MongooseconnectDB();
const customMiddleware = (req, res, next) => {
    console.log(
      new Date().toString(),
      "Handling request for",
      req.method,
      req.originalUrl
    );
  
    next();
  };
 
server.use(customMiddleware);


server.use('/register', registerRouter);
server.use('/login', loginRouter);
server.use('/forgot-password', forgotPasswordRouter);
server.use('/reset-password', resetPasswordRouter);
server.use('/url-shortener', urlRouter);
server.use('/stic',urlstic);
const port = 8000;
server.listen(port, ()=>{
    console.log(Date().toString(),`Server is running on port ${port}`);
});