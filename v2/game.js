// Game elements
const mirrorNumber = document.getElementById('mirrorNumber');
const scoreValue = document.getElementById('scoreValue');
const timer = document.getElementById('timer');
const feedback = document.getElementById('feedback');
const buttons = document.querySelectorAll('.num-btn');
const rulesPopup = document.getElementById('rulesPopup');
const startGameBtn = document.getElementById('startGame');

// Game state
let gameStarted = false;
let score = 0;
let currentNumber = null;
let timerInterval = null;
let timeLeft = 0;
let canPlay = true;
let combo = 0;
let baseTime = 2;
let difficulty = 1;

// Generate random number (1-9)
function generateNumber() {
    return Math.floor(Math.random() * 9) + 1;
}

// Update score
function updateScore(points) {
    const comboBonus = Math.floor(combo / 3); // Every 3 correct answers increase bonus
    const totalPoints = points + (comboBonus * 5);
    score += totalPoints;
    scoreValue.textContent = score;
    
    // Increase difficulty every 50 points
    difficulty = 1 + Math.floor(score / 50) * 0.1;
    baseTime = Math.max(0.8, 2 - (difficulty - 1)); // Minimum 0.8 seconds
}

// Start timer
function startTimer() {
    timeLeft = baseTime;
    timer.textContent = `${timeLeft.toFixed(1)}s`;
    timer.style.color = '#e74c3c';
    
    timerInterval = setInterval(() => {
        timeLeft -= 0.1;
        const percentage = (timeLeft / baseTime) * 100;
        timer.textContent = `${timeLeft.toFixed(1)}s`;
        
        // Visual feedback through color
        if (percentage > 66) {
            timer.style.color = '#2ecc71';
        } else if (percentage > 33) {
            timer.style.color = '#f1c40f';
        } else {
            timer.style.color = '#e74c3c';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timer.textContent = 'Time\'s up!';
            timer.style.color = '#e74c3c';
            showFeedback(false);
            canPlay = false;
            setTimeout(startNewRound, 1000);
        }
    }, 100);
}

// Start new round
function startNewRound() {
    clearInterval(timerInterval);
    canPlay = true;
    currentNumber = generateNumber();
    mirrorNumber.textContent = currentNumber;
    startTimer();
}

// Handle button clicks
buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (!canPlay) return;
        
        const clickedNumber = parseInt(button.dataset.number);
        clearInterval(timerInterval);
        
        if (clickedNumber === currentNumber) {
            updateScore(10);
            showFeedback(true);
        } else {
            showFeedback(false);
        }
        
        canPlay = false;
        setTimeout(startNewRound, 1000);
    });
});

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (!canPlay) return;
    
    const key = e.key;
    if (/^[1-9]$/.test(key)) {
        const number = parseInt(key);
        clearInterval(timerInterval);
        
        if (number === currentNumber) {
            updateScore(10);
            showFeedback(true);
        } else {
            showFeedback(false);
        }
        
        canPlay = false;
        setTimeout(startNewRound, 1000);
    }
});

// Create firework effect
function createFirework(x, y) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = x + 'px';
    firework.style.top = y + 'px';
    document.body.appendChild(firework);
    
    // Remove the firework element after animation
    setTimeout(() => {
        document.body.removeChild(firework);
    }, 1000);
}

// Show multiple fireworks
function showFireworks(count = 3) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createFirework(x, y);
        }, i * 200);
    }
}

// Update showFeedback function to include fireworks
function showFeedback(isCorrect) {
    if (isCorrect) {
        combo++;
        const comboText = combo > 1 ? ` Combo x${combo}!` : '!';
        feedback.textContent = `Correct! +${10 + Math.floor(combo / 3) * 5} points${comboText}`;
        feedback.className = 'correct';
        showFireworks();
    } else {
        combo = 0;
        feedback.textContent = 'Wrong!';
        feedback.className = 'incorrect';
    }
    setTimeout(() => {
        feedback.textContent = '';
        feedback.className = '';
    }, 1000);
}

// Initialize game
function initGame() {
    rulesPopup.style.display = 'none';
    gameStarted = true;
    startNewRound();
}

// Event listener for start button
startGameBtn.addEventListener('click', initGame);

// Clear existing event listeners and add new ones
buttons.forEach(button => {
    button.onclick = null;
    button.addEventListener('click', () => {
        if (!gameStarted || !canPlay) return;
        
        const clickedNumber = parseInt(button.dataset.number);
        clearInterval(timerInterval);
        
        if (clickedNumber === currentNumber) {
            updateScore(10);
            showFeedback(true);
        } else {
            showFeedback(false);
        }
        
        canPlay = false;
        setTimeout(startNewRound, 1000);
    });
});

// Update keyboard event listener
const keydownHandler = (e) => {
    if (!gameStarted || !canPlay) return;
    
    const key = e.key;
    if (/^[1-9]$/.test(key)) {
        const number = parseInt(key);
        clearInterval(timerInterval);
        
        if (number === currentNumber) {
            updateScore(10);
            showFeedback(true);
        } else {
            showFeedback(false);
        }
        
        canPlay = false;
        setTimeout(startNewRound, 1000);
    }
};

document.addEventListener('keydown', keydownHandler);
