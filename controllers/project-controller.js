const Project = require('../models/project-model');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const allProjects = await Project.find({}).populate('popupText');
    res.render('project/index', { allProjects })
}

module.exports.renderNewForm = (req, res) => {
    res.render('project/create');
}

module.exports.createProject = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.project.location,
        limit: 1
    }).send()
    const project = new Project(req.body.project);
    project.geometry = geoData.body.features[0].geometry;
    project.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    project.author = req.user._id;
    await project.save();
    console.log(project);
    req.flash('success', `The project ${project.title} was created successfully!`);
    res.redirect(`/project/${project._id}`)
}

module.exports.showProject = async (req, res,) => {
    const project = await Project.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!project) {
        req.flash('error', 'Cannot find that project!');
        return res.redirect('/project');
    }
    res.render('project/show', { project });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id)
    if (!project) {
        req.flash('error', 'Cannot find that project!');
        return res.redirect('/project');
    }
    res.render('project/edit', { project });
}

module.exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, { ...req.body.project });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    project.images.push(...imgs);
    await project.save();
    console.log(project);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await project.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated project!');
    res.redirect(`/project/${project._id}`)
}

module.exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted project')
    res.redirect('/project');
}