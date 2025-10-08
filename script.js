// Improved JS: Added timer, high score, error handling, progress updates, better UX, and animation.
// QUIZ DATA SECTION
const quizData = [
    {
        question: "What does 'let' declare in JavaScript?",
        options: ["A constant value", "A changeable variable", "A function", "An array"],
        correct: 1
    },
    {
        question: "Which is the strict equality operator?",
        options: ["==", "=", "===", "!="],
        correct: 2
    },
    {
        question: "What is the purpose of a for loop?",
        options: ["To declare variables", "To repeat code a set number of times", "To handle events", "To style elements"],
        correct: 1
    },
    {
        question: "How do you select an element by ID in the DOM?",
        options: ["querySelector", "getElementById", "createElement", "appendChild"],
        correct: 1
    },
    {
        question: "What does DOM stand for?",
        options: ["Document Object Model", "Data Object Manager", "Display Output Machine", "Digital Object Method"],
        correct: 0
    },
    {
        question: "Which keyword defines a constant in JavaScript?",
        options: ["var", "let", "const", "define"],
        correct: 2
    }

    // You can add more questions below (use commas between objects)
];

// Global Variables
let currentQuestion = 0;
let score = 0;
let totalQuestions = quizData.length;
let selectedAnswer = -1;
let timerInterval; // For per-question timer
let timeLeft = 30; // 30 seconds per question
let highScore = localStorage.getItem('jsQuizHighScore') || 0;

// Utility: Update progress bar
// Progress Bar Function
function updateProgress() {
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('current-q').textContent = currentQuestion + 1;
    document.getElementById('total-q').textContent = totalQuestions;
}

// Extension: Start timer for each question
// Timer Functions
function startTimer() {
    timeLeft = 30;
    document.getElementById('timer-container').style.display = 'block';
    document.getElementById('timer-text').textContent = timeLeft;
    document.getElementById('timer-fill').style.width = '100%';
    // countdown every 1 second
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-text').textContent = timeLeft;
        document.getElementById('timer-fill').style.width = (timeLeft / 30 * 100) + '%';
        // when timer reaches zero
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            nextQuestion(); // Auto-advance on timeout
        }
    }, 1000);
}
// Extension: Clear timer
// Stop and Hide Timer
function clearTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        document.getElementById('timer-container').style.display = 'none';
    }
}

// Load Question Function
function loadQuestion() {
    try {
        const q = quizData[currentQuestion];
        if (!q) throw new Error('No question data');

        document.getElementById('question').textContent = q.question;
        const optionsDiv = document.getElementById('options');
        optionsDiv.innerHTML = '';
        // Creates a Button for each Option
        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.textContent = option;
            btn.classList.add('option');
            btn.setAttribute('aria-label', `Option: ${option}`);
            btn.onclick = () => selectOption(index);
            optionsDiv.appendChild(btn);
        });

        document.getElementById('next-btn').style.display = 'none';
        updateProgress();
        startTimer(); // Extension: Timer Starts
    } catch (error) {
        console.error('Error loading question:', error);
        document.getElementById('question').innerHTML = '<p style="color: red;">Error loading question. Check console.</p>';
    }
}

// Select Option Function
function selectOption(index) {
    if (selectedAnswer !== -1) return; // Prevent Multiple Selections
    selectedAnswer = index;
    clearTimer(); // Stop Timer on Answer

    const options = document.querySelectorAll('.option');
    options.forEach((opt, i) => {
        opt.disabled = true; // Disable buttons after answer
        opt.classList.remove('correct', 'incorrect');
        // Mark Correct Answer Green, Wrong Red
        if (i === quizData[currentQuestion].correct) {
            opt.classList.add('correct');
        } else if (i === index && index !== quizData[currentQuestion].correct) {
            opt.classList.add('incorrect');
        }
    });
    // Show the "NEXT" Button After Answer
    document.getElementById('next-btn').style.display = 'block';
}

// Next Question Function
function nextQuestion() {
    if (selectedAnswer === quizData[currentQuestion].correct) {
        score++;
    }

    currentQuestion++;
    selectedAnswer = -1;
    // load next question or show results
    if (currentQuestion < totalQuestions) {
        loadQuestion();
    } else {
        showScore();
    }
}

// Show Score Function
function showScore() {
    clearTimer();
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('score-container').style.display = 'block';

    const percentage = Math.round((score / totalQuestions) * 100);
    document.getElementById('score-circle-text').textContent = score;
    document.getElementById('total-score').textContent = totalQuestions;

    // Feedback Text Based on Score
    let feedback = '';
    if (percentage >= 80) feedback = "Outstanding! You're a JavaScript wizard. 🌟";
    else if (percentage >= 60) feedback = "Well done! Keep practicing those concepts. 👍";
    else feedback = "Good start—dive back into the lecture notes for a refresh. 📚";

    document.getElementById('feedback').textContent = feedback;

    // Extension: High score
    // Saves New High Score if Achieved
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('jsQuizHighScore', highScore);
    }

    // Show High Score
    document.getElementById('high-score').style.display = 'block';
    document.getElementById('high-score-val').textContent = highScore;
}

// Restart Quiz Function
function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = -1;
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('score-container').style.display = 'none';
    document.getElementById('high-score').style.display = 'none';
    loadQuestion();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadQuestion);

// Add keyboard shortcut: Press Enter to go to next question (only during quiz)
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const scoreContainer = document.getElementById('score-container');
        const questionContainer = document.getElementById('question-container');
        const nextBtn = document.getElementById('next-btn');

        // Only work if we're still inside the quiz section
        if (questionContainer.style.display !== 'none' && nextBtn.style.display === 'block') {
            nextQuestion();
        }
    }
});

