const { error } = require('console');
const { application } = require('express');
const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes=require('./routes/reviewRoutes');
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const appError=require('./utilities/appError');
const globalErrorHandler=require('./controllers/errorController');

//set security http headers
app.use(helmet());

//development logging
const tourData = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8')
);
if (process.env.NODE_ENV === 'development') {
  console.log(process.env.NODE_ENV);
  app.use(morgan('dev'));
}

//limit requests from same api
const limiter=rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:"Too many requests from this IP, please try again in an hour!"
})
app.use('/api',limiter)

//body parser, reading data from body into req.body
app.use(express.json({
  limit:'10kb'
}));

//data sanitization against noSQL query injection
app.use(mongoSanitize());

//data sanitization against XSS
app.use(xss());

//prevent parameter pollution
app.use(hpp({
  whitelist:[
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}));


//serving static files
app.use(express.static(`${__dirname}/public`));
//middleware
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews',reviewRoutes);





//url not found
app.all('*',(req,res,next)=>{
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // });

  // const err=new Error(`can't find ${req.originalUrl} on the server.`);
  // err.status='fail';
  // err.statusCode=404;

  next(new appError(`can't find ${req.originalUrl} on the server.`,404));
})

app.use(globalErrorHandler);

module.exports = app;
