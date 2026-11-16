import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, PawPrint, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { Button } from '../common/Button';

export const ChatWidget = ({ isOpen, onClose, selectedPet = null }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUser]);

  // Load or start conversation when opened
  useEffect(() => {
    if (!isOpen || !user) return;

    const setupChat = async () => {
      setLoading(true);
      try {
        if (selectedPet) {
          // Open or create conversation specifically for this pet
          const res = await api.chat.getOrCreateConversation({
            petId: selectedPet._id,
          });
          setActiveConversation(res.conversation);
        } else {
          // Load list of conversations
          const res = await api.chat.getConversations();
          setConversations(res.conversations || []);
          if (res.conversations && res.conversations.length > 0) {
            setActiveConversation(res.conversations[0]);
          } else {
            // Start default general conversation with admin
            const newConv = await api.chat.getOrCreateConversation({});
            setActiveConversation(newConv.conversation);
          }
        }
      } catch (err) {
        console.error('Error starting chat:', err);
      } finally {
        setLoading(false);
      }
    };

    setupChat();
  }, [isOpen, selectedPet, user]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      try {
        const res = await api.chat.getMessages(activeConversation._id);
        setMessages(res.messages || []);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    fetchMessages();

    // Join conversation room in Socket.IO
    if (socket) {
      socket.emit('join_conversation', activeConversation._id);

      const handleNewMessage = (newMsg) => {
        if (newMsg.conversationId === activeConversation._id) {
          setMessages((prev) => [...prev, newMsg]);
        }
      };

      const handleTyping = ({ conversationId, userName }) => {
        if (conversationId === activeConversation._id) {
          setTypingUser(userName);
        }
      };

      const handleStopTyping = ({ conversationId }) => {
        if (conversationId === activeConversation._id) {
          setTypingUser(null);
        }
      };

      socket.on('new_message', handleNewMessage);
      socket.on('user_typing', handleTyping);
      socket.on('user_stop_typing', handleStopTyping);

      return () => {
        socket.emit('leave_conversation', activeConversation._id);
        socket.off('new_message', handleNewMessage);
        socket.off('user_typing', handleTyping);
        socket.off('user_stop_typing', handleStopTyping);
      };
    }
  }, [activeConversation, socket]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (!socket || !activeConversation) return;

    socket.emit('typing_start', {
      conversationId: activeConversation._id,
      userName: user.name,
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', {
        conversationId: activeConversation._id,
      });
    }, 1500);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    const text = inputText.trim();
    setInputText('');

    if (socket) {
      socket.emit('typing_stop', { conversationId: activeConversation._id });
    }

    try {
      const res = await api.chat.sendMessage(activeConversation._id, text);
      // Socket will also broadcast or we can optimistically append
      if (!messages.some((m) => m._id === res.message._id)) {
        setMessages((prev) => [...prev, res.message]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full sm:w-96 h-[520px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-brand-500 text-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <PawPrint className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm">
              {activeConversation?.pet
                ? `Inquiry: ${activeConversation.pet.name}`
                : 'Shelter Live Support'}
            </h3>
            <span className="text-[10px] text-white/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              Online • Real-Time Chat
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/50 text-xs">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
            <MessageSquare className="w-8 h-8 mb-2 opacity-50 text-brand-500" />
            <p className="font-medium text-xs">Start a conversation!</p>
            <p className="text-[11px] mt-1">
              Ask questions about pet temperament, visiting hours, or adoption procedures.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-end gap-1.5 max-w-[85%]">
                  {!isMe && (
                    <img
                      src={
                        msg.sender?.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                      }
                      alt={msg.sender?.name}
                      className="w-6 h-6 rounded-full object-cover mb-1 flex-shrink-0"
                    />
                  )}
                  <div
                    className={`p-3 rounded-2xl ${
                      isMe
                        ? 'bg-brand-500 text-white rounded-br-xs shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700 shadow-xs'
                    }`}
                  >
                    {!isMe && (
                      <p className="text-[10px] font-bold text-brand-600 dark:text-brand-400 mb-0.5">
                        {msg.sender?.name || 'Shelter Team'}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-1 ${
                        isMe ? 'text-white/70' : 'text-slate-400'
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {typingUser && (
          <div className="text-[11px] text-slate-400 italic flex items-center gap-1.5 pl-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
            <span>{typingUser} is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={handleInputChange}
          className="flex-1 py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-400"
        />
        <Button
          type="submit"
          size="sm"
          variant="primary"
          disabled={!inputText.trim()}
          icon={Send}
        >
          Send
        </Button>
      </form>
    </div>
  );
};
