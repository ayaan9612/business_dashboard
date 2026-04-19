import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Sun, Moon, Bell } from 'lucide-react';
import useStore from '../store/useStore';
import { useEffect } from 'react';

const DashboardLayout = () => {
  const { darkMode, toggleDarkMode } = useStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`flex h-screen bg-background font-sans ${darkMode ? 'dark' : ''}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-foreground">Welcome back, Developer! 👋</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
            </button>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
