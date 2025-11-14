import http from 'http';
import { createApp } from './app.js';
import { attachSockets } from './sockets/index.js';
const PORT = process.env.PORT || 8080;
const app = createApp();
const server = http.createServer(app);
attachSockets(server);
server.listen(PORT, ()=>console.log(`[ISN] API listening on :${PORT}`));
