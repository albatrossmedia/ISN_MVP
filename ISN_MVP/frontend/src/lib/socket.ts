import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080';

let socket: Socket | null = null;

export const connectSocket = (token?: string) => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: {
      token: token || localStorage.getItem('auth_token'),
    },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  if (!socket) {
    return connectSocket();
  }
  return socket;
};
