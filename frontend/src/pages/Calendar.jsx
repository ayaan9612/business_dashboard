import React, { useState } from 'react';
import useStore from '../store/useStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';

const Calendar = () => {
  const { projects } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Calendar</h1>
          <p className="text-muted-foreground">Track project timelines, start dates, and deadlines.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-card p-2 rounded-2xl border border-border shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground">
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold text-foreground min-w-[140px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/20">
          {weekDays.map(day => (
            <div key={day} className="py-4 text-center text-sm font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-border gap-[1px]">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            // Find projects starting or ending on this day
            const startingProjects = projects.filter(p => p.createdAt && isSameDay(new Date(p.createdAt), day));
            // Note: p.deadline could be YYYY-MM-DD string, new Date() handles it fine. We'll adjust timezones if needed by creating a safe date.
            const endingProjects = projects.filter(p => {
              if (!p.deadline) return false;
              // Add T12:00:00 to avoid timezone shifts making it fall on the previous day
              const deadlineStr = p.deadline.includes('T') ? p.deadline : `${p.deadline}T12:00:00`;
              return isSameDay(new Date(deadlineStr), day);
            });

            return (
              <div 
                key={day.toString()} 
                className={`bg-card p-2 md:p-3 hover:bg-muted/30 transition-colors flex flex-col min-h-[120px] ${!isCurrentMonth ? 'opacity-50' : ''}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-primary text-primary-foreground shadow-md' : 'text-foreground'}`}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div className="flex-1 space-y-1.5 overflow-y-auto">
                  {startingProjects.map(p => (
                    <div key={`start-${p._id}`} className="text-xs px-2 py-1.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg truncate font-medium group relative cursor-default shadow-sm" title={`Started: ${p.title}`}>
                      🚀 Start: {p.title}
                    </div>
                  ))}
                  
                  {endingProjects.map(p => (
                    <div key={`end-${p._id}`} className={`text-xs px-2 py-1.5 border rounded-lg truncate font-medium group relative cursor-default shadow-sm ${
                      p.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                      p.priority === 'High' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`} title={`Due: ${p.title} (${p.status})`}>
                      🎯 Due: {p.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
