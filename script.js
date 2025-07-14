const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");
const resultContainer = document.querySelector(".result-container");
const configContainer = document.querySelector(".config-container");


const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let quizCategory = "programming";
let currentQuestion = null;
const questionsIndexHistory = [];
let numberOfQuestions = 10;
let correctAnswerCount = 0;


const showQuizResult = () => {
    quizContainer.style.display = "none";
    resultContainer.style.display = "block";

    const resultText = `You Answered <b>${correctAnswerCount}</b> Out of <b>${numberOfQuestions}</b> questions correctly`;
    document.querySelector(".result-message").innerHTML = resultText;
};

const resetTimer = () => {
    clearInterval(timer);
    currentTime = QUIZ_TIME_LIMIT;
    timerDisplay.textContent = `${currentTime}s`;
}

const startTimer = () => {
    timer = setInterval(() => {
        currentTime--;
        timerDisplay.textContent = `${currentTime}s`;

        if (currentTime <= 0) {
            clearInterval(timer);
            highlightCorrectAnswer();

            nextQuestionBtn.style.visibility = "visible";
            quizContainer.querySelector(".quiz-timer").style.background = "#c31402";
            answerOptions.querySelectorAll(".answer-option").forEach(opt => opt.style.pointerEvents = "none");  
        }
    }, 1000)
}

const getRandomQuestion = () => {
    const categoryObj = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase());

    if (!categoryObj || categoryObj.questions.length === 0) {
        console.log("No questions found for this category.");
        return null;
    }

    const categoryQuestions = categoryObj.questions;

    if (questionsIndexHistory.length >= Math.min(categoryQuestions.length, numberOfQuestions)) {
        return showQuizResult();
    }

    const availableQuestions = categoryQuestions.filter((_, index) => !questionsIndexHistory.includes(index));

    if (availableQuestions.length === 0) {
        alert("No more questions left in this category!");
        return null;
    }

    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    const randomIndex = categoryQuestions.indexOf(randomQuestion);
    questionsIndexHistory.push(randomIndex);

    return randomQuestion;
};

const highlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
};

const handleAnswer = (option, answerIndex) => {
    clearInterval(timer);
    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect ? 'correct' : 'incorrect');

    if (!isCorrect) {
        highlightCorrectAnswer();
    } else {
        correctAnswerCount++;
    }

    answerOptions.querySelectorAll(".answer-option").forEach(opt => opt.style.pointerEvents = "none");
    nextQuestionBtn.style.visibility = "visible";
};
const renderQuestions = () => {
    currentQuestion = getRandomQuestion();
    if (!currentQuestion) return;

    resetTimer();
    startTimer();

    answerOptions.innerHTML = "";
    nextQuestionBtn.style.visibility = "hidden";
    quizContainer.querySelector(".quiz-timer").style.background = "#32313C";

    document.querySelector(".question-text").textContent = currentQuestion.question;

    questionStatus.innerHTML = `<b>${questionsIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;

    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        li.addEventListener("click", () => handleAnswer(li, index));
        answerOptions.appendChild(li);
    });
};

document.querySelectorAll(".category-option, .question-option").forEach(option => {
    option.addEventListener("click", () => {
        option.parentNode.querySelector(".active").classList.remove("active");
        option.classList.add("active"); // Fixed here
    });
});

const startQuiz = () =>{
    configContainer.style.display = "none";
    quizContainer.style.display = "block";

    quizCategory = configContainer.querySelector(".category-option.active").textContent;
    numberOfQuestions = parseInt(configContainer.querySelector(".question-option.active").textContent);

    renderQuestions(); // Needed to start the quiz
};
const resetQuiz = () =>{
    resetTimer();
    correctAnswerCount = 0;
    questionsIndexHistory.length=0;
    configContainer.style.display = "block";
    resultContainer.style.display = "none";
}

renderQuestions();
nextQuestionBtn.addEventListener("click", renderQuestions);
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click", startQuiz);