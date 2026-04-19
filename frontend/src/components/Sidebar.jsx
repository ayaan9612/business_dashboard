import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, DollarSign, Calendar, Settings, LogOut, Mail, X } from 'lucide-react';
import useStore from '../store/useStore';
import clsx from 'clsx';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
    logout();
    navigate('/login');
  };


  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Finances', path: '/finances', icon: DollarSign },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Email Hub', path: '/emails', icon: Mail },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-card border-r border-border px-4 py-6 shadow-sm">
      <div className="flex items-center justify-between px-2 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/30">
            F
          </div>
          <span className="text-xl font-semibold text-foreground tracking-tight">FreelanceHub</span>
        </div>
        <button 
          onClick={onClose} 
          className="lg:hidden p-1.5 text-muted-foreground hover:bg-muted rounded-xl"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={20} className={clsx("transition-transform group-hover:scale-110", isActive && "text-primary-foreground")} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-border">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-medium shadow-md">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
        </div>
        
        <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
