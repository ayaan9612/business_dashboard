import { useState } from 'react';
import useStore from '../store/useStore';
import { Mail, Sparkles, Plus, Check, Loader2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const Emails = () => {
  const [emailText, setEmailText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const { projects, setProjects } = useStore();

  const handleCreateProject = () => {
    if (parsedData) {
      setProjects([parsedData, ...projects]);
      setParsedData(null);
      setEmailText('');
      alert('Project created successfully from email!');
    }
  };

  const handleParse = () => {
    if (!emailText) return;
    setIsParsing(true);
    setParsedData(null);

    // Simulate AI parsing delay
    setTimeout(() => {
      // Mock AI extraction logic
      const budgetMatch = emailText.match(/\$([\d,]+)/);
      const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : 0;
      
      const deadlineMatch = emailText.match(/by\s+([A-Za-z]+\s+\d+)/i) || emailText.match(/deadline is\s+([A-Za-z]+\s+\d+)/i);
      
      const nameMatch = emailText.match(/(?:Thanks|Regards|Sincerely|Best),?\s*\n+([A-Za-z\s]+)/i);
      const extractedName = nameMatch ? nameMatch[1].trim() : 'Extracted Client';

      const parsed = {
        _id: Date.now().toString(),
        title: emailText.split('\n')[0].substring(0, 30) || 'New Project',
        clientName: extractedName,
        description: emailText,
        budget: budget,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Default +14 days if not found
        priority: budget > 5000 ? 'High' : 'Medium',
        progress: 0,
        status: 'Pending',
        parsedFromEmail: true
      };

      setParsedData(parsed);
      setIsParsing(false);
    }, 2000);
  };


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">AI Email Parser</h1>
          <p className="text-muted-foreground">Automatically extract project details from client emails.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Section */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="text-primary" size={20} />
            <h3 className="text-xl font-semibold text-foreground">Simulate Incoming Email</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Paste a client email below to see the AI extract the project requirements, budget, and deadline.</p>
          
          <textarea
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            className="w-full flex-1 min-h-[300px] bg-background border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
            placeholder="Hi there,&#10;&#10;I need a new e-commerce website for my clothing brand. We need it to be mobile responsive and have a payment gateway integrated.&#10;&#10;Our budget is around $8,500 and we need it done by October 15th.&#10;&#10;Thanks,&#10;Sarah"
          />
          
          <button
            onClick={handleParse}
            disabled={isParsing || !emailText}
            className="mt-4 w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-primary-foreground py-3 rounded-xl font-medium shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all"
          >
            {isParsing ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Parse Email
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm flex flex-col relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-primary" size={20} />
            <h3 className="text-xl font-semibold text-foreground">AI Extracted Data</h3>
          </div>

          {!parsedData && !isParsing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
              <Sparkles size={48} className="mb-4" />
              <p className="text-lg font-medium text-foreground">Waiting for email input</p>
              <p className="text-sm text-muted-foreground mt-2">Parsed details will appear here.</p>
            </div>
          )}

          {isParsing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <Sparkles size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
              </div>
              <p className="mt-4 text-primary font-medium animate-pulse">Extracting project parameters...</p>
            </div>
          )}

          {parsedData && (
            <div className="flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-muted/50 rounded-xl p-4 mb-4 border border-border">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-1"><Check size={12}/> Successfully Parsed</p>
                <h4 className="text-lg font-bold text-foreground mb-1">{parsedData.title}</h4>
                <p className="text-sm text-muted-foreground">{parsedData.clientName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-background rounded-lg p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Budget</p>
                  <p className="font-semibold text-foreground">${parsedData.budget.toLocaleString()}</p>
                </div>
                <div className="bg-background rounded-lg p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                  <p className="font-semibold text-foreground">{format(new Date(parsedData.deadline), 'MMM d, yyyy')}</p>
                </div>
                <div className="bg-background rounded-lg p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Priority</p>
                  <p className={`font-semibold ${parsedData.priority === 'High' ? 'text-destructive' : 'text-amber-500'}`}>{parsedData.priority}</p>
                </div>
              </div>

              <div className="mb-auto">
                 <p className="text-sm font-medium text-foreground mb-2">Requirements / Notes</p>
                 <div className="bg-background rounded-lg p-3 border border-border text-sm text-muted-foreground line-clamp-4">
                   {parsedData.description}
                 </div>
              </div>

              <button
                onClick={handleCreateProject}
                className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Plus size={18} /> Create Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Emails;
