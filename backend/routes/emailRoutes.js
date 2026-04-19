const express = require('express');
const router = express.Router();
const { processIncomingEmail } = require('../controllers/emailController');

// This could be a webhook endpoint for SendGrid/Postmark etc.
router.post('/webhook', processIncomingEmail);

module.exports = router;
