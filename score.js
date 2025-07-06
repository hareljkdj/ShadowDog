export class Score {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Arial';
    }

    draw(context) {
        context.fillStyle = 'black';
        context.textAlign = 'left';
        context.font = this.fontSize + 'px ' + this.fontFamily;

        context.fillText(`Score: ${this.game.score}`, 20, 50);
        context.fillText(`Time: ${((this.game.maxtime - this.game.time) / 1000).toFixed(1)}`, 20, 80);

        if (this.game.gameOver) {
            context.textAlign = 'center';
            const message = this.game.score > 50 ? 'You Win!' : 'Game Over';
            context.fillText(message, this.game.width / 2, this.game.height / 2);
        }
        if (this.game.paused) {
            context.fillStyle = 'rgba(0, 0, 0, 0.5)'; // רקע חצי שקוף
            context.fillRect(0, 0, this.game.width, this.game.height);

            context.fillStyle = 'Black'; // צבע טקסט
            context.font = 'bold 40px Arial';
            context.textAlign = 'center';
            context.fillText('PAUSED', this.game.width / 2, this.game.height / 2);
        }
        for (let i = 0; i < this.game.lives; i++) {
         context.drawImage(
          document.getElementById('heart1'), // אייקון לב
         25 + i * 35, // מרווחים בין האייקונים
         100,          // Y קבוע מתחת ל-Score
         30, 30        // גודל האייקון
        );
        }
        // ציור פס אנרגיה
        context.fillStyle = 'black';
        context.fillRect(20, 140, 150, 10); // רקע

        context.fillStyle = 'limegreen';
        const staminaWidth = (this.game.player.stamina / this.game.player.maxStamina) * 150;
        context.fillRect(20, 140, staminaWidth, 10); // אנרגיה בפועל

        context.strokeStyle = 'white';
        context.strokeRect(20, 140, 150, 10); // מסגרת
    }

}
