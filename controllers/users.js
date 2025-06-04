const User = require('../models/user');
module.exports.renderRegister = (req, res) => {
    res.render('Auth/register');
}
module.exports.postUser = async (req, res, next) => {
    try {
        const { username, email, pass } = req.body;
        const newUser = new User({ email: email, username: username })
        const registeredUser = await User.register(newUser, pass);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        });

    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}
module.exports.renderLogin = (req, res) => {
    res.render('Auth/login')
}
module.exports.login = (req, res) => {
    const returnUrl = res.locals.returnUrl
    console.log(returnUrl)
    req.flash('success', 'Welcome Back!')
    res.redirect(returnUrl);
}
module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) { return next(err) };
        req.flash('success', 'Goodbye')
        res.redirect('/campgrounds');
    });


}