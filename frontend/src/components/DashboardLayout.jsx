import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Sun, Moon, Bell, Menu } from 'lucide-react';
import useStore from '../store/useStore';
import { useEffect, useState } from 'react';

const DashboardLayout = () => {
  const { darkMode, toggleDarkMode, fetchProjects, user } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchProjects();
    }
  }, [user?._id, fetchProjects]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`flex h-screen bg-background font-sans ${darkMode ? 'dark' : ''}`}>
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar container */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative w-full lg:w-auto">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-foreground hidden sm:block">Welcome back, Developer! 👋</h2>
            <h2 className="text-lg font-semibold text-foreground sm:hidden">Dashboard</h2>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
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
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
