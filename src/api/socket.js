import { io } from 'socket.io-client';

let socket = null;

// Directly connect to backend server on port 5000 for guaranteed websocket connection
const SOCKET_SERVER_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : '/';

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 25,
      reconnectionDelay: 1500,
      autoConnect: true,
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('⚡ [Socket.io Connected to Backend]:', SOCKET_SERVER_URL, '| Socket ID:', socket.id);
    });

    socket.on('joined_role_success', (res) => {
      console.log('⚡ [Socket Joined Role Successfully]:', res);
    });

    socket.on('connect_error', (err) => {
      console.warn('⚡ [Socket.io Connection Notice]:', err.message);
    });
  }

  return socket;
};

export const joinSocketRole = ({ role, shopId = null, userId = null }) => {
  const s = getSocket();
  const payload = { role, shopId, userId };

  if (s.connected) {
    console.log('⚡ [Emitting join_role]:', payload);
    s.emit('join_role', payload);
  } else {
    s.once('connect', () => {
      console.log('⚡ [Connected, Emitting join_role]:', payload);
      s.emit('join_role', payload);
    });
  }
};
