import { auth, db } from './firebase-config.js';
import { collection, addDoc, doc, updateDoc, getDoc, query, where, getDocs, arrayUnion,arrayRemove } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const MAX_GROUPS = 3;
let currentGroupId = null;

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

function clearError() {
  document.getElementById("errorMsg").textContent = "";
}

async function getMyGroupIds() {
  const uid = auth.currentUser.uid;
  const userSnap = await getDoc(doc(db, "users", uid));
  return userSnap.data().groupIds || [];
}

async function loadMyGroups() {
  const groupIds = await getMyGroupIds();
  const listEl = document.getElementById("myGroupsList");
  listEl.innerHTML = "";

  if (groupIds.length === 0) {
    listEl.innerHTML = `<li class="list-group-item text-muted">You haven't joined any groups yet.</li>`;
  }

  for (const gid of groupIds) {
    const groupSnap = await getDoc(doc(db, "groups", gid));
    if (!groupSnap.exists()) continue;
    const data = groupSnap.data();

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${data.name} <small class="text-muted">(${data.code})</small></span>
      <button class="btn btn-sm btn-primary view-group-btn" data-group-id="${gid}">View</button>
    `;
    listEl.appendChild(li);
  }

  document.querySelectorAll(".view-group-btn").forEach(btn => {
    btn.addEventListener("click", () => showLeaderboard(btn.dataset.groupId));
  });

  const joinSection = document.getElementById("joinCreateSection");
  const limitMsg = document.getElementById("groupLimitMsg");

  if (groupIds.length >= MAX_GROUPS) {
    joinSection.style.display = "none";
    limitMsg.textContent = "You've joined the maximum of 3 groups.";
  } else {
    joinSection.style.display = "block";
    limitMsg.textContent = `${groupIds.length}/${MAX_GROUPS} groups joined.`;
  }
}

async function createGroup() {
  clearError();
  const uid = auth.currentUser.uid;
  const groupName = document.getElementById("groupNameInput").value.trim();

  if (!groupName) {
    showError("Please enter a group name");
    return;
  }

  const groupIds = await getMyGroupIds();
  if (groupIds.length >= MAX_GROUPS) {
    showError("You can only be in up to 3 groups.");
    return;
  }

  const code = generateCode();

  const groupRef = await addDoc(collection(db, "groups"), {
    name: groupName,
    code: code,
    members: [uid],
    createdBy: uid
  });

  await updateDoc(doc(db, "users", uid), { groupIds: arrayUnion(groupRef.id) });

  document.getElementById("groupNameInput").value = "";
  await loadMyGroups();
  showLeaderboard(groupRef.id);
}

async function joinGroup() {
  clearError();
  const uid = auth.currentUser.uid;
  const enteredCode = document.getElementById("joinCodeInput").value.trim().toUpperCase();

  if (enteredCode.length !== 6) {
    showError("Code must be 6 characters");
    return;
  }

  const groupIds = await getMyGroupIds();
  if (groupIds.length >= MAX_GROUPS) {
    showError("You can only be in up to 3 groups.");
    return;
  }

  const q = query(collection(db, "groups"), where("code", "==", enteredCode));
  const snap = await getDocs(q);

  if (snap.empty) {
    showError("Invalid code");
    return;
  }

  const groupDoc = snap.docs[0];

  if (groupIds.includes(groupDoc.id)) {
    showError("You're already in this group.");
    return;
  }

  await updateDoc(doc(db, "groups", groupDoc.id), { members: arrayUnion(uid) });
  await updateDoc(doc(db, "users", uid), { groupIds: arrayUnion(groupDoc.id) });

  document.getElementById("joinCodeInput").value = "";
  await loadMyGroups();
  showLeaderboard(groupDoc.id);
}

async function showLeaderboard(groupId) {
    currentGroupId = groupId;
  const groupSnap = await getDoc(doc(db, "groups", groupId));
  const data = groupSnap.data();

  document.getElementById("leaderboardSection").style.display = "block";
  document.getElementById("groupNameDisplay").textContent = data.name;
  document.getElementById("groupCodeDisplay").textContent = data.code;

  const memberIds = data.members;
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

  document.getElementById("leaderboardSection").scrollIntoView({ behavior: "smooth" });
}

async function exitGroup() {
  clearError();
  if (!currentGroupId) return;

  const uid = auth.currentUser.uid;

  await updateDoc(doc(db, "groups", currentGroupId), {
    members: arrayRemove(uid)
  });
  await updateDoc(doc(db, "users", uid), {
    groupIds: arrayRemove(currentGroupId)
  });

  document.getElementById("leaderboardSection").style.display = "none";
  currentGroupId = null;

  alert("You have exited the group.");

  await loadMyGroups();
}
auth.onAuthStateChanged((user) => {
  if (user) {
    loadMyGroups();
  } else {
    showError("You must be logged in to view this page.");
  }
});

document.getElementById("createGroupBtn").addEventListener("click", createGroup);
document.getElementById("joinGroupBtn").addEventListener("click", joinGroup);
document.getElementById("exitGroupBtn").addEventListener("click", exitGroup);