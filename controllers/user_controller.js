const User = require('../models/user_model');

module.exports.renderSignUp = (req, res) => {
    res.render('users/signup');
}

module.exports.signUp = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to MicroReview!');
            res.redirect('/project');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('signup');
    }
}

module.exports.renderSignIn = (req, res) => {
    res.render('users/signin');
}

module.exports.signIn = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/project';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.signOut = (req, res) => {
    req.logout();
    // req.session.destroy();
    req.flash('success', "Goodbye!");
    res.redirect('/project');
}