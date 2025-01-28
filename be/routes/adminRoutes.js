const express = require('express')
const adminController = require('../controllers/adminController');
const router = express.Router();

router.post('/register', adminController.register);
router.post('/login', adminController.loginAdmin);

module.exports = router;