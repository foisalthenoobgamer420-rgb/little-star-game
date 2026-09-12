// =========================================
// LITTLE STAR CATCH ⭐
// FULL GAME JAVASCRIPT
// =========================================


// =========================================
// DOM
// =========================================

const gameArea =
    document.getElementById("gameArea");

const player =
    document.getElementById("player");

const star =
    document.getElementById("star");

const coin =
    document.getElementById("coin");

const heart =
    document.getElementById("heart");

const boost =
    document.getElementById("boost");

const particles =
    document.getElementById("particles");

const effectLayer =
    document.getElementById("effectLayer");


// INFO

const scoreText =
    document.getElementById("score");

const coinsText =
    document.getElementById("coins");

const livesText =
    document.getElementById("lives");

const levelText =
    document.getElementById("level");

const timeText =
    document.getElementById("time");

const highScoreText =
    document.getElementById("highScore");


// BUTTONS

const startButton =
    document.getElementById("startButton");

const pauseButton =
    document.getElementById("pauseButton");

const fullscreenButton =
    document.getElementById("fullscreenButton");

const exitFullscreenButton =
    document.getElementById(
        "exitFullscreenButton"
    );

const musicButton =
    document.getElementById("musicButton");

const leftButton =
    document.getElementById("leftButton");

const rightButton =
    document.getElementById("rightButton");


// SCREENS

const levelCompleteScreen =
    document.getElementById(
        "levelCompleteScreen"
    );

const gameOverScreen =
    document.getElementById(
        "gameOverScreen"
    );

const winScreen =
    document.getElementById("winScreen");


// LEVEL

const completedLevel =
    document.getElementById(
        "completedLevel"
    );

const levelMessage =
    document.getElementById(
        "levelMessage"
    );

const nextLevelButton =
    document.getElementById(
        "nextLevelButton"
    );


// GAME OVER

const finalScore =
    document.getElementById(
        "finalScore"
    );

const gameOverHighScore =
    document.getElementById(
        "gameOverHighScore"
    );

const restartButton =
    document.getElementById(
        "restartButton"
    );


// WIN

const winScore =
    document.getElementById(
        "winScore"
    );

const winHighScore =
    document.getElementById(
        "winHighScore"
    );

const winRestartButton =
    document.getElementById(
        "winRestartButton"
    );


// MUSIC

const backgroundMusic =
    document.getElementById(
        "backgroundMusic"
    );

const musicStatus =
    document.getElementById(
        "musicStatus"
    );

const powerStatus =
    document.getElementById(
        "powerStatus"
    );


// =========================================
// GAME SETTINGS
// =========================================

const NORMAL_SPEED = 150;

const BOOST_SPEED = 300;

const MAX_LEVEL = 10;

const START_LIVES = 5;

const START_TIME = 60;


// =========================================
// GAME STATE
// =========================================

let score = 0;

let coins = 0;

let lives = START_LIVES;

let level = 1;

let timeLeft = START_TIME;

let starsCaught = 0;

let gameRunning = false;

let gamePaused = false;

let leftPressed = false;

let rightPressed = false;

let playerX = 50;

let boostActive = false;

let boostTimeout = null;

let timerInterval = null;

let animationId = null;

let musicOn = true;


// OBJECT POSITIONS

let starX = 50;
let starY = -60;

let coinX = 30;
let coinY = -60;

let heartX = 70;
let heartY = -60;

let boostX = 50;
let boostY = -60;


// OBJECT SPEED

let starSpeed = 2.5;

let coinSpeed = 2.2;

let heartSpeed = 1.8;

let boostSpeed = 2;


// =========================================
// HIGH SCORE
// =========================================

let highScore =
    Number(
        localStorage.getItem(
            "littleStarHighScore"
        )
    ) || 0;

highScoreText.textContent =
    highScore;


// =========================================
// AUDIO
// =========================================

let audioContext = null;


function initAudio() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }
}


function sound(
    frequency,
    duration = 0.12,
    type = "sine"
) {

    try {

        initAudio();

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.type = type;

        oscillator.frequency.value =
            frequency;

        gain.gain.setValueAtTime(
            0.12,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime +
            duration
        );

        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime +
            duration
        );

    } catch (error) {

        console.log(
            "Sound unavailable"
        );

    }
}


function playStarSound() {

    sound(880, 0.12, "sine");

}


function playCoinSound() {

    sound(1200, 0.1, "square");

}


function playHeartSound() {

    sound(600, 0.2, "sine");

}


function playBoostSound() {

    sound(300, 0.25, "sawtooth");

}


// =========================================
// MUSIC
// =========================================

function startMusic() {

    if (!musicOn) return;

    try {

        backgroundMusic.volume = 0.35;

        const promise =
            backgroundMusic.play();

        if (promise) {

            promise.catch(() => {

                musicStatus.textContent =
                    "🎵 Click Start Game to play music";

            });

        }

    } catch (error) {

        console.log(
            "Music unavailable"
        );

    }
}


function stopMusic() {

    backgroundMusic.pause();

}


function toggleMusic() {

    musicOn = !musicOn;

    if (musicOn) {

        musicButton.textContent =
            "🔊 Music ON";

        if (gameRunning) {

            startMusic();

        }

    } else {

        musicButton.textContent =
            "🔇 Music OFF";

        stopMusic();

    }

}


// =========================================
// UI
// =========================================

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


// =========================================
// RESET
// =========================================

function resetGame() {

    score = 0;

    coins = 0;

    lives = START_LIVES;

    level = 1;

    timeLeft = START_TIME;

    starsCaught = 0;

    playerX = 50;

    boostActive = false;

    leftPressed = false;

    rightPressed = false;

    clearInterval(timerInterval);

    cancelAnimationFrame(
        animationId
    );

    clearTimeout(
        boostTimeout
    );

    star.style.display = "none";

    coin.style.display = "none";

    heart.style.display = "none";

    boost.style.display = "none";

    player.style.left =
        "50%";

    powerStatus.textContent =
        "";

    effectLayer.innerHTML =
        "";

    particles.innerHTML =
        "";

    updateUI();

}


// =========================================
// START GAME
// =========================================

function startGame() {

    resetGame();

    gameRunning = true;

    gamePaused = false;

    levelCompleteScreen.style.display =
        "none";

    gameOverScreen.style.display =
        "none";

    winScreen.style.display =
        "none";

    startButton.style.display =
        "none";

    pauseButton.style.display =
        "inline-block";

    pauseButton.textContent =
        "⏸️ Pause";

    initAudio();

    startMusic();

    startTimer();

    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// =========================================
// TIMER
// =========================================

function startTimer() {

    clearInterval(timerInterval);

    timerInterval =
        setInterval(() => {

            if (
                !gameRunning ||
                gamePaused
            ) {
                return;
            }

            timeLeft--;

            updateUI();

            if (timeLeft <= 0) {

                timeLeft = 0;

                updateUI();

                if (
                    starsCaught >=
                    starsNeeded()
                ) {

                    completeLevel();

                } else {

                    gameOver();

                }

            }

        }, 1000);

}


// =========================================
// LEVEL TARGET
// =========================================

function starsNeeded() {

    return level * 5;

}


// =========================================
// PLAYER MOVEMENT
// =========================================

function updatePlayer(delta) {

    if (
        !gameRunning ||
        gamePaused
    ) {
        return;
    }


    // ⭐ NORMAL = 150
    // ⚡ BOOST = 300

    const speed =
        boostActive
            ? BOOST_SPEED
            : NORMAL_SPEED;


    const movement =
        speed *
        delta /
        60;


    if (leftPressed) {

        playerX -= movement;

    }


    if (rightPressed) {

        playerX += movement;

    }


    playerX =
        Math.max(
            6,
            Math.min(
                94,
                playerX
            )
        );


    player.style.left =
        playerX + "%";

}


// =========================================
// RANDOM POSITION
// =========================================

function randomX() {

    return (
        8 +
        Math.random() * 84
    );

}


// =========================================
// SPAWN STAR
// =========================================

function spawnStar() {

    starX = randomX();

    starY = -60;

    starSpeed =
        2.5 +
        level * 0.25;

    star.style.left =
        starX + "%";

    star.style.top =
        starY + "px";

    star.style.display =
        "block";

}


// =========================================
// SPAWN COIN
// =========================================

function spawnCoin() {

    coinX = randomX();

    coinY = -60;

    coin.style.left =
        coinX + "%";

    coin.style.top =
        coinY + "px";

    coin.style.display =
        "block";

}


// =========================================
// SPAWN HEART
// =========================================

function spawnHeart() {

    heartX = randomX();

    heartY = -60;

    heart.style.left =
        heartX + "%";

    heart.style.top =
        heartY + "px";

    heart.style.display =
        "block";

}


// =========================================
// SPAWN BOOST
// =========================================

function spawnBoost() {

    boostX = randomX();

    boostY = -60;

    boost.style.left =
        boostX + "%";

    boost.style.top =
        boostY + "px";

    boost.style.display =
        "block";

}


// =========================================
// COLLISION
// =========================================

function isColliding(object) {

    const playerRect =
        player.getBoundingClientRect();

    const objectRect =
        object.getBoundingClientRect();


    return !(
        playerRect.right <
        objectRect.left +

        5 ||

        playerRect.left >
        objectRect.right -

        5 ||

        playerRect.bottom <
        objectRect.top +

        5 ||

        playerRect.top >
        objectRect.bottom -

        5
    );

}


// =========================================
// PARTICLES
// =========================================

function createParticles(
    x,
    y,
    emoji = "✨"
) {

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );

        particle.textContent =
            emoji;

        particle.style.position =
            "absolute";

        particle.style.left =
            x + "px";

        particle.style.top =
            y + "px";

        particle.style.fontSize =
            "20px";

        particle.style.pointerEvents =
            "none";

        particle.style.transition =
            "all 0.7s ease-out";

        particles.appendChild(
            particle
        );


        const angle =
            Math.random() *
            Math.PI * 2;

        const distance =
            40 +
            Math.random() * 50;


        requestAnimationFrame(() => {

            particle.style.transform =
                `translate(
                    ${Math.cos(angle) * distance}px,
                    ${Math.sin(angle) * distance}px
                )`;

            particle.style.opacity =
                "0";

        });


        setTimeout(() => {

            particle.remove();

        }, 750);

    }

}


// =========================================
// CATCH STAR
// =========================================

function catchStar() {

    score += 10;

    starsCaught++;

    playStarSound();

    createParticles(
        star.offsetLeft,
        star.offsetTop,
        "✨"
    );

    star.style.display =
        "none";

    updateUI();


    if (
        starsCaught >=
        starsNeeded()
    ) {

        completeLevel();

    }

}


// =========================================
// CATCH COIN
// =========================================

function catchCoin() {

    score += 5;

    coins++;

    playCoinSound();

    createParticles(
        coin.offsetLeft,
        coin.offsetTop,
        "🪙"
    );

    coin.style.display =
        "none";

    updateUI();

}


// =========================================
// CATCH HEART
// =========================================

function catchHeart() {

    if (lives < START_LIVES) {

        lives++;

    }

    playHeartSound();

    createParticles(
        heart.offsetLeft,
        heart.offsetTop,
        "❤️"
    );

    heart.style.display =
        "none";

    updateUI();

}


// =========================================
// CATCH BOOST
// =========================================

function catchBoost() {

    boostActive = true;

    playBoostSound();

    powerStatus.textContent =
        "⚡ SPEED BOOST ACTIVE!";

    boost.style.display =
        "none";


    clearTimeout(
        boostTimeout
    );


    boostTimeout =
        setTimeout(() => {

            boostActive = false;

            powerStatus.textContent =
                "";

        }, 6000);

}


// =========================================
// LEVEL COMPLETE CELEBRATION
// =========================================

function celebrationBlast() {

    effectLayer.innerHTML =
        "";


    const emojis = [
        "🎉",
        "🎊",
        "✨",
        "⭐",
        "💖",
        "🥳",
        "🌟",
        "🎈"
    ];


    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const emoji =
            document.createElement(
                "div"
            );

        emoji.className =
            "effect-emoji";

        emoji.textContent =
            emojis[
                Math.floor(
                    Math.random() *
                    emojis.length
                )
            ];


        const angle =
            Math.random() *
            Math.PI * 2;


        const distance =
            130 +
            Math.random() * 320;


        const x =
            Math.cos(angle) *
            distance;


        const y =
            Math.sin(angle) *
            distance;


        emoji.style.setProperty(
            "--x",
            `${x}px`
        );

        emoji.style.setProperty(
            "--y",
            `${y}px`
        );

        emoji.style.setProperty(
            "--rotate",
            `${Math.random() * 720 - 360}deg`
        );


        emoji.style.animationDelay =
            `${Math.random() * 0.25}s`;


        effectLayer.appendChild(
            emoji
        );

    }


    sound(
        900,
        0.15,
        "sine"
    );

    setTimeout(() => {

        sound(
            1200,
            0.25,
            "sine"
        );

    }, 150);


    setTimeout(() => {

        effectLayer.innerHTML =
            "";

    }, 1800);

}


// =========================================
// COMPLETE LEVEL
// =========================================

function completeLevel() {

    if (
        !gameRunning ||
        gamePaused
    ) {
        return;
    }


    gamePaused = true;

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


    if (
        level >= MAX_LEVEL
    ) {

        celebrationBlast();


        setTimeout(() => {

            winGame();

        }, 1300);


        return;

    }


    levelMessage.textContent =
        `Great job! ${starsNeeded()} stars collected. Get ready for Level ${level + 1}! ⭐`;


    celebrationBlast();


    setTimeout(() => {

        levelCompleteScreen.style.display =
            "flex";

    }, 900);

}


// =========================================
// NEXT LEVEL
// =========================================

function nextLevel() {

    if (
        level >= MAX_LEVEL
    ) {

        winGame();

        return;

    }


    level++;

    starsCaught = 0;

    timeLeft = START_TIME;

    gamePaused = false;


    levelCompleteScreen.style.display =
        "none";


    powerStatus.textContent =
        "";


    updateUI();


    startTimer();


    spawnStar();


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// =========================================
// BOMB BLAST
// =========================================

function bombBlast() {

    effectLayer.innerHTML =
        "";


    // 💣 BOMB

    const bomb =
        document.createElement(
            "div"
        );

    bomb.className =
        "bomb-effect";

    bomb.textContent =
        "💣";

    effectLayer.appendChild(
        bomb
    );


    // 💥 EXPLOSION

    setTimeout(() => {

        const flash =
            document.createElement(
                "div"
            );

        flash.className =
            "explosion-flash";

        effectLayer.appendChild(
            flash
        );


        const explosionEmojis = [
            "💥",
            "🔥",
            "💨",
            "⚡",
            "💣"
        ];


        for (
            let i = 0;
            i < 30;
            i++
        ) {

            const particle =
                document.createElement(
                    "div"
                );

            particle.className =
                "effect-emoji";

            particle.textContent =
                explosionEmojis[
                    Math.floor(
                        Math.random() *
                        explosionEmojis.length
                    )
                ];


            const angle =
                Math.random() *
                Math.PI * 2;


            const distance =
                120 +
                Math.random() * 320;


            particle.style.setProperty(
                "--x",
                `${Math.cos(angle) * distance}px`
            );

            particle.style.setProperty(
                "--y",
                `${Math.sin(angle) * distance}px`
            );

            particle.style.setProperty(
                "--rotate",
                `${Math.random() * 720 - 360}deg`
            );


            effectLayer.appendChild(
                particle
            );

        }


        sound(
            100,
            0.5,
            "sawtooth"
        );


        const gameOverText =
            document.createElement(
                "div"
            );

        gameOverText.className =
            "game-over-effect-text";

        gameOverText.textContent =
            "💥 GAME OVER! 💥";

        effectLayer.appendChild(
            gameOverText
        );


    }, 700);


    setTimeout(() => {

        effectLayer.innerHTML =
            "";

    }, 2300);

}


// =========================================
// GAME OVER
// =========================================

function gameOver() {

    if (!gameRunning) {
        return;
    }


    gameRunning = false;

    gamePaused = true;


    clearInterval(
        timerInterval
    );

    cancelAnimationFrame(
        animationId
    );


    stopMusic();


    star.style.display =
        "none";

    coin.style.display =
        "none";

    heart.style.display =
        "none";

    boost.style.display =
        "none";


    finalScore.textContent =
        score;

    gameOverHighScore.textContent =
        highScore;


    bombBlast();


    // Show Game Over after bomb blast starts

    setTimeout(() => {

        gameOverScreen.style.display =
            "flex";

    }, 850);

}


// =========================================
// WIN
// =========================================

function winGame() {

    gameRunning = false;

    gamePaused = true;


    clearInterval(
        timerInterval
    );

    cancelAnimationFrame(
        animationId
    );


    stopMusic();


    levelCompleteScreen.style.display =
        "none";


    winScore.textContent =
        score;

    winHighScore.textContent =
        highScore;


    setTimeout(() => {

        winScreen.style.display =
            "flex";

    }, 200);

}


// =========================================
// HIGH SCORE
// =========================================

function saveHighScore() {

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

        highScoreText.textContent =
            highScore;

    }

}


// =========================================
// PAUSE
// =========================================

function togglePause() {

    if (!gameRunning) {
        return;
    }


    gamePaused =
        !gamePaused;


    if (gamePaused) {

        pauseButton.textContent =
            "▶️ Resume";

        stopMusic();

    } else {

        pauseButton.textContent =
            "⏸️ Pause";

        startMusic();

        animationId =
            requestAnimationFrame(
                gameLoop
            );

    }

}


// =========================================
// GAME LOOP
// =========================================

let lastTime = 0;

let lastCoinSpawn = 0;

let lastHeartSpawn = 0;

let lastBoostSpawn = 0;


function gameLoop(timestamp) {

    if (!gameRunning) {
        return;
    }


    if (gamePaused) {
        return;
    }


    const delta =
        lastTime
            ? (timestamp - lastTime) / 16.67
            : 1;


    lastTime =
        timestamp;


    updatePlayer(delta);


    // STAR

    if (
        star.style.display !==
        "block"
    ) {

        spawnStar();

    }


    starY +=
        starSpeed *
        delta;


    star.style.top =
        starY + "px";


    if (
        isColliding(star)
    ) {

        catchStar();

    } else if (
        starY >
        gameArea.clientHeight + 50
    ) {

        star.style.display =
            "none";

        lives--;

        score =
            Math.max(
                0,
                score - 2
            );


        updateUI();


        if (lives <= 0) {

            gameOver();

            return;

        }

    }


    // COIN

    if (
        timestamp -
        lastCoinSpawn >
        4500 &&
        coin.style.display !==
        "block"
    ) {

        spawnCoin();

        lastCoinSpawn =
            timestamp;

    }


    if (
        coin.style.display ===
        "block"
    ) {

        coinY +=
            coinSpeed *
            delta;

        coin.style.top =
            coinY + "px";


        if (
            isColliding(coin)
        ) {

            catchCoin();

        } else if (
            coinY >
            gameArea.clientHeight + 50
        ) {

            coin.style.display =
                "none";

        }

    }


    // HEART

    if (
        timestamp -
        lastHeartSpawn >
        9000 &&
        heart.style.display !==
        "block"
    ) {

        spawnHeart();

        lastHeartSpawn =
            timestamp;

    }


    if (
        heart.style.display ===
        "block"
    ) {

        heartY +=
            heartSpeed *
            delta;

        heart.style.top =
            heartY + "px";


        if (
            isColliding(heart)
        ) {

            catchHeart();

        } else if (
            heartY >
            gameArea.clientHeight + 50
        ) {

            heart.style.display =
                "none";

        }

    }


    // BOOST

    if (
        timestamp -
        lastBoostSpawn >
        12000 &&
        boost.style.display !==
        "block"
    ) {

        spawnBoost();

        lastBoostSpawn =
            timestamp;

    }


    if (
        boost.style.display ===
        "block"
    ) {

        boostY +=
            boostSpeed *
            delta;

        boost.style.top =
            boostY + "px";


        if (
            isColliding(boost)
        ) {

            catchBoost();

        } else if (
            boostY >
            gameArea.clientHeight + 50
        ) {

            boost.style.display =
                "none";

        }

    }


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// =========================================
// KEYBOARD
// =========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "ArrowLeft" ||
            event.key.toLowerCase() ===
            "a"
        ) {

            leftPressed = true;

            event.preventDefault();

        }


        if (
            event.key ===
            "ArrowRight" ||
            event.key.toLowerCase() ===
            "d"
        ) {

            rightPressed = true;

            event.preventDefault();

        }


        if (
            event.key ===
            " "
        ) {

            if (gameRunning) {

                togglePause();

            }

            event.preventDefault();

        }

    }
);


document.addEventListener(
    "keyup",
    (event) => {

        if (
            event.key ===
            "ArrowLeft" ||
            event.key.toLowerCase() ===
            "a"
        ) {

            leftPressed = false;

        }


        if (
            event.key ===
            "ArrowRight" ||
            event.key.toLowerCase() ===
            "d"
        ) {

            rightPressed = false;

        }

    }
);


// =========================================
// MOBILE BUTTONS
// =========================================

function holdButton(
    button,
    direction
) {

    button.addEventListener(
        "pointerdown",
        (event) => {

            event.preventDefault();

            if (
                direction ===
                "left"
            ) {

                leftPressed = true;

            } else {

                rightPressed = true;

            }

        }
    );


    button.addEventListener(
        "pointerup",
        () => {

            if (
                direction ===
                "left"
            ) {

                leftPressed = false;

            } else {

                rightPressed = false;

            }

        }
    );


    button.addEventListener(
        "pointerleave",
        () => {

            if (
                direction ===
                "left"
            ) {

                leftPressed = false;

            } else {

                rightPressed = false;

            }

        }
    );


    button.addEventListener(
        "pointercancel",
        () => {

            if (
                direction ===
                "left"
            ) {

                leftPressed = false;

            } else {

                rightPressed = false;

            }

        }
    );

}


holdButton(
    leftButton,
    "left"
);

holdButton(
    rightButton,
    "right"
);


// =========================================
// BUTTON EVENTS
// =========================================

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
    startGame
);


winRestartButton.addEventListener(
    "click",
    startGame
);


// =========================================
// FULLSCREEN
// =========================================

async function enterFullscreen() {

    try {

        if (
            !document.fullscreenElement
        ) {

            await gameArea.requestFullscreen();

        }

    } catch (error) {

        console.log(
            "Fullscreen unavailable"
        );

    }

}


async function exitFullscreen() {

    try {

        if (
            document.fullscreenElement
        ) {

            await document.exitFullscreen();

        }

    } catch (error) {

        console.log(
            "Exit fullscreen unavailable"
        );

    }

}


fullscreenButton.addEventListener(
    "click",
    enterFullscreen
);


exitFullscreenButton.addEventListener(
    "click",
    exitFullscreen
);


// =========================================
// FULLSCREEN BUTTON TEXT
// =========================================

document.addEventListener(
    "fullscreenchange",
    () => {

        if (
            document.fullscreenElement
        ) {

            fullscreenButton.textContent =
                "⛶ Fullscreen ON";

        } else {

            fullscreenButton.textContent =
                "⛶ Fullscreen";

        }

    }
);


// =========================================
// INITIALIZE
// =========================================

levelCompleteScreen.style.display =
    "none";

gameOverScreen.style.display =
    "none";

winScreen.style.display =
    "none";

star.style.display =
    "none";

coin.style.display =
    "none";

heart.style.display =
    "none";

boost.style.display =
    "none";

updateUI();