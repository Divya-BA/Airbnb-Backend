const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/user');

const {
  createBookings,
  getBookings,
  cancelBooking,
} = require('../controllers/bookingController');

router.route('/').get(isLoggedIn, getBookings).post(isLoggedIn, createBookings);
router.route("/:bookingId").delete(isLoggedIn, cancelBooking);

module.exports = router;