// board
const blocksize = window.innerWidth < 600 ? Math.floor(window.innerWidth / 22 ) : 25;
const rows = 20;
const cols = 20;
const board = document.querySelector(".board");
let snakeBody = [];
// snake
let snakeX = blocksize * 5;
let snakeY = blocksize * 5;

let velocityX = 0;
let velocityY = 0;

// food
let foodX;
let foodY;

let gameOver = false; 

// arrows 
const arrowUp = document.querySelector(".up");
const arrowDown = document.querySelector(".down");
const arrowLeft = document.querySelector(".left");
const arrowRight = document.querySelector(".right");


// message 
let message = document.querySelector(".message");
message.style.display = "none";
//score 
let currentScoreElement = document.querySelector(".currentScore");
let highScoreElement = document.querySelector(".highScore");
let highScore = JSON.parse(localStorage.getItem("highScore")) || 0;
highScoreElement.innerHTML = highScore;
let currentScore = 0;

board.height = rows * blocksize;
board.width = cols * blocksize;
const context = board.getContext("2d");
placeFood();
let gameLoop = setInterval(update, 400);
document.addEventListener("keydown", changeDirection)

function update() {
    if (gameOver) {
        return;
    }

    let speed = currentScore < 10 ? 400 : 
    currentScore < 30 ? 250 : 
    currentScore < 50 ? 200 : 
    currentScore < 70 ? 150 : 100;

    clearInterval(gameLoop);
    gameLoop = setInterval(update, speed);
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle="red";
    context.fillRect(foodX, foodY, blocksize, blocksize);

    if (snakeX === foodX && snakeY === foodY) {
        snakeBody.push([foodX, foodY]);

        if (currentScore < 50) {
            currentScore += 5
        } else  if (currentScore > 49 && currentScore < 100) {
            currentScore += 10;
        } else  if (currentScore > 99 && currentScore < 200) {
            currentScore += 20;
        } else  if (currentScore > 199) {
            currentScore += 40;
        } 
        currentScoreElement.innerHTML = currentScore;
        placeFood();
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }

    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY]
    }
    context.fillStyle = "lime";
    snakeX += (velocityX * blocksize);
    snakeY += (velocityY * blocksize);
    context.fillRect(snakeX, snakeY, blocksize, blocksize);
    for (let i = 0; i < snakeBody.length; i++) {
        const bodyX = snakeBody[i][0];
        const bodyY = snakeBody[i][1];
        context.fillRect(bodyX, bodyY, blocksize, blocksize)
    }
    
    if (snakeX < 0 || snakeX >= cols * blocksize || snakeY < 0 || snakeY >= rows * blocksize) {
        gameOver = true;
        renderMessage();
        if(currentScore > highScore) {
            highScore = currentScore;
        } else {
            highScore += 0;
        }
        highScoreElement.innerHTML = highScore;
        localStorage.setItem("highScore", JSON.stringify(highScore));
        console.log(localStorage)
    } 

    for (let i = 0; i < snakeBody.length; i++) {
        const bodyX = snakeBody[i][0];
        const bodyY = snakeBody[i][1];
        if (snakeX === bodyX && snakeY === bodyY) {
            gameOver = true;
            renderMessage();
        }
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blocksize;
    foodY  = Math.floor(Math.random() * cols) * blocksize;
}

function moveup() {
    if (velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    }
}

function moveDown() {
    if (velocityY !== -1){
        velocityX = 0;
        velocityY = 1;
    }
}

function moveRight() {
    if ( velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
    
}

function moveLeft() {
    if (velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } 
}
function changeDirection(e) {
    if (e.key === "ArrowUp") {
        moveup();
    } else if (e.key === "ArrowDown") {
        moveDown();
    } else if (e.key === "ArrowRight") {
        moveRight();
    } else if (e.key === "ArrowLeft") {
        moveLeft();
    }
}
    arrowUp.addEventListener("click", moveup);
    arrowDown.addEventListener("click", moveDown);
    arrowRight.addEventListener("click", moveRight);
    arrowLeft.addEventListener("click", moveLeft);

function renderMessage() {
    message.style.display = "block";
     message.innerHTML = "Game over, click here or press enter to continue"
    message.addEventListener("click", restartGame)
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            restartGame();
        }
    })
}

function restartGame() {
    gameOver = false;
    snakeBody = [];
    snakeX = blocksize * 5;
    snakeY = blocksize * 5;
    currentScore = 0;
    currentScoreElement.innerHTML = currentScore;
    velocityX = 0;
    velocityY = 0;
    placeFood();
    message.style.display = "none";
}
