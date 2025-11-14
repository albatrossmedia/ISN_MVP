import { Server } from 'socket.io';

export function attachSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('[Socket.io] Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('[Socket.io] Client disconnected:', socket.id);
    });

    socket.on('subscribe', (room) => {
      socket.join(room);
      console.log(`[Socket.io] Client ${socket.id} joined room: ${room}`);
    });

    socket.on('unsubscribe', (room) => {
      socket.leave(room);
      console.log(`[Socket.io] Client ${socket.id} left room: ${room}`);
    });
  });

  return io;
}

export default attachSockets;
