import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, DollarSign, AlignLeft, Target, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

const NewProjectModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    description: '',
    deadline: '',
    budget: '',
    priority: 'Medium'
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        ...initialData,
        deadline: initialData.deadline ? format(new Date(initialData.deadline), 'yyyy-MM-dd') : ''
      });
    } else if (isOpen) {
      setFormData({ title: '', clientName: '', description: '', deadline: '', budget: '', priority: 'Medium' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <h2 className="text-xl font-bold text-foreground">{initialData ? 'Edit Project' : 'Create New Project'}</h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Briefcase size={16} className="text-primary"/> Project Title
              </label>
              <input 
                required
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. E-commerce Redesign"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Target size={16} className="text-primary"/> Client Name
              </label>
              <input 
                required
                type="text" 
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <AlignLeft size={16} className="text-primary"/> Description / Requirements
            </label>
            <textarea 
              rows="3"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the project..."
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <CalendarIcon size={16} className="text-primary"/> Deadline
              </label>
              <input 
                required
                type="date" 
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <DollarSign size={16} className="text-primary"/> Budget ($)
              </label>
              <input 
                type="number" 
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Priority</label>
              <select 
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground appearance-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md shadow-primary/20 transition-all active:scale-95"
            >
              {initialData ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default NewProjectModal;
