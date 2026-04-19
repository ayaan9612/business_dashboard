import React from 'react';
import useStore from '../store/useStore';
import { DollarSign, Clock, ArrowUpRight, ArrowDownRight, CreditCard, Activity } from 'lucide-react';
import { format } from 'date-fns';

const Finances = () => {
  const { projects } = useStore();

  const totalIncome = projects
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + (Number(p.budget) || 0), 0);

  const pendingPayments = projects
    .filter(p => p.status !== 'Completed')
    .reduce((sum, p) => sum + (Number(p.budget) || 0), 0);

  const transactions = projects
    .filter(p => Number(p.budget) > 0)
    .map(p => ({
      _id: p._id,
      amount: Number(p.budget),
      status: p.status === 'Completed' ? 'Paid' : 'Pending',
      date: p.deadline,
      projectTitle: p.title,
      clientName: p.clientName
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Finances</h1>
        <p className="text-muted-foreground">Track your income, pending payments, and recent transactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-8 rounded-3xl border border-border shadow-sm flex items-center gap-6 group hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform">
            <DollarSign size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Income Received</p>
            <h3 className="text-4xl font-bold text-foreground tracking-tight">${totalIncome.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-card p-8 rounded-3xl border border-border shadow-sm flex items-center gap-6 group hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl group-hover:scale-110 transition-transform">
            <Clock size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Pending Payments</p>
            <h3 className="text-4xl font-bold text-foreground tracking-tight">${pendingPayments.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Activity size={20} className="text-primary"/> 
            Transaction History
          </h3>
        </div>
        
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 p-12 text-center">
            <CreditCard size={48} className="text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Transactions Yet</h3>
            <p className="text-muted-foreground max-w-sm">When you create a project with a budget, its financial status will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Transaction / Project</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Client</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${tx.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {tx.status === 'Paid' ? <ArrowUpRight size={16} /> : <Clock size={16} />}
                        </div>
                        <span className="font-medium text-foreground">{tx.projectTitle}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{tx.clientName}</td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{format(new Date(tx.date), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${
                        tx.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-foreground">
                        ${tx.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Finances;
