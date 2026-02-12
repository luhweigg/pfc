import initMultiplayer from './multiplayer.js';
import initSingleplayer from './singleplayer.js';

export default function initSocket(io) {
    const multiNamespace = io.of('/multi');
    const singleNamespace = io.of('/single');

    initMultiplayer(multiNamespace);
    initSingleplayer(singleNamespace);
}