import { Sitting, Running ,Jumping, Falling, Rolling, Diving, Hit} from "./PlayerStates.js";
import { Collision } from "./Collision.js";
// File: Player.js
export class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin; // Position player above the ground
    this.vy =0; // Vertical speed
    this.weight = 1; // Weight for gravity effect
    this.image = document.getElementById('player'); // 10 pixels above the ground
    this.speed = 0;
    this.frameX = 0; // Horizontal frame index for sprite animation
    this.frameY = 0; // Vertical frame index for sprite animation
    this.maxSpeed = 10; // Maximum speed for horizontal movement
    this.maxFrame = 5; // Maximum frame for animation
    this.fps = 20; // Frames per second for animation
    this.frameInterval = 1000 / this.fps; // Interval between frames in milliseconds
    this.frameTimer = 0; // Timer to control frame updates
    this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game),
    new Diving(this.game),new Hit(this.game)]; // Array of player states
    this.stamina = 100;            // ערך התחלתי
    this.maxStamina = 100;
    this.staminaRecovery = 10;     // כמה stamina מתמלאת בשנייה
    this.staminaDrainRate = 50;    // כמה stamina נרוקן לשנייה בזמן ROLLING
  }

    update(input, deltaTime) {
        this.checkCollision(); // Check for collisions with enemies
        // Handle input for the current state
        this.currentState.handleInput(input);
        this.x += this.speed;
        if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed; // Move left
        else if (input.includes('ArrowRight')) this.speed = this.maxSpeed; // Move right
        else this.speed = 0;
        if (this.x < 0) this.x = 0; // Prevent moving off the left edge
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // vertical movement
        this.y += this.vy; // Gravity effect
        if(!this.onGround())  this.vy += this.weight; // Apply gravity
        else this.vy = 0; // Reset vertical speed when on the ground

        // Animation frame handling
        if( this.frameTimer > this.frameInterval) {
            this.frameTimer = 0; // Reset timer
            this.frameX++; // Move to the next frame
            if (this.frameX > this.maxFrame) this.frameX = 0; 
        }
        else this.frameTimer += deltaTime; // Increment timer by deltaTime

        // כל עוד לא ROLLING – למלא stamina בהדרגה
        if (this.currentState !== this.states[4] && this.currentState !== this.states[5]) { // If not rolling
            this.stamina += this.staminaRecovery * (deltaTime / 1000); // Increment stamina based on deltaTime
            if (this.stamina > this.maxStamina) this.stamina = this.maxStamina; // Cap stamina at max value
        } else {
            // אם ROLLING – להוריד stamina בהדרגה
            this.stamina -= this.staminaDrainRate * (deltaTime / 1000); // Decrement stamina based on deltaTime
            if (this.stamina < 0) this.stamina = 0; // Prevent negative stamina
        }
    }
    draw(context) {
       context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin; // Check if the player is on the ground
    }
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollision() {
        this.game.enemies.forEach(enemy => {
        if (this.x < enemy.x + enemy.width &&
            this.x + this.width > enemy.x &&
            this.y < enemy.y + enemy.height &&
            this.y + this.height > enemy.y) {
            // Collision detected
            enemy.markForDeletion = true; // Mark the enemy for deletion
            this.game.collision.push(new Collision(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5)); // Add collision particle effect
            if (this.currentState === this.states[5] || this.currentState === this.states[4]) {
                 this.game.score++; // Increment score if player is diving
            }
            else
            {
                this.setState(6, 0); // Set player state to hit
                this.game.lives--; // Decrease player lives
                if (this.game.lives <= 0) {
                    this.game.gameOver = true; // Set game over if lives are zero
                }
            }
        }
    });
}
}