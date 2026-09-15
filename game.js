"use strict";


/* =====================================================
   LITTLE STAR GAME
   10 LEVELS / 300 SECONDS / 5 LIVES
===================================================== */


/* =========================
   DOM
========================= */

const scoreText = document.getElementById("score");
const coinsText = document.getElementById("coins");
const livesText = document.getElementById("lives");
const levelText = document.getElementById("level");
const timeText = document.getElementById("time");
const highScoreText = document.getElementById("highScore");

const gameArea = document.getElementById("gameArea");

const player = document.getElementById("player");
const star = document.getElementById("star");
const coin = document.getElementById("coin");
const heart = document.getElementById("heart");
const boost = document.getElementById("boost");

const particles = document.getElementById("particles");

const powerStatus = document.getElementById("powerStatus");

const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const fullscreenButton = document.getElementById("fullscreenButton");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

const musicButton = document.getElementById("musicButton");
const musicStatus = document.getElementById("musicStatus");

const backgroundMusic =
    document.getElementById("backgroundMusic");


/* =========================
   OVERLAYS
========================= */

const levelCompleteScreen =
    document.getElementById("levelCompleteScreen");

const gameOverScreen =
    document.getElementById("gameOverScreen");

const winScreen =
    document.getElementById("winScreen");

const completedLevel =
    document.getElementById("completedLevel");

const levelMessage =
    document.getElementById("levelMessage");

const nextLevelButton =
    document.getElementById("nextLevelButton");

const finalScore =
    document.getElementById("finalScore");

const gameOverHighScore =
    document.getElementById("gameOverHighScore");

const restartButton =
    document.getElementById("restartButton");

const winScore =
    document.getElementById("winScore");

const winHighScore =
    document.getElementById("winHighScore");

const winRestartButton =
    document.getElementById("winRestartButton");


/* =========================
   GAME VARIABLES
========================= */

let score = 0;
let coins = 0;

let lives = 5;

let level = 1;

const maxLevel = 10;

let starsCollected = 0;

let starsNeeded = level * 5;

let timeLeft = 300;

let gameRunning = false;

let paused = false;

let playerX = 50;


/* =========================
   FALLING OBJECTS
========================= */

let starX = 50;
let starY = -60;

let coinX = 50;
let coinY = -60;

let heartX = 50;
let heartY = -60;

let boostX = 50;
let boostY = -60;


/* =========================
   SPEED
========================= */

let starSpeed = 180;

let boostActive = false;

let boostEndTime = 0;


/* =========================
   CONTROLS
========================= */

let leftPressed = false;
let rightPressed = false;


/* =========================
   TIMER
========================= */

let timerInterval = null;


/* =========================
   ANIMATION
========================= */

let animationFrame = null;

let lastTime = performance.now();


/* =========================
   MUSIC
========================= */

let musicEnabled = false;


/* =========================
   AUDIO
========================= */

let audioContext = null;


/* =========================
   HIGH SCORE
========================= */

let highScore =
    Number(
        localStorage.getItem(
            "littleStarHighScore"
        )
    ) || 0;


/* =========================
   INITIAL UI
========================= */

updateHighScore();

updateUI();

pauseButton.disabled = true;


/* =====================================================
   AUDIO
===================================================== */

function getAudioContext() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (AudioContext) {
            audioContext = new AudioContext();
        }
    }

    return audioContext;
}


function playSound(type) {

    const ctx = getAudioContext();

    if (!ctx) return;

    if (ctx.state === "suspended") {
        ctx.resume();
    }

    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    let frequency = 500;
    let duration = 0.12;
    let wave = "sine";

    switch (type) {

        case "star":
            frequency = 800;
            duration = 0.1;
            break;

        case "coin":
            frequency = 1000;
            duration = 0.12;
            break;

        case "heart":
            frequency = 650;
            duration = 0.15;
            break;

        case "boost":
            frequency = 1200;
            duration = 0.2;
            wave = "square";
            break;

        case "miss":
            frequency = 180;
            duration = 0.2;
            wave = "sawtooth";
            break;

        case "lose":
            frequency = 100;
            duration = 0.7;
            wave = "sawtooth";
            break;

        case "win":
            frequency = 900;
            duration = 0.8;
            break;
    }

    oscillator.type = wave;

    oscillator.frequency.setValueAtTime(
        frequency,
        now
    );

    gain.gain.setValueAtTime(
        0.0001,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        0.2,
        now + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + duration
    );

    oscillator.start(now);
    oscillator.stop(now + duration);
}


/* =====================================================
   MUSIC
===================================================== */

async function startMusic() {

    if (!musicEnabled) return;

    try {

        backgroundMusic.volume = 0.35;

        await backgroundMusic.play();

    } catch (error) {

        console.log(
            "Music waiting for user interaction."
        );
    }
}


function stopMusic() {

    backgroundMusic.pause();

    backgroundMusic.currentTime = 0;
}


musicButton.addEventListener(
    "click",
    async function () {

        musicEnabled = !musicEnabled;

        if (musicEnabled) {

            musicStatus.textContent = "ON";

            musicButton.textContent =
                "🔊 Music ON";

            await startMusic();

        } else {

            musicStatus.textContent = "OFF";

            musicButton.textContent =
                "🎵 Music OFF";

            stopMusic();
        }
    }
);


/* =====================================================
   UI
===================================================== */

function updateUI() {

    scoreText.textContent = score;

    coinsText.textContent = coins;

    livesText.textContent = lives;

    levelText.textContent = level;

    timeText.textContent = timeLeft;

    highScoreText.textContent = highScore;

    if (boostActive) {

        const remaining =
            Math.max(
                0,
                Math.ceil(
                    (boostEndTime - performance.now()) / 1000
                )
            );

        powerStatus.textContent =
            `⚡ SPEED BOOST! ${remaining}s`;

    } else {

        powerStatus.textContent = "";
    }
}


function updateHighScore() {

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "littleStarHighScore",
            highScore
        );
    }

    highScoreText.textContent =
        highScore;
}


/* =====================================================
   PLAYER
===================================================== */

function updatePlayer(deltaTime) {

    if (!gameRunning || paused) return;

    let speed =
        boostActive ? 300 : 150;

    if (leftPressed) {

        playerX -=
            speed * deltaTime;
    }

    if (rightPressed) {

        playerX +=
            speed * deltaTime;
    }

    playerX =
        Math.max(
            6,
            Math.min(94, playerX)
        );

    player.style.left =
        playerX + "%";
}


/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight"
        ) {

            event.preventDefault();
        }

        if (event.key === "ArrowLeft") {

            leftPressed = true;
        }

        if (event.key === "ArrowRight") {

            rightPressed = true;
        }

        if (
            event.key === " " &&
            gameRunning
        ) {

            event.preventDefault();

            togglePause();
        }
    }
);


document.addEventListener(
    "keyup",
    function (event) {

        if (event.key === "ArrowLeft") {

            leftPressed = false;
        }

        if (event.key === "ArrowRight") {

            rightPressed = false;
        }
    }
);


/* =====================================================
   MOBILE BUTTONS
===================================================== */

function pressLeft(event) {

    event.preventDefault();

    leftPressed = true;
}

function releaseLeft(event) {

    event.preventDefault();

    leftPressed = false;
}

function pressRight(event) {

    event.preventDefault();

    rightPressed = true;
}

function releaseRight(event) {

    event.preventDefault();

    rightPressed = false;
}


leftButton.addEventListener(
    "pointerdown",
    pressLeft
);

leftButton.addEventListener(
    "pointerup",
    releaseLeft
);

leftButton.addEventListener(
    "pointerleave",
    releaseLeft
);

leftButton.addEventListener(
    "pointercancel",
    releaseLeft
);


rightButton.addEventListener(
    "pointerdown",
    pressRight
);

rightButton.addEventListener(
    "pointerup",
    releaseRight
);

rightButton.addEventListener(
    "pointerleave",
    releaseRight
);

rightButton.addEventListener(
    "pointercancel",
    releaseRight
);


/* =====================================================
   RESET STAR
===================================================== */

function resetStar() {

    starX =
        Math.random() * 88 + 6;

    starY = -60;

    star.style.left =
        starX + "%";

    star.style.top =
        starY + "px";

    star.style.display =
        "block";
}


/* =====================================================
   RESET COIN
===================================================== */

function resetCoin() {

    coinX =
        Math.random() * 88 + 6;

    coinY = -60;

    coin.style.left =
        coinX + "%";

    coin.style.top =
        coinY + "px";

    coin.style.display =
        "block";
}


/* =====================================================
   RESET HEART
===================================================== */

function resetHeart() {

    heartX =
        Math.random() * 88 + 6;

    heartY = -60;

    heart.style.left =
        heartX + "%";

    heart.style.top =
        heartY + "px";

    heart.style.display =
        "block";
}


/* =====================================================
   RESET BOOST
===================================================== */

function resetBoost() {

    boostX =
        Math.random() * 88 + 6;

    boostY = -60;

    boost.style.left =
        boostX + "%";

    boost.style.top =
        boostY + "px";

    boost.style.display =
        "block";
}


/* =====================================================
   COLLISION
===================================================== */

function isColliding(object) {

    const playerRect =
        player.getBoundingClientRect();

    const objectRect =
        object.getBoundingClientRect();

    return (
        objectRect.bottom >= playerRect.top &&
        objectRect.top <= playerRect.bottom &&
        objectRect.left < playerRect.right &&
        objectRect.right > playerRect.left
    );
}


/* =====================================================
   STAR UPDATE
===================================================== */

function updateStar(deltaTime) {

    if (!gameRunning || paused) return;

    starY +=
        starSpeed * deltaTime;

    star.style.top =
        starY + "px";


    if (isColliding(star)) {

        score++;

        starsCollected++;

        playSound("star");

        createParticlesFromElement(
            star,
            ["⭐", "✨", "💫"]
        );

        resetStar();

        updateUI();


        if (
            starsCollected >=
            starsNeeded
        ) {

            completeLevel();
        }

        return;
    }


    if (
        starY >
        gameArea.clientHeight + 50
    ) {

        lives--;

        playSound("miss");

        createParticlesFromElement(
            player,
            ["💔"]
        );

        resetStar();

        updateUI();

        if (lives <= 0) {

            endGame();
        }
    }
}


/* =====================================================
   COIN UPDATE
===================================================== */

function updateCoin(deltaTime) {

    if (!gameRunning || paused) return;

    if (
        coin.style.display === "none"
    ) {

        if (Math.random() < 0.008) {

            resetCoin();
        }

        return;
    }


    coinY +=
        starSpeed * 0.8 * deltaTime;

    coin.style.top =
        coinY + "px";


    if (isColliding(coin)) {

        coins++;

        score += 2;

        playSound("coin");

        createParticlesFromElement(
            coin,
            ["🪙", "✨"]
        );

        coin.style.display =
            "none";

        updateUI();

        return;
    }


    if (
        coinY >
        gameArea.clientHeight + 50
    ) {

        coin.style.display =
            "none";
    }
}


/* =====================================================
   HEART UPDATE
===================================================== */

function updateHeart(deltaTime) {

    if (!gameRunning || paused) return;

    if (
        heart.style.display === "none"
    ) {

        if (
            lives < 5 &&
            Math.random() < 0.0025
        ) {

            resetHeart();
        }

        return;
    }


    heartY +=
        starSpeed * 0.7 * deltaTime;

    heart.style.top =
        heartY + "px";


    if (isColliding(heart)) {

        lives =
            Math.min(
                5,
                lives + 1
            );

        playSound("heart");

        createParticlesFromElement(
            heart,
            ["❤️", "💖", "✨"]
        );

        heart.style.display =
            "none";

        updateUI();

        return;
    }


    if (
        heartY >
        gameArea.clientHeight + 50
    ) {

        heart.style.display =
            "none";
    }
}


/* =====================================================
   BOOST UPDATE
===================================================== */

function updateBoost(deltaTime) {

    if (!gameRunning || paused) return;


    if (boostActive) {

        if (
            performance.now() >=
            boostEndTime
        ) {

            boostActive = false;

            powerStatus.textContent = "";

            updateUI();
        }
    }


    if (
        boost.style.display === "none"
    ) {

        if (Math.random() < 0.002) {

            resetBoost();
        }

        return;
    }


    boostY +=
        starSpeed * 0.75 * deltaTime;

    boost.style.top =
        boostY + "px";


    if (isColliding(boost)) {

        boostActive = true;

        boostEndTime =
            performance.now() + 5000;

        playSound("boost");

        createParticlesFromElement(
            boost,
            ["⚡", "✨", "💥"]
        );

        boost.style.display =
            "none";

        updateUI();

        return;
    }


    if (
        boostY >
        gameArea.clientHeight + 50
    ) {

        boost.style.display =
            "none";
    }
}


/* =====================================================
   HIDE OPTIONAL ITEMS
===================================================== */

function hideOptionalItems() {

    coin.style.display = "none";

    heart.style.display = "none";

    boost.style.display = "none";
}


/* =====================================================
   PARTICLES
===================================================== */

function createParticlesFromElement(
    element,
    emojis
) {

    const rect =
        element.getBoundingClientRect();

    createParticles(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        12,
        emojis
    );
}


function createParticles(
    x,
    y,
    count = 25,
    emojis = [
        "✨",
        "⭐",
        "💖",
        "🎉"
    ]
) {

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const particle =
            document.createElement("span");

        particle.className =
            "particle";

        particle.textContent =
            emojis[
                Math.floor(
                    Math.random() *
                    emojis.length
                )
            ];

        particle.style.left =
            x + "px";

        particle.style.top =
            y + "px";

        particle.style.setProperty(
            "--x",
            (
                Math.random() * 300 -
                150
            ) + "px"
        );

        particle.style.setProperty(
            "--y",
            (
                Math.random() * 300 -
                150
            ) + "px"
        );

        document.body.appendChild(
            particle
        );

        setTimeout(
            () => particle.remove(),
            1000
        );
    }
}


/* =====================================================
   START GAME
===================================================== */

function startGame() {

    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );
    }

    clearInterval(
        timerInterval
    );


    score = 0;

    coins = 0;

    lives = 5;

    level = 1;

    starsCollected = 0;

    starsNeeded =
        level * 5;

    timeLeft = 300;

    starSpeed = 180;

    playerX = 50;

    boostActive = false;

    boostEndTime = 0;

    leftPressed = false;

    rightPressed = false;

    paused = false;

    gameRunning = true;


    levelCompleteScreen
        .classList.add("hidden");

    gameOverScreen
        .classList.add("hidden");

    winScreen
        .classList.add("hidden");


    document.body
        .classList.remove("paused");


    player.style.left =
        playerX + "%";


    star.style.display =
        "block";


    hideOptionalItems();

    resetStar();

    updateUI();

    updateHighScore();


    startButton.style.display =
        "inline-block";

    pauseButton.disabled = false;

    pauseButton.textContent =
        "⏸️ Pause";


    startMusic();

    startTimer();


    lastTime =
        performance.now();

    animationFrame =
        requestAnimationFrame(
            gameLoop
        );
}


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

    clearInterval(
        timerInterval
    );

    timerInterval =
        setInterval(
            function () {

                if (
                    !gameRunning ||
                    paused
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


/* =====================================================
   PAUSE
===================================================== */

function togglePause() {

    if (!gameRunning) return;

    paused = !paused;

    document.body
        .classList.toggle(
            "paused",
            paused
        );


    if (paused) {

        pauseButton.textContent =
            "▶️ Resume";

        backgroundMusic.pause();

    } else {

        pauseButton.textContent =
            "⏸️ Pause";

        startMusic();

        lastTime =
            performance.now();
    }
}


pauseButton.addEventListener(
    "click",
    togglePause
);


/* =====================================================
   COMPLETE LEVEL
===================================================== */

function completeLevel() {

    if (!gameRunning) return;

    gameRunning = false;

    clearInterval(
        timerInterval
    );

    leftPressed = false;
    rightPressed = false;

    star.style.display = "none";

    hideOptionalItems();

    pauseButton.disabled = true;

    createParticles(
        window.innerWidth / 2,
        window.innerHeight / 2,
        80,
        [
            "🎉",
            "✨",
            "🎊",
            "⭐",
            "💥"
        ]
    );

    playSound("win");

    stopMusic();


    completedLevel.textContent =
        level;


    if (level < maxLevel) {

        levelMessage.textContent =
            `Amazing! Get ready for Level ${level + 1}! ⭐`;

        nextLevelButton.textContent =
            `➡️ Level ${level + 1}`;

        levelCompleteScreen
            .classList.remove("hidden");

    } else {

        /*
           LEVEL 10 FINISHED
           FINAL GAME COMPLETE
        */

        showWin();
    }
}


/* =====================================================
   NEXT LEVEL
===================================================== */

function nextLevel() {

    level++;

    starsCollected = 0;

    starsNeeded =
        level * 5;

    timeLeft = 300;

    starSpeed =
        180 +
        (level - 1) * 15;

    boostActive = false;

    boostEndTime = 0;

    playerX = 50;

    player.style.left =
        playerX + "%";

    levelCompleteScreen
        .classList.add("hidden");

    hideOptionalItems();

    resetStar();

    updateUI();

    gameRunning = true;

    paused = false;

    pauseButton.disabled = false;

    pauseButton.textContent =
        "⏸️ Pause";

    document.body
        .classList.remove("paused");

    startMusic();

    startTimer();

    lastTime =
        performance.now();
}


nextLevelButton.addEventListener(
    "click",
    nextLevel
);


/* =====================================================
   GAME OVER
===================================================== */

function endGame() {

    if (!gameRunning) return;

    gameRunning = false;

    paused = false;

    clearInterval(
        timerInterval
    );

    leftPressed = false;

    rightPressed = false;

    pauseButton.disabled = true;

    pauseButton.textContent =
        "⏸️ Pause";

    star.style.display =
        "none";

    hideOptionalItems();

    stopMusic();

    playSound("lose");


    updateHighScore();


    finalScore.textContent =
        score;

    gameOverHighScore.textContent =
        highScore;


    gameOverScreen
        .classList.remove("hidden");


    createParticles(
        window.innerWidth / 2,
        window.innerHeight / 2,
        60,
        [
            "💥",
            "🔥",
            "💣"
        ]
    );
}


/* =====================================================
   FINAL WIN
===================================================== */

function showWin() {

    gameRunning = false;

    paused = false;

    clearInterval(
        timerInterval
    );

    leftPressed = false;

    rightPressed = false;

    pauseButton.disabled = true;

    star.style.display =
        "none";

    hideOptionalItems();

    stopMusic();


    updateHighScore();


    winScore.textContent =
        score;

    winHighScore.textContent =
        highScore;


    /*
       BIG FINAL CELEBRATION
    */

    createParticles(
        window.innerWidth / 2,
        window.innerHeight / 2,
        120,
        [
            "🎉",
            "🎊",
            "🎆",
            "✨",
            "⭐",
            "🏆",
            "💥",
            "🥳"
        ]
    );


    winScreen
        .classList.remove("hidden");


    playSound("win");


    /*
       Extra victory sounds
    */

    setTimeout(
        () => playSound("win"),
        450
    );

    setTimeout(
        () => playSound("win"),
        900
    );
}


/* =====================================================
   RESTART
===================================================== */

restartButton.addEventListener(
    "click",
    startGame
);

winRestartButton.addEventListener(
    "click",
    startGame
);


/* =====================================================
   FULLSCREEN
===================================================== */

fullscreenButton.addEventListener(
    "click",
    async function () {

        try {

            if (
                !document.fullscreenElement
            ) {

                await document.documentElement
                    .requestFullscreen();

            } else {

                await document.exitFullscreen();
            }

        } catch (error) {

            console.log(
                "Fullscreen unavailable."
            );
        }
    }
);


/* =====================================================
   MAIN GAME LOOP
===================================================== */

function gameLoop(currentTime) {

    const deltaTime =
        Math.min(
            (currentTime - lastTime) / 1000,
            0.05
        );

    lastTime =
        currentTime;


    if (
        gameRunning &&
        !paused
    ) {

        updatePlayer(deltaTime);

        updateStar(deltaTime);

        if (gameRunning) {
            updateCoin(deltaTime);
        }

        if (gameRunning) {
            updateHeart(deltaTime);
        }

        if (gameRunning) {
            updateBoost(deltaTime);
        }

        updateUI();
    }


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );
}


/* =====================================================
   START LOOP
===================================================== */

animationFrame =
    requestAnimationFrame(
        gameLoop
    );


/* =====================================================
   START BUTTON
===================================================== */

startButton.addEventListener(
    "click",
    startGame
);
