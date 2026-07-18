import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { doc, setDoc, getDocs, collection, query, where } 
  from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const emailField = document.getElementById("emailField");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const spinner = document.getElementById("spinner");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

let mode = "login";

loginTab.addEventListener("click", () => {
  mode = "login";
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
  btnText.textContent = "Log In";
  emailField.style.display = "none";
  errorMsg.textContent = "";
});

signupTab.addEventListener("click", () => {
  mode = "signup";
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
  btnText.textContent = "Sign Up";
  emailField.style.display = "block";
  errorMsg.textContent = "";
});

function getFriendlyError(err) {
  const code = err.code || "";
  if (code.includes("email-already-in-use")) return "That email is already registered. Try logging in instead.";
  if (code.includes("invalid-email")) return "Please enter a valid email address.";
  if (code.includes("weak-password")) return "Password must be at least 6 characters.";
  if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential")) 
    return "Incorrect username or password.";
  return "Something went wrong. Please try again.";
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  spinner.style.display = isLoading ? "inline-block" : "none";
}

submitBtn.addEventListener("click", async () => {
  errorMsg.textContent = "";

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    errorMsg.textContent = "Please fill in all fields.";
    return;
  }

  setLoading(true);

  try {
    if (mode === "signup") {
      const email = emailInput.value.trim();
      if (!email) {
        errorMsg.textContent = "Please enter your email.";
        setLoading(false);
        return;
      }

      const usernameCheck = query(collection(db, "users"), where("username", "==", username));
      const existing = await getDocs(usernameCheck);
      if (!existing.empty) {
        errorMsg.textContent = "That username is already taken.";
        setLoading(false);
        return;
      }

      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: user.email,
        xp: 0,
        streak: 0,
        lastActiveDate: null,
        groupId: null
      });

    } else {
      const usernameQuery = query(collection(db, "users"), where("username", "==", username));
      const results = await getDocs(usernameQuery);

      if (results.empty) {
        errorMsg.textContent = "Incorrect username or password.";
        setLoading(false);
        return;
      }

      const userData = results.docs[0].data();
      await signInWithEmailAndPassword(auth, userData.email, password);
    }

    window.location.href = "dashboard.html";
  } catch (err) {
    errorMsg.textContent = getFriendlyError(err);
    setLoading(false);
  }
});