const { ref } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');
const User = require('../models/user');
const imagesSchema = new Schema({
    url: String,
    filename: String
}
)
imagesSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = {toJSON: {virtuals:true}}


const campgroundSchema = new Schema({
    title: String,
    images: [imagesSchema],
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId, ref: "Review"
    }],
    author: {
        type: Schema.Types.ObjectId, ref: "User"
    }

},opts)
campgroundSchema.virtual('properties.popupmarkup').get(function () {
    return `<b><a href =campgrounds/${this._id}>${this.title}</a></b>`
})
campgroundSchema.path('images').validate(function (images) {
    return images.length <= 5; // set maximum number of images, for example 5
},);
campgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema)