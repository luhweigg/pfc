import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendFile = (res, filePath, contentType) => {
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Fichier introuvable</h1>');
            } else {
                res.writeHead(500);
                res.end('Erreur serveur: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
};

const server = http.createServer((req, res) => {
    const url = req.url;
    console.log(`Requête reçue : ${url}`);

    if (url === '/') {
        const filePath = path.join(__dirname, 'public', 'home.html');
        sendFile(res, filePath, 'text/html');

    } else if (url === '/about') {
        const filePath = path.join(__dirname, 'public', 'about.html');
        sendFile(res, filePath, 'text/html');

    } else if (url === '/pfc') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        sendFile(res, filePath, 'text/html');

    } else {
        const filePath = path.join(__dirname, 'public', url);
        const extname = path.extname(filePath);
        
        let contentType = 'text/plain';
        switch (extname) {
            case '.js': contentType = 'text/javascript'; break;
            case '.css': contentType = 'text/css'; break;
            case '.json': contentType = 'application/json'; break;
            case '.png': contentType = 'image/png'; break;
            case '.jpg': contentType = 'image/jpg'; break;
            case '.ico': contentType = 'image/x-icon'; break;
            case '.html': contentType = 'text/html'; break;
        }

        sendFile(res, filePath, contentType);
    }
});

const io = new Server(server);

let connectedPlayers = [];
let coupsJoues = {};

function determinerGagnant(c1, c2) {
    if (c1 === c2) return 'egalite';
    if ((c1 === 'pierre' && c2 === 'ciseaux') ||(c1 === 'feuille' && c2 === 'pierre') ||(c1 === 'ciseaux' && c2 === 'feuille')) {
        return 'joueur1';
    }
    return 'joueur2';
}

io.on('connection', (socket) => {
    console.log(`Nouvelle connexion : ${socket.id}`);

    if (connectedPlayers.length >= 2) {
        socket.emit('full');
        socket.disconnect(true);
        console.log('-> Connexion rejetée (Serveur complet)');
        return;
    }

    connectedPlayers.push(socket.id);

    if (connectedPlayers.length === 1) {
        socket.emit('waiting', 'En attente d\'un second joueur...');
    } 
    else if (connectedPlayers.length === 2) {
        io.emit('start', 'Adversaire trouvé ! La partie commence !');
    }

    socket.on('play', (coup) => {
        if (connectedPlayers.length < 2) return;

        coupsJoues[socket.id] = coup;
        const ids = Object.keys(coupsJoues);

        if (ids.length === 1) {
            socket.emit('waiting', 'Coup validé. En attente de l\'adversaire...');
        }
        else if (ids.length === 2) {
            const id1 = ids[0];
            const id2 = ids[1];
            const resultat = determinerGagnant(coupsJoues[id1], coupsJoues[id2]);

            if (resultat === 'egalite') {
                io.emit('result', `Égalité ! (${coupsJoues[id1]} vs ${coupsJoues[id2]})`);
            } else if (resultat === 'joueur1') {
                io.to(id1).emit('result', `Gagné ! (${coupsJoues[id1]} bat ${coupsJoues[id2]})`);
                io.to(id2).emit('result', `Perdu ! (${coupsJoues[id1]} bat ${coupsJoues[id2]})`);
            } else {
                io.to(id1).emit('result', `Perdu ! (${coupsJoues[id2]} bat ${coupsJoues[id1]})`);
                io.to(id2).emit('result', `Gagné ! (${coupsJoues[id2]} bat ${coupsJoues[id1]})`);
            }
        }
    });

    socket.on('restart', () => {
        if (Object.keys(coupsJoues).length === 2) {
            coupsJoues = {};
            io.emit('start', 'Nouvelle manche ! À vous de jouer !');
        }
    });

    socket.on('disconnect', () => {
        connectedPlayers = connectedPlayers.filter(id => id !== socket.id);
        delete coupsJoues[socket.id];

        if (connectedPlayers.length === 1) {
            const survivantId = connectedPlayers[0];
            io.to(survivantId).emit('opp_left', 'L\'adversaire a quitté la partie. En attente d\'un nouveau joueur...');
            coupsJoues = {};
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log(`Pour jouer, rendez-vous sur http://localhost:${PORT}/pfc`);
});