// Game logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');

let player;
let bullets = [];
let enemies = [];
let keys = {};
let score = 0;
let gameOver = false;
let enemySpawnTimer = 0;
let currentLevel = 'easy';
let spawnRate = 60; // frames between spawns
let mouseX = 0;
let mouseY = 0;
let animationId = null; // Track the animation frame
let autoFire = false;
let shouldFire = false;
let gameStartTime = 0; // Track when game started
let gameTime = 0; // Current game time in seconds

// Make canvas responsive
function resizeCanvas() {
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight - 120; // Leave space for controls and score

    const aspectRatio = 800 / 600;
    let newWidth = 1600;
    let newHeight = 1200;

    if (maxWidth < 1600 || maxHeight < 1200) {
        if (maxWidth / aspectRatio <= maxHeight) {
            newWidth = maxWidth;
            newHeight = maxWidth / aspectRatio;
        } else {
            newHeight = maxHeight;
            newWidth = maxHeight * aspectRatio;
        }
    }

    canvas.width = newWidth;
    canvas.height = newHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function init() {
    player = new Player(canvas.width / 2, canvas.height - 50);
    bullets = [];
    enemies = [];
    score = 0;
    gameOver = false;
    enemySpawnTimer = 0;
    gameStartTime = Date.now();
    gameTime = 0;
    gameOverElement.style.display = 'none';
    updateScore();
}

function updateScore() {
    const levelName = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
    scoreElement.textContent = `Score: ${score} | Level: ${levelName} | Time: ${gameTime}s`;
}

function setLevel(level) {
    currentLevel = level;

    // Set spawn rate based on level
    switch(level) {
        case 'easy':
            spawnRate = 60; // 1 enemy per second (at 60fps)
            break;
        case 'medium':
            spawnRate = 40; // 1.5 enemies per second
            break;
        case 'hard':
            spawnRate = 25; // 2.4 enemies per second
            break;
    }

    restartGame();
}

function spawnEnemy() {
    const x = Math.random() * (canvas.width - 60) + 30;
    const enemyType = Math.random();

    if (enemyType < 0.25) {
        enemies.push(new Enemy1(x, -30));
    } else if (enemyType >= 0.25 && enemyType < 0.50) {
        enemies.push(new Enemy2(x, -30));
    } else if (enemyType >= 0.50 && enemyType > 0.75) {
        enemies.push(new Enemy3(x, -30));
    } else {
        enemies.push(new Enemy4(x, -30));
    }
}

function checkCollision(obj1, obj2) {
    const bounds1 = obj1.getBounds();
    const bounds2 = obj2.getBounds();

    // Bounding box collision detection (works for any shape)
    return bounds1.x < bounds2.x + bounds2.width &&
           bounds1.x + bounds1.width > bounds2.x &&
           bounds1.y < bounds2.y + bounds2.height &&
           bounds1.y + bounds1.height > bounds2.y;
}

function gameLoop() {
    if (gameOver) return;

    // Update game time
    gameTime = Math.floor((Date.now() - gameStartTime) / 1000);
    updateScore();

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update player aim
    player.setAimAngle(mouseX, mouseY);

    // Move player
    player.move(keys, canvas);
    player.draw(ctx);

    if (autoFire && shouldFire) {
        shouldFire = false;
        setTimeout(
        () => {
            shouldFire = true;
            const weaponTip = player.getWeaponTip();
            bullets.push(new Bullet(weaponTip.x, weaponTip.y, player.angle));
        }, 100);
    }
    // Update and draw bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        bullets[i].draw(ctx);

        if (bullets[i].isOffScreen(canvas)) {
            bullets.splice(i, 1);
            continue;
        }

        // Check bullet-enemy collision
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (checkCollision(bullets[i], enemies[j])) {
                bullets.splice(i, 1);
                if (enemies[j].extraPoints != null) {
                    score += enemies[j].extraPoints;
                }
                enemies.splice(j, 1);
                score += 10;

                updateScore();
                break;
            }
        }
    }

    // Spawn enemies
    enemySpawnTimer++;
    if (enemySpawnTimer > spawnRate) {
        spawnEnemy();
        enemySpawnTimer = 0;
    }

    // Update and draw enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        enemies[i].draw(ctx);

        if (enemies[i].isOffScreen(canvas)) {
            enemies.splice(i, 1);
            continue;
        }

        // Check player-enemy collision
        if (checkCollision(player, enemies[i])) {
            gameOver = true;
            gameOverElement.style.display = 'block';
            return;
        }
    }

    animationId = requestAnimationFrame(gameLoop);
}

function restartGame() {
    // Cancel any existing game loop
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    init();
    gameLoop();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'e') {
        autoFire = !autoFire;
        if (autoFire) {
            shouldFire = true;
        }
    }
});

document.addEventListener('click', (e) => {
    if (!gameOver) {
        e.preventDefault();
        const weaponTip = player.getWeaponTip();
        bullets.push(new Bullet(weaponTip.x, weaponTip.y, player.angle));
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse controls for aiming
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

// Start game
init();
canvas.focus();
gameLoop();
