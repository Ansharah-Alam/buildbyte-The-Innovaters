import { auth, db } from './firebase-config.js';
import { collection, addDoc, doc, updateDoc, getDoc, query, where, getDocs, arrayUnion } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function showError(msg) {
  document.getElementById("errorMsg").textContent = msg;
}

async function createGroup() {
  const uid = auth.currentUser.uid;
  const groupName = document.getElementById("groupNameInput").value.trim();

  if (!groupName) {
    showError("Please enter a group name");
    return;
  }

  const code = generateCode();

  const groupRef = await addDoc(collection(db, "groups"), {
    name: groupName,
    code: code,
    members: [uid],
    createdBy: uid
  });

  await updateDoc(doc(db, "users", uid), { groupId: groupRef.id });

  showGroupView(groupName, code, groupRef.id);
}

async function joinGroup() {
  const uid = auth.currentUser.uid;
  const enteredCode = document.getElementById("joinCodeInput").value.trim().toUpperCase();

  if (enteredCode.length !== 6) {
    showError("Code must be 6 characters");
    return;
  }

  const q = query(collection(db, "groups"), where("code", "==", enteredCode));
  const snap = await getDocs(q);

  if (snap.empty) {
    showError("Invalid code");
    return;
  }

  const groupDoc = snap.docs[0];
  await updateDoc(doc(db, "groups", groupDoc.id), {
    members: arrayUnion(uid)
  });
  await updateDoc(doc(db, "users", uid), { groupId: groupDoc.id });

  showGroupView(groupDoc.data().name, groupDoc.data().code, groupDoc.id);
}

function showGroupView(name, code, groupId) {
  document.getElementById("noGroupSection").style.display = "none";
  document.getElementById("groupSection").style.display = "block";
  document.getElementById("groupNameDisplay").textContent = name;
  document.getElementById("groupCodeDisplay").textContent = code;
  loadLeaderboard(groupId);
}

async function loadLeaderboard(groupId) {
  const groupSnap = await getDoc(doc(db, "groups", groupId));
  const memberIds = groupSnap.data().members;

  const users = [];
  for (const uid of memberIds) {
    const userSnap = await getDoc(doc(db, "users", uid));
    users.push({ uid, ...userSnap.data() });
  }

  users.sort((a, b) => b.xp - a.xp);

  const listEl = document.getElementById("leaderboardList");
  listEl.innerHTML = "";
  users.forEach((u, i) => {
    listEl.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${i + 1}. ${u.email || u.uid}
        <span class="badge bg-primary rounded-pill">${u.xp} XP</span>
      </li>`;
  });
}

async function initGroupPage() {
  const uid = auth.currentUser.uid;
  const userSnap = await getDoc(doc(db, "users", uid));
  const groupId = userSnap.data().groupId;

  if (groupId) {
    const groupSnap = await getDoc(doc(db, "groups", groupId));
    showGroupView(groupSnap.data().name, groupSnap.data().code, groupId);
  }
}

auth.onAuthStateChanged((user) => {
  if (user) {
    initGroupPage();
  } else {
    showError("You must be logged in to view this page.");
  }
});

document.getElementById("createGroupBtn").addEventListener("click", createGroup);
document.getElementById("joinGroupBtn").addEventListener("click", joinGroup);