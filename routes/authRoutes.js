const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:id/:token').post(authController.resetPassword);

module.exports = router;
