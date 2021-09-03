const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../utils/middleware');
const reviewController = require('../controllers/review_controller');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

router.put('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.updateReview));

module.exports = router;