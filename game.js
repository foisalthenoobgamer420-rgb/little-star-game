// =====================================================
// LITTLE STAR GAME ⭐
// FULL VERSION
// 10 LEVELS + 60 SEC + 5 LIVES
// MUSIC + SOUND + PAUSE + MOBILE + BOOST
// =====================================================


// =====================================================
// HTML ELEMENTS
// =====================================================

const gameArea = document.getElementById("gameArea");

const player = document.getElementById("player");

const star = document.getElementById("star");
const coin = document.getElementById("coin");
const heart = document.getElementById("heart");
const boost = document.getElementById("boost");

const scoreText = document.getElementById("score");
const coinsText = document.getElementById("coins");
const livesText = document.getElementById("lives");
const levelText = document.getElementById("level");
const timeText = document.getElementById("time");
const highScoreText = document.getElementById("highScore");

const powerStatus = document.getElementById("powerStatus");

const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

const musicButton = document.getElementById("musicButton");
const musicStatus = document.getElementById("musicStatus");

const fullscreenButton =
    document.getElementById("fullscreenButton");

const backgroundMusic =
    document.getElementById("backgroundMusic");

const particles =
    document.getElementById("particles");


// =====================================================
// SCREENS
// =====================================================

const gameOverScreen =
    document.getElementById("gameOverScreen");

const levelCompleteScreen =
    document.getElementById("levelCompleteScreen");

const winScreen =
    document.getElementById("winScreen");

const finalScore =
    document.getElementById("finalScore");

const gameOverHighScore =
    document.getElementById("gameOverHighScore");

const completedLevel =
    document.getElementById("completedLevel");

const levelMessage =
    document.getElementById("levelMessage");

const winScore =
    document.getElementById("winScore");

const winHighScore =
    document.getElementById("winHighScore");

const restartButton =
    document.getElementById("restartButton");

const nextLevelButton =
    document.getElementById("nextLevelButton");

const winRestartButton =
    document.getElementById("winRestartButton");


// =====================================================
// GAME VARIABLES
// =====================================================

let score = 0;

let coins = 0;

let lives = 5;

let level = 1;

const maxLevel = 10;

let starsCollected = 0;

let starsNeeded = level * 5;

let timeLeft = 60;


// =====================================================
// PLAYER
// =====================================================

let playerX = 50;


// =====================================================
// FALLING OBJECTS
// =====================================================

let starX = 50;
let starY = -60;

let coinX = 50;
let coinY = -100;

let heartX = 50;
let heartY = -150;

let boostX = 50;
let boostY = -200;


// =====================================================
// GAME STATE
// =====================================================

let gameRunning = false;

let gamePaused = false;

let animationId = null;

let timerInterval = null;


// =====================================================
// SPEED
// =====================================================

let starSpeed = 180;


// =====================================================
// BOOST
// =====================================================

let boostActive = false;

let boostEndTime = 0;


// =====================================================
// KEY STATE
// =====================================================

const keys = {
    left: false,
    right: false
};


// =====================================================
// HIGH SCORE
// =====================================================

let highScore =
    Number(
        localStorage.getItem("littleStarHighScore")
    ) || 0;

highScoreText.textContent = highScore;


// =====================================================
// MUSIC
// =====================================================

let musicOn = true;


// =====================================================
// AUDIO
// =====================================================

let audioContext = null;


// =====================================================
// AUDIO INITIALIZATION
// =====================================================

function initAudio() {

    if (audioContext) {

        if (
            audioContext.state === "suspended"
        ) {

            audioContext.resume()
                .catch(() => {});

        }

        return;
    }

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext) return;

    try {

        audioContext =
            new AudioContext();

        if (
            audioContext.state === "suspended"
        ) {

            audioContext.resume()
                .catch(() => {});

        }

    } catch (error) {

        console.log(
            "Audio unavailable"
        );

    }
}


// =====================================================
// SOUND EFFECTS
// =====================================================

function playSound(type) {

    initAudio();

    if (!audioContext) return;

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );

    const now =
        audioContext.currentTime;


    // STAR
    if (type === "star") {

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            700,
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            1200,
            now + 0.12
        );

        gain.gain.setValueAtTime(
            0.15,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.01,
            now + 0.18
        );

        oscillator.start(now);

        oscillator.stop(
            now + 0.18
        );
    }


    // COIN
    else if (type === "coin") {

        oscillator.type = "triangle";

        oscillator.frequency.setValueAtTime(
            900,
            now
        );

        oscillator.frequency.setValueAtTime(
            1300,
            now + 0.08
        );

        gain.gain.setValueAtTime(
            0.16,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.01,
            now + 0.2
        );

        oscillator.start(now);

        oscillator.stop(
            now + 0.2
        );
    }


    // HEART
    else if (type === "heart") {

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            500,
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            900,
            now + 0.15
        );

        gain.gain.setValueAtTime(
            0.16,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.01,
            now + 0.25
        );

        oscillator.start(now);

        oscillator.stop(
            now + 0.25
        );
    }


    // BOOST
    else if (type === "boost") {

        oscillator.type = "square";

        oscillator.frequency.setValueAtTime(
            300,
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            1000,
            now + 0.3
        );

        gain.gain.setValueAtTime(
            0.12,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.01,
            now + 0.35
        );

        oscillator.start(now);

        oscillator.stop(
            now + 0.35
        );
    }


    // MISS
    else if (type === "miss") {

        oscillator.type = "sawtooth";

        oscillator.frequency.setValueAtTime(
            250,
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            80,
            now + 0.25
        );

        gain.gain.setValueAtTime(
            0.12,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.01,
            now + 0.25
        );

        oscillator.start(now);

        oscillator.stop(
            now + 0.25
        );
    }


    // LOSE
    else if (type === "lose") {

        oscillator.type = "sawtooth";

        oscillator.frequency.setValueAtTime(
            350,
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            50,
            now + 0.8
        );

        gain.gain.setValueAtTime(
            0.2,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.01,
            now + 0.8
        );

        oscillator.start(now);

        oscillator.stop(
            now + 0.8
        );
    }


    // WIN
    else if (type === "win") {

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            500,
            now
        );

        oscillator.frequency.setValueAtTime(
            700,
            now + 0.15
        );

        oscillator.frequency.setValueAtTime(
            900,
            now + 0.3
        );

        oscillator.frequency.setValueAtTime(
            1200,
            now + 0.45
        );

        gain.gain.setValueAtTime(
            0.18,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.01,
            now + 0.7
        );

        oscillator.start(now);

        oscillator.stop(
            now + 0.7
        );
    }
}


// =====================================================
// MUSIC
// =====================================================

function startMusic() {

    if (!musicOn) return;

    if (!backgroundMusic) return;

    backgroundMusic.volume = 0.35;

    backgroundMusic.play()
        .catch(() => {});

}


function stopMusic() {

    if (!backgroundMusic) return;

    backgroundMusic.pause();

}


function toggleMusic() {

    initAudio();

    musicOn = !musicOn;

    if (musicOn) {

        musicButton.textContent =
            "🎵 Music ON";

        musicStatus.textContent =
            "Music ON";

        if (gameRunning && !gamePaused) {

            startMusic();

        }

    } else {

        musicButton.textContent =
            "🔇 Music OFF";

        musicStatus.textContent =
            "Music OFF";

        stopMusic();

    }
}


// =====================================================
// RANDOM X
// =====================================================

function randomX() {

    return (
        Math.random() * 88 + 6
    );

}


// =====================================================
// PLACE ITEM
// =====================================================

function placeItem(
    item,
    x,
    y
) {

    item.style.left =
        x + "%";

    item.style.top =
        y + "px";

    item.style.display =
        "block";

}


// =====================================================
// RESET STAR
// =====================================================

function resetStar() {

    starX = randomX();

    starY = -60;

    placeItem(
        star,
        starX,
        starY
    );

}


// =====================================================
// RESET COIN
// =====================================================

function resetCoin() {

    coinX = randomX();

    coinY = -100;

    coin.style.left =
        coinX + "%";

    coin.style.top =
        coinY + "px";

}


// =====================================================
// RESET HEART
// =====================================================

function resetHeart() {

    heartX = randomX();

    heartY = -150;

    heart.style.left =
        heartX + "%";

    heart.style.top =
        heartY + "px";

}


// =====================================================
// RESET BOOST
// =====================================================

function resetBoost() {

    boostX = randomX();

    boostY = -200;

    boost.style.left =
        boostX + "%";

    boost.style.top =
        boostY + "px";

}


// =====================================================
// HIDE OPTIONAL ITEMS
// =====================================================

function hideOptionalItems() {

    coin.style.display =
        "none";

    heart.style.display =
        "none";

    boost.style.display =
        "none";

}


// =====================================================
// COLLISION
// =====================================================

function isColliding(item) {

    if (
        item.style.display ===
        "none"
    ) {

        return false;

    }

    const playerRect =
        player.getBoundingClientRect();

    const itemRect =
        item.getBoundingClientRect();

    return (

        itemRect.bottom >=
        playerRect.top &&

        itemRect.top <=
        playerRect.bottom &&

        itemRect.left <
        playerRect.right &&

        itemRect.right >
        playerRect.left

    );

}


// =====================================================
// PARTICLE BLAST
// =====================================================

function createParticles(
    source,
    emojis
) {

    const sourceRect =
        source.getBoundingClientRect();

    const areaRect =
        gameArea.getBoundingClientRect();

    const centerX =
        sourceRect.left -
        areaRect.left +
        sourceRect.width / 2;

    const centerY =
        sourceRect.top -
        areaRect.top +
        sourceRect.height / 2;


    emojis.forEach(
        (emoji) => {

            const particle =
                document.createElement(
                    "div"
                );

            particle.className =
                "particle";

            particle.textContent =
                emoji;

            particle.style.left =
                centerX + "px";

            particle.style.top =
                centerY + "px";


            const angle =
                Math.random() *
                Math.PI *
                2;

            const distance =
                50 +
                Math.random() *
                100;


            particle.style.setProperty(
                "--dx",
                Math.cos(angle) *
                    distance +
                    "px"
            );

            particle.style.setProperty(
                "--dy",
                Math.sin(angle) *
                    distance +
                    "px"
            );


            particles.appendChild(
                particle
            );


            setTimeout(
                () => {

                    particle.remove();

                },
                900
            );

        }
    );

}


// =====================================================
// UPDATE PLAYER
// =====================================================

function updatePlayer(deltaTime) {

    if (
        !gameRunning ||
        gamePaused
    ) {

        return;

    }


    // NORMAL = 150
    // BOOST = 300

    const speed =
        boostActive
            ? 300
            : 150;


    if (keys.left) {

        playerX -=
            speed *
            deltaTime;

    }


    if (keys.right) {

        playerX +=
            speed *
            deltaTime;

    }


    if (playerX < 6) {

        playerX = 6;

    }


    if (playerX > 94) {

        playerX = 94;

    }


    player.style.left =
        playerX + "%";


    // BOOST TIMER

    if (
        boostActive &&
        performance.now() >
            boostEndTime
    ) {

        boostActive =
            false;

        powerStatus.textContent =
            "";

    }

}


// =====================================================
// UPDATE STAR
// =====================================================

function updateStar(deltaTime) {

    if (
        !gameRunning ||
        gamePaused
    ) {

        return;

    }


    starY +=
        starSpeed *
        deltaTime;


    star.style.top =
        starY + "px";


    // CATCH

    if (
        isColliding(star)
    ) {

        score++;

        starsCollected++;

        playSound("star");

        createParticles(
            star,
            [
                "✨",
                "⭐",
                "💫"
            ]
        );

        resetStar();

        updateHighScore();

        checkLevelProgress();

        updateUI();

        return;

    }


    // MISS

    if (
        starY >
        gameArea.clientHeight +
        60
    ) {

        lives--;

        playSound("miss");

        createParticles(
            star,
            [
                "💔",
                "😢"
            ]
        );

        resetStar();

        updateUI();


        if (lives <= 0) {

            endGame();

        }

    }

}


// =====================================================
// UPDATE COIN
// =====================================================

function updateCoin(deltaTime) {

    if (
        !gameRunning ||
        gamePaused
    ) {

        return;

    }


    // Random spawn

    if (
        coin.style.display ===
            "none" &&
        Math.random() < 0.008
    ) {

        resetCoin();

    }


    if (
        coin.style.display ===
        "none"
    ) {

        return;

    }


    coinY +=
        (starSpeed * 0.85) *
        deltaTime;


    coin.style.top =
        coinY + "px";


    if (
        isColliding(coin)
    ) {

        coins++;

        score += 2;

        playSound("coin");

        createParticles(
            coin,
            [
                "🪙",
                "✨",
                "💰"
            ]
        );

        coin.style.display =
            "none";

        updateHighScore();

        updateUI();

        return;

    }


    if (
        coinY >
        gameArea.clientHeight +
        50
    ) {

        coin.style.display =
            "none";

    }

}


// =====================================================
// UPDATE HEART
// =====================================================

function updateHeart(deltaTime) {

    if (
        !gameRunning ||
        gamePaused
    ) {

        return;

    }


    if (
        heart.style.display ===
            "none" &&
        Math.random() < 0.0025
    ) {

        resetHeart();

    }


    if (
        heart.style.display ===
        "none"
    ) {

        return;

    }


    heartY +=
        (starSpeed * 0.75) *
        deltaTime;


    heart.style.top =
        heartY + "px";


    if (
        isColliding(heart)
    ) {

        if (lives < 5) {

            lives++;

        }

        playSound("heart");

        createParticles(
            heart,
            [
                "❤️",
                "💖",
                "💕"
            ]
        );

        heart.style.display =
            "none";

        updateUI();

        return;

    }


    if (
        heartY >
        gameArea.clientHeight +
        50
    ) {

        heart.style.display =
            "none";

    }

}


// =====================================================
// UPDATE BOOST
// =====================================================

function updateBoost(deltaTime) {

    if (
        !gameRunning ||
        gamePaused
    ) {

        return;

    }


    if (
        boost.style.display ===
            "none" &&
        Math.random() < 0.002
    ) {

        resetBoost();

    }


    if (
        boost.style.display ===
        "none"
    ) {

        return;

    }


    boostY +=
        (starSpeed * 0.9) *
        deltaTime;


    boost.style.top =
        boostY + "px";


    if (
        isColliding(boost)
    ) {

        boostActive =
            true;

        boostEndTime =
            performance.now() +
            5000;

        playSound("boost");

        powerStatus.textContent =
            "⚡ SPEED BOOST! 5 seconds!";

        createParticles(
            boost,
            [
                "⚡",
                "🔥",
                "💨"
            ]
        );

        boost.style.display =
            "none";

        return;

    }


    if (
        boostY >
        gameArea.clientHeight +
        50
    ) {

        boost.style.display =
            "none";

    }

}


// =====================================================
// LEVEL PROGRESS
// =====================================================

function checkLevelProgress() {

    if (
        starsCollected >=
        starsNeeded
    ) {

        completeLevel();

    }

}


// =====================================================
// COMPLETE LEVEL
// =====================================================

function completeLevel() {

    gameRunning =
        false;

    gamePaused =
        false;

    cancelAnimationFrame(
        animationId
    );

    clearInterval(
        timerInterval
    );

    stopMusic();

    playSound("win");

    pauseButton.style.display =
        "none";

    star.style.display =
        "none";

    coin.style.display =
        "none";

    heart.style.display =
        "none";

    boost.style.display =
        "none";


    completedLevel.textContent =
        level;


    if (level < maxLevel) {

        levelMessage.textContent =
            "Get ready! The next level is faster! 🚀";

        nextLevelButton.textContent =
            "🚀 Next Level";

    } else {

        levelMessage.textContent =
            "One more step and you will become the Star Master! 👑";

        nextLevelButton.textContent =
            "🏆 Finish Game";

    }


    levelCompleteScreen.style.display =
        "flex";

}


// =====================================================
// NEXT LEVEL
// =====================================================

function nextLevel() {

    levelCompleteScreen.style.display =
        "none";


    if (level >= maxLevel) {

        showWin();

        return;

    }


    level++;

    starsNeeded =
        level * 5;

    starsCollected =
        0;

    timeLeft =
        60;

    starSpeed =
        180 +
        (level - 1) *
        15;


    gameRunning =
        true;

    gamePaused =
        false;


    playerX =
        50;


    player.style.left =
        playerX + "%";


    resetStar();

    hideOptionalItems();

    updateUI();


    pauseButton.style.display =
        "inline-block";

    pauseButton.textContent =
        "⏸️ Pause";


    lastTime =
        performance.now();


    startMusic();

    startTimer();


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// =====================================================
// GAME OVER
// =====================================================

function endGame() {

    gameRunning =
        false;

    gamePaused =
        false;


    cancelAnimationFrame(
        animationId
    );

    clearInterval(
        timerInterval
    );


    stopMusic();

    playSound("lose");


    pauseButton.style.display =
        "none";


    star.style.display =
        "none";

    coin.style.display =
        "none";

    heart.style.display =
        "none";

    boost.style.display =
        "none";


    updateHighScore();


    finalScore.textContent =
        score;

    gameOverHighScore.textContent =
        highScore;


    gameOverScreen.style.display =
        "flex";

}


// =====================================================
// WIN
// =====================================================

function showWin() {

    gameRunning =
        false;

    gamePaused =
        false;


    cancelAnimationFrame(
        animationId
    );

    clearInterval(
        timerInterval
    );


    stopMusic();

    playSound("win");


    pauseButton.style.display =
        "none";


    star.style.display =
        "none";

    coin.style.display =
        "none";

    heart.style.display =
        "none";

    boost.style.display =
        "none";


    updateHighScore();


    winScore.textContent =
        score;

    winHighScore.textContent =
        highScore;


    winScreen.style.display =
        "flex";

}


// =====================================================
// START GAME
// =====================================================

function startGame() {

    initAudio();


    score = 0;

    coins = 0;

    lives = 5;

    level = 1;

    starsCollected = 0;

    starsNeeded = 5;

    timeLeft = 60;


    playerX = 50;


    starSpeed = 180;


    boostActive = false;

    boostEndTime = 0;


    gameRunning =
        true;

    gamePaused =
        false;


    gameOverScreen.style.display =
        "none";

    levelCompleteScreen.style.display =
        "none";

    winScreen.style.display =
        "none";


    powerStatus.textContent =
        "";


    startButton.style.display =
        "none";

    pauseButton.style.display =
        "inline-block";

    pauseButton.textContent =
        "⏸️ Pause";


    player.style.left =
        playerX + "%";


    resetStar();

    hideOptionalItems();


    updateUI();


    lastTime =
        performance.now();


    startMusic();

    startTimer();


    cancelAnimationFrame(
        animationId
    );


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// =====================================================
// TIMER
// =====================================================

function startTimer() {

    clearInterval(
        timerInterval
    );


    timerInterval =
        setInterval(
            () => {

                if (
                    !gameRunning ||
                    gamePaused
                ) {

                    return;

                }


                timeLeft--;


                updateUI();


                if (
                    timeLeft <= 0
                ) {

                    endGame();

                }

            },
            1000
        );

}


// =====================================================
// PAUSE
// =====================================================

function togglePause() {

    if (!gameRunning) {

        return;

    }


    gamePaused =
        !gamePaused;


    if (gamePaused) {

        pauseButton.textContent =
            "▶️ Resume";

        document.body.classList.add(
            "game-paused"
        );

        stopMusic();

    } else {

        pauseButton.textContent =
            "⏸️ Pause";

        document.body.classList.remove(
            "game-paused"
        );

        lastTime =
            performance.now();

        startMusic();

    }

}


// =====================================================
// KEYBOARD
// =====================================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "ArrowLeft"
        ) {

            keys.left =
                true;

            event.preventDefault();

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            keys.right =
                true;

            event.preventDefault();

        }

    }
);


document.addEventListener(
    "keyup",
    (event) => {

        if (
            event.key ===
            "ArrowLeft"
        ) {

            keys.left =
                false;

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            keys.right =
                false;

        }

    }
);


// =====================================================
// MOBILE / POINTER CONTROLS
// =====================================================

function setupHoldButton(
    button,
    direction
) {

    const press = (event) => {

        event.preventDefault();

        initAudio();

        keys[direction] =
            true;

    };


    const release = (event) => {

        event.preventDefault();

        keys[direction] =
            false;

    };


    button.addEventListener(
        "pointerdown",
        press
    );

    button.addEventListener(
        "pointerup",
        release
    );

    button.addEventListener(
        "pointerleave",
        release
    );

    button.addEventListener(
        "pointercancel",
        release
    );

}


setupHoldButton(
    leftButton,
    "left"
);


setupHoldButton(
    rightButton,
    "right"
);


// =====================================================
// FULLSCREEN
// =====================================================

fullscreenButton.addEventListener(
    "click",
    async () => {

        try {

            if (!document.fullscreenElement) {

                await document.documentElement
                    .requestFullscreen();

                document.body.classList.add(
                    "fullscreen-mode"
                );

                fullscreenButton.textContent =
                    "⛶ Exit Fullscreen";

            } else {

                await document.exitFullscreen();

            }

        } catch (error) {

            console.log(
                "Fullscreen unavailable"
            );

        }

    }
);


document.addEventListener(
    "fullscreenchange",
    () => {

        if (
            !document.fullscreenElement
        ) {

            document.body.classList.remove(
                "fullscreen-mode"
            );

            fullscreenButton.textContent =
                "⛶ Fullscreen";

        }

    }
);


// =====================================================
// BUTTON EVENTS
// =====================================================

startButton.addEventListener(
    "click",
    startGame
);


pauseButton.addEventListener(
    "click",
    togglePause
);


musicButton.addEventListener(
    "click",
    toggleMusic
);


nextLevelButton.addEventListener(
    "click",
    nextLevel
);


restartButton.addEventListener(
    "click",
    () => {

        startGame();

    }
);


winRestartButton.addEventListener(
    "click",
    () => {

        startGame();

    }
);


// =====================================================
// UPDATE UI
// =====================================================

function updateUI() {

    scoreText.textContent =
        score;

    coinsText.textContent =
        coins;

    livesText.textContent =
        lives;

    levelText.textContent =
        level;

    timeText.textContent =
        timeLeft;

    highScoreText.textContent =
        highScore;

}


// =====================================================
// HIGH SCORE
// =====================================================

function updateHighScore() {

    if (
        score >
        highScore
    ) {

        highScore =
            score;

        localStorage.setItem(
            "littleStarHighScore",
            highScore
        );

    }

    highScoreText.textContent =
        highScore;

}


// =====================================================
// GAME LOOP
// =====================================================

let lastTime =
    performance.now();


function gameLoop(currentTime) {

    if (!gameRunning) {

        return;

    }


    if (!gamePaused) {

        let deltaTime =
            (currentTime -
                lastTime) /
            1000;


        // Prevent huge movement after lag/tab switch

        if (
            deltaTime > 0.05
        ) {

            deltaTime =
                0.05;

        }


        lastTime =
            currentTime;


        updatePlayer(
            deltaTime
        );

        updateStar(
            deltaTime
        );

        updateCoin(
            deltaTime
        );

        updateHeart(
            deltaTime
        );

        updateBoost(
            deltaTime
        );

    } else {

        lastTime =
            currentTime;

    }


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// =====================================================
// INITIAL STATE
// =====================================================

updateUI();

resetStar();

hideOptionalItems();

pauseButton.style.display =
    "none";


// Music preload

if (backgroundMusic) {

    backgroundMusic.preload =
        "auto";

    backgroundMusic.load();

    backgroundMusic.addEventListener(
        "error",
        () => {

            console.log(
                "music.mp3 পাওয়া যায়নি। music.mp3 অবশ্যই index.html-এর পাশে থাকতে হবে।"
            );

        }
    );

}
