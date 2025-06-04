const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/expressError');
const User = require('../models/user');
const passport = require('passport');
const { returnTo } = require('../middleware');
const userController = require('../controllers/users')
router.route('/register')
    .get(userController.renderRegister)
    .post(wrapAsync(userController.postUser))
router.route('/login')
    .get(userController.renderLogin)
    .post(returnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.login)

router.get('/logout', userController.logout)


module.exports = router;