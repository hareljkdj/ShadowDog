import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { BackGround } from "./BackGround.js";
import { FlyingEnemy, ClimbingEnemy , GroundEnemy } from "./enemies/enemies.js";
import { Score } from "./score.js";



window.addEventListener('load', () => {
        const canvas = document.getElementById('canvas1');
        const ctx = canvas.getContext('2d');
        canvas.width = 500;
        canvas.height = 500;
        canvas.style.display = 'none';
        let game;
        let lastTime;
        const restartBtn = document.getElementById('restartBtn');





        class Game {
            constructor(height, width) {
                this.width = width;
                this.height = height;
                this.groundMargin = 50;
                this.speed = 0;
                this.maxSpeed = 4; // Maximum speed for horizontal movement
                this.background = new BackGround(this);
                this.player = new Player(this);
                this.input = new InputHandler(this);
                this.Score = new Score(this); // Initialize score
                this.collision = []; // Initialize collision detection
                this.enemies = [];
                this.praticles = [];
                this.enemyTimer = 0; // Timer for enemy spawning
                this.enemyInterval = 1000; // Interval for enemy spawning in milliseconds
                this.debug = true; // Debug mode
                this.score = 0; // Game score
                this.time = 0; // Game time
                this.maxtime = 60000; // Maximum game time in milliseconds
                this.gameOver = false; // Game over flag
                this.frontColor = 'black'; // Color for the score text
                this.lives = 5; // Player lives
                this.paused = false; 
                restartBtn.addEventListener('click', () => {
                    location.reload(); // Reload the game on button click
                });
            }

            update(deltaTime) {
                this.time += deltaTime; // Increment game time
                if (this.time > this.maxtime) {
                    this.gameOver = true; // Set game over flag if time exceeds maximum
                }
                this.background.update();
                this.player.update(this.input.keys, deltaTime);
                // Update enemies
                if (this.enemyTimer > this.enemyInterval) {
                    this.addEnemy();
                    this.enemyTimer = 0; // Reset timer after adding an enemy
                }
                else this.enemyTimer += deltaTime; // Increment timer by deltaTime

                this.enemies.forEach(enemy => {
                    enemy.update(deltaTime);
                    if (enemy.markForDeletion) {
                        this.enemies.splice(this.enemies.indexOf(enemy), 1); // Remove enemy from the array
                    }
                });

                this.praticles.forEach((praticle,index) => {
                    praticle.update(deltaTime);
                    if (praticle.markForDeletion) {
                        this.praticles.splice(index,1); // Remove praticle from the array
                    }
                });

                this.collision.forEach((collision, index) => {
                    collision.update(deltaTime);
                    if (collision.markForDeletion) {
                        this.collision.splice(index, 1); // Remove collision from the array
                    }
                });
            }
            draw(context) {
                this.background.draw(context);
                this.player.draw(context);
                this.enemies.forEach(enemy => {
                    enemy.draw(context);
                });
                this.Score.draw(context);

                this.praticles.forEach(praticle => {
                    praticle.draw(context);
                });
                this.collision.forEach(collision => {
                    collision.draw(context);
                });
            }
            addEnemy() {
                if (this.speed >0 && Math.random() < 0.5) {
                    this.enemies.push(new GroundEnemy(this));
                }
                else if (this.speed > 0) {
                    this.enemies.push(new ClimbingEnemy(this));
                }
                this.enemies.push(new FlyingEnemy(this));
            }
    
        }
  

        function animate(timeStamp) {
            const deltaTime = timeStamp - lastTime;
            lastTime = timeStamp; // Convert to seconds
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if(!game.paused) {
                game.update(deltaTime);
            }
            if (game.gameOver) {
                restartBtn.style.display = 'block'; // מציג את כפתור האתחול
            }

            game.draw(ctx);
            
            if (!game.gameOver) requestAnimationFrame(animate);
        }

         document.getElementById('startButton').addEventListener('click', () => {
         document.getElementById('mainMenu').style.display = 'none';
         canvas.style.display = 'block';
         game = new Game(canvas.width, canvas.height);// Initialize lastTime to 0
         game.player.currentState = game.player.states[0];
         game.player.currentState.enter();
         lastTime = 0; // Reset lastTime to 0
         animate(0);
});
    });