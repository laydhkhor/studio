'use client';

import * as React from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Clock, 
  Loader2,
  CheckCircle2,
  AlertCircle
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
import { format } from 'date-fns';
import { useFirestore, setDocumentNonBlocking, deleteDocumentNonBlocking, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';

export default function CalendarManagementPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [newSlotTime, setNewSlotTime] = React.useState('');

  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  // Fetch current schedule for selected date
  const scheduleRef = useMemoFirebase(() => {
    if (!db || !formattedDate) return null;
    return doc(db, 'doctor_schedules', formattedDate);
  }, [db, formattedDate]);

  const schedulesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'doctor_schedules');
  }, [db]);

  const { data: allSchedules } = useCollection(schedulesQuery);
  const currentSchedule = allSchedules?.find(s => s.id === formattedDate);

  const handleAddSlot = () => {
    if (!db || !formattedDate || !newSlotTime) return;

    const existingSlots = currentSchedule?.slots || [];
    if (existingSlots.some((s: any) => s.time === newSlotTime)) {
      toast({ variant: 'destructive', title: 'Error', description: 'This slot already exists.' });
      return;
    }

    const updatedSlots = [...existingSlots, { time: newSlotTime, isBooked: false, bookingId: null }];
    // Sort slots by time
    updatedSlots.sort((a, b) => a.time.localeCompare(b.time));

    const docRef = doc(db, 'doctor_schedules', formattedDate);
    setDocumentNonBlocking(docRef, {
      id: formattedDate,
      date: formattedDate,
      slots: updatedSlots
    }, { merge: true });

    setNewSlotTime('');
    toast({ title: 'Slot Added', description: `New availability for ${newSlotTime} on ${formattedDate}.` });
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
        <h1 className="font-headline text-3xl font-bold">Slot Management</h1>
        <p className="text-muted-foreground font-ui">Define your clinical availability for digital consultations.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Calendar Selection */}
        <Card className="md:col-span-5 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Select Date</CardTitle>
            <CardDescription>Pick a date to manage your clinical windows.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-none"
              fromDate={new Date()}
            />
          </CardContent>
        </Card>

        {/* Slot Editor */}
        <Card className="md:col-span-7 border-none shadow-sm">
          <CardHeader className="bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline">{formattedDate ? format(selectedDate!, 'PPP') : 'Select a date'}</CardTitle>
                <CardDescription>
                  {currentSchedule?.slots?.length || 0} slots configured for this day.
                </CardDescription>
              </div>
              {currentSchedule?.slots?.length > 0 && (
                <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5">Active Schedule</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="slot-time" className="text-xs uppercase font-bold text-slate-400 tracking-wider">New 10-Min Slot (e.g. 14:30)</Label>
                <div className="flex gap-2">
                   <Input 
                    id="slot-time" 
                    type="time" 
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                    className="h-11"
                  />
                  <Button onClick={handleAddSlot} disabled={!newSlotTime} className="h-11 px-6">
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Configured Clinical Windows</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentSchedule?.slots?.map((slot: any, index: number) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-xl border flex flex-col gap-2 relative group ${slot.isBooked ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-primary transition-all'}`}
                  >
                    <div className="flex items-center justify-between">
                       <span className="font-mono font-bold text-sm">{slot.time}</span>
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
                    <span className={`text-[9px] uppercase font-black tracking-tighter ${slot.isBooked ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {slot.isBooked ? 'Booked' : 'Available'}
                    </span>
                  </div>
                ))}

                {(!currentSchedule || currentSchedule.slots.length === 0) && (
                  <div className="col-span-full py-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400">
                    <Clock className="h-10 w-10 mb-2 opacity-20" />
                    <p className="text-sm font-medium">No slots defined yet.</p>
                    <p className="text-xs">Add a time above to start taking appointments.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/30 py-4 flex items-center gap-3">
             <AlertCircle className="h-4 w-4 text-primary shrink-0" />
             <p className="text-[10px] text-muted-foreground leading-relaxed">
               <strong>Note:</strong> Once a slot is booked by a patient, it cannot be deleted from this view. Managing cancellations is handled in the Patients tab.
             </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
