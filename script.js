// script.js

// Flashcard system
class Flashcard {
    constructor(question, answer) {
        this.question = question;
        this.answer = answer;
    }
}

class FlashcardManager {
    constructor() {
        this.flashcards = this.loadFlashcards();
    }

    loadFlashcards() {
        const flashcards = localStorage.getItem('flashcards');
        return flashcards ? JSON.parse(flashcards) : [];
    }

    saveFlashcards() {
        localStorage.setItem('flashcards', JSON.stringify(this.flashcards));
    }

    addFlashcard(question, answer) {
        const newFlashcard = new Flashcard(question, answer);
        this.flashcards.push(newFlashcard);
        this.saveFlashcards();
    }

    getFlashcards() {
        return this.flashcards;
    }

    deleteFlashcard(index) {
        this.flashcards.splice(index, 1);
        this.saveFlashcards();
    }
}

// Quiz system
class Quiz {
    constructor(flashcards) {
        this.flashcards = flashcards;
        this.currentQuestionIndex = 0;
        this.score = 0;
    }

    getNextQuestion() {
        if (this.currentQuestionIndex < this.flashcards.length) {
            return this.flashcards[this.currentQuestionIndex];
        }
        return null;
    }

    answerQuestion(isCorrect) {
        if (isCorrect) {
            this.score++;
        }
        this.currentQuestionIndex++;
    }

    getScore() {
        return this.score;
    }

    reset() {
        this.currentQuestionIndex = 0;
        this.score = 0;
    }
}

// Timer system
class Timer {
    constructor(duration) {
        this.duration = duration;
        this.remainingTime = duration;
        this.intervalId = null;
    }

    start(callback) {
        this.remainingTime = this.duration;
        this.intervalId = setInterval(() => {
            if (this.remainingTime > 0) {
                this.remainingTime--;
            } else {
                clearInterval(this.intervalId);
                callback();
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.intervalId);
    }

    getRemainingTime() {
        return this.remainingTime;
    }
}

// Notes system
class NotesManager {
    constructor() {
        this.notes = this.loadNotes();
    }

    loadNotes() {
        const notes = localStorage.getItem('notes');
        return notes ? JSON.parse(notes) : [];
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    addNote(note) {
        this.notes.push(note);
        this.saveNotes();
    }

    getNotes() {
        return this.notes;
    }

    deleteNote(index) {
        this.notes.splice(index, 1);
        this.saveNotes();
    }
}

// Example of usage
const flashcardManager = new FlashcardManager();
flashcardManager.addFlashcard('What is the capital of France?', 'Paris');

const quiz = new Quiz(flashcardManager.getFlashcards());
const timer = new Timer(60); // 60 seconds timer

const notesManager = new NotesManager();
notesManager.addNote('This is a note for study.');

// A function to start the quiz and timer
function startQuiz() {
    timer.start(() => {
        console.log('Time is up!');
        console.log('Your score: ', quiz.getScore());
    });

    nextQuestion();
}

function nextQuestion() {
    const question = quiz.getNextQuestion();
    if (question) {
        console.log(question.question);
        // Code to show the answer and interact with user goes here
    } else {
        console.log('Quiz completed! Your score: ', quiz.getScore());
        timer.stop();
    }
}

// Starting the process
startQuiz();