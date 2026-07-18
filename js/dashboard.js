import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { doc, getDoc } 
  from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// AUTH GUARD: if not logged in, kick back to login page
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // Fetch user's data from Firestore
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const data = userDocSnap.data();
    document.getElementById("welcomeMsg").textContent = `Welcome back, ${data.email}!`;
    document.getElementById("streakValue").textContent = data.streak || 0;
    document.getElementById("xpValue").textContent = data.xp || 0;
  }
});

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
