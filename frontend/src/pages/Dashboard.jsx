import useStore from '../store/useStore';
import { DollarSign, FolderKanban, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
  <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-foreground tracking-tight">{value}</h3>
        {trend && (
          <p className="text-xs font-medium text-emerald-500 flex items-center gap-1 mt-2 bg-emerald-500/10 w-fit px-2 py-0.5 rounded-full">
            <TrendingUp size={12} /> {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { projects, finances } = useStore();

  const activeProjects = projects.filter(p => p.status !== 'Completed').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Overview</h1>
        <p className="text-muted-foreground">Here's what's happening with your freelance business today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Earnings" 
          value={`$${finances.totalIncome.toLocaleString()}`} 
          icon={DollarSign} 
          trend="+12.5% this month"
          colorClass="bg-primary/10 text-primary"
        />
        <StatCard 
          title="Pending Payments" 
          value={`$${finances.pendingPayments.toLocaleString()}`} 
          icon={Clock} 
          colorClass="bg-amber-500/10 text-amber-500"
        />
        <StatCard 
          title="Active Projects" 
          value={activeProjects} 
          icon={FolderKanban} 
          colorClass="bg-blue-500/10 text-blue-500"
        />
        <StatCard 
          title="Completed" 
          value={completedProjects} 
          icon={CheckCircle} 
          colorClass="bg-emerald-500/10 text-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="text-xl font-semibold text-foreground">Recent Projects</h3>
            <button className="text-sm text-primary hover:underline font-medium">View All</button>
          </div>
          <div className="divide-y divide-border">
            {projects.slice(0, 3).map((project) => (
              <div key={project._id} className="p-6 hover:bg-muted/50 transition-colors flex items-center justify-between group">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary font-bold shadow-sm">
                    {project.title.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{project.title}</h4>
                    <p className="text-sm text-muted-foreground">{project.clientName}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                    project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                    project.status === 'In Progress' ? 'bg-primary/10 text-primary' : 
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {project.status}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={14} />
                    <span>Due {formatDistanceToNow(new Date(project.deadline), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-xl font-semibold text-foreground">Recent Transactions</h3>
          </div>
          <div className="p-6 space-y-6">
            {finances.recentTransactions.map((tx) => (
              <div key={tx._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${tx.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{tx.projectTitle}</p>
                    <p className="text-xs text-muted-foreground">{tx.status}</p>
                  </div>
                </div>
                <span className="font-bold text-foreground">${tx.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
