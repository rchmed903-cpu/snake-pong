// ================= SPLASH SCREEN =================
(function () {
    const splash = document.getElementById('splash-screen');
    const bar = document.getElementById('splash-bar');
    const status = document.getElementById('splash-status');
    const splashCanvas = document.getElementById('splash-canvas');
    const ctx = splashCanvas.getContext('2d');

    splashCanvas.width = window.innerWidth;
    splashCanvas.height = window.innerHeight;

    const dots = Array.from({ length: 60 }, () => ({
        x: Math.random() * splashCanvas.width,
        y: Math.random() * splashCanvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random()
    }));

    let animFrame;
    function drawSplashBg() {
        ctx.clearRect(0, 0, splashCanvas.width, splashCanvas.height);
        dots.forEach(d => {
            d.y -= d.speed;
            d.opacity += 0.01;
            if (d.y < 0) {
                d.y = splashCanvas.height;
                d.x = Math.random() * splashCanvas.width;
                d.opacity = 0;
            }
            ctx.globalAlpha = Math.abs(Math.sin(d.opacity)) * 0.5;
            ctx.fillStyle = '#39ff14';
            ctx.fillRect(
                Math.floor(d.x / 10) * 10,
                Math.floor(d.y / 10) * 10,
                d.size, d.size
            );
        });
        ctx.globalAlpha = 1;
        animFrame = requestAnimationFrame(drawSplashBg);
    }
    drawSplashBg();

    const steps = [
        { label: 'Loading assets...', pct: 20 },
        { label: 'Building grid...', pct: 45 },
        { label: 'Spawning snake...', pct: 65 },
        { label: 'Setting difficulty...', pct: 82 },
        { label: 'Ready!', pct: 100 },
    ];

    let i = 0;
    function nextStep() {
        if (i >= steps.length) {
            setTimeout(() => {
                cancelAnimationFrame(animFrame);
                splash.classList.add('hidden');
                setTimeout(() => {
                    splash.remove();
                    showMainMenu();
                }, 900);
            }, 400);
            return;
        }
        bar.style.width = steps[i].pct + '%';
        status.textContent = steps[i].label;
        i++;
        setTimeout(nextStep, i === steps.length ? 300 : 420);
    }

    setTimeout(nextStep, 1200);
})();
// ==================================================

// ================= SNAKE GRAPHIC ON MENU =================
function drawSnakeGraphic() {
    const gc = document.getElementById('snake-graphic');
    if (!gc) return;
    const gx = gc.getContext('2d');
    const S = 12;
    const segments = [
        {x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},
        {x:4,y:2},{x:3,y:2},{x:2,y:2},{x:1,y:2},{x:0,y:2},
        {x:0,y:3},{x:1,y:3},{x:2,y:3}
    ];
    gx.clearRect(0, 0, gc.width, gc.height);
    segments.forEach((seg, idx) => {
        gx.fillStyle = idx === 0 ? '#ffffff' : '#39ff14';
        gx.fillRect(seg.x * S + 2, seg.y * S - 8, S - 2, S - 2);
    });
    // food dot
    gx.fillStyle = '#ff6b35';
    gx.fillRect(6 * S + 2, 1 * S - 8, S - 2, S - 2);

    // eyes on head
    gx.fillStyle = '#0a0a0a';
    gx.fillRect(4, 4, 2, 2);
    gx.fillRect(8, 4, 2, 2);
}

// ================= MAIN MENU =================
function showMainMenu() {
    const menu = document.getElementById('main-menu');
    const gameWrapper = document.getElementById('game-wrapper');
    const menuHighScore = document.getElementById('menu-high-score');

    menuHighScore.textContent = localStorage.getItem('highScore') || 0;
    gameWrapper.style.display = 'none';
    gameWrapper.classList.remove('visible');
    menu.classList.add('visible');

    drawSnakeGraphic();

    // animated background
    const menuCanvas = document.getElementById('menu-canvas');
    const mCtx = menuCanvas.getContext('2d');
    menuCanvas.width = window.innerWidth;
    menuCanvas.height = window.innerHeight;

    const mdots = Array.from({ length: 50 }, () => ({
        x: Math.random() * menuCanvas.width,
        y: Math.random() * menuCanvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.4 + 0.15,
        opacity: Math.random()
    }));

    let menuAnimFrame;
    function drawMenuBg() {
        mCtx.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
        mdots.forEach(d => {
            d.y -= d.speed;
            d.opacity += 0.01;
            if (d.y < 0) {
                d.y = menuCanvas.height;
                d.x = Math.random() * menuCanvas.width;
                d.opacity = 0;
            }
            mCtx.globalAlpha = Math.abs(Math.sin(d.opacity)) * 0.4;
            mCtx.fillStyle = '#39ff14';
            mCtx.fillRect(
                Math.floor(d.x / 10) * 10,
                Math.floor(d.y / 10) * 10,
                d.size, d.size
            );
        });
        mCtx.globalAlpha = 1;
        menuAnimFrame = requestAnimationFrame(drawMenuBg);
    }
    drawMenuBg();

    // difficulty buttons
    let selectedDiff = difficulty;
    const diffBtns = document.querySelectorAll('.diff-btn');
    diffBtns.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.level === selectedDiff) btn.classList.add('selected');
        btn.addEventListener('click', function () {
            selectedDiff = this.dataset.level;
            diffBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            difficulty = selectedDiff;
            document.getElementById('difficulty-select').value = selectedDiff;
        });
    });

    // play button
    document.getElementById('play-btn').onclick = function () {
        cancelAnimationFrame(menuAnimFrame);
        menu.classList.add('hidden');
        setTimeout(() => {
            menu.classList.remove('visible');
            menu.classList.remove('hidden');
            startGame();
        }, 600);
    };
}

function startGame() {
    const gameWrapper = document.getElementById('game-wrapper');
    gameWrapper.style.display = 'flex';
    setTimeout(() => gameWrapper.classList.add('visible'), 50);
    resizeCanvas();
    initializeGame();
    clearInterval(gameInterval);
    gameInterval = setInterval(update, GAME_SPEED);
}
// =================================================

const difficultySelect = document.getElementById("difficulty-select");
const pauseBtn = document.getElementById("pause-btn");
const restartBtnTop = document.getElementById("restart-btn-top");
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const gameOverScreen = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');
const menuBtn = document.getElementById('menu-btn');
const GRID_SIZE = 10;
const SNAKE_SIZE = GRID_SIZE;
const FOOD_SIZE = GRID_SIZE;
let difficulty = "medium";

// ================= SOUND EFFECTS =================
const startSound = new Audio("sounds/gamestart.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");
startSound.volume = 0.5;
gameOverSound.volume = 0.5;
// =================================================

// ================= RESPONSIVE CANVAS =================
function resizeCanvas() {
    const size = Math.min(420, window.innerWidth * 0.90);
    const snapped = Math.floor(size / GRID_SIZE) * GRID_SIZE;
    canvas.width = snapped;
    canvas.height = snapped;
}

window.addEventListener('resize', function () {
    if (document.getElementById('game-wrapper').style.display !== 'none') {
        resizeCanvas();
        initializeGame();
        clearInterval(gameInterval);
        gameInterval = setInterval(update, GAME_SPEED);
    }
});
// =====================================================

function setDifficulty(level) {
    difficulty = level;
    if (level === "easy") {
        GAME_SPEED = 140;
        FOOD_SPEED = 6;
    } else if (level === "medium") {
        GAME_SPEED = 100;
        FOOD_SPEED = 4;
    } else if (level === "hard") {
        GAME_SPEED = 60;
        FOOD_SPEED = 2;
    }
    clearInterval(gameInterval);
    gameInterval = setInterval(update, GAME_SPEED);
}

difficultySelect.addEventListener("change", function () {
    setDifficulty(this.value);
});

let GAME_SPEED = 100;
let FOOD_SPEED = 4;

let snake, food, dx, dy, blinkCounter;
let gamePaused = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

let currentScoreElem = document.getElementById('current-score');
let highScoreElem = document.getElementById('high-score');

// ================= INITIALIZE =================
function initializeGame() {
    snake = [
        { x: Math.floor(canvas.width / 2 / GRID_SIZE) * GRID_SIZE, y: Math.floor(canvas.height / 2 / GRID_SIZE) * GRID_SIZE },
        { x: Math.floor(canvas.width / 2 / GRID_SIZE) * GRID_SIZE, y: (Math.floor(canvas.height / 2 / GRID_SIZE) + 1) * GRID_SIZE },
    ];

    dx = 0;
    dy = -GRID_SIZE;
    blinkCounter = 0;
    score = 0;

    food = {
        ...generateFoodPosition(),
        dx: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE,
        dy: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE
    };

    currentScoreElem.textContent = score;
    highScoreElem.textContent = highScore;

    startSound.currentTime = 0;
    startSound.play().catch(() => {});
}

// ================= PAUSE BUTTON =================
pauseBtn.addEventListener("click", function () {
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? "Resume" : "Pause";
});

// ================= TOP RESTART BUTTON =================
restartBtnTop.addEventListener("click", function () {
    gamePaused = false;
    pauseBtn.textContent = "Pause";
    gameOverScreen.style.display = "none";
    gameOverScreen.querySelector('h2').textContent = 'Game Over';
    initializeGame();
    clearInterval(gameInterval);
    gameInterval = setInterval(update, GAME_SPEED);
});

// ================= MENU BUTTON =================
menuBtn.addEventListener('click', function () {
    clearInterval(gameInterval);
    gamePaused = false;
    gameOverScreen.style.display = 'none';
    gameOverScreen.querySelector('h2').textContent = 'Game Over';
    pauseBtn.textContent = 'Pause';
    showMainMenu();
});

// ================= PC CONTROLS =================
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -GRID_SIZE; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = GRID_SIZE; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -GRID_SIZE; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = GRID_SIZE; dy = 0; }
            break;
    }
});

// ================= MOBILE CONTROLS =================
document.body.addEventListener("touchmove", function (e) {
    e.preventDefault();
}, { passive: false });

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: false });

canvas.addEventListener("touchend", function (e) {
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;
    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && dx === 0) { dx = GRID_SIZE; dy = 0; }
        else if (diffX < 0 && dx === 0) { dx = -GRID_SIZE; dy = 0; }
    } else {
        if (diffY > 0 && dy === 0) { dx = 0; dy = GRID_SIZE; }
        else if (diffY < 0 && dy === 0) { dx = 0; dy = -GRID_SIZE; }
    }
}, { passive: false });

// ================= FOOD POSITION =================
function generateFoodPosition() {
    while (true) {
        let newFoodPosition = {
            x: Math.floor(Math.random() * canvas.width / GRID_SIZE) * GRID_SIZE,
            y: Math.floor(Math.random() * canvas.height / GRID_SIZE) * GRID_SIZE
        };
        let collisionWithSnake = false;
        for (let segment of snake) {
            if (segment.x === newFoodPosition.x && segment.y === newFoodPosition.y) {
                collisionWithSnake = true;
                break;
            }
        }
        if (!collisionWithSnake) return newFoodPosition;
    }
}

// ================= COLLISION CHECK =================
function checkCollision() {
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

// ================= MAIN UPDATE =================
function update() {
    if (gamePaused) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (checkCollision()) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreElem.textContent = highScore;
        }
        gameOver();
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        currentScoreElem.textContent = score;
        food = {
            ...generateFoodPosition(),
            dx: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE,
            dy: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE
        };
        if (snake.length === (canvas.width / GRID_SIZE) * (canvas.height / GRID_SIZE)) {
            gameWin();
            return;
        }
    } else {
        snake.pop();
    }

    if (blinkCounter % FOOD_SPEED === 0) {
        food.x += food.dx;
        food.y += food.dy;

        if (food.x < 0) { food.dx = -food.dx; food.x = 0; }
        if (food.x >= canvas.width) { food.dx = -food.dx; food.x = canvas.width - GRID_SIZE; }
        if (food.y < 0) { food.dy = -food.dy; food.y = 0; }
        if (food.y >= canvas.height) { food.dy = -food.dy; food.y = canvas.height - GRID_SIZE; }
    }

    blinkCounter++;
    draw();
}

// ================= DRAW =================
function drawGrid() {
    context.strokeStyle = "#ffffff15";
    for (let i = 0; i < canvas.width; i += GRID_SIZE) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, canvas.height);
        context.stroke();
    }
    for (let j = 0; j < canvas.height; j += GRID_SIZE) {
        context.beginPath();
        context.moveTo(0, j);
        context.lineTo(canvas.width, j);
        context.stroke();
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();

    snake.forEach((segment, index) => {
        context.fillStyle = index === 0 ? '#ffffff' : '#39ff14';
        context.fillRect(segment.x + 1, segment.y + 1, SNAKE_SIZE - 2, SNAKE_SIZE - 2);
    });

    context.fillStyle = '#ff6b35';
    context.fillRect(food.x + 1, food.y + 1, FOOD_SIZE - 2, FOOD_SIZE - 2);
}

// ================= GAME OVER =================
function gameOver() {
    gamePaused = true;
    document.getElementById('go-final-score').textContent = score;
    gameOverScreen.querySelector('h2').textContent = 'Game Over';
    gameOverScreen.style.display = 'flex';
    gameOverSound.currentTime = 0;
    gameOverSound.play().catch(() => {});
}

// ================= GAME WIN =================
function gameWin() {
    gamePaused = true;
    document.getElementById('go-final-score').textContent = score;
    gameOverScreen.querySelector('h2').textContent = 'You Win!';
    gameOverScreen.style.display = 'flex';
}

// ================= OVERLAY RESTART =================
restartBtn.addEventListener('click', function () {
    gameOverScreen.style.display = 'none';
    gameOverScreen.querySelector('h2').textContent = 'Game Over';
    pauseBtn.textContent = "Pause";
    gamePaused = false;
    initializeGame();
    clearInterval(gameInterval);
    gameInterval = setInterval(update, GAME_SPEED);
});

// ================= WINDOW FOCUS / BLUR =================
window.addEventListener('blur', function () {
    gamePaused = true;
    pauseBtn.textContent = "Resume";
});

window.addEventListener('focus', function () {
    gamePaused = false;
    pauseBtn.textContent = "Pause";
});

// ================= START =================
let gameInterval;
setDifficulty(difficulty);