export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        window.addEventListener('keydown', e => {
            if ((e.key === 'ArrowUp' || 
                e.key === 'ArrowDown' || 
                e.key === 'ArrowLeft' || 
                e.key === 'ArrowRight' ||
                e.key === 'Enter') 
                && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }else if (e.key === 'p' || e.key === 'P') {
                game.paused = !game.paused;
            }
        });
 // Toggle debug mode
        window.addEventListener('keyup', e => {
            if (e.key === 'ArrowUp' ||
                e.key === 'ArrowDown' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'Enter') {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
        
    }

}