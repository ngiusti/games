var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;
var ballRadius = 10;
var player1Score = 0;
var player2Score = 0;

var winningScore = 3;
var showWinningScreen = false;
var paddle1Y = 250;
var paddleHeight = 100;
var paddle2Y = 250;
var paddleWidth = 10;

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };


}

function handleMouseClick(evt) {
    if (showWinningScreen) {
        player1Score = 0;
        player2Score = 0;
        showWinningScreen = false;
    }
}

window.onload = function () {

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    var framesPerSecond = 30;
    setInterval(function () { moveEverything(); drawEverything(); }, 1000 / framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);
    canvas.addEventListener('mousemove', function (evt) {
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - paddleHeight / 2;
    });
};

function ballReset() {
    if (player1Score >= winningScore || player2Score >= winningScore) {
        showWinningScreen = true;
    }
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

function computerMovement() {
    var paddle2YCenter = paddle2Y + paddleHeight / 2;
    if (paddle2YCenter < ballY - 35) {
        paddle2Y += 6;
    }
    else if (paddle2YCenter > ballY +35){
        paddle2Y -= 6;
    }
}

function moveEverything() {
    if (showWinningScreen) {
        return;
    }
    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if (ballX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle1Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        }
        else {
            player2Score++; //must be before ballReset()
            ballReset();
        }
    }
    if (ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            deltaY = ballY - (paddle2Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        }
        else {
            player1Score++;
            ballReset();
        }
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet() {
    for (var i = 0; i < canvas.height; i += 40){
        colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
}
function drawEverything() {
    //makes the black background
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    if (showWinningScreen) {
        canvasContext.fillStyle = 'white';
        if (player1Score >= winningScore) {
            canvasContext.fillText("left player won!", canvas.width / 2, canvas.height / 3);
        }
        else if (player2Score >= winningScore) {
            canvasContext.fillText("right player won!", canvas.width / 2, canvas.height / 3);
        }
        
        canvasContext.fillText("click to continue", canvas.width / 2, canvas.height / 2);
        return;
    }
    drawNet();
    // makes player 1 paddle
    colorRect(0, paddle1Y, paddleWidth, paddleHeight, 'white');
    // makes player 2 paddle
    colorRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight, 'white');
    //makes the ball
    colorCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}