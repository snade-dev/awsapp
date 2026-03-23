import { Navigate, Route, Routes } from "react-router-dom";
import { AppDataProvider, useAppData } from "./context/AppDataContext";
import { AppLayout } from "./components/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { QuizzesPage } from "./pages/QuizzesPage";
import { StudentsPage } from "./pages/StudentsPage";
import { SessionPage } from "./pages/SessionPage";
import { ResultsPage } from "./pages/ResultsPage";
import { StudentHomePage } from "./pages/StudentHomePage";
import { LoginPage } from "./pages/LoginPage";

export default function App() {
  return (
    <AppDataProvider>
      <AppRoutes />
    </AppDataProvider>
  );
}

function AppRoutes() {
  const { auth } = useAppData();

  return (
    <Routes>
      <Route path="/connexion" element={<LoginPage />} />
      <Route path="/" element={<Navigate to={auth.isAuthenticated ? (auth.role === "teacher" ? "/enseignant" : "/etudiant") : "/connexion"} replace />} />
      <Route
        path="/enseignant"
        element={
          <ProtectedRoute allowRole="teacher">
            <AppLayout
              role="teacher"
              title="Espace enseignant"
              description="Creez des quiz, gerez les etudiants et suivez les resultats depuis un espace dedie."
            />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="quiz" element={<QuizzesPage />} />
        <Route path="etudiants" element={<StudentsPage />} />
        <Route path="resultats" element={<ResultsPage />} />
      </Route>
      <Route
        path="/etudiant"
        element={
          <ProtectedRoute allowRole="student">
            <AppLayout
              role="student"
              title="Espace etudiant"
              description="Selectionnez un quiz puis repondez question par question dans une interface reservee aux etudiants."
            />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentHomePage />} />
        <Route path="session" element={<SessionPage />} />
      </Route>
      <Route path="*" element={<Navigate to={auth.isAuthenticated ? "/" : "/connexion"} replace />} />
    </Routes>
  );
}

function ProtectedRoute({ allowRole, children }) {
  const { auth } = useAppData();
  if (!auth.isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }
  if (allowRole && auth.role !== allowRole) {
    return <Navigate to={auth.role === "teacher" ? "/enseignant" : "/etudiant"} replace />;
  }
  return children;
}
