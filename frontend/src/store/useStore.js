import { create } from 'zustand';

// Use mock data to demonstrate the UI until the backend is fully wired up
const mockProjects = [
  { _id: '1', title: 'E-commerce Redesign', clientName: 'Acme Corp', deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), progress: 65, status: 'In Progress', priority: 'High', budget: 5000 },
  { _id: '2', title: 'Mobile App MVP', clientName: 'Startup Inc', deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), progress: 30, status: 'Pending', priority: 'Medium', budget: 12000 },
  { _id: '3', title: 'Landing Page Optimization', clientName: 'SaaS Co', deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), progress: 100, status: 'Completed', priority: 'Low', budget: 1500 },
];

const mockFinances = {
  totalIncome: 24500,
  pendingPayments: 8500,
  recentTransactions: [
    { _id: 't1', amount: 2500, type: 'Income', status: 'Paid', date: new Date(), projectTitle: 'Website Fixes' },
    { _id: 't2', amount: 5000, type: 'Income', status: 'Pending', date: new Date(), projectTitle: 'E-commerce Redesign' },
  ]
};

const useStore = create((set) => ({
  user: { name: 'Admin', role: 'Admin', email: 'admin@example.com' },
  darkMode: true,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  projects: mockProjects,
  finances: mockFinances,
  setProjects: (projects) => set({ projects }),
  updateProject: (id, updatedData) => set((state) => ({
    projects: state.projects.map((p) => (p._id === id ? { ...p, ...updatedData } : p))
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p._id !== id)
  })),
}));

export default useStore;
