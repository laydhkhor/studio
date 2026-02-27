'use client';

import * as React from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  Pill, 
  FileText, 
  ArrowRight, 
  ShieldCheck,
  User,
  HeartPulse,
  Activity,
  History,
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
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { PrescriptionCard } from '@/components/blocks/PrescriptionCard';

export default function PatientDashboardPage() {
  const { user } = useUser();
  const db = useFirestore();

  // 1. Fetch upcoming appointments from top-level collection
  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'appointments'), 
      where('patientId', '==', user.uid),
      where('status', '==', 'Accepted'),
      orderBy('appointmentDateTime', 'asc'), 
      limit(2)
    );
  }, [db, user]);

  const { data: bookings } = useCollection(bookingsQuery);

  // 2. Fetch recent prescriptions from top-level collection
  const prescriptionsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'prescriptions'), 
      where('patientId', '==', user.uid),
      orderBy('issuedDate', 'desc'), 
      limit(1)
    );
  }, [db, user]);

  const { data: recentPrescriptions } = useCollection(prescriptionsQuery);

  return (
    <div className="space-y-10 py-6">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-8 text-center md:text-left">
          <div className="bg-primary/5 p-6 rounded-[2rem] ring-1 ring-primary/10">
            <User className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="font-headline text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Health Hub</h1>
            <p className="text-slate-500 font-medium">Manage your clinical history and virtual sessions.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
           <Badge variant="outline" className="h-12 px-6 bg-emerald-50 text-emerald-600 border-emerald-100 flex items-center gap-2 font-black uppercase tracking-widest text-[10px] rounded-2xl">
             <ShieldCheck className="h-4 w-4" /> Secure Profile
           </Badge>
           <Button size="lg" className="rounded-2xl h-14 px-8 font-black text-sm shadow-xl shadow-primary/20 w-full sm:w-auto" asChild>
             <Link href="/#booking">Book Consultation</Link>
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Content: Appointments & Prescriptions */}
        <div className="lg:col-span-8 space-y-10">
           {/* Upcoming Sessions Section */}
           <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                   <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20"><Calendar className="h-5 w-5 text-white" /></div>
                   <h2 className="font-headline text-2xl font-bold text-slate-900 tracking-tight">Scheduled Sessions</h2>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary/5">
                  <Link href="/patients-dashboard/profile" className="flex items-center">Update Records <ArrowRight className="ml-2 h-3.5 w-3.5"/></Link>
                </Button>
              </div>

              <div className="grid gap-6">
                {bookings && bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <Card key={booking.id} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white rounded-[2rem]">
                      <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
                         <div className="bg-slate-50 p-8 flex flex-col items-center justify-center text-center min-w-[160px] border-r border-dashed border-slate-200">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">{format(new Date(booking.appointmentDateTime), 'EEE')}</span>
                            <span className="text-4xl font-headline font-black text-slate-900 leading-none">{format(new Date(booking.appointmentDateTime), 'dd')}</span>
                            <span className="text-[11px] font-bold text-primary mt-2 uppercase tracking-widest">{format(new Date(booking.appointmentDateTime), 'MMM yyyy')}</span>
                         </div>
                         <div className="p-8 flex-grow space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-6">
                               <div className="space-y-2">
                                  <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                    {booking.type || 'Clinical Consult'}
                                  </Badge>
                                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">Diagnostic Consultation</h3>
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Consultant: Dr. P. Pattyanayek</p>
                               </div>
                               <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                  <div className="flex flex-col items-end">
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Slot</span>
                                     <span className="font-mono text-lg font-black text-slate-700">{format(new Date(booking.appointmentDateTime), 'HH:mm')}</span>
                                  </div>
                                  <div className="bg-white p-2.5 rounded-xl shadow-sm"><Clock className="h-5 w-5 text-slate-400" /></div>
                               </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-dashed border-slate-100 gap-4">
                               <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                                    <div className="absolute inset-0 h-3 w-3 rounded-full bg-emerald-500 blur-sm animate-pulse" />
                                  </div>
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ready for connection</span>
                               </div>
                               {booking.meetingLink && (
                                 <Button size="lg" asChild className="rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-900 hover:bg-primary shadow-xl shadow-slate-900/10 transition-all px-8 h-12">
                                    <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">
                                       <Video className="mr-2 h-4 w-4" /> Start Video Meet
                                    </a>
                                 </Button>
                               )}
                            </div>
                         </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center px-10 shadow-inner">
                    <div className="bg-slate-50 p-6 rounded-[2rem] mb-6">
                      <Calendar className="h-12 w-12 text-slate-200" />
                    </div>
                    <p className="font-headline text-xl font-bold text-slate-400">No Upcoming Sessions</p>
                    <p className="text-sm text-slate-300 mt-2 max-w-xs leading-relaxed">
                      Secure your next diagnostic slot to track your wellness progress.
                    </p>
                    <Button variant="outline" className="mt-8 rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[10px] border-slate-200 hover:border-primary hover:text-primary transition-all" asChild>
                      <Link href="/#booking">Schedule New Slot</Link>
                    </Button>
                  </div>
                )}
              </div>
           </section>

           {/* Latest Prescription Section */}
           <section className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                 <div className="bg-accent p-2 rounded-xl shadow-lg shadow-accent/20"><FileText className="h-5 w-5 text-white" /></div>
                 <h2 className="font-headline text-2xl font-bold text-slate-900 tracking-tight">Recent Medical Report</h2>
              </div>
              {recentPrescriptions && recentPrescriptions.length > 0 ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <PrescriptionCard prescription={recentPrescriptions[0]} />
                </div>
              ) : (
                <Card className="border-none shadow-sm bg-slate-50/50 p-12 rounded-[2rem] text-center border-2 border-dashed border-slate-200">
                   <p className="text-sm text-slate-400 font-medium italic">"Reports are automatically generated following your consultation."</p>
                </Card>
              )}
              <div className="pt-2 text-center">
                 <Button variant="link" asChild className="text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:no-underline group">
                    <Link href="/patients-dashboard/prescriptions" className="flex items-center gap-2">
                      Access Complete Medical Archive <History className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform"/>
                    </Link>
                 </Button>
              </div>
           </section>
        </div>

        {/* Vital Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="border-none shadow-2xl shadow-slate-900/20 bg-slate-900 text-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="font-headline text-xl font-bold flex items-center gap-3">
                   <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20"><HeartPulse className="h-5 w-5 text-white" /></div>
                   Vitals Tracker
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs font-medium">Monitoring your wellness metrics.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-8">
                 {[
                   { label: 'Blood Glucose', val: '92%', icon: Activity, color: 'bg-primary' },
                   { label: 'Medication Adherence', val: '100%', icon: Pill, color: 'bg-accent' },
                   { label: 'Heart Rate Stability', val: '88%', icon: HeartPulse, color: 'bg-primary' }
                 ].map((stat, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                         <span className="flex items-center gap-2"><stat.icon className="h-3.5 w-3.5" /> {stat.label}</span>
                         <span className="text-white">{stat.val}</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                         <div className={cn("h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000", stat.color)} style={{ width: stat.val }} />
                      </div>
                   </div>
                 ))}
              </CardContent>
              <CardFooter className="bg-white/5 p-6 border-t border-white/5">
                 <p className="text-[10px] text-slate-500 text-center w-full leading-relaxed font-bold uppercase tracking-widest">
                   Data synced from Cloud Wellness API
                 </p>
              </CardFooter>
           </Card>

           <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-4 border border-slate-100">
              <CardHeader className="pb-4">
                <CardTitle className="font-headline text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clinic Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                 <div className="p-6 bg-slate-50 rounded-[2rem] flex items-center gap-5 border border-slate-100">
                    <div className="bg-white p-3 rounded-2xl shadow-sm ring-1 ring-slate-100"><ShieldCheck className="h-6 w-6 text-emerald-500" /></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Primary Physician</p>
                       <p className="text-sm font-black text-slate-800">Dr. Pritam Pattyanayek</p>
                    </div>
                 </div>
                 <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      In case of clinical emergency, please visit the Kapashda clinic or dial your local ambulance services immediately.
                    </p>
                 </div>
              </CardContent>
              <CardFooter className="px-6 pb-6">
                 <Button variant="outline" className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] border-slate-200 hover:bg-slate-50 transition-all" asChild>
                    <Link href="/contact">Message Clinic Hub</Link>
                 </Button>
              </CardFooter>
           </Card>
        </div>
      </div>
    </div>
  );
}
