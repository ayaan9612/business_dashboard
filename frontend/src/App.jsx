import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Emails from './pages/Emails';

// Mock empty components for other routes
const Finances = () => <div className="p-8"><h1 className="text-2xl font-bold">Finances</h1><p className="text-muted-foreground mt-2">Finance tracking coming soon.</p></div>;
const Calendar = () => <div className="p-8"><h1 className="text-2xl font-bold">Calendar</h1><p className="text-muted-foreground mt-2">Calendar view coming soon.</p></div>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="finances" element={<Finances />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="emails" element={<Emails />} />
      </Route>
    </Routes>
  );
}

export default App;
