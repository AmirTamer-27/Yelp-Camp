const maptilerClient = require("@maptiler/client");
const { cloudinary } = require('../cloudinary/index')
const Campground = require('../models/campground')
maptilerClient.config.apiKey = process.env.MapTiler_Key;

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}
module.exports.renderNewCampground = (req, res) => {
    res.render('campgrounds/new')

}
module.exports.postNewcamp = async (req, res, next) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location);
    const campground = req.body.campground;
    const newCamp = new Campground(campground);
    newCamp.geometry = geoData.features[0].geometry
    for (let f of req.files) {
        newCamp.images.push({
            url: f.path,
            filename: f.filename
        })
    }
    newCamp.author = req.user._id
    await newCamp.save();
    console.log(newCamp)
    req.flash('success', 'Succesfully added new campround!')
    res.redirect(`/campgrounds/${newCamp._id}`);
}
module.exports.show = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate(
        {
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }

    ).populate('author')
    if (!campground) {
        req.flash('error', 'Cant find that campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })


}
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cant find that campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });

}
module.exports.putCamp = async (req, res) => {
    const { id } = req.params;
    const updatedCampground = req.body.campground;

    let imagesArray = [];
    console.log(req.body)
    for (let f of req.files) {
        imagesArray.push({
            url: f.path,
            filename: f.filename
        })

    }
    const campground = await Campground.findByIdAndUpdate(id, updatedCampground, { runValidators: true });
    campground.images.push(...imagesArray)
    if (req.body.deleted) {
         console.log(req.body.deleted)
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleted } } } })
        for (let filename of req.body.deleted) {
            await cloudinary.uploader.destroy(filename)
        }
    }
    await campground.save();
    
    req.flash('success', 'Succesfully updated campround!')
    res.redirect(`/campgrounds/${id}`);

}



module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await Campground.findOneAndDelete({ _id: id })
    req.flash('success', 'Succesfully deleted campground!')
    res.redirect('/campgrounds');
}