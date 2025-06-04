const joi = require('joi')
campgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        location: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required().min(0),

    }).required(),
    deleted: joi.array()
})
reviewSchema = joi.object({
    review: joi.object({
        body: joi.string().required(),
        rating: joi.number().required()
    }).required()
})
module.exports.campgroundSchema = campgroundSchema;
module.exports.reviewSchema = reviewSchema;