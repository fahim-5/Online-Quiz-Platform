# 📘 Online Quiz Platform (CSE 4165 Project)

## 📌 Project Overview

This project is an **Online Quiz Platform** developed as part of the **CSE 4165 course requirement**. The system enables administrators to create and manage quizzes, while students can participate within a fixed time and track their performance.

The system follows a **Full-Stack Web Architecture** using:

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** PHP
* **Database:** MySQL

---

## 🎯 Core Features

### 👨‍💼 Admin Panel

* Create quizzes with **title, duration, and rules**
* Add, edit, delete questions from **question bank**
* Monitor **student participation and scores**

### 👨‍🎓 Student Panel

* Take quizzes within a **fixed time limit**
* View **result history and score summary**

### ⚙️ System Features

* Automatic scoring for objective questions
* Quiz timer
* Leaderboard
* Question bank management
* User authentication (login/register)

---

## 🏗️ Project Requirements (As Provided by Instructor)

Each project must include:

* Frontend using **HTML, CSS, JavaScript**
* Backend using **PHP**
* Database using **MySQL**
* Proper **UI design and validation**
* Full **CRUD operations** where applicable

---

## 📂 Project Structure

```
online-quiz-system/
│
├── config/              # Database & app configuration
├── public/              # Entry point (UI, assets)
├── app/
│   ├── controllers/     # Business logic
│   ├── models/          # Database interaction
│   └── views/           # UI templates
│
├── routes/              # Route handling
├── database/            # SQL files
├── includes/            # Helper functions
├── logs/                # Error logs
└── README.md
```

---

## 🗄️ Database Design (Core Tables)

* `users` → Stores user info (Admin/Student)
* `quizzes` → Quiz metadata
* `questions` → Questions per quiz
* `answers` → MCQ options
* `results` → Student scores
* `leaderboard` → Ranking system

---

## ⚙️ Installation & Setup Instructions

### 1️⃣ Clone Project

```bash
git clone https://github.com/your-repo/online-quiz-system.git
cd online-quiz-system
```

### 2️⃣ Setup Database

* Create a MySQL database (e.g., `quiz_system`)
* Import:

```sql
database/migrations.sql
database/seed.sql
```

### 3️⃣ Configure Database Connection

Edit:

```
config/database.php
```

Set:

```php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "quiz_system";
```

### 4️⃣ Run Project

* Place project in `htdocs` (XAMPP) or `www` (WAMP)
* Start Apache & MySQL
* Open browser:

```
http://localhost/online-quiz-system/public
```

---

## 🔐 Authentication Flow

* User Registration (Student/Admin role)
* Secure login using session handling
* Password hashing using `password_hash()`

---

## 🔄 CRUD Operations Coverage

| Module      | CRUD Support |
| ----------- | ------------ |
| Users       | Create, Read |
| Quizzes     | Full CRUD    |
| Questions   | Full CRUD    |
| Results     | Read         |
| Leaderboard | Read         |

---

## 📊 Pros & Limitations

### ✅ Strengths

* Clean modular architecture (MVC-like)
* Scalable structure for future upgrades
* Covers all academic requirements
* Separation of concerns improves maintainability

### ❌ Limitations

* No REST API (monolithic PHP)
* Limited scalability without framework (Laravel)
* Manual routing may become complex

---

## 🚀 Future Enhancements

* Convert to **REST API + React frontend**
* Add **real-time quiz (WebSocket)**
* Implement **JWT authentication**
* Introduce **AI-based question generation**

---

## 🧠 Strategic Insight

This project is not just an academic submission — it is a **foundation for a production-grade assessment platform**.

If properly extended:

* Can evolve into an **EdTech SaaS product**
* Supports **micro-learning and remote evaluation systems**
* Aligns with current **digital education trends**

---

## 👨‍💻 Author

CSE Student – Full Stack Developer
Focus: Scalable Systems, Backend Engineering, and Product Thinking

---
