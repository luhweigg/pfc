export function determinerGagnant(c1, c2) {
    if (c1 === c2) return 'egalite';
    if (
        (c1 === 'pierre' && c2 === 'ciseaux') ||
        (c1 === 'feuille' && c2 === 'pierre') ||
        (c1 === 'ciseaux' && c2 === 'feuille')
    ) {
        return 'joueur1';
    }
    return 'joueur2';
}