const Review = require('../models/reviews')
const Campground = require('../models/campground')

module.exports.postReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = req.body.review;
    const newReview = new Review(review);
    newReview.author = req.user;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Your review has been posted!')
    res.redirect(`/campgrounds/${id}`)


}
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findById(id);
    const index = campground.reviews.indexOf(reviewId);
    campground.reviews.splice(index, 1);
    await campground.save();
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Succesfully deleted review!')
    res.redirect(`/campgrounds/${id}`)


}