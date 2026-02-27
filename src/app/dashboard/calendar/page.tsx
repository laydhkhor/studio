
'use client';

import * as React from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  CalendarCheck
} from 'lucide-react';
import { format, addMinutes, parse } from 'date-fns';
import { useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminCalendarPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date>();
  const [startTime, setTimeStart] = React.useState('13:00');
  const [endTime, setTimeEnd] = React.useState('15:00');
  const [isSaving, setIsSaving] = React.useState(false);
  const [existingSchedules, setExistingSchedules] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchSchedules = React.useCallback(async () => {
    if (!db) return;
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'doctor_schedules'));
      const schedules = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExistingSchedules(schedules);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  React.useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleGenerateSlots = () => {
    if (!date || !startTime || !endTime) {
      toast({ variant: 'destructive', title: 'Missing Info', description: 'Please select a date and time range.' });
      return;
    }

    setIsSaving(true);
    const dateStr = format(date, 'yyyy-MM-dd');
    const start = parse(startTime, 'HH:mm', date);
    const end = parse(endTime, 'HH:mm', date);

    if (end <= start) {
      toast({ variant: 'destructive', title: 'Invalid Range', description: 'End time must be after start time.' });
      setIsSaving(false);
      return;
    }

    const slots = [];
    let current = start;
    while (current < end) {
      slots.push({
        time: format(current, 'HH:mm'),
        isBooked: false,
        bookingId: null
      });
      current = addMinutes(current, 10);
    }

    const scheduleRef = doc(db, 'doctor_schedules', dateStr);
    setDocumentNonBlocking(scheduleRef, {
      date: dateStr,
      slots,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    setTimeout(() => {
      setIsSaving(false);
      fetchSchedules();
      toast({ title: 'Schedule Created', description: `Generated ${slots.length} slots for ${dateStr}.` });
    }, 800);
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'doctor_schedules', id));
      fetchSchedules();
      toast({ title: 'Schedule Removed' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete schedule.' });
    }
  };

  return (
    <div className="space-y-8 h-full">
      <header>
        <h1 className="text-3xl font-bold font-headline text-slate-900">Manage Availability</h1>
        <p className="text-slate-500">Define your clinical hours and auto-generate 10-minute patient slots.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-5 shadow-xl border-none h-fit">
          <CardHeader className="bg-primary/5 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Plus className="h-5 w-5" /> New Session
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Consultation Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-12", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" value={startTime} onChange={(e) => setTimeStart(e.target.value)} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="time" value={endTime} onChange={(e) => setTimeEnd(e.target.value)} className="h-12" />
              </div>
            </div>

            <Button onClick={handleGenerateSlots} className="w-full h-12 font-bold shadow-lg shadow-primary/20" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarCheck className="mr-2 h-4 w-4" />}
              Generate Clinical Slots
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7 shadow-xl border-none">
          <CardHeader>
            <CardTitle className="font-headline">Clinical Availability Pool</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : existingSchedules.length > 0 ? (
              <div className="space-y-4">
                {existingSchedules.map((schedule) => (
                  <div key={schedule.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{format(parse(schedule.date, 'yyyy-MM-dd', new Date()), 'MMMM dd, yyyy')}</p>
                      <p className="text-xs text-slate-500 font-medium">{schedule.slots?.length || 0} Total Slots</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteSchedule(schedule.id)} className="text-slate-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-20 text-slate-400">No active schedules found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
