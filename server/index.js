import express from "express";
import cors from "cors";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "db.json");
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

function readDb() {
  if (!existsSync(DB_PATH)) {
    return { teachers: [], quizzes: [], students: [], results: [] };
  }
  return JSON.parse(readFileSync(DB_PATH, "utf8"));
}

function writeDb(nextDb) {
  writeFileSync(DB_PATH, JSON.stringify(nextDb, null, 2));
}

function sanitizeQuizForStudent(quiz, withAnswers = false) {
  return {
    id: quiz.id,
    title: quiz.title,
    subject: quiz.subject,
    mode: quiz.mode,
    duration: quiz.duration,
    description: quiz.description,
    allowExplanations: quiz.allowExplanations,
    questions: quiz.questions.map((question) => ({
      text: question.text,
      options: question.options.map((option) => ({
        text: option.text,
        explanation: option.explanation
      })),
      ...(withAnswers ? { correctAnswer: question.correctAnswer } : {})
    }))
  };
}

app.get("/api/bootstrap", (_req, res) => {
  const db = readDb();
  res.json({
    quizzes: db.quizzes,
    students: db.students,
    results: db.results
  });
});

app.post("/api/login", (req, res) => {
  const db = readDb();
  const { role, email, password } = req.body ?? {};

  if (role === "teacher") {
    const teacher = db.teachers.find((item) => item.email === email && item.password === password);
    if (!teacher) {
      return res.status(401).json({ message: "Identifiants enseignant invalides." });
    }
    return res.json({ isAuthenticated: true, role: "teacher", name: teacher.name, id: teacher.id });
  }

  if (role === "student") {
    const student = db.students.find((item) => item.email === email && item.password === password);
    if (!student) {
      return res.status(401).json({ message: "Identifiants etudiant invalides." });
    }
    return res.json({ isAuthenticated: true, role: "student", name: student.name, id: student.id });
  }

  return res.status(400).json({ message: "Role invalide." });
});

app.post("/api/quizzes", (req, res) => {
  const db = readDb();
  const payload = req.body ?? {};
  const quiz = {
    id: randomUUID(),
    title: payload.title,
    subject: payload.subject,
    mode: payload.mode,
    duration: Number(payload.duration),
    description: payload.description || "",
    allowExplanations: Boolean(payload.allowExplanations),
    questions: Array.isArray(payload.questions) ? payload.questions : []
  };

  db.quizzes.unshift(quiz);
  writeDb(db);
  res.status(201).json(quiz);
});

app.delete("/api/quizzes/:id", (req, res) => {
  const db = readDb();
  db.quizzes = db.quizzes.filter((quiz) => quiz.id !== req.params.id);
  writeDb(db);
  res.status(204).end();
});

app.post("/api/students", (req, res) => {
  const db = readDb();
  const payload = req.body ?? {};
  const student = {
    id: randomUUID(),
    name: payload.name,
    email: payload.email,
    group: payload.group || "",
    password: payload.password || "etud1234"
  };
  db.students.unshift(student);
  writeDb(db);
  res.status(201).json(student);
});

app.delete("/api/students/:id", (req, res) => {
  const db = readDb();
  db.students = db.students.filter((student) => student.id !== req.params.id);
  writeDb(db);
  res.status(204).end();
});

app.post("/api/results", (req, res) => {
  const db = readDb();
  const payload = req.body ?? {};
  const result = {
    id: randomUUID(),
    studentName: payload.studentName,
    quizTitle: payload.quizTitle,
    mode: payload.mode,
    score: payload.score,
    total: payload.total,
    submittedAt: new Date().toLocaleString("fr-FR"),
    status: payload.status
  };
  db.results.unshift(result);
  writeDb(db);
  res.status(201).json(result);
});

app.listen(PORT, () => {
  console.log(`QuizCampus API running on http://localhost:${PORT}`);
});
