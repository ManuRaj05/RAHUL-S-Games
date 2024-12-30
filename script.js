const gameArea = document.querySelector('.game-area');
const dragan = document.getElementById('dragan');
const scoreDisplay = document.getElementById('score-value');
const livesDisplay = document.getElementById('lives-value');
const gameOverDisplay = document.getElementById('game-over');
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');
const finalScoreDisplay = document.getElementById('final-score');
const finalTimeDisplay = document.getElementById('final-time');
const startButton = document.getElementById('start-button');
const timerDisplay = document.getElementById('timer');
const highScoreDisplay = document.getElementById('high-score')
const levelDisplay = document.getElementById('level-value');
const targetDisplay = document.getElementById('target-value')
const levelTimerDisplay = document.getElementById('level-timer');
const levelCompleteDisplay = document.getElementById('level-complete')
const highestScoreDisplay = document.getElementById('highest-score-value')
let score = 0;
let lives = 8;
let fireballs = [];
let gameRunning = false;
let gamePaused = false;
let fireballSpeed = 2;
let fireBallInterval;
let difficultyInterval;
let startTime;
let elapsedTime = 0;
const draganSpeed = 20; // Increased speed

let draganX = 0;
let countdown = 6;
let countdownInterval;
let highScore = 0;
let rotationAngle = 0;
let level = 1;
let targetBallCount = 5;
let levelTime = 20;
let levelTimerInterval;
let ballsCollected;


function startGame(){
    startButton.style.display = 'none';
    timerDisplay.style.display = 'block';
    livesDisplay.textContent = lives;
    countdown = 6;
    timerDisplay.textContent = countdown;
    levelDisplay.textContent = level;
    targetDisplay.textContent = targetBallCount;
    highestScoreDisplay.textContent = highScore;

    countdownInterval = setInterval(() => {
      countdown--;
        if (countdown >= 0) {
          timerDisplay.textContent = countdown;
        }

        if (countdown < 0) {
            clearInterval(countdownInterval);
            timerDisplay.style.display = 'none';
            startPlaying()
          }
    }, 1000)

}

function startPlaying(){

    resetGame()
    gameRunning = true;
    gamePaused = false
    playButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    startTime = Date.now();
    fireBallInterval = setInterval(createFireball, 1000);
    difficultyInterval = setInterval(increaseDifficulty, 120000) // increase difficulty every 2 min
    startLevelTimer();
    gameLoop()

}
function gameLoop(){
    if(!gameRunning || gamePaused) return;
    moveFireballs()
    checkCollisions()
    if(lives <= 0){
        gameOver()
    }else if(ballsCollected >= targetBallCount){
        levelComplete()
    }else{
        requestAnimationFrame(gameLoop)
    }
}
function startLevelTimer(){
    levelTime = 20;
    levelTimerDisplay.style.display = 'block'
    levelTimerDisplay.textContent = levelTime;
     levelTimerInterval = setInterval(() => {
        levelTime--;
        levelTimerDisplay.textContent = levelTime
         if (levelTime < 0) {
           clearInterval(levelTimerInterval);
             levelTimerDisplay.style.display = 'none'
            gameOver()
        }

    }, 1000)


}
function resetGame() {
    score = 0;
    lives = 8;
    fireballs = [];
    fireballSpeed = 2;
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    gameOverDisplay.style.display = 'none';
    pauseButton.style.display = 'none';
    resumeButton.style.display = 'none'
    playButton.style.display = 'inline-block';
     levelCompleteDisplay.style.display = 'none';
    elapsedTime = 0;
    draganX = (gameArea.clientWidth - dragan.clientWidth) / 2;
    dragan.style.left = draganX + 'px';
    highScoreDisplay.style.display = 'none'
    ballsCollected = 0;



  // Clear any existing fireballs from the DOM
    const existingFireballs = gameArea.querySelectorAll('.fireball');
    existingFireballs.forEach(fireball => fireball.remove());

    clearInterval(fireBallInterval);
    clearInterval(difficultyInterval);
     clearInterval(levelTimerInterval)
}

function createFireball() {
    if(!gameRunning || gamePaused) return;
    const fireball = document.createElement('div');
    fireball.classList.add('fireball');
    const startX = Math.random() * (gameArea.clientWidth - 40); // adjust start x position for small size
    fireball.style.left = startX + 'px';
    fireball.style.top = -40 + 'px';
    gameArea.appendChild(fireball);
    fireballs.push(fireball);
}

function moveFireballs() {
    fireballs.forEach((fireball, index) => {
        const currentTop = parseInt(fireball.style.top);
        fireball.style.top = currentTop + fireballSpeed + 'px';
        if (currentTop > gameArea.clientHeight) {
            fireball.remove()
            fireballs.splice(index, 1) // Remove from array
            lives--;
            livesDisplay.textContent = lives;
        }
    })
}

function checkCollisions() {
    const draganRect = dragan.getBoundingClientRect();

    fireballs.forEach((fireball, index) => {
        const fireballRect = fireball.getBoundingClientRect();
        if(
            draganRect.left < fireballRect.right &&
            draganRect.right > fireballRect.left &&
            draganRect.top < fireballRect.bottom &&
            draganRect.bottom > fireballRect.top

        ){
             score++;
            scoreDisplay.textContent = score;
            ballsCollected++;
            if (score > highScore) {
              highScore = score;
               highestScoreDisplay.textContent = highScore;
            }
            changeBucketAppearance();
            fireball.remove();
            fireballs.splice(index, 1);
        }

    });
}
function changeBucketAppearance() {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    dragan.style.backgroundColor = randomColor;
}



function increaseDifficulty(){
    fireballSpeed += 0.5;
    for (let i=0; i < 2; i++){
        createFireball()
    }
}

function gameOver(){
    gameRunning = false;
    clearInterval(fireBallInterval);
    clearInterval(difficultyInterval);
     clearInterval(levelTimerInterval);
    gameOverDisplay.style.display = 'block';
    playButton.style.display = 'inline-block'
    pauseButton.style.display = 'none'
    resumeButton.style.display = 'none'
    const time = (Date.now() - startTime)/ 1000;
    finalScoreDisplay.textContent = score;
    finalTimeDisplay.textContent = time.toFixed(2);
}

function pauseGame(){
    gamePaused = true;
    pauseButton.style.display = 'none';
    resumeButton.style.display = 'inline-block';
    clearInterval(fireBallInterval)
    clearInterval(difficultyInterval)
     clearInterval(levelTimerInterval)
}
function levelComplete(){
  gameRunning = false;
  clearInterval(fireBallInterval);
   clearInterval(difficultyInterval)
    clearInterval(levelTimerInterval)
   levelCompleteDisplay.style.display = 'block';
    setTimeout(()=>{
        levelCompleteDisplay.style.display = 'none';
      level++;
        levelDisplay.textContent = level;
        if(level <= 20){
              targetBallCount += 2;
            targetDisplay.textContent = targetBallCount;
              startPlaying();
        }else{
          gameRunning = false;
          gameOverDisplay.style.display = 'block';

        }


    },3000)

}
function resumeGame(){
    gamePaused = false;
    resumeButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    startTime = Date.now() - elapsedTime * 1000;
    fireBallInterval = setInterval(createFireball, 1000);
    difficultyInterval = setInterval(increaseDifficulty, 120000);
    startLevelTimer();
    gameLoop();

}
function moveDragan(direction){
    if (!gameRunning || gamePaused) return;
    draganX += direction * draganSpeed
    const minX = 0;
    const maxX = gameArea.clientWidth - dragan.clientWidth;
    draganX = Math.max(minX, Math.min(draganX, maxX));
    dragan.style.left = draganX + 'px'

}



document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      moveDragan(-1);  // Move left on left arrow
    } else if (e.key === 'ArrowRight') {
       moveDragan(1); // Move right on right arrow
    }
});

startButton.addEventListener('click', startGame);
playButton.addEventListener('click', startPlaying);
pauseButton.addEventListener('click',pauseGame);
resumeButton.addEventListener('click',resumeGame)
