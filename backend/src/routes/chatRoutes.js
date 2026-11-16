const express = require('express');
const router = express.Router();
const {
  getOrCreateConversation,
  getUserConversations,
  getMessages,
  sendMessage,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/conversations')
  .get(getUserConversations)
  .post(getOrCreateConversation);

router.route('/conversations/:id/messages')
  .get(getMessages)
  .post(sendMessage);

module.exports = router;
