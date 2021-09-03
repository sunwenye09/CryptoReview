const { projectSchema, reviewSchema } = require('./validation-schemas.js');
const ExpressError = require('./ExpressError');
const Project = require('../models/project-model');
const Review = require('../models/review_model');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/signin');
    }
    next();
}

module.exports.validateProject = (req, res, next) => {
    const { error } = projectSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission for this operation!');
        return res.redirect(`/project/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission for this operation!');
        return res.redirect(`/project/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}