const jwt = require('jsonwebtoken');
const User = require('../models/User');

const initSocketIO = (io) => {
  // Middleware to authenticate socket connections via JWT token
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token) {
        // Allow anonymous users to connect for public real-time events (like pet catalog updates)
        socket.user = null;
        return next();
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecretpawsomejwtkey_fallback_2026'
      );

      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        socket.user = user;
      }
      next();
    } catch (err) {
      // If token is invalid, still allow connection as guest
      socket.user = null;
      next();
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user ? socket.user._id.toString() : 'guest';
    const userName = socket.user ? socket.user.name : 'Guest';

    console.log(`🔌 Socket connected: ${socket.id} (User: ${userName} / ${userId})`);

    // Join personal user room for private notifications
    if (socket.user) {
      socket.join(`user_${userId}`);
      console.log(`👤 User joined room: user_${userId}`);

      if (socket.user.role === 'admin') {
        socket.join('admin_channel');
        console.log(`👑 Admin joined room: admin_channel`);
      }
    }

    // Join specific chat conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`💬 Socket ${socket.id} joined conversation: ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`👋 Socket ${socket.id} left conversation: ${conversationId}`);
    });

    // Typing indicators
    socket.on('typing_start', ({ conversationId, userName }) => {
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        conversationId,
        userName,
      });
    });

    socket.on('typing_stop', ({ conversationId }) => {
      socket.to(`conversation_${conversationId}`).emit('user_stop_typing', {
        conversationId,
      });
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`❌ Socket disconnected: ${socket.id} (${reason})`);
    });
  });
};

module.exports = initSocketIO;
