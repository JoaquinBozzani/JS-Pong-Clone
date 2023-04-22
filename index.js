//variables for settings
const settignsBtn = document.querySelector('#settingsBtn')
const settingsOverlay = document.querySelector('#settingsOverlay');
const settings = document.querySelector('#settings');
const ballSpeedSlider = document.querySelector('#ballSpeedSlider');

//variables for game
const gameBoard = document.querySelector('#gameBoard');
const ctx = gameBoard.getContext('2d');
const scoreText = document.querySelector('#score');
const resetBtn = document.querySelector('#reset');
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = 'black';

//paddles
const paddleBorder = 'black';
let paddleSpeed = 15;

let paddle1 = {
    width: 8,
    height: 65,
    color: 'rgb(255, 255, 255)',
    x: 0,
    y: 0,
}

let paddle2 = {
    width: 8,
    height: 65,
    color: 'rgb(255, 255, 255)',
    // to put paddleTwo on the opposite side of paddleOne
    x: gameWidth - 8, //substract width
    y: gameHeight - 65, //substract height
}

//ball
let ballColor = 'rgb(255, 255, 255)';
const ballBorder = 'black';
const ballRadius = 3;

//game settigns
let intervalID;
let ballSpeed = ballSpeedSlider.value;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;

//scores
let player1Score = 0;
let player2Score = 0;


// functions
//settigns
function openSettings() {
    settingsOverlay.classList.add('openSettingsOverlay');
    settings.classList.add('showSettings');
}

function closeSettings() {
    settingsOverlay.classList.remove('openSettingsOverlay');
    settings.classList.remove('showSettings');
}


//game
function gameStart() {
    createBall();
    nextTick();
};

function nextTick() {
    intervalID = setTimeout(() => {
        clearBoard();
        drawPaddles();
        moveBall();
        drawBall(ballX, ballY);
        checkCollision();
        nextTick();
    }, 10);
};

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

function drawPaddles() {
    ctx.strokeStyle = paddleBorder;
    
    //for paddleOne
    ctx.fillStyle = paddle1.color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    
    //for paddleTwo
    ctx.fillStyle = paddle2.color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
};

function movePaddle (event) {
    switch(event.key) {
        case('w'):
            if(paddle1.y > 0){
                paddle1.y -= paddleSpeed;
            }
            break;
        case('s'):
            if(paddle1.y < (gameHeight - paddle1.height)){
                paddle1.y += paddleSpeed;
            }
            break;
        case('ArrowUp'):
            if(paddle2.y > 0){
                paddle2.y -= paddleSpeed;
            }
            break;
        case('ArrowDown'):
            if(paddle2.y < (gameHeight - paddle2.height)){
                paddle2.y += paddleSpeed;
            }
            break;
    }   
};

function createBall() {
    ballSpeed = ballSpeedSlider.value;
    if(Math.round(Math.random()) == 1) {
        ballXDirection = 1;
    } else {
        ballXDirection = -1;
    }

    if(Math.round(Math.random()) == 1) {
        ballYDirection = 1;
    } else {
        ballYDirection = -1;
    }

    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    drawBall(ballX, ballY);
};

function moveBall() {
    ballX += (ballSpeed * ballXDirection);
    ballY += (ballSpeed * ballYDirection);
};

function drawBall(ballX, ballY) {
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorder;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
};

function checkCollision() {
    //check collision against walls
    if(ballY <= 0 + ballRadius) {
        ballYDirection *= -1;
    }
    if(ballY >= gameHeight - ballRadius) {
        ballYDirection *= -1;
    }
    if(ballX <= 0) {
        player2Score += 1;
        updateScore();
        createBall();
        return;
    }
    if(ballX >= gameWidth) {
        player1Score += 1;
        updateScore();
        createBall();
        return;
    }
    //check collision against paddles
    //paddle1
    if(ballX <= (paddle1.x + paddle1.width + ballRadius)) {
        if(ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
            ballX = (paddle1.x + paddle1.width + ballRadius); //if ball gets stuck
            ballXDirection *= -1;
            //speed things up 
            ballSpeed *= 1.1;
        }
    }
    //paddle2
    if(ballX >= (paddle2.x - ballRadius)) {
        if(ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
            ballX = (paddle2.x - ballRadius); //if ball gets stuck
            ballXDirection *= -1;
            //speed things up 
            ballSpeed *= 1.1;
        }
    }
};

function updateScore() {
    scoreText.textContent = `${player1Score} : ${player2Score} `;
};

function gameReset() {
    player1Score = 0;
    player2Score = 0;
    //reset paddles 
    paddle1 = {
        width: 8,
        height: 65,
        color: 'rgb(255, 255, 255)',
        x: 0,
        y: 0,
    }
    
    paddle2 = {
        width: 8,
        height: 65,
        color: 'rgb(255, 255, 255)',
        // to put paddleTwo on the opposite side of paddleOne
        x: gameWidth - 8, //substract width
        y: gameHeight - 65, //substract height
    }
    //reset ball
    ballX = 0;
    ballY = 0;
    ballXDirection = 0;
    ballYDirection = 0;
    updateScore();
    clearInterval(intervalID);
    gameStart();
};


// event listeners for game
window.addEventListener('keydown', movePaddle);
resetBtn.addEventListener('click', gameReset);


//event listeners for settigns
settignsBtn.addEventListener('click', openSettings);

settingsOverlay.addEventListener('click', (event) => {
    if(!event.target.closest('#settings')) {
        closeSettings();
    }
})

window.addEventListener('keyup', (event) => {
    if(event.key === 'Escape') {
        closeSettings();
    }
})


//start game on page load
gameStart();