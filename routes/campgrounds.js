const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/expressError');
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas/Validations')
const { isLoggedIn } = require('../middleware')
const { isAuthor } = require('../middleware')
const { validateCampgrounds } = require('../middleware');
const { required } = require('joi');
const campgroundController = require('../controllers/campground')
const { storage } = require('../cloudinary/index')
const multer = require('multer');
const upload = multer({ storage })

router.route('/')
    .get(wrapAsync(campgroundController.index))
    .post(isLoggedIn, upload.array('img'), validateCampgrounds, wrapAsync(campgroundController.postNewcamp))

router.get('/new', isLoggedIn, campgroundController.renderNewCampground)
router.get('/edit/:id', isLoggedIn, isAuthor, wrapAsync(campgroundController.renderEditForm))
router.route('/:id')
    .delete(isLoggedIn, isAuthor, wrapAsync(campgroundController.deleteCamp))
    .put(isLoggedIn, isAuthor, upload.array('img'), validateCampgrounds, wrapAsync(campgroundController.putCamp))
    .get(wrapAsync(campgroundController.show))

module.exports = router;

