// Game elements
const mirrorNumber = document.getElementById('mirrorNumber');
const scoreValue = document.getElementById('scoreValue');
const timer = document.getElementById('timer');
const feedback = document.getElementById('feedback');
const buttons = document.querySelectorAll('.num-btn');

// Game state
let score = 0;
let currentNumber = null;
let timerInterval = null;
let timeLeft = 0;
let canPlay = true;

// Generate random number (1-9)
function generateNumber() {
    return Math.floor(Math.random() * 9) + 1;
}

// Update score
function updateScore(points) {
    score += points;
    scoreValue.textContent = score;
}

// Show feedback
function showFeedback(isCorrect) {
    feedback.textContent = isCorrect ? 'Correct!' : 'Wrong!';
    feedback.className = isCorrect ? 'correct' : 'incorrect';
    setTimeout(() => {
        feedback.textContent = '';
        feedback.className = '';
    }, 1000);
}

// Start timer
function startTimer() {
    timeLeft = 2;
    timer.textContent = `${timeLeft}s`;
    
    timerInterval = setInterval(() => {
        timeLeft -= 0.1;
        timer.textContent = `${timeLeft.toFixed(1)}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timer.textContent = 'Time\'s up!';
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

// Start the game
startNewRound();
