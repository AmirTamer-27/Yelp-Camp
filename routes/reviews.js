const express = require('express')
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const Review = require('../models/reviews')
const Campground = require('../models/campground')
const ExpressError = require('../utils/expressError');
const { reviewSchema } = require('../schemas/Validations')
const { isLoggedIn } = require('../middleware');
const { isReviewAuthor } = require('../middleware');
const { validateReviews } = require('../middleware');
const reviewsController = require('../controllers/reviews')
const User = require('../models/user');

router.post('/', isLoggedIn, validateReviews, wrapAsync(reviewsController.postReview))
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewsController.deleteReview))
module.exports = router;