const express = require('express');
const morgan = require('morgan');
const app = express();
const tourController = require('./../controllers/tourControllers.js');
const authController = require('./../controllers/authController.js');


const tourRoutes = express.Router();
// tourRoutes.use(express.json);
// tourRoutes.use(morgan('dev'));

// tourRoutes.param('id', tourController.checkId);
// tourRoutes.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
// tourRoutes.route('/tour-stats').get(tourController.getTourStats);
// tourRoutes.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
tourRoutes
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
tourRoutes
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.protect,authController.restrictTo('admin','lead-Tour'), tourController.deleteTour);

module.exports = tourRoutes;
