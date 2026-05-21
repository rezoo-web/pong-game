// Game constants
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 8;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;
const MAX_BALL_SPEED = 8;

// Game objects
const player = {
    x: 10,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0
};

const computer = {
    x: canvas.width - PADDLE_WIDTH - 10,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: BALL_SIZE,
    dx: BALL_SPEED,
    dy: BALL_SPEED,
    speed: BALL_SPEED
};

// Input handling
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    // Move player paddle towards mouse position
    const paddleCenter = player.y + player.height / 2;
    if (Math.abs(mouseY - paddleCenter) > 5) {
        player.dy = mouseY > paddleCenter ? PADDLE_SPEED : -PADDLE_SPEED;
    } else {
        player.dy = 0;
    }
});

// Arrow keys control
function updatePlayerInput() {
    if (keys['ArrowUp']) {
        player.dy = -PADDLE_SPEED;
    } else if (keys['ArrowDown']) {
        player.dy = PADDLE_SPEED;
    } else if (!keys['ArrowUp'] && !keys['ArrowDown']) {
        player.dy = 0;
    }
}

// Update game state
function update() {
    updatePlayerInput();

    // Update player paddle
    player.y += player.dy;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }

    // Simple AI for computer paddle
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;
    
    if (computerCenter < ballCenter - 35) {
        computer.y += PADDLE_SPEED;
    } else if (computerCenter > ballCenter + 35) {
        computer.y -= PADDLE_SPEED;
    }

    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.size < 0 ? ball.size : canvas.height - ball.size;
    }

    // Ball collision with paddles
    if (
        ball.x - ball.size < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.size;
        
        // Add spin based on paddle position
        const collidePoint = ball.y - (player.y + player.height / 2);
        collidePoint / (player.height / 2);
        ball.dy = (collidePoint / (player.height / 2)) * ball.speed;
    }

    if (
        ball.x + ball.size > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computer.x - ball.size;
        
        // Add spin based on paddle position
        const collidePoint = ball.y - (computer.y + computer.height / 2);
        ball.dy = (collidePoint / (computer.height / 2)) * ball.speed;
    }

    // Score and reset ball
    if (ball.x < 0) {
        computer.score++;
        resetBall();
    }
    if (ball.x > canvas.width) {
        player.score++;
        resetBall();
    }

    // Update score display
    document.getElementById('playerScore').textContent = player.score;
    document.getElementById('computerScore').textContent = computer.score;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED;
    ball.dy = (Math.random() - 0.5) * 2 * BALL_SPEED;
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.strokeStyle = '#00ff00';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#00ff00';
    ctx.shadowColor = 'rgba(0, 255, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(computer.x, computer.y, computer.width, computer.height);
    ctx.shadowColor = 'transparent';

    // Draw ball
    ctx.fillStyle = '#ff00ff';
    ctx.shadowColor = 'rgba(255, 0, 255, 0.8)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Reset game button
document.getElementById('resetBtn').addEventListener('click', () => {
    player.score = 0;
    computer.score = 0;
    resetBall();
    document.getElementById('playerScore').textContent = '0';
    document.getElementById('computerScore').textContent = '0';
});

// Start the game
gameLoop();