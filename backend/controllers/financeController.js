const Finance = require('../models/Finance');
const Project = require('../models/Project');

const getFinances = async (req, res) => {
  try {
    const finances = await Finance.find({ userId: req.user._id }).populate('projectId', 'title');
    
    // Calculate overview stats
    let totalIncome = 0;
    let pendingPayments = 0;

    finances.forEach(f => {
      if (f.type === 'Income' && f.status === 'Paid') {
        totalIncome += f.amount;
      } else if (f.type === 'Income' && f.status === 'Pending') {
        pendingPayments += f.amount;
      }
    });

    res.json({ records: finances, overview: { totalIncome, pendingPayments } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFinance = async (req, res) => {
  try {
    const { projectId, amount, type, status } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project || project.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    const finance = new Finance({
      projectId, userId: req.user._id, amount, type, status
    });
    const createdFinance = await finance.save();
    res.status(201).json(createdFinance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFinances, createFinance };
