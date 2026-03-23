import { createContext, startTransition, useContext, useEffect, useRef, useState } from "react";

const AUTH_STORAGE_KEY = "quizcampus-auth-v1";
const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const initialQuestion = {
  text: "",
  options: [
    { text: "", explanation: "" },
    { text: "", explanation: "" },
    { text: "", explanation: "" },
    { text: "", explanation: "" }
  ],
  correctAnswer: 0
};

const AppDataContext = createContext(null);

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    },
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Une erreur serveur est survenue.");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function AppDataProvider({ children }) {
  const [data, setData] = useState({ quizzes: [], students: [], results: [] });
  const [quizForm, setQuizForm] = useState({ title: "", subject: "", mode: "practice", duration: 20, description: "", allowExplanations: true });
  const [draftQuestion, setDraftQuestion] = useState(initialQuestion);
  const [draftQuestions, setDraftQuestions] = useState([]);
  const [studentForm, setStudentForm] = useState({ name: "", email: "", group: "" });
  const [sessionConfig, setSessionConfig] = useState({ studentId: "", quizId: "", showExplanations: false });
  const [activeSession, setActiveSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { isAuthenticated: false, role: null, name: "", id: "" };
    try {
      return JSON.parse(raw);
    } catch {
      return { isAuthenticated: false, role: null, name: "", id: "" };
    }
  });
  const timerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const payload = await api("/bootstrap");
        if (!cancelled) {
          setData(payload);
          setSessionConfig((current) => ({
            ...current,
            studentId: current.studentId || payload.students[0]?.id || "",
            quizId: current.quizId || payload.quizzes[0]?.id || ""
          }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activeSession || activeSession.mode !== "exam" || activeSession.completed) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      return undefined;
    }

    timerRef.current = window.setInterval(() => {
      setActiveSession((current) => {
        if (!current) return current;
        const nextRemainingSeconds = current.remainingSeconds - 1;
        if (nextRemainingSeconds <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          window.setTimeout(() => finishSession(current, true), 0);
          return null;
        }
        return { ...current, remainingSeconds: nextRemainingSeconds };
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [activeSession]);

  function updateQuizForm(field, value) {
    setQuizForm((current) => ({ ...current, [field]: value }));
  }

  function updateDraftOption(index, field, value) {
    setDraftQuestion((current) => {
      const options = [...current.options];
      options[index] = { ...options[index], [field]: value };
      return { ...current, options };
    });
  }

  function addDraftQuestion() {
    if (!draftQuestion.text.trim() || draftQuestion.options.some((option) => !option.text.trim())) {
      window.alert("Veuillez remplir l'enonce et les 4 options avant d'ajouter la question.");
      return;
    }

    startTransition(() => {
      setDraftQuestions((current) => [
        ...current,
        {
          text: draftQuestion.text.trim(),
          options: draftQuestion.options.map((option) => ({
            text: option.text.trim(),
            explanation: option.explanation.trim()
          })),
          correctAnswer: draftQuestion.correctAnswer
        }
      ]);
      setDraftQuestion(initialQuestion);
    });
  }

  function removeDraftQuestion(index) {
    setDraftQuestions((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function submitQuiz(event) {
    event.preventDefault();
    if (!draftQuestions.length) {
      window.alert("Ajoutez au moins une question avant d'enregistrer le quiz.");
      return;
    }

    const payload = {
      title: quizForm.title.trim(),
      subject: quizForm.subject.trim(),
      mode: quizForm.mode,
      duration: Number(quizForm.duration),
      description: quizForm.description.trim(),
      allowExplanations: quizForm.allowExplanations,
      questions: draftQuestions
    };

    if (!payload.title || !payload.subject || !payload.duration) {
      window.alert("Veuillez completer les informations du quiz.");
      return;
    }

    const createdQuiz = await api("/quizzes", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    startTransition(() => {
      setData((current) => ({ ...current, quizzes: [createdQuiz, ...current.quizzes] }));
      setSessionConfig((current) => ({ ...current, quizId: createdQuiz.id }));
      setQuizForm({ title: "", subject: "", mode: "practice", duration: 20, description: "", allowExplanations: true });
      setDraftQuestions([]);
      setDraftQuestion(initialQuestion);
    });
  }

  async function submitStudent(event) {
    event.preventDefault();
    const payload = {
      name: studentForm.name.trim(),
      email: studentForm.email.trim(),
      group: studentForm.group.trim()
    };

    if (!payload.name || !payload.email) {
      window.alert("Veuillez renseigner le nom et l'email de l'etudiant.");
      return;
    }

    const createdStudent = await api("/students", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    startTransition(() => {
      setData((current) => ({ ...current, students: [createdStudent, ...current.students] }));
      setSessionConfig((current) => ({ ...current, studentId: createdStudent.id }));
      setStudentForm({ name: "", email: "", group: "" });
    });
  }

  async function deleteStudent(studentId) {
    await api(`/students/${studentId}`, { method: "DELETE" });
    setData((current) => ({ ...current, students: current.students.filter((student) => student.id !== studentId) }));
    if (sessionConfig.studentId === studentId) {
      setSessionConfig((current) => ({ ...current, studentId: data.students.find((student) => student.id !== studentId)?.id || "" }));
    }
  }

  async function deleteQuiz(quizId) {
    await api(`/quizzes/${quizId}`, { method: "DELETE" });
    setData((current) => ({ ...current, quizzes: current.quizzes.filter((quiz) => quiz.id !== quizId) }));
    if (sessionConfig.quizId === quizId) {
      setSessionConfig((current) => ({ ...current, quizId: data.quizzes.find((quiz) => quiz.id !== quizId)?.id || "" }));
    }
  }

  function startSession() {
    const student = data.students.find((item) => item.id === sessionConfig.studentId);
    const quiz = data.quizzes.find((item) => item.id === sessionConfig.quizId);
    if (!student || !quiz) {
      window.alert("Veuillez selectionner un etudiant et un quiz.");
      return;
    }

    setActiveSession({
      studentId: student.id,
      quizId: quiz.id,
      mode: quiz.mode,
      answers: Array(quiz.questions.length).fill(null),
      remainingSeconds: quiz.duration * 60,
      currentQuestionIndex: 0,
      showExplanations: quiz.mode === "practice" ? sessionConfig.showExplanations && Boolean(quiz.allowExplanations) : false,
      completed: false
    });
  }

  function setSessionAnswer(questionIndex, answerIndex) {
    setActiveSession((current) => {
      if (!current) return current;
      const answers = [...current.answers];
      answers[questionIndex] = answerIndex;
      return { ...current, answers };
    });
  }

  async function finishSession(session = activeSession, forced = false) {
    if (!session) return;
    const quiz = data.quizzes.find((item) => item.id === session.quizId);
    const student = data.students.find((item) => item.id === session.studentId);
    if (!quiz || !student) return;

    const score = quiz.questions.reduce((total, question, index) => total + (question.correctAnswer === session.answers[index] ? 1 : 0), 0);
    const resultPayload = {
      studentName: student.name,
      quizTitle: quiz.title,
      mode: quiz.mode,
      score,
      total: quiz.questions.length,
      status: forced ? "Temps ecoule" : "Termine"
    };

    const result = await api("/results", {
      method: "POST",
      body: JSON.stringify(resultPayload)
    });

    clearInterval(timerRef.current);
    timerRef.current = null;

    startTransition(() => {
      setData((current) => ({ ...current, results: [result, ...current.results] }));
      setActiveSession({
        ...session,
        completed: true,
        score,
        total: quiz.questions.length,
        studentName: student.name,
        quizTitle: quiz.title,
        forced
      });
    });
  }

  function nextSessionQuestion() {
    setActiveSession((current) => {
      if (!current) return current;
      const quiz = data.quizzes.find((item) => item.id === current.quizId);
      if (!quiz) return current;
      return {
        ...current,
        currentQuestionIndex: Math.min(current.currentQuestionIndex + 1, quiz.questions.length - 1)
      };
    });
  }

  function previousSessionQuestion() {
    setActiveSession((current) => {
      if (!current) return current;
      return {
        ...current,
        currentQuestionIndex: Math.max(current.currentQuestionIndex - 1, 0)
      };
    });
  }

  async function login(credentials) {
    const nextAuth = await api("/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
    setAuth(nextAuth);
    return nextAuth;
  }

  function logout() {
    setAuth({ isAuthenticated: false, role: null, name: "", id: "" });
  }

  const value = {
    data,
    auth,
    isLoading,
    quizForm,
    draftQuestion,
    draftQuestions,
    studentForm,
    sessionConfig,
    activeSession,
    setStudentForm,
    setSessionConfig,
    setDraftQuestion,
    updateQuizForm,
    updateDraftOption,
    addDraftQuestion,
    removeDraftQuestion,
    submitQuiz,
    submitStudent,
    deleteStudent,
    deleteQuiz,
    startSession,
    setSessionAnswer,
    nextSessionQuestion,
    previousSessionQuestion,
    finishSession,
    login,
    logout
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }
  return context;
}
