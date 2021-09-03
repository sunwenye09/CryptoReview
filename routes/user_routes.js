const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
//const User = require('../models/user_model');
const userController = require('../controllers/user_controller');

router.route('/signup')
    .get(userController.renderSignUp)
    .post(catchAsync(userController.signUp));

router.route('/signin')
    .get(userController.renderSignIn)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/signin' }), userController.signIn)

router.get('/signout', userController.signOut)

module.exports = router;