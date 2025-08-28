import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(token?: string) {
  if (socket && socket.connected) return socket;
  socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000', {
    path: '/ws',
    auth: { token: token || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '') },
    transports: ['websocket']
  });
  // reconnect logic built-in
  return socket;
}
