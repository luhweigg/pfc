import { io } from "socket.io-client";
import { MSG_WELCOME, MSG_FULL, MSG_WAITING, MSG_START, MSG_PLAY, MSG_RESULT, MSG_RESTART, MSG_OPP_LEFT } from "./constants";
import { updateMessage, initButtons, initRestartButton, toggleRestartButton, setButtonsDisabled, showFullMessage } from "./ui";

export function initGame() {
    const namespace = window.location.pathname.includes('singleplayer') ? '/single' : '/multi';
    const socket = io(namespace);

    console.log(`Connexion au namespace : ${namespace}`);

    setButtonsDisabled(true);

    socket.on(MSG_WELCOME, (msg) => {
        updateMessage(msg);
    });

    socket.on(MSG_FULL, () => {
        showFullMessage();
        socket.disconnect();
    });

    socket.on(MSG_WAITING, (msg) => {
        updateMessage(msg);
        setButtonsDisabled(true);
        toggleRestartButton(false);
    });

    socket.on(MSG_START, (msg) => {
        updateMessage(msg);
        setButtonsDisabled(false);
        toggleRestartButton(false);
    });

    socket.on(MSG_RESULT, (resultat) => {
        updateMessage(`Résultat : ${resultat}`);
        toggleRestartButton(true);
        setButtonsDisabled(true);
    });

    socket.on(MSG_OPP_LEFT, (msg) => {
        updateMessage(msg);
        setButtonsDisabled(true);
        toggleRestartButton(false);
    });

    initButtons((coup) => {
        socket.emit(MSG_PLAY, coup);
        setButtonsDisabled(true);
        updateMessage(`Vous avez joué : ${coup}. En attente de l'adversaire...`);
    });

    initRestartButton(() => {
        socket.emit(MSG_RESTART);
    });
}