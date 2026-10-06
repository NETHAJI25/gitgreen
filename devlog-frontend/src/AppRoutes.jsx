import { Routes, Route, Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import JournalLayout from './components/journal/JournalLayout';
import JournalOverview from './components/journal/JournalOverview';
import AddEntryForm from './components/journal/AddEntryForm';
import EntryHistory from './components/journal/EntryHistory';
import JavaLearningTrack from './components/journal/JavaLearningTrack';

function RequireAuth() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleLogin = () => {
    login({ username: 'dev', email: 'dev@example.com' });
    navigate('/journal');
  };
  const handleGitHubLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  };
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-bg-secondary/50 border border-border rounded-lg text-center space-y-4">
      <h1 className="text-2xl font-bold">DevLog Login</h1>
      <p className="text-text-secondary">Sign in with GitHub to sync your journal to real commits.</p>
      <button onClick={handleGitHubLogin} className="w-full bg-journal text-white py-2 px-4 rounded-lg">
        Sign in with GitHub
      </button>
      <button onClick={handleLogin} className="w-full border border-border py-2 px-4 rounded-lg text-text-secondary">
        Continue in demo mode
      </button>
    </div>
  );
}

function DashboardSelector() {
  return (
    <div className="max-w-2xl mx-auto mt-16 p-6 text-center space-y-6">
      <h1 className="text-3xl font-bold">DevLog</h1>
      <p className="text-text-secondary">Developer journal that saves entries to GitHub as real commits.</p>
      <div className="flex gap-4 justify-center">
        <Link to="/journal" className="bg-journal text-white py-2 px-6 rounded-lg">Journal</Link>
        <Link to="/journal/java-track" className="border border-border py-2 px-6 rounded-lg">Java Track</Link>
        <Link to="/journal/history" className="border border-border py-2 px-6 rounded-lg">History</Link>
      </div>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div className="max-w-2xl mx-auto mt-16 p-6 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-text-secondary mt-2">Coming soon.</p>
      <Link to="/journal" className="text-journal underline">Back to journal</Link>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/select-dashboard" element={<DashboardSelector />} />
      <Route path="/onboarding" element={<Placeholder title="Onboarding" />} />

      <Route element={<RequireAuth />}>
        <Route path="/journal" element={<JournalLayout />}>
          <Route index element={<JournalOverview />} />
          <Route path="overview" element={<JournalOverview />} />
          <Route path="add" element={<AddEntryForm />} />
          <Route path="history" element={<EntryHistory />} />
          <Route path="java-track" element={<JavaLearningTrack />} />
          <Route path="templates" element={<Placeholder title="Templates" />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/select-dashboard" replace />} />
      <Route path="*" element={<Navigate to="/select-dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
