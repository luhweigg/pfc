import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";

import { sendFile } from './script/utils.js';
import initSocket from './script/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer((req, res) => {
    const url = req.url;
    console.log(`Requête reçue : ${url}`);

    if (url === '/') {
        sendFile(res, path.join(__dirname, 'public', 'index.html'), 'text/html');
    } else if (url === '/about') {
        sendFile(res, path.join(__dirname, 'public', 'about.html'), 'text/html');
    } else if (url === '/singleplayer' || url === '/multiplayer') {
        sendFile(res, path.join(__dirname, 'public', 'game.html'), 'text/html');
    } else {
        const filePath = path.join(__dirname, 'public', url);
        const extname = path.extname(filePath);
        
        let contentType = 'text/plain';
        const mimeTypes = {
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.ico': 'image/x-icon',
            '.html': 'text/html'
        };
        contentType = mimeTypes[extname] || contentType;
        sendFile(res, filePath, contentType);
    }
});

const io = new Server(server);
initSocket(io);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});