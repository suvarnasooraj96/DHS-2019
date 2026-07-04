// ==========================================================================
// Application State Trackers & Data Registry
// ==========================================================================
let quizData = []; // Will be populated dynamically from the JSON file
let currentQuestionIndex = 0;
let score = 0;

// ==========================================================================
// DOM Elements Caching
// ==========================================================================
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const counterEl = document.getElementById('question-counter');
const progressEl = document.getElementById('progress');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const explanationContainer = document.getElementById('explanation-container');
const explanationTextEl = document.getElementById('explanation-text');
const nextBtn = document.getElementById('next-btn');
const finalScoreEl = document.getElementById('final-score');
const finalFeedbackEl = document.getElementById('final-feedback');

// ==========================================================================
// Core Data Fetcher
// ==========================================================================
/**
 * Fetches quiz data from external JSON file and initializes the application
 */
async function initializeQuiz() {
    try {
        // Fetches the data file asynchronously
        const response = await fetch('quiz-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        quizData = await response.json();
        
        // Start the quiz once data is safely loaded
        loadQuestion();
    } catch (error) {
        console.error("Failed to load quiz data:", error);
        questionTextEl.textContent = "Error loading quiz data. Please ensure quiz-data.json is present.";
    }
}

// ==========================================================================
// Core Render & Workflow Engines
// ==========================================================================

/**
 * Loads the current question details into view layouts
 */
function loadQuestion() {
    if (quizData.length === 0) return;

    // Hide contextual elements and empty grid items
    explanationContainer.style.display = 'none';
    nextBtn.style.display = 'none';
    optionsContainer.innerHTML = '';

    const currentData = quizData[currentQuestionIndex];
    
    // Update live layout parameters
    counterEl.textContent = `Question ${currentQuestionIndex + 1}/${quizData.length}`;
    progressEl.style.width = `${(currentQuestionIndex / quizData.length) * 100}%`;
    questionTextEl.textContent = currentData.question;

    // Populates choices layout
    currentData.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => selectOption(button, option);
        optionsContainer.appendChild(button);
    });
}

/**
 * Validates selected answer and displays visual response patterns
 */
function selectOption(selectedBtn, selectedValue) {
    const currentData = quizData[currentQuestionIndex];
    const allButtons = optionsContainer.querySelectorAll('.option-btn');

    // Freeze interactive mechanics to avoid multi-selection
    allButtons.forEach(btn => btn.disabled = true);

    if (selectedValue === currentData.answer) {
        selectedBtn.classList.add('correct');
        score++;
    } else {
        selectedBtn.classList.add('incorrect');
        // Auto-locate correct element target for visual disclosure
        allButtons.forEach(btn => {
            if (btn.textContent === currentData.answer) {
                btn.classList.add('correct');
            }
        });
    }

    // Reveal question parameter explanations
    explanationTextEl.textContent = currentData.explanation;
    explanationContainer.style.display = 'block';

    // Discloses step advance action control
    nextBtn.style.display = 'inline-block';
}

/**
 * Steps app layout pointer forwards or finishes session workflow
 */
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

/**
 * Toggles interface layers and outputs aggregated metrics
 */
function showResults() {
    quizScreen.style.display = 'none';
    resultsScreen.style.display = 'block';
    progressEl.style.width = '100%';
    
    finalScoreEl.innerHTML = `${score} <span>/ ${quizData.length}</span>`;
    
    const percentage = (score / quizData.length) * 100;
    let feedback = '';

    if (percentage >= 90) {
        feedback = `Outstanding! You scored ${percentage.toFixed(1)}%. You possess an exceptional grasp of medical terminology and pharmacological rules.`;
    } else if (percentage >= 70) {
        feedback = `Great job! You scored ${percentage.toFixed(1)}%. Solid performance with standard theoretical and applied structures.`;
    } else if (percentage >= 50) {
        feedback = `Passed. You scored ${percentage.toFixed(1)}%. Reviewing the detailed rationales and explanations will help solidify your knowledge.`;
    } else {
        feedback = `You scored ${percentage.toFixed(1)}%. Don't worry! Go back over the explanations and try running through the dynamic registry cards again.`;
    }
    
    finalFeedbackEl.textContent = feedback;
}

/**
 * Flushes active variable registers to default configurations
 */
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    resultsScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    loadQuestion();
}

// ==========================================================================
// Document Initialization Link
// ==========================================================================
window.onload = () => {
    initializeQuiz(); // Call the fetch function instead of directly loading questions
};