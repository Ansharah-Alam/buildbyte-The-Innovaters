import { questionsOOP } from "../data/questions-oop.js";
import { questionsFundamentals } from "../data/questions-fundamentals.js";
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let currentUserId = null;

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

// AUTH GUARD: kick back to login if not signed in, else grab uid
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  currentUserId = user.uid;
});

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
    awardXP(10); // STEP 3: award XP on correct answer
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
  updateStreak(); // STEP 4: update streak once lesson is complete
}

// STEP 3: Award XP to the logged-in user in Firestore
async function awardXP(amount) {
  if (!currentUserId) return;
  const userRef = doc(db, "users", currentUserId);
  await updateDoc(userRef, { xp: increment(amount) });
}

// STEP 4: Streak calculation helpers
function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayDateString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

async function updateStreak() {
  if (!currentUserId) return;

  const userRef = doc(db, "users", currentUserId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const data = userSnap.data();
  const lastActive = data.lastActiveDate;
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  let newStreak;
  if (lastActive === today) {
    return; // already counted today, don't increment again
  } else if (lastActive === yesterday) {
    newStreak = (data.streak || 0) + 1;
  } else {
    newStreak = 1; // older than yesterday, or null (first time)
  }

  await updateDoc(userRef, { streak: newStreak, lastActiveDate: today });
}

startBtnEl.addEventListener("click", startQuiz);
nextBtnEl.addEventListener("click", nextQuestion);