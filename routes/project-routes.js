const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project-controller');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateProject } = require('../utils/middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(projectController.index))
    .post(isLoggedIn, upload.array('image'), validateProject, catchAsync(projectController.createProject))


router.get('/new', isLoggedIn, projectController.renderNewForm)

router.route('/:id')
    .get(catchAsync(projectController.showProject))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateProject, catchAsync(projectController.updateProject))
    .delete(isLoggedIn, isAuthor, catchAsync(projectController.deleteProject));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(projectController.renderEditForm))



module.exports = router;