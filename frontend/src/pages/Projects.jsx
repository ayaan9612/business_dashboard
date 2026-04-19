import { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { Plus, Search, Filter, Clock, MoreVertical, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import NewProjectModal from '../components/NewProjectModal';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const ProjectCard = ({ project, onEdit }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { deleteProject, updateProject } = useStore();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setConfirmDelete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFinish = async () => {
    updateProject(project._id, { status: 'Completed', progress: 100 });
    setIsDropdownOpen(false);
    try {
      await updateDoc(doc(db, 'projects', project._id), { status: 'Completed', progress: 100 });
    } catch (error) {
      console.error("Error updating project in DB", error);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (confirmDelete) {
      deleteProject(project._id);
      setIsDropdownOpen(false);
      try {
        await deleteDoc(doc(db, 'projects', project._id));
      } catch (error) {
        console.error("Error deleting project in DB", error);
      }
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg transition-all group flex flex-col relative">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
          project.priority === 'High' ? 'bg-destructive/10 text-destructive' :
          project.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
          'bg-blue-500/10 text-blue-500'
        }`}>
          {project.status === 'Completed' ? 'Completed' : `${project.priority} Priority`}
        </span>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`text-muted-foreground hover:text-foreground transition-opacity ${isDropdownOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          >
            <MoreVertical size={20} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl border border-border shadow-xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="py-1">
                <button 
                  onClick={() => { onEdit(project); setIsDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                >
                  <Edit2 size={14} className="text-primary"/> Edit Project
                </button>
                {project.status !== 'Completed' && (
                  <button 
                    onClick={handleFinish}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <CheckCircle size={14} className="text-emerald-500"/> Mark as Finished
                  </button>
                )}
                <button 
                  onClick={handleDelete}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 border-t border-border mt-1 transition-colors ${
                    confirmDelete ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'text-destructive hover:bg-destructive/10'
                  }`}
                >
                  <Trash2 size={14} /> {confirmDelete ? 'Confirm Delete' : 'Delete Project'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">{project.title}</h3>
      <p className="text-sm text-muted-foreground mb-6 font-medium">{project.clientName}</p>
      
      <div className="mt-auto">
        <div className="flex justify-between text-sm mb-2 font-medium">
          <span className="text-foreground">Progress</span>
          <span className="text-primary">{project.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mb-6 overflow-hidden">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ease-out ${project.status === 'Completed' ? 'bg-emerald-500' : 'bg-primary'}`}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
            <Clock size={14} className="text-primary" />
            <span className="font-medium">{format(new Date(project.deadline), 'MMM d, yyyy')}</span>
          </div>
          <div className="font-bold text-foreground bg-primary/10 text-primary px-3 py-1.5 rounded-lg">
            ${project.budget.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const { user, projects, setProjects, updateProject, isProjectsLoading } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateOrUpdateProject = async (data) => {
    if (projectToEdit) {
      const updatedData = {
        ...data,
        budget: Number(data.budget) || 0,
      };
      updateProject(projectToEdit._id, updatedData);
      try {
        await updateDoc(doc(db, 'projects', projectToEdit._id), updatedData);
      } catch (error) {
        console.error("Error updating project", error);
      }
    } else {
      const newProjectData = {
        ...data,
        progress: 0,
        status: 'Pending',
        budget: Number(data.budget) || 0,
        userId: user._id,
        createdAt: Date.now()
      };
      
      try {
        const docRef = await addDoc(collection(db, 'projects'), newProjectData);
        const newProject = { _id: docRef.id, ...newProjectData };
        setProjects([newProject, ...projects]);
      } catch (error) {
        console.error("Error adding project", error);
      }
    }
    setIsModalOpen(false);
    setProjectToEdit(null);
  };

  const openNewProjectModal = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const filteredProjects = projects.filter((project) => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    project.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Projects</h1>
          <p className="text-muted-foreground">Manage your active, pending, and completed projects.</p>
        </div>
        <button 
          onClick={openNewProjectModal}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl font-medium shadow-md shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="flex gap-4 bg-card p-2 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search projects by title or client..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <div className="w-px bg-border my-2"></div>
        <button className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl flex items-center gap-2 transition-colors font-medium text-sm">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {isProjectsLoading ? (
        <div className="flex justify-center items-center p-12 flex-1">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-2xl border border-dashed border-border flex-1">
          <Search size={48} className="text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
          <p className="text-muted-foreground max-w-sm">We couldn't find any projects matching your search query. Try adjusting your filters or create a new project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} onEdit={openEditModal} />
          ))}
        </div>
      )}

      <NewProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateOrUpdateProject}
        initialData={projectToEdit}
      />
    </div>
  );
};

export default Projects;
