# MERN Quiz Application

An advanced Quiz Management System built using **MERN Stack**, supporting **Faculty Question Management**, **Student Online Quiz**, **Real-Time Timer**, **Auto Submission**, **One Attempt Per Subject**, **Shuffled Questions**, and **Performance Reports**.

## Features

| Role | Capabilities |
|------|--------------|
| **Student** | Take quizzes, one attempt per subject, timer-based auto submit, result view |
| **Faculty** | Add questions, view student performance, filter reports |
| **System** | Shuffles questions per quiz, prevents cheating, secure JWT authentication |

## Tech Stack

| Category | Technology |
|---------|------------|
| Frontend | React.js, React-Bootstrap, Axios, Framer-Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT Authentication |
| UI | Responsive Modern UI |

##  Project Folder Structure

```
project-root/
│
├── front_end/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Quiz.js
│   │   │   ├── FacultyDashboard.js
│   │   │   └── Results.js
│   │   ├── components/
│   │   │   └── QuestionCard.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   └── styles/
│   └── package.json
│
├── back_end/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── server.js
│   └── package.json
│
└── README.md
```

##  Environment Variables

Create a `.env` file in **back_end/**:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

##  Setup Instructions

### 1️. Clone Repository
```
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2️. Setup Backend
```
cd back_end
npm install
npm start
```

### 3️. Setup Frontend
```
cd ../front_end
npm install
npm start
```

##  Key Functionalities

#### One Attempt per Subject
#### Shuffled Questions
#### Auto Timer Submit
#### Faculty Reports

## API Endpoints Overview

| Method | Endpoint | Access | Description |
|-------|----------|--------|-------------|
| GET | `/api/quiz/question?subject=` | Student | Fetch randomized quiz questions |
| GET | `/api/quiz/attempt/check?subject=` | Student | Check attempt limit |
| POST | `/api/quiz/attempt` | Student | Submit quiz attempt |
| POST | `/api/quiz/question` | Faculty | Add question |
| GET | `/api/reports/student-summary` | Faculty | View performance summary |

## Contributing

Feel free to submit issues or pull requests.

## Give a Star
If you found this project helpful, please give it a ⭐!
