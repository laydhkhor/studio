'use client';

import * as React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Clock, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Wand2,
  Timer,
  Calendar as CalendarIcon,
  Settings2,
  Layers,
  MousePointer2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  format, 
  addMinutes, 
  parse, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  eachDayOfInterval,
  isToday,
  isWithinInterval,
  startOfDay,
  endOfDay
} from 'date-fns';
import { useFirestore, setDocumentNonBlocking, deleteDocumentNonBlocking, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function CalendarManagementPage() {
  const { toast } = useToast();
  const db = useFirestore();
  
  // View State
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  
  // Multi-select Range State
  const [rangeStart, setRangeStart] = React.useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = React.useState<Date | null>(null);
  const [isRangeMode, setIsRangeMode] = React.useState(false);

  // Range Generator State
  const [startTime, setStartTime] = React.useState('10:00');
  const [endTime, setEndTime] = React.useState('14:00');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');

  // Firestore Data
  const schedulesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'doctor_schedules');
  }, [db]);

  const { data: allSchedules } = useCollection(schedulesQuery);
  const currentSchedule = allSchedules?.find(s => s.id === formattedSelectedDate);

  // Calendar Logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDateClick = (day: Date) => {
    if (isRangeMode) {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(day);
        setRangeEnd(null);
      } else {
        if (day < rangeStart) {
          setRangeEnd(rangeStart);
          setRangeStart(day);
        } else {
          setRangeEnd(day);
        }
      }
    } else {
      setSelectedDate(day);
    }
  };

  const handleGenerateSlots = () => {
    if (!db || !startTime || !endTime) return;
    
    const datesToUpdate = isRangeMode && rangeStart && rangeEnd 
      ? eachDayOfInterval({ start: rangeStart, end: rangeEnd })
      : [selectedDate];

    setIsGenerating(true);
    
    datesToUpdate.forEach(date => {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const slots: any[] = [];
      let current = parse(startTime, 'HH:mm', new Date());
      const end = parse(endTime, 'HH:mm', new Date());

      if (current >= end) return;

      while (current < end) {
        slots.push({
          time: format(current, 'HH:mm'),
          isBooked: false,
          bookingId: null
        });
        current = addMinutes(current, 10);
      }

      const docRef = doc(db, 'doctor_schedules', formattedDate);
      setDocumentNonBlocking(docRef, {
        id: formattedDate,
        date: formattedDate,
        slots: slots
      }, { merge: true });
    });

    setTimeout(() => {
      setIsGenerating(false);
      toast({ 
        title: 'Schedules Updated', 
        description: `Clinical windows populated for ${datesToUpdate.length} day(s).` 
      });
      if (isRangeMode) {
        setRangeStart(null);
        setRangeEnd(null);
        setIsRangeMode(false);
      }
    }, 1000);
  };

  const handleRemoveSlot = (index: number) => {
    if (!db || !currentSchedule || !formattedSelectedDate) return;

    const updatedSlots = currentSchedule.slots.filter((_: any, i: number) => i !== index);
    const docRef = doc(db, 'doctor_schedules', formattedSelectedDate);
    
    if (updatedSlots.length === 0) {
      deleteDocumentNonBlocking(docRef);
    } else {
      setDocumentNonBlocking(docRef, { slots: updatedSlots }, { merge: true });
    }
    
    toast({ title: 'Slot Removed', description: 'Availability has been updated.' });
  };

  const isDayInRange = (day: Date) => {
    if (!rangeStart || !rangeEnd) return false;
    return isWithinInterval(day, { start: startOfDay(rangeStart), end: endOfDay(rangeEnd) });
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-black text-slate-900 tracking-tight">Clinical Scheduler</h1>
          <p className="text-slate-500 font-medium text-sm">Define availability windows and manage daily diagnostic slots.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
            variant={isRangeMode ? "default" : "outline"} 
            className="rounded-xl h-11 px-6 font-bold shadow-sm"
            onClick={() => {
              setIsRangeMode(!isRangeMode);
              setRangeStart(null);
              setRangeEnd(null);
            }}
           >
             {isRangeMode ? <MousePointer2 className="mr-2 h-4 w-4" /> : <Layers className="mr-2 h-4 w-4" />}
             {isRangeMode ? 'Single Select Mode' : 'Range Select Mode'}
           </Button>
           <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border shadow-sm">
              <Button variant="ghost" size="icon" onClick={prevMonth} className="h-10 w-10 rounded-xl hover:bg-slate-50"><ChevronLeft className="h-5 w-5" /></Button>
              <div className="px-4 py-2 min-w-[160px] text-center">
                 <span className="font-headline font-black text-sm uppercase tracking-widest">{format(currentMonth, 'MMMM yyyy')}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={nextMonth} className="h-10 w-10 rounded-xl hover:bg-slate-50"><ChevronRight className="h-5 w-5" /></Button>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
        {/* Main Interactive Grid */}
        <div className="lg:col-span-8 h-full">
           <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden h-full flex flex-col">
              <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                   <div key={day} className="py-4 text-center">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{day}</span>
                   </div>
                 ))}
              </div>
              <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto">
                 {calendarDays.map((day, idx) => {
                    const daySchedule = allSchedules?.find(s => s.id === format(day, 'yyyy-MM-dd'));
                    const hasSlots = daySchedule && daySchedule.slots?.length > 0;
                    const isBookedOut = daySchedule?.slots?.every((s: any) => s.isBooked);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isSelected = isSameDay(day, selectedDate);
                    const isInRange = isDayInRange(day);
                    const isRangeBound = (rangeStart && isSameDay(day, rangeStart)) || (rangeEnd && isSameDay(day, rangeEnd));

                    return (
                      <button
                        key={idx}
                        onClick={() => handleDateClick(day)}
                        className={cn(
                          "relative min-h-[100px] p-4 border-r border-b border-slate-50 transition-all flex flex-col items-start gap-2 group",
                          !isCurrentMonth && "bg-slate-50/30 opacity-40",
                          isSelected && !isRangeMode ? "bg-primary/5 ring-2 ring-inset ring-primary/20 z-10" : "hover:bg-slate-50/50",
                          isInRange && "bg-primary/10",
                          isRangeBound && "ring-2 ring-inset ring-primary shadow-lg z-20",
                          isToday(day) && "bg-slate-50/80"
                        )}
                      >
                        <span className={cn(
                          "text-xs font-black h-7 w-7 flex items-center justify-center rounded-lg transition-colors",
                          (isSelected && !isRangeMode) || isRangeBound ? "bg-primary text-white" : "text-slate-400 group-hover:text-slate-900",
                          isToday(day) && !(isSelected || isRangeBound) && "bg-slate-900 text-white shadow-lg"
                        )}>
                          {format(day, 'd')}
                        </span>

                        {hasSlots && (
                          <div className="mt-auto w-full space-y-1">
                             <div className={cn(
                               "h-1 w-full rounded-full",
                               isBookedOut ? "bg-rose-400" : "bg-emerald-400"
                             )} />
                             <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-400 truncate">
                                {daySchedule.slots.length} Windows
                             </p>
                          </div>
                        )}
                      </button>
                    );
                 })}
              </div>
           </Card>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
           <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8">
                 <div className="flex items-center justify-between mb-2">
                    <CardTitle className="font-headline font-bold text-xl">
                      {isRangeMode 
                        ? (rangeStart ? `${format(rangeStart, 'MMM dd')} - ${rangeEnd ? format(rangeEnd, 'MMM dd') : '...'}` : 'Select Range') 
                        : format(selectedDate, 'PPP')}
                    </CardTitle>
                    <Settings2 className="h-5 w-5 text-slate-400" />
                 </div>
                 <CardDescription className="text-slate-400 text-xs font-medium">
                    {isRangeMode ? 'Bulk schedule configuration active.' : `${currentSchedule?.slots?.length || 0} configured diagnostic windows.`}
                 </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                 {/* Generator Tool */}
                 <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                       <Wand2 className="h-4 w-4 text-primary" />
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Rapid Slot Generator</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase text-slate-400">Shift Start</Label>
                        <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="h-10 rounded-xl bg-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase text-slate-400">Shift End</Label>
                        <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="h-10 rounded-xl bg-white" />
                      </div>
                    </div>
                    <Button 
                      onClick={handleGenerateSlots} 
                      disabled={isGenerating || (isRangeMode && !rangeEnd)} 
                      className="w-full h-11 rounded-xl shadow-lg shadow-primary/20 font-bold text-xs"
                    >
                      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                      Populate 10-Min Slots
                    </Button>
                 </div>

                 {/* Slot List (Only show in single select mode) */}
                 {!isRangeMode && (
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Timeline Preview</span>
                         <Badge variant="outline" className="bg-slate-50 text-[9px] font-bold uppercase py-0 px-2">{currentSchedule?.slots?.length || 0} Total</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                         {currentSchedule?.slots?.map((slot: any, index: number) => (
                           <div 
                             key={index} 
                             className={cn(
                               "p-3 rounded-xl border transition-all flex flex-col gap-1.5 relative group",
                               slot.isBooked 
                                 ? 'bg-slate-50 border-slate-100' 
                                 : 'bg-white border-slate-200 hover:border-primary hover:shadow-md'
                             )}
                           >
                             <div className="flex items-center justify-between">
                                <span className="font-mono font-black text-xs text-slate-700">{slot.time}</span>
                                {slot.isBooked ? (
                                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                ) : (
                                  <button 
                                    onClick={() => handleRemoveSlot(index)}
                                    className="text-slate-300 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                             </div>
                             <div className="flex items-center gap-1">
                               <Timer className={cn("h-2.5 w-2.5", slot.isBooked ? "text-emerald-500" : "text-slate-300")} />
                               <span className={cn("text-[8px] uppercase font-black tracking-widest", slot.isBooked ? 'text-emerald-600' : 'text-slate-400')}>
                                 {slot.isBooked ? 'Booked' : 'Open'}
                               </span>
                             </div>
                           </div>
                         ))}

                         {(!currentSchedule || currentSchedule.slots.length === 0) && (
                           <div className="col-span-full py-12 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center px-4">
                             <CalendarIcon className="h-8 w-8 text-slate-200 mb-2" />
                             <p className="text-[10px] font-bold text-slate-400 uppercase">No Clinical Windows</p>
                             <p className="text-[9px] text-slate-300 mt-1">Select a date and use the generator above to start.</p>
                           </div>
                         )}
                      </div>
                   </div>
                 )}

                 {isRangeMode && (
                   <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center px-6">
                      <Layers className="h-10 w-10 text-primary/20 mb-4" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Range configuration active</p>
                      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                        Slots generated now will be applied to every day between your selected start and end points.
                      </p>
                   </div>
                 )}
              </CardContent>
              <CardFooter className="bg-slate-50/50 p-6 flex items-start gap-3">
                 <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                 <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                    <strong>Safety Note:</strong> Slot generation uses 10-minute clinical offsets. Booked slots are locked to prevent schedule collisions.
                 </p>
              </CardFooter>
           </Card>
        </div>
      </div>
    </div>
  );
}