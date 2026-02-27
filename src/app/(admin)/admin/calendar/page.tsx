'use client';

import * as React from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Clock, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Wand2,
  Timer
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
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { format, addMinutes, parse } from 'date-fns';
import { useFirestore, setDocumentNonBlocking, deleteDocumentNonBlocking, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function CalendarManagementPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  
  // Range Generator State
  const [startTime, setStartTime] = React.useState('10:00');
  const [endTime, setEndTime] = React.useState('14:00');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  const schedulesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'doctor_schedules');
  }, [db]);

  const { data: allSchedules } = useCollection(schedulesQuery);
  const currentSchedule = allSchedules?.find(s => s.id === formattedDate);

  const handleGenerateSlots = () => {
    if (!db || !formattedDate || !startTime || !endTime) return;
    
    setIsGenerating(true);
    const slots: any[] = [];
    let current = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());

    if (current >= end) {
      toast({ variant: 'destructive', title: 'Invalid Range', description: 'Start time must be before end time.' });
      setIsGenerating(false);
      return;
    }

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

    setTimeout(() => {
      setIsGenerating(false);
      toast({ title: 'Slots Generated', description: `${slots.length} windows created for ${formattedDate}.` });
    }, 800);
  };

  const handleRemoveSlot = (index: number) => {
    if (!db || !currentSchedule || !formattedDate) return;

    const updatedSlots = currentSchedule.slots.filter((_: any, i: number) => i !== index);
    const docRef = doc(db, 'doctor_schedules', formattedDate);
    
    if (updatedSlots.length === 0) {
      deleteDocumentNonBlocking(docRef);
    } else {
      setDocumentNonBlocking(docRef, { slots: updatedSlots }, { merge: true });
    }
    
    toast({ title: 'Slot Removed', description: 'Availability has been updated.' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Clinical Scheduler</h1>
        <p className="text-muted-foreground font-ui text-sm">Define your availability windows and manage patient diagnostic slots.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Date Picker */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Select Date</CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full flex items-center justify-center rounded-md border-none"
                fromDate={new Date()}
              />
            </CardContent>
          </Card>

          {/* Range Generator Tool */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Slot Generator</CardTitle>
              <CardDescription className="text-[10px]">Auto-generate 10-min clinical windows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Start Time</Label>
                  <Input type="time" id="start" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="h-10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">End Time</Label>
                  <Input type="time" id="end" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="h-10 rounded-xl" />
                </div>
              </div>
              <Button onClick={handleGenerateSlots} disabled={isGenerating} className="w-full h-11 rounded-xl shadow-lg shadow-primary/20 font-bold">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
                Generate Timeline
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Slot Management */}
        <Card className="lg:col-span-8 border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline font-bold text-xl">{formattedDate ? format(selectedDate!, 'PPP') : 'Select a date'}</CardTitle>
                <CardDescription className="text-xs">
                  {currentSchedule?.slots?.length || 0} windows configured for this day.
                </CardDescription>
              </div>
              {currentSchedule?.slots?.length > 0 && (
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 text-[10px] font-bold uppercase tracking-widest px-3 py-1">Active Timeline</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {currentSchedule?.slots?.map((slot: any, index: number) => (
                <div 
                  key={index} 
                  className={cn(
                    "p-4 rounded-2xl border transition-all flex flex-col gap-2 relative group",
                    slot.isBooked 
                      ? 'bg-slate-50 border-slate-100 opacity-60' 
                      : 'bg-white border-slate-200 hover:border-primary hover:shadow-md'
                  )}
                >
                  <div className="flex items-center justify-between">
                     <span className="font-mono font-black text-sm text-slate-700">{slot.time}</span>
                     {slot.isBooked ? (
                       <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                     ) : (
                       <button 
                         onClick={() => handleRemoveSlot(index)}
                         className="text-slate-300 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all p-1"
                       >
                         <Trash2 className="h-3.5 w-3.5" />
                       </button>
                     )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Timer className={cn("h-3 w-3", slot.isBooked ? "text-emerald-500" : "text-slate-300")} />
                    <span className={cn("text-[9px] uppercase font-black tracking-widest", slot.isBooked ? 'text-emerald-600' : 'text-slate-400')}>
                      {slot.isBooked ? 'Patient Booked' : 'Available'}
                    </span>
                  </div>
                </div>
              ))}

              {(!currentSchedule || currentSchedule.slots.length === 0) && (
                <div className="col-span-full py-24 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center px-6">
                  <div className="bg-slate-50 p-6 rounded-full mb-4">
                    <CalendarIcon className="h-10 w-10 text-slate-200" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">Clinical Calendar is Empty</p>
                  <p className="text-xs text-slate-300 mt-1 max-w-xs">Use the Slot Generator on the left to quickly populate diagnostic windows for this date.</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/30 py-4 border-t border-slate-50">
             <div className="flex items-center gap-3 w-full">
                <AlertCircle className="h-4 w-4 text-primary shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                  <strong>Clinical Note:</strong> Booked slots are locked for patient safety. Cancellations must be processed via the Appointments module.
                </p>
             </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
