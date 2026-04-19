import { create } from 'zustand';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const useStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  darkMode: true,
  setUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    set({ user: userData, token: userData.token });
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  projects: [],
  isProjectsLoading: true,
  fetchProjects: async () => {
    const user = get().user;
    if (!user?._id) {
      set({ isProjectsLoading: false });
      return;
    }
    set({ isProjectsLoading: true });
    try {
      const q = query(collection(db, 'projects'), where('userId', '==', user._id));
      const querySnapshot = await getDocs(q);
      const fetchedProjects = [];
      querySnapshot.forEach((doc) => {
        fetchedProjects.push({ _id: doc.id, ...doc.data() });
      });
      set({ projects: fetchedProjects.sort((a, b) => b.createdAt - a.createdAt), isProjectsLoading: false });
    } catch (error) {
      console.error("Error fetching projects:", error);
      set({ isProjectsLoading: false });
    }
  },
  finances: {
    totalIncome: 0,
    pendingPayments: 0,
    recentTransactions: []
  },
  setProjects: (projects) => set({ projects }),
  updateProject: (id, updatedData) => set((state) => ({
    projects: state.projects.map((p) => (p._id === id ? { ...p, ...updatedData } : p))
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p._id !== id)
  })),
}));

export default useStore;
