import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Emails from './pages/Emails';
import Finances from './pages/Finances';
import Calendar from './pages/Calendar';
import useStore from './store/useStore';

function App() {
  const { user } = useStore();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
      <Route path="/" element={user ? <DashboardLayout /> : <Navigate to="/login" />}>
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
