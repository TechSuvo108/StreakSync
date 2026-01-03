<!-- Anchor for Back to Top -->
<div id="top"></div>

![StreakSync Preview](./assets/preview.png)

<div align="center">

# 🔥 StreakSync

<p>
  <em>
    A <b>goal-driven social productivity platform</b> that helps users  
    build long-lasting habits through <b>streaks</b>, <b>community</b>,  
    and <b>accountability</b>.
  </em>
</p>

<p>
  <em>
    🚀 Built as a <b>team project</b> for <b>HackFiesta</b>
  </em>
</p>

</div>

---

## 🌐 Live Demo

<p>
  <em>
    Try the application live:<br>
    🔗 <a href="https://streaksync-ad98a.web.app/"><b>Visit StreakSync</b></a>
  </em>
</p>

---

## 📖 Overview

<p>
  <em>
    <b>StreakSync</b> is a <b>full-stack web application</b> designed to turn  
    personal goals into <b>visible streaks</b> and <b>shared journeys</b>.
  </em>
</p>

<p>
  <em>
    Users can create goals, maintain daily streaks, participate in community  
    challenges, share progress updates, and stay motivated through  
    <b>positive social interaction</b> and <b>AI-powered encouragement</b>.
  </em>
</p>

<p>
  <em>
    The platform emphasizes <b>consistency over perfection</b>, providing  
    streak protection mechanisms and emotional reinforcement to reduce drop-offs.
  </em>
</p>

---

## ✨ Core Features

<p><em>🔐 <b>Authentication</b> — Secure Google sign-in using Firebase Authentication.</em></p>

<p><em>🎯 <b>Goal & Streak Management</b> — Create daily, long-term, or time-bound goals with visible streaks.</em></p>

<p><em>❤️ <b>Emotional Anchor</b> — Each goal includes a personal “Why I started” message shown during difficult moments.</em></p>

<p><em>🧊 <b>Streak Protection</b> — Limited freezes and recovery logic to prevent accidental streak loss.</em></p>

<p><em>👥 <b>Goal-Based Community Search</b> — Find users and groups by goal title instead of forced matching.</em></p>

<p><em>💬 <b>Social Feed</b> — Share progress updates, like posts, and participate in discussions.</em></p>

<p><em>🗑️ <b>Content Moderation</b> — Comment deletion allowed for comment authors and post owners.</em></p>

<p><em>🏆 <b>Challenges & Gamification</b> — Join, complete, or create community challenges with badges and XP.</em></p>

<p><em>📊 <b>Analytics & Reports</b> — Visual insights into consistency, streaks, and activity trends.</em></p>

<p><em>🤖 <b>AI Motivation</b> — Short, empathetic motivational messages generated using Gemini AI.</em></p>

<p><em>🔔 <b>Real-Time Updates</b> — Live feed, comments, challenges, and goal updates via Firestore subscriptions.</em></p>

---

## 🧠 System Architecture

<p>
  <em>
    StreakSync follows a <b>service-oriented frontend architecture</b> with  
    Firebase acting as the backend-as-a-service.
  </em>
</p>

- **Frontend** → React + TypeScript (UI, state, interaction)
- **Backend Logic** → Firebase Firestore & Cloud services
- **Authentication** → Firebase Auth (Google Provider)
- **AI Services** → Gemini API (abstracted via service layer)
- **Hosting** → Firebase Hosting

---

## 🧰 Tech Stack

<p align="center">
  <img src="https://img.icons8.com/color/70/react-native.png" alt="React" />
  <img src="https://img.icons8.com/color/70/typescript.png" alt="TypeScript" />
  <img src="https://img.icons8.com/color/70/firebase.png" alt="Firebase" />
  <img src="https://img.icons8.com/color/70/tailwindcss.png" alt="Tailwind CSS" />
</p>

**Frontend**
- React + TypeScript  
- Tailwind CSS  
- Recharts  

**Backend / Services**
- Firebase Authentication  
- Firebase Firestore (Realtime subscriptions)  
- Firebase Hosting  

**AI**
- Google Gemini API (motivation & naming assistance)

---

## 🔐 Security & Permissions

<p>
  <em>
    Access control is enforced at both <b>UI</b> and <b>database</b> levels.
  </em>
</p>

- Only post owners can delete posts  
- Comments can be deleted by comment authors or post owners  
- Challenges can only be deleted by their creators  
- Firestore rules protect user data using authenticated UID checks  

---

## 🧠 What We Learned

<p>
  <em>
    Working together on <b>StreakSync</b> helped our team gain hands-on experience with:
  </em>
</p>

<p>
  <em>
    • Designing real-world authentication flows<br>
    • Implementing role-based permissions<br>
    • Managing real-time data using Firestore subscriptions<br>
    • Structuring scalable service layers<br>
    • Handling time-based streak logic<br>
    • Collaborating effectively as a development team<br>
    • Writing clean, maintainable TypeScript code
  </em>
</p>

---

## 👥 Team – HackFiesta Submission

<p>
  <em>
    This project was built as a <b>group submission</b> for <b>HackFiesta</b> by:
  </em>
</p>

<p>
  <em>
    <b>Subham Kolay</b><br>
    <b>Soumyadeep Saha</b><br>
    <b>Trishit Majumdar</b><br>
    <b>Soumya Modak</b>
  </em>
</p>

<p>
  <em>
    Hooghly Engineering And Technology College<br/>
    BTech <b>Computer Science</b>.
  </em>
</p>

---

## ⭐ Support

<p>
  <em>
    If you find <b>StreakSync</b> interesting or impactful,  
    consider giving this repository a ⭐ — it motivates our team to keep building!
  </em>
</p>

---

<div align="center">
  <a href="#top">
    <img src="https://img.shields.io/badge/Back%20to%20Top-000000?style=for-the-badge&logo=github&logoColor=white" />
  </a>
</div>