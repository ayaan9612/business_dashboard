const Project = require('../models/Project');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, clientName, description, requirements, deadline, budget, priority, status } = req.body;
    const project = new Project({
      title, clientName, description, requirements, deadline, budget, priority, status,
      userId: req.user._id
    });
    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project && project.userId.toString() === req.user._id.toString()) {
      project.title = req.body.title || project.title;
      project.clientName = req.body.clientName || project.clientName;
      project.description = req.body.description || project.description;
      project.requirements = req.body.requirements || project.requirements;
      project.deadline = req.body.deadline || project.deadline;
      project.budget = req.body.budget || project.budget;
      project.priority = req.body.priority || project.priority;
      project.status = req.body.status || project.status;
      project.progress = req.body.progress !== undefined ? req.body.progress : project.progress;
      
      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project && project.userId.toString() === req.user._id.toString()) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
