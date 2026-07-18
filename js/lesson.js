import { questionsOOP } from "../data/questions-oop.js";
import { questionsFundamentals } from "../data/questions-fundamentals.js";
import { db } from "./firebase-config.js";
import {
  doc,
  updateDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

const topicSelectorEl = document.getElementById("topic-selector");
const topicSelectEl = document.getElementById("topic-select");
const startBtnEl = document.getElementById("start-btn");
const quizSectionEl = document.getElementById("quiz-section");
const questionTextEl = document.getElementById("question-text");
const optionsContainerEl = document.getElementById("options-container");
const nextBtnEl = document.getElementById("next-btn");
const summaryEl = document.getElementById("summary");
const summaryScoreEl = document.getElementById("summary-score");
const summaryXpEl = document.getElementById("summary-xp");

/**
 * Load the selected topic's questions and begin the quiz.
 */
function startQuiz() {
  const topic = topicSelectEl.value;
  questions = topic === "oop" ? questionsOOP : questionsFundamentals;

  currentIndex = 0;
  score = 0;
  answered = false;

  topicSelectorEl.classList.add("d-none");
  quizSectionEl.classList.remove("d-none");
  summaryEl.classList.add("d-none");

  loadQuestion(currentIndex);
}

/**
 * Render the question and option buttons for the given index.
 * @param {number} index
 */
function loadQuestion(index) {
  // TODO: Add loading/error states if questions array is empty or index is invalid.
  const current = questions[index];
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

/**
 * Compare the selected option to the correct answer, style buttons, and lock choices.
 * @param {string} selected
 */
function checkAnswer(selected) {
  if (answered) return;

  const current = questions[currentIndex];
  const isCorrect = selected === current.correct;
  answered = true;

  if (isCorrect) {
    score += 1;
  }

  const optionButtons = optionsContainerEl.querySelectorAll("button");
  optionButtons.forEach((button) => {
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

/**
 * Advance to the next question or show the end-of-lesson summary.
 */
async function nextQuestion() {
  currentIndex += 1;

  if (currentIndex >= questions.length) {
    const xpEarned = score * 10;

    // TODO: Replace with the authenticated user's id from Firebase Auth.
    const userId = "placeholder-user-id";
    await awardXP(userId, xpEarned);
    await updateStreak(userId);
    showSummary(score, questions.length);
    return;
  }

  loadQuestion(currentIndex);
}

/**
 * Increment the user's XP in Firestore.
 * @param {string} userId
 * @param {number} amount
 */
async function awardXP(userId, amount) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    xp: increment(amount),
  });
}

/**
 * Update the user's daily streak after completing a lesson.
 * @param {string} userId
 */
async function updateStreak(userId) {
  // TODO: Implement streak logic (compare lastCompleted date, reset or increment streak).
  console.log("updateStreak not implemented yet for user:", userId);
}

/**
 * Reveal the summary panel with final score and XP earned.
 * @param {number} score
 * @param {number} total
 */
function showSummary(score, total) {
  const xpEarned = score * 10;

  quizSectionEl.classList.add("d-none");

  summaryScoreEl.textContent = `You scored ${score} out of ${total}.`;
  summaryXpEl.textContent = `You earned ${xpEarned} XP.`;
  summaryEl.classList.remove("d-none");
}

startBtnEl.addEventListener("click", startQuiz);
nextBtnEl.addEventListener("click", nextQuestion);
