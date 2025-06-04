if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/expressError');
const { campgroundSchema, reviewSchema } = require('./schemas/Validations')
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const registration = require('./routes/users')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')



const sessionObject = {
    name:'session',
    // secure:true,
    secret: "Hamdi",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
    'http://localhost:3000/dist/maptiler-sdk.css',

];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
    'http://localhost:3000/dist/maptiler-sdk.css'
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
    'http://localhost:3000/dist/maptiler-sdk.css'
];
const fontSrcUrls = [];
app.use(session(sessionObject))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(mongoSanitize());
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dmu9ng6w5/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
                'http://localhost:3000/dist/maptiler-sdk.css',
                "https://media.cntraveler.com/photos/5ef635b25a986932f31237d9/16:9/w_2560%2Cc_limit/CampingGear-2020-GettyImages-sb10070057l-001.jpg"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }))
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp'
)
    .then(() => {
        console.log("Connected to Mongo")
    })
    .catch((e) => {
        console.log(e)
    })
app.use(methodOverride('_method'));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)
app.use('/', registration)
app.get('/',(req,res)=>{
    res.render('home')
})


app.all('*', (req, res, next) => {
    throw new ExpressError(404, "Page Not Found")
})
app.use((err, req, res, next) => {
    if (!err.message) err.message = "Something Went Wrong";
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).render('errors', { err })

})


app.listen(3000, () => {
    console.log("Listening on port 3000");
})

