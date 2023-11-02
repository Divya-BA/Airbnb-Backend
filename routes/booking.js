const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/user');

const {
  createBookings,
  getBookings,
} = require('../controllers/bookingController');

router.route('/').get(isLoggedIn, getBookings).post(isLoggedIn, createBookings);

module.exports = router;