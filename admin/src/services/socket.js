import { io } from 'socket.io-client';

const SOCKET_URL = 'https://praja-elctric-automation-backend.onrender.com';

// Singleton socket instance with auto-reconnection
const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export default socket;
