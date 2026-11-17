import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const { info, success } = useToast();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Determine socket server target
    const socketOrigin =
      import.meta.env.VITE_SOCKET_URL ||
      (import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
        : window.location.origin);

    // Create socket connection
    const newSocket = io(socketOrigin, {
      auth: { token },
      autoConnect: true,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('⚡ Socket connected to server');
    });

    // Real-time live notification
    newSocket.on('notification', (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      info(`🔔 ${notif.title}: ${notif.message}`);
    });

    // Real-time application status update for the applicant
    newSocket.on('application_status_updated', ({ status, pet }) => {
      if (status === 'approved') {
        success(`🎉 Great news! Your application for ${pet?.name || 'the pet'} has been APPROVED!`);
      } else if (status === 'rejected') {
        info(`Notice: Your application for ${pet?.name || 'the pet'} was reviewed.`);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        setNotifications,
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
