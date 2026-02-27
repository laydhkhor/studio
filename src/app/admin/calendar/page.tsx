
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
import { useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
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
        {/* Creation Form */}
        <Card className="lg:col-span-5 shadow-xl border-none h-fit">
          <CardHeader className="bg-primary/5 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Plus className="h-5 w-5" /> New Session
            </CardTitle>
            <CardDescription>Select a date and working hours to open bookings.</CardDescription>
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
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input type="time" value={startTime} onChange={(e) => setTimeStart(e.target.value)} className="pl-10 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input type="time" value={endTime} onChange={(e) => setTimeEnd(e.target.value)} className="pl-10 h-12" />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>System Note:</strong> The selected hours will be automatically divided into 10-minute slots. 
                Existing unbooked slots for this date will be overwritten.
              </p>
            </div>

            <Button onClick={handleGenerateSlots} className="w-full h-12 font-bold shadow-lg shadow-primary/20" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarCheck className="mr-2 h-4 w-4" />}
              Generate Clinical Slots
            </Button>
          </CardContent>
        </Card>

        {/* Existing Schedules List */}
        <Card className="lg:col-span-7 shadow-xl border-none">
          <CardHeader>
            <CardTitle className="font-headline">Clinical Availability Pool</CardTitle>
            <CardDescription>Manage currently active dates and see booking density.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-slate-400">Loading schedules...</p>
              </div>
            ) : existingSchedules.length > 0 ? (
              <div className="space-y-4">
                {existingSchedules.map((schedule) => {
                  const bookedCount = schedule.slots?.filter((s: any) => s.isBooked).length || 0;
                  const totalCount = schedule.slots?.length || 0;
                  return (
                    <div key={schedule.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-xl text-primary">
                          <CalendarIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{format(parse(schedule.date, 'yyyy-MM-dd', new Date()), 'MMMM dd, yyyy')}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            <p className="text-xs text-slate-500 font-medium">
                              {bookedCount}/{totalCount} Slots Booked
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSchedule(schedule.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
                <CalendarIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No active schedules found.</p>
                <p className="text-xs text-slate-300">Use the form on the left to create your first session.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
