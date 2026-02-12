import { determinerGagnant } from './game.js';

const MOVES = ['pierre', 'feuille', 'ciseaux'];

export default function initSingleplayer(namespace) {
    namespace.on('connection', (socket) => {
        console.log(`[SOLO] Nouveau joueur : ${socket.id}`);
        socket.emit('start', 'Mode Solo : À toi de jouer contre l\'IA !');
        socket.on('play', (coupJoueur) => {
            const coupIA = MOVES[Math.floor(Math.random() * MOVES.length)];

            const resultat = determinerGagnant(coupJoueur, coupIA);

            let message = '';
            if (resultat === 'egalite') {
                message = `Égalité ! L'IA a aussi joué ${coupIA}.`;
            } else if (resultat === 'joueur1') {
                message = `Gagné ! L'IA a joué ${coupIA}.`;
            } else {
                message = `Perdu ! L'IA a joué ${coupIA}.`;
            }

            socket.emit('result', message);
        });

        socket.on('restart', () => {
            namespace.emit('start', 'Nouvelle manche ! À vous de jouer !');
        });

        socket.on('disconnect', () => {
            console.log(`[SOLO] Joueur parti : ${socket.id}`);
        });
    });
}