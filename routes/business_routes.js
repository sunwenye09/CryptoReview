const express = require('express');
const router = express.Router();
const business_controller = require('../controllers/business_controller');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateBusiness } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Business = require('../models/business_model');

router.route('/')
    .get(catchAsync(business_controller.index))
    .post(isLoggedIn, upload.array('image'), validateBusiness, catchAsync(business_controller.createBusiness))


router.get('/new', isLoggedIn, business_controller.renderNewForm)

router.route('/:id')
    .get(catchAsync(business_controller.showBusiness))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateBusiness, catchAsync(business_controller.updateBusiness))
    .delete(isLoggedIn, isAuthor, catchAsync(business_controller.deleteBusiness));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(business_controller.renderEditForm))



module.exports = router;