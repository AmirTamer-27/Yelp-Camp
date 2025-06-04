const Campground = require('./models/campground')
const Review = require('./models/reviews')
const ExpressError = require('./utils/expressError');
const { campgroundSchema } = require('./schemas/Validations')
const { reviewSchema } = require('./schemas/Validations')
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnUrl = req.originalUrl
        req.flash('error', 'You must be signed in to do that')
        res.redirect('/login')

    }
    else {
        next();
    }
}
const returnTo = (req, res, next) => {
    if (req.session.returnUrl) {
        res.locals.returnUrl = req.session.returnUrl
        return next()
    }
    else {
        res.locals.returnUrl = '/campgrounds'
        return next();
    }
}
const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (camp.author._id.toString() !== req.user._id.toString()) {
        req.flash('error', 'You are not the author of this campground')
        res.redirect(`/campgrounds/${id}`)
    }
    else {
        next()
    }

}
const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId).populate('author')
    if (review.author._id.toString() !== req.user._id.toString()) {
        req.flash('error', 'You are not the author of this review')
        res.redirect(`/campgrounds/${id}`)
    }

    else {
        next()
    }
}
const validateCampgrounds = function (req, res, next) {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    }
    else {
        next();
    }
}
const validateReviews = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    }
    else {
        next();
    }
}


module.exports.isLoggedIn = isLoggedIn;
module.exports.returnTo = returnTo;
module.exports.isAuthor = isAuthor;
module.exports.isReviewAuthor = isReviewAuthor;
module.exports.validateCampgrounds = validateCampgrounds;
module.exports.validateReviews = validateReviews;