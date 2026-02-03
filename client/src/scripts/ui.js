export function updateMessage(text) {
    const box = document.getElementById('message-box');
    if(box) box.innerText = text;
}

export function setButtonsDisabled(disabled) {
    const buttons = document.querySelectorAll('.btn-pfc');
    buttons.forEach(btn => {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? '0.5' : '1';
        btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
    });
}

export function showFullMessage() {
    document.getElementById('game-buttons').style.display = 'none';
    document.getElementById('restart-container').style.display = 'none';
    document.getElementById('message-box').innerText = "⛔ Serveur complet. Connexion refusée.";
    document.getElementById('message-box').style.color = "red";
}

export function toggleRestartButton(show) {
    const container = document.getElementById('restart-container');
    const gameButtons = document.getElementById('game-buttons');
    
    if (show) {
        container.style.display = 'block';
        gameButtons.style.display = 'none';
    } else {
        container.style.display = 'none';
        gameButtons.style.display = 'flex';
    }
}

export function initRestartButton(callback) {
    document.getElementById('btn-restart').addEventListener('click', callback);
}

export function initButtons(callback) {
    const buttons = document.querySelectorAll('.btn-pfc');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const coup = btn.dataset.coup;
            callback(coup);
        });
    });
}