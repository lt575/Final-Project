const timeInput = document.getElementById('timeInput');
const startTimerButton = document.getElementById('startTimer');
const pauseTimerButton = document.getElementById('pauseTimer');
const resetTimerButton = document.getElementById('resetTimer');
const displayTimer = document.getElementById('displayTimer');

let countdownInterval;
let timeRemaining = 0;
let isStopped = false;

function updateDisplay() {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    displayTimer.textContent = `Time: ${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer(duration) {
    if (timeRemaining <= 0) {
        timeRemaining = duration;
    }

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        if (!isStopped && timeRemaining > 0) {
            timeRemaining--;
            updateDisplay();
        }

        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            displayTimer.textContent = 'Time Up!';
            alert('Time is up!');
        }
    }, 1000);
}

startTimerButton.addEventListener('click', () => {
    const parts = timeInput.value.split(':');
    if (parts.length === 2) {
        const hours = parseInt(parts[0]) || 0;
        const minutes = parseInt(parts[1]) || 0;

        if (hours >= 0 && minutes >= 0 && minutes < 60) {
            const secondsDuration = hours * 3600 + minutes * 60;
            startTimer(secondsDuration);
            isStopped = false;
            startTimerButton.disabled = true;
            pauseTimerButton.disabled = false;
            resetTimerButton.disabled = false;
        } else {
            alert('Enter time in format HH:MM.');
        }
    } else {
        alert('Enter valid time.');
    }
});

pauseTimerButton.addEventListener('click', () => {
    isStopped = !isStopped; // Toggle pause state
    pauseTimerButton.textContent = isStopped ? 'Resume' : 'Pause';
});

resetTimerButton.addEventListener('click', () => {
    clearInterval(countdownInterval);
    timeRemaining = 0;
    updateDisplay();
    timeInput.value = '';
    startTimerButton.disabled = false;
    pauseTimerButton.disabled = true;
    resetTimerButton.disabled = true;
    displayTimer.textContent = 'Time: 0:00:00';
});
