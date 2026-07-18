import { questionsOOP } from "../data/questions-oop.js";
import { questionsFundamentals } from "../data/questions-fundamentals.js";

let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

const topicSelectorEl = document.getElementById("topic-selector");
const topicSelectEl = document.getElementById("topic-select");
const startBtnEl = document.getElementById("start-btn");
const scoreTextEl = document.getElementById("score-text");
const quizSectionEl = document.getElementById("quiz-section");
const questionTextEl = document.getElementById("question-text");
const optionsContainerEl = document.getElementById("options-container");
const nextBtnEl = document.getElementById("next-btn");
const summaryEl = document.getElementById("summary");
const summaryScoreEl = document.getElementById("summary-score");

function updateScoreDisplay() {
  scoreTextEl.textContent = `Score: ${score}`;
}

function startQuiz() {
  const topic = topicSelectEl.value;
  currentQuestions = topic === "oop" ? questionsOOP : questionsFundamentals;

  currentIndex = 0;
  score = 0;
  answered = false;

  updateScoreDisplay();
  topicSelectorEl.classList.add("d-none");
  scoreTextEl.classList.remove("d-none");
  quizSectionEl.classList.remove("d-none");
  summaryEl.classList.add("d-none");

  loadQuestion(0);
}

function loadQuestion(index) {
  const current = currentQuestions[index];
  answered = false;

  questionTextEl.textContent = current.question;
  optionsContainerEl.innerHTML = "";

  current.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline-primary text-start";
    button.textContent = option;
    button.dataset.option = option;
    button.addEventListener("click", () => checkAnswer(option));
    optionsContainerEl.appendChild(button);
  });

  nextBtnEl.disabled = true;
}

function checkAnswer(selected) {
  if (answered) return;

  const current = currentQuestions[currentIndex];
  const isCorrect = selected === current.correct;
  answered = true;

  if (isCorrect) {
    score += 1;
    updateScoreDisplay();
  }

  optionsContainerEl.querySelectorAll("button").forEach((button) => {
    const option = button.dataset.option;

    if (option === current.correct) {
      button.classList.remove("btn-outline-primary");
      button.classList.add("btn-success");
    } else if (option === selected) {
      button.classList.remove("btn-outline-primary");
      button.classList.add("btn-danger");
    }

    button.disabled = true;
  });

  nextBtnEl.disabled = false;
}

function nextQuestion() {
  currentIndex += 1;

  if (currentIndex >= currentQuestions.length) {
    showSummary(score, currentQuestions.length);
    return;
  }

  loadQuestion(currentIndex);
}

function showSummary(finalScore, total) {
  quizSectionEl.classList.add("d-none");
  summaryScoreEl.textContent = `You scored ${finalScore} out of ${total}.`;
  summaryEl.classList.remove("d-none");
}

startBtnEl.addEventListener("click", startQuiz);
nextBtnEl.addEventListener("click", nextQuestion);
