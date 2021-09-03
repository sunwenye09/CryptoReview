const Project = require('../models/project-model');
const Review = require('../models/review_model');

module.exports.createReview = async (req, res) => {
    const project = await Project.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    project.reviews.push(review);
    await review.save();
    await project.save();
    //req.flash('success', 'Your comments were posted successfully!');
    res.redirect(`/project/${project._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Project.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    //req.flash('success', 'Successfully deleted comments');
    res.redirect(`/project/${id}`);
}

module.exports.upldateReview = async (req, res) => {
    const review = await Review.findById(req.params.reviewId);
    review.body = req.body.review;
    await review.save();
    res.redirect(`/project/${req.params.id}`);
}