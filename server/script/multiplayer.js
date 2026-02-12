import { determinerGagnant } from './game.js';

let connectedPlayers = [];
let coupsJoues = {};

export default function initMultiplayer(namespace) {
    namespace.on('connection', (socket) => {
        console.log(`[MULTI] Nouvelle connexion : ${socket.id}`);

        if (connectedPlayers.length >= 2) {
            socket.emit('full');
            socket.disconnect(true);
            return;
        }

        connectedPlayers.push(socket.id);

        if (connectedPlayers.length === 1) {
            socket.emit('waiting', 'En attente d\'un second joueur...');
        } else if (connectedPlayers.length === 2) {
            namespace.emit('start', 'Adversaire trouvé ! La partie commence !');
        }

        socket.on('play', (coup) => {
            if (connectedPlayers.length < 2) return;

            coupsJoues[socket.id] = coup;
            const ids = Object.keys(coupsJoues);

            if (ids.length === 1) {
                socket.emit('waiting', 'Coup validé. En attente de l\'adversaire...');
            } else if (ids.length === 2) {
                const id1 = ids[0];
                const id2 = ids[1];
                
                const resultat = determinerGagnant(coupsJoues[id1], coupsJoues[id2]);

                if (resultat === 'egalite') {
                    namespace.emit('result', `Égalité ! (${coupsJoues[id1]} vs ${coupsJoues[id2]})`);
                } else if (resultat === 'joueur1') {
                    namespace.to(id1).emit('result', `Gagné ! (${coupsJoues[id1]} bat ${coupsJoues[id2]})`);
                    namespace.to(id2).emit('result', `Perdu ! (${coupsJoues[id1]} bat ${coupsJoues[id2]})`);
                } else {
                    namespace.to(id1).emit('result', `Perdu ! (${coupsJoues[id2]} bat ${coupsJoues[id1]})`);
                    namespace.to(id2).emit('result', `Gagné ! (${coupsJoues[id2]} bat ${coupsJoues[id1]})`);
                }
            }
        });

        socket.on('restart', () => {
            if (Object.keys(coupsJoues).length === 2) {
                coupsJoues = {};
                namespace.emit('start', 'Nouvelle manche ! À vous de jouer !');
            }
        });

        socket.on('disconnect', () => {
            connectedPlayers = connectedPlayers.filter(id => id !== socket.id);
            delete coupsJoues[socket.id];
            
            if (connectedPlayers.length > 0) {
                 namespace.emit('opp_left', 'L\'adversaire a quitté.');
                 coupsJoues = {};
            }
        });
    });
}