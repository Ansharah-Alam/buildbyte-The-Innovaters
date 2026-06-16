# 🎯 StudySquad

**Learning is easier when you're not doing it alone.**

StudySquad turns solo studying into a group habit. Answer quiz lessons, earn XP, build a daily streak, and climb the leaderboard with your own study squad — because a little friendly competition (and a little peer pressure) goes a long way.

🔗 **Live Demo:** [studysquad-74c08.web.app](https://studysquad-74c08.web.app)

---

## 🧠 The Idea

Most study apps are built for one person sitting alone with their phone. StudySquad is built around a simple truth: **you study better when someone's watching.** So instead of just tracking your own progress, we made progress *social* — you join a group with a shareable code, and everyone in it can see who's actually showing up.

No live AI calls, no unnecessary complexity — just quiz questions, XP, streaks, and a leaderboard that keeps everyone honest.

---

## ✨ Features

- 🔐 **Secure sign-up & login** — email/password authentication via Firebase, with a custom username set at signup
- 📊 **Personal dashboard** — see your XP and streak at a glance the moment you log in
- 📝 **Quiz lessons** — instant right/wrong feedback, question by question
- 🔥 **Daily streaks** — logic that actually tracks consecutive days, not just total activity
- ⭐ **XP system** — earn points for every correct answer
- 👥 **Study groups** — create a group and get a shareable 6-character code, or join one with a code
- 🏆 **Live leaderboard** — see how you stack up against your group, ranked by XP
- 🔀 **Join up to 3 groups** — study math with one crew, general knowledge with another
- 🚪 **Exit anytime** — leave a group cleanly, with confirmation, no awkward lingering
- 🎨 **Consistent, clean UI** — one cohesive look across every page, built with Bootstrap

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | HTML, CSS, JavaScript  |
| Styling | Bootstrap 5 |
| Auth | Firebase Authentication (email/password) |
| Database | Cloud Firestore |
| Hosting-ready | Static frontend — deployable anywhere (Firebase Hosting, Netlify, Vercel) |

We deliberately kept the stack simple: no frameworks, no build step, no bundler. Anyone can clone this and open `index.html` — that's it.

---

## 🚀 Getting Started

1. **Clone the repo**
   [github.com/Ansharah-Alam/buildbyte-The-Innovaters](https://github.com/Ansharah-Alam/buildbyte-The-Innovaters)

2. **Firebase setup**
   - This project already connects to our Firebase project via `js/firebase-config.js`
   - If you're setting up your own instance, create a project at [firebase.google.com](https://firebase.google.com), enable **Authentication (Email/Password)** and **Cloud Firestore**, and drop your config into `js/firebase-config.js`

3. **Run it locally**
   - Open the folder in VS Code
   - Right-click `index.html` → **Open with Live Server** (or any local static server)
   - No `npm install` needed — there's nothing to build

4. **Try it out**
   - Sign up with any email/password, or use our demo account below
   - Land on your dashboard, start a lesson, earn XP
   - Create a group, share the code with a teammate, watch the leaderboard update

### 🔑 Demo Account

Don't want to sign up? Use this to log in directly and explore:

| Username | Password |
|---|---|
| `hamza` | `abc123` |

---

## 🗂️ Project Structure

```
├── index.html          # Login / signup
├── dashboard.html       # XP, streak, navigation hub
├── lesson.html          # Quiz engine
├── group.html            # Create/join groups + leaderboard
├── js/
│   ├── firebase-config.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── lesson.js
│   └── group.js
├── data/
│   └── questions-fundamental
|   └── questions-fundamental.js      # Pre-written quiz questions
└── README.md
```

---

## 🔑 How It Actually Works

Every student has a profile that quietly tracks two things: XP and streak. Finish a lesson, get XP. Study again the next day, your streak grows — miss a day, it resets.

Groups work like a class code. Create one, get a 6-character code, share it. Anyone with that code joins instantly and lands on a shared leaderboard — so everyone can see who's actually showing up. Join up to 3 groups, leave anytime.

No servers, no complexity — just progress, synced live, for everyone to see.

---

## 👥 Team — The Innovators

Built in 24 hours for **BuildByte** hackathon.

| Member | Contribution |
|---|---|
| **Malaika Murad** | Authentication & Dashboard, Custom Usernames |
| **Eisha Tanzeel** | Lesson/Quiz Engine, XP & Streak Logic |
| **Ansharah** | Groups, Leaderboard, Multi-Group & Exit Logic, UI Styling |

---

## ✅ MVP Scope

Built in 24 hours, so we kept it tight and made every feature actually work end-to-end rather than half-building a longer list. What's live right now:

- Full auth flow with custom usernames
- XP + streak tracking that updates in real time
- A working quiz engine with instant feedback
- Groups you can create, join, switch between, and leave
- A live leaderboard, deployed and usable by anyone with the link

This is the core loop — sign up, study, compete — fully functional, not a mockup.

---

## 💡 What We'd Add Next

- Push notifications to remind users before their streak breaks
- More quiz topics and difficulty levels
- Group chat or comments for peer accountability
- Weekly XP resets for a fresh leaderboard each week

---

*Built with a lot of coffee and a lot of `git push` errors.* ☕

