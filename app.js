class FlashcardApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.questionScores = {};
        this.totalCorrect = 0;
        this.totalIncorrect = 0;
        this.currentQuestion = null;
        this.selectedAnswer = null;
        
        this.initializeEventListeners();
        this.loadFlashcardsJSON();
    }

    initializeEventListeners() {
        document.getElementById('next-question').addEventListener('click', this.nextQuestion.bind(this));
        document.getElementById('restart').addEventListener('click', this.restart.bind(this));
        document.getElementById('try-sample').addEventListener('click', this.startWithSampleQuestions.bind(this));
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.questions && Array.isArray(data.questions)) {
                    this.loadQuestions(data.questions);
                    this.startQuiz();
                } else {
                    alert('Invalid JSON format. Please ensure your file has a "questions" array.');
                }
            } catch (error) {
                alert('Error reading JSON file. Please check the format.');
            }
        };
        reader.readAsText(file);
    }

    startWithSampleQuestions() {
        const sampleQuestions = [
            {
                "id": 1,
                "question": "When you approach a railroad crossing without flashing warning signals or crossing gates, you should:",
                "options": {
                    "a": "cross the tracks as quickly as possible.",
                    "b": "always stop.",
                    "c": "yield to all trains at the crossing.",
                    "d": "speed up to beat the train."
                },
                "correct_answer": "c",
                "explanation": "You must yield to all trains at the crossing because trains cannot stop quickly and have the right-of-way at all railroad crossings, regardless of warning signals or gates."
            },
            {
                "id": 2,
                "question": "What should you do when approaching a yellow traffic light?",
                "options": {
                    "a": "Speed up to get through the intersection.",
                    "b": "Stop if you can do so safely.",
                    "c": "Always stop immediately.",
                    "d": "Continue at the same speed."
                },
                "correct_answer": "b",
                "explanation": "A yellow light means the signal is about to change to red. You should stop if you can do so safely, but if you're too close to the intersection, you may proceed with caution."
            },
            {
                "id": 3,
                "question": "The maximum speed limit in a school zone is usually:",
                "options": {
                    "a": "15 mph",
                    "b": "20 mph",
                    "c": "25 mph",
                    "d": "30 mph"
                },
                "correct_answer": "c",
                "explanation": "Most school zones have a maximum speed limit of 25 mph when children are present or during school hours to ensure the safety of students."
            }
        ];
        
        this.loadQuestions(sampleQuestions);
        this.startQuiz();
    }

    loadQuestions(questions) {
        this.questions = questions;
        this.initializeScores();
        this.saveProgress();
    }

    initializeScores() {
        this.questionScores = {};
        this.questions.forEach(q => {
            this.questionScores[q.id] = {
                correct: 0,
                incorrect: 0,
                mastered: false
            };
        });
    }

    startQuiz() {
        this.showScreen('question-screen');
        this.updateStats();
        this.nextQuestion();
    }

    getAvailableQuestions() {
        return this.questions.filter(q => !this.questionScores[q.id].mastered);
    }

    nextQuestion() {
        const availableQuestions = this.getAvailableQuestions();
        
        if (availableQuestions.length === 0) {
            this.showCompletionScreen();
            return;
        }

        // Select a random question from available ones
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        this.currentQuestion = availableQuestions[randomIndex];
        this.selectedAnswer = null;
        
        this.displayQuestion();
        this.updateStats();
        this.showScreen('question-screen');
    }

    displayQuestion() {
        document.getElementById('current-question-id').textContent = this.currentQuestion.id;
        document.getElementById('question-text').textContent = this.currentQuestion.question;
        
        // Hide result elements for new question
        document.getElementById('inline-result').style.display = 'none';
        document.getElementById('next-question').style.display = 'none';
        
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';
        
        Object.entries(this.currentQuestion.options).forEach(([key, value]) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.textContent = `${key.toUpperCase()}) ${value}`;
            optionDiv.addEventListener('click', () => this.selectAnswer(key, optionDiv));
            optionsContainer.appendChild(optionDiv);
        });
    }

    selectAnswer(answer, optionElement) {
        if (this.selectedAnswer) return; // Prevent multiple selections
        
        this.selectedAnswer = answer;
        const isCorrect = answer === this.currentQuestion.correct_answer;
        
        // Update scores
        if (isCorrect) {
            this.questionScores[this.currentQuestion.id].correct++;
            this.totalCorrect++;
        } else {
            this.questionScores[this.currentQuestion.id].incorrect++;
            this.totalIncorrect++;
        }
        
        // Check if question is mastered (correct >= incorrect + 2)
        const score = this.questionScores[this.currentQuestion.id];
        if (score.correct >= score.incorrect + 2) {
            score.mastered = true;
        }
        
        // Show correct/incorrect styling
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.classList.add('disabled');
            const optionLetter = option.textContent.charAt(0).toLowerCase();
            if (optionLetter === this.currentQuestion.correct_answer) {
                option.classList.add('correct');
            } else if (optionLetter === answer && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
        
        // Show result immediately on same screen
        this.showInlineResult(isCorrect);
        this.updateStats();
        this.saveProgress();
    }

    showInlineResult(isCorrect) {
        const resultContainer = document.getElementById('inline-result');
        const resultStatus = document.getElementById('inline-result-status');
        const resultExplanation = document.getElementById('inline-result-explanation');
        const questionScoreDisplay = document.getElementById('inline-question-score');
        const nextButton = document.getElementById('next-question');
        
        resultStatus.textContent = isCorrect ? '✅ Correct!' : '❌ Incorrect';
        resultStatus.className = `result-status ${isCorrect ? 'correct' : 'incorrect'}`;
        
        if (this.currentQuestion.explanation) {
            resultExplanation.textContent = this.currentQuestion.explanation;
            resultExplanation.style.display = 'block';
        } else {
            resultExplanation.style.display = 'none';
        }
        
        const score = this.questionScores[this.currentQuestion.id];
        questionScoreDisplay.textContent = `${score.correct} correct, ${score.incorrect} incorrect`;
        if (score.mastered) {
            questionScoreDisplay.textContent += ' - Mastered! 🎉';
        }
        
        resultContainer.style.display = 'block';
        nextButton.style.display = 'block';
    }

    showCompletionScreen() {
        document.getElementById('final-correct').textContent = this.totalCorrect;
        document.getElementById('final-incorrect').textContent = this.totalIncorrect;
        
        const accuracy = this.totalCorrect + this.totalIncorrect > 0 
            ? Math.round((this.totalCorrect / (this.totalCorrect + this.totalIncorrect)) * 100)
            : 0;
        document.getElementById('final-accuracy').textContent = accuracy;
        
        this.showScreen('complete-screen');
    }

    updateStats() {
        const remaining = this.getAvailableQuestions().length;
        document.getElementById('questions-remaining').textContent = remaining;
        document.getElementById('correct-count').textContent = this.totalCorrect;
        document.getElementById('incorrect-count').textContent = this.totalIncorrect;
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    restart() {
        this.currentQuestionIndex = 0;
        this.selectedAnswer = null;
        this.totalCorrect = 0;
        this.totalIncorrect = 0;
        this.clearProgress();
        this.loadFlashcardsJSON();
    }

    saveProgress() {
        const progress = {
            questionScores: this.questionScores,
            totalCorrect: this.totalCorrect,
            totalIncorrect: this.totalIncorrect,
            questions: this.questions
        };
        localStorage.setItem('dmv-flashcards-progress', JSON.stringify(progress));
    }

    async loadFlashcardsJSON() {
        try {
            const response = await fetch('complete_flashcards.json');
            if (!response.ok) {
                throw new Error('Could not load complete_flashcards.json');
            }
            const data = await response.json();
            
            if (data.questions && Array.isArray(data.questions)) {
                // Try to load saved progress first
                const saved = localStorage.getItem('dmv-flashcards-progress');
                if (saved) {
                    try {
                        const progress = JSON.parse(saved);
                        if (progress.questions && progress.questions.length === data.questions.length) {
                            // Resume with saved progress
                            this.questions = data.questions; // Use fresh question data
                            this.questionScores = progress.questionScores || {};
                            this.totalCorrect = progress.totalCorrect || 0;
                            this.totalIncorrect = progress.totalIncorrect || 0;
                            
                            if (this.getAvailableQuestions().length > 0) {
                                this.startQuiz();
                                return;
                            } else {
                                this.showCompletionScreen();
                                return;
                            }
                        }
                    } catch (error) {
                        console.log('Could not load saved progress:', error);
                    }
                }
                
                // Start fresh with loaded questions
                this.loadQuestions(data.questions);
                this.startQuiz();
            } else {
                throw new Error('Invalid JSON format');
            }
        } catch (error) {
            console.error('Error loading flashcards.json:', error);
            this.showLoadError(error.message);
        }
    }

    showLoadError(errorMessage) {
        document.getElementById('error-message').textContent = `Error: ${errorMessage}`;
        this.showScreen('error-screen');
    }

    clearProgress() {
        localStorage.removeItem('dmv-flashcards-progress');
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FlashcardApp();
});