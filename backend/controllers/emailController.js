const Project = require('../models/Project');
const User = require('../models/User');

// Mock AI parsing function
// In a real scenario, you would send `emailBody` to OpenAI/Gemini API here
const parseEmailWithAI = async (emailBody) => {
  console.log('Simulating AI parsing for:', emailBody.substring(0, 50) + '...');
  
  // Basic mock extraction logic based on keywords
  const titleMatch = emailBody.match(/Project Title:\s*(.*)/i);
  const clientMatch = emailBody.match(/Client:\s*(.*)/i);
  const deadlineMatch = emailBody.match(/Deadline:\s*(.*)/i);
  const budgetMatch = emailBody.match(/Budget:\s*\$?(\d+)/i);

  return {
    title: titleMatch ? titleMatch[1].trim() : 'New AI Project',
    clientName: clientMatch ? clientMatch[1].trim() : 'Unknown Client',
    description: emailBody,
    requirements: 'Extracted from email',
    deadline: deadlineMatch ? new Date(deadlineMatch[1]) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // default 14 days
    budget: budgetMatch ? parseInt(budgetMatch[1]) : 0,
  };
};

const processIncomingEmail = async (req, res) => {
  try {
    const { from, subject, text, to } = req.body;
    
    // Find the user who owns this email (or maybe it's a dedicated forwarding address)
    // For simplicity, we'll assign it to the first Admin user we find if 'to' is a generic address
    // Or we could map the 'to' address to a specific user.
    let targetUser = await User.findOne({ email: to });
    if (!targetUser) {
      targetUser = await User.findOne({ role: 'Admin' });
    }
    
    if (!targetUser) {
       return res.status(404).json({ message: 'No suitable user found to assign the project.' });
    }

    const emailBody = text || subject || '';
    const extractedData = await parseEmailWithAI(emailBody);

    const project = new Project({
      ...extractedData,
      status: 'Pending',
      priority: 'Medium',
      userId: targetUser._id,
      parsedFromEmail: true
    });

    await project.save();
    console.log('Project created from email:', project.title);

    res.status(200).json({ message: 'Email processed and project created', project });
  } catch (error) {
    console.error('Email processing error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { processIncomingEmail };
