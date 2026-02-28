'use client';

import * as React from 'react';
import { 
  CalendarDays, 
  Search, 
  Clock,
  Video, 
  Loader2
} from 'lucide-react';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { query, orderBy, collection } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AppointmentsPage() {
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Fetch all appointments from the flat collection
  const bookingsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'appointments'), orderBy('appointmentDateTime', 'desc'));
  }, [db]);

  const { data: bookings, isLoading } = useCollection(bookingsQuery);

  const filteredBookings = React.useMemo(() => {
    if (!bookings) return [];
    return bookings.filter(b => 
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bookings, searchTerm]);

  const upcoming = filteredBookings.filter(b => new Date(b.appointmentDateTime) >= new Date());
  const past = filteredBookings.filter(b => new Date(b.appointmentDateTime) < new Date());

  const BookingList = ({ list }: { list: any[] }) => (
    <div className="space-y-4">
      {list.length > 0 ? (
        list.map((booking) => (
          <Card key={booking.id} className="border-none shadow-sm hover:shadow-md transition-all group bg-white overflow-hidden">
            <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
               <div className="bg-slate-50 p-6 flex flex-col items-center justify-center text-center min-w-[140px] border-r border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{format(new Date(booking.appointmentDateTime), 'EEE')}</span>
                  <span className="text-3xl font-headline font-black text-slate-900 leading-none">{format(new Date(booking.appointmentDateTime), 'dd')}</span>
                  <span className="text-xs font-bold text-primary mt-1">{format(new Date(booking.appointmentDateTime), 'MMM yyyy')}</span>
               </div>
               <div className="p-6 flex-grow space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[9px] font-bold uppercase tracking-widest">{booking.type || 'Clinical Consult'}</Badge>
                           <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest">{booking.status}</Badge>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Booking: {booking.id}</h3>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Patient ID: {booking.patientId.substring(0, 12)}</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Time Slot</span>
                           <span className="font-mono font-bold text-slate-700">{format(new Date(booking.appointmentDateTime), 'HH:mm')}</span>
                        </div>
                        <div className="bg-slate-100 p-2.5 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all"><Clock className="h-4 w-4 text-slate-400" /></div>
                     </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-dashed border-slate-100">
                     <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", new Date(booking.appointmentDateTime) >= new Date() ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {new Date(booking.appointmentDateTime) >= new Date() ? 'Session Ready' : 'Session Completed'}
                        </span>
                     </div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl h-9 text-xs font-bold border-slate-200" asChild>
                           <Link href={`/admin/patients?id=${booking.patientId}`}>View Record</Link>
                        </Button>
                        {booking.meetingLink && (
                          <Button size="sm" asChild className="rounded-xl h-9 text-xs font-bold bg-slate-900 hover:bg-primary transition-colors">
                             <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Video className="mr-2 h-3.5 w-3.5" /> Join Meet
                             </a>
                          </Button>
                        )}
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="py-24 text-center flex flex-col items-center gap-3 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
           <div className="bg-slate-50 p-6 rounded-full"><CalendarDays className="h-10 w-10 text-slate-200" /></div>
           <p className="font-bold text-slate-400">No appointments in this category.</p>
           <p className="text-xs text-slate-300 max-w-xs mx-auto">Appointments will appear here once booked by patients through the clinical portal.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Clinical Sessions</h1>
          <p className="text-muted-foreground font-ui text-sm">Manage your upcoming diagnostic calls and review history.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
              <Input 
                placeholder="Search sessions..." 
                className="pl-10 h-11 bg-white border-slate-200 rounded-xl" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] h-12 bg-white border p-1 rounded-2xl">
          <TabsTrigger value="upcoming" className="rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
            Past Records
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-8">
          {isLoading ? (
            <div className="py-32 text-center">
               <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing Appointments...</p>
            </div>
          ) : (
            <>
              <TabsContent value="upcoming">
                <BookingList list={upcoming} />
              </TabsContent>
              <TabsContent value="past">
                <BookingList list={past} />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
}