const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: '/tmp' });

const {
  register,
  login,
  logout,
  uploadPicture,
  updateUserDetails,
} = require('../controllers/userController');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/upload-picture').post(upload.single('picture', 1), uploadPicture)
router.route('/update-user').put(updateUserDetails)
router.route('/logout').get(logout);


module.exports = router;