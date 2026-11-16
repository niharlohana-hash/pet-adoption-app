const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get or create conversation between user and shelter/admin (or another user)
// @route   POST /api/chat/conversations
// @access  Private
const getOrCreateConversation = async (req, res, next) => {
  try {
    const { recipientId, petId } = req.body;

    let targetRecipientId = recipientId;

    // If no recipientId provided, find the primary admin to chat with
    if (!targetRecipientId) {
      const admin = await User.findOne({ role: 'admin' });
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'No shelter admin available to chat with',
        });
      }
      targetRecipientId = admin._id;
    }

    if (targetRecipientId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot start a conversation with yourself',
      });
    }

    // Find existing conversation between these participants for this pet (or general)
    let conversationQuery = {
      participants: { $all: [req.user._id, targetRecipientId] },
    };
    if (petId) {
      conversationQuery.pet = petId;
    }

    let conversation = await Conversation.findOne(conversationQuery)
      .populate('participants', 'name email avatar role')
      .populate('pet', 'name species photos');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, targetRecipientId],
        pet: petId || undefined,
        lastMessage: {
          text: 'Conversation started',
          sender: req.user._id,
          createdAt: new Date(),
        },
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email avatar role')
        .populate('pet', 'name species photos');
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's conversations
// @route   GET /api/chat/conversations
// @access  Private
const getUserConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name email avatar role')
      .populate('pet', 'name species breed photos status')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/conversations/:id/messages
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    // Verify user is a participant or an admin
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this conversation',
      });
    }

    const messages = await Message.find({ conversationId: id })
      .populate('sender', 'name email avatar role')
      .sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      {
        conversationId: id,
        sender: { $ne: req.user._id },
        read: false,
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message in a conversation
// @route   POST /api/chat/conversations/:id/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message text cannot be empty',
      });
    }

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    const message = await Message.create({
      conversationId: id,
      sender: req.user._id,
      text: text.trim(),
    });

    // Update conversation lastMessage
    conversation.lastMessage = {
      text: text.trim(),
      sender: req.user._id,
      createdAt: new Date(),
    };
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate(
      'sender',
      'name email avatar role'
    );

    // Emit real-time Socket.IO event to the conversation room and recipient
    const io = req.app.get('io');
    if (io) {
      io.to(`conversation_${id}`).emit('new_message', populatedMessage);

      // Also notify other participants
      conversation.participants.forEach((participantId) => {
        if (participantId.toString() !== req.user._id.toString()) {
          io.to(`user_${participantId}`).emit('chat_notification', {
            conversationId: id,
            message: populatedMessage,
          });
        }
      });
    }

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrCreateConversation,
  getUserConversations,
  getMessages,
  sendMessage,
};
