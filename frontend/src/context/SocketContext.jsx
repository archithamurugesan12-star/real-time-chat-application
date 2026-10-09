import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsSocketConnected(false);
        setOnlineUserIds(new Set());
      }
      return;
    }

    // Determine Socket server URL
    const backendUrl = import.meta.env.VITE_SOCKET_URL ||
      (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000');

    const newSocket = io(backendUrl, {
      auth: {
        token: `Bearer ${token}`,
      },
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('[Socket.IO] Connected with ID:', newSocket.id);
      setIsSocketConnected(true);
      newSocket.emit('user:online');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[Socket.IO] Disconnected. Reason:', reason);
      setIsSocketConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.warn('[Socket.IO] Connection error:', err.message);
      setIsSocketConnected(false);
    });

    // Receive initial online users list
    newSocket.on('users:online:list', (userIds) => {
      if (Array.isArray(userIds)) {
        setOnlineUserIds(new Set(userIds));
      }
    });

    // Receive individual user presence updates
    newSocket.on('user:status', ({ userId, isOnline }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        if (isOnline) {
          next.add(userId);
        } else {
          next.delete(userId);
        }
        return next;
      });
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [token, user?._id]);

  const checkIsOnline = (userId) => {
    if (!userId) return false;
    return onlineUserIds.has(userId.toString());
  };

  const value = {
    socket,
    isSocketConnected,
    onlineUserIds,
    checkIsOnline,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;
