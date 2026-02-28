'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar as CalendarIcon, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  Video, 
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import { 
  useFirestore, 
  useUser, 
  useCollection, 
  useMemoFirebase 
} from '@/firebase';
import { 
  collection, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  setDoc,
  addDoc,
  query,
  where
} from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BookingSection({ bookingData }: { bookingData: any }) {
    const { toast } = useToast();
    const { user } = useUser();
    const db = useFirestore();
    const router = useRouter();
    
    const [selectedDate, setSelectedDate] = React.useState('');
    const [selectedSlotIndex, setSelectedSlotIndex] = React.useState<number | null>(null);
    const [isProcessing, setIsProcessing] = React.useState(false);

    // 1. Fetch live schedules from the doctor's calendar
    const schedulesQuery = useMemoFirebase(() => {
      if (!db) return null;
      return collection(db, 'doctor_schedules');
    }, [db]);

    const { data: rawSchedules, isLoading: isLoadingSchedules } = useCollection(schedulesQuery);
    
    // Filter for dates that have at least one unbooked slot
    const availableDates = React.useMemo(() => {
      if (!rawSchedules) return [];
      return rawSchedules
        .filter(s => s.slots?.some((slot: any) => !slot.isBooked))
        .sort((a, b) => a.date.localeCompare(b.date));
    }, [rawSchedules]);

    const currentSchedule = React.useMemo(() => {
      return availableDates.find(s => s.date === selectedDate);
    }, [availableDates, selectedDate]);

    const handleBookingInitiation = async () => {
      if (!user) {
        toast({ 
          variant: 'destructive', 
          title: 'Authentication Required', 
          description: 'Please sign in to secure your clinical slot.' 
        });
        router.push(`/login?redirect=/booking`);
        return;
      }

      if (!selectedDate || selectedSlotIndex === null || !currentSchedule) return;

      const slot = currentSchedule.slots[selectedSlotIndex];
      
      setIsProcessing(true);

      const options = {
        key: 'rzp_test_dummy',
        amount: 40000, // INR 400.00
        currency: 'INR',
        name: 'DocAssist Clinic',
        description: `Video Consultation - ${selectedDate} at ${slot.time}`,
        image: 'https://placehold.co/100x100/3b82f6/white?text=DA',
        handler: function (response: any) {
          finalizeBooking(slot.time, response.razorpay_payment_id || 'PAYMENT_ID_MOCK');
        },
        prefill: {
          name: user.displayName || 'Patient',
          email: user.email,
        },
        theme: {
          color: '#3b82f6',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      try {
        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          finalizeBooking(slot.time, 'MOCK_PAY_SUCCESS');
        }
      } catch (e) {
        setIsProcessing(false);
        toast({ variant: 'destructive', title: 'Payment Error', description: 'Could not connect to payment gateway.' });
      }
    };

    const finalizeBooking = async (slotTime: string, paymentId: string) => {
      if (!db || !user || !currentSchedule || selectedSlotIndex === null) return;

      const bookingId = `BK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const meetingLink = `https://meet.google.com/doc-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`;
      const appointmentDateTime = `${selectedDate}T${slotTime}:00`;

      try {
        const scheduleRef = doc(db, 'doctor_schedules', selectedDate);
        const updatedSlots = [...currentSchedule.slots];
        updatedSlots[selectedSlotIndex] = {
          ...updatedSlots[selectedSlotIndex],
          isBooked: true,
          bookingId
        };
        await updateDoc(scheduleRef, { slots: updatedSlots });

        const appointmentRef = doc(db, 'appointments', bookingId);
        await setDoc(appointmentRef, {
          id: bookingId,
          patientId: user.uid,
          doctorId: 'main-doctor', 
          appointmentDateTime,
          type: 'Video Consultation',
          status: 'Accepted',
          meetingLink,
          paymentId,
          amount: 400,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        const notificationsRef = collection(db, 'notifications');
        await addDoc(notificationsRef, {
          userId: user.uid,
          message: `Booking confirmed: Video consultation on ${format(parse(selectedDate, 'yyyy-MM-dd', new Date()), 'PPP')} at ${slotTime}.`,
          type: 'booking_accepted',
          isRead: false,
          createdAt: serverTimestamp()
        });

        toast({
          title: 'Consultation Secured!',
          description: `Your slot at ${slotTime} is confirmed. Redirecting to your dashboard...`,
        });
        
        setTimeout(() => {
          router.push('/patients-dashboard');
        }, 2000);
      } catch (error) {
        console.error('Booking Error:', error);
        toast({ 
          variant: 'destructive', 
          title: 'System Error', 
          description: 'Failed to record your appointment. Please contact support.' 
        });
        setIsProcessing(false);
      }
    };

    if (!bookingData) return null;

    return (
        <section className="bg-transparent py-10 w-full overflow-hidden" id="booking">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <div className="container px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-0 border-none rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl bg-white w-full">
                    {/* Left: Benefits & Information */}
                    <div className="lg:col-span-4 bg-slate-900 p-6 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        
                        <div className="relative z-10 space-y-8">
                            <div className="space-y-2">
                                <div className="bg-primary/20 w-fit p-3 rounded-2xl mb-4">
                                  <Stethoscope className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-headline font-bold">Video Clinic</h3>
                                <p className="text-slate-400 text-sm">Evidence-based diagnosis from your home.</p>
                            </div>
                            
                            <div className="space-y-6">
                                {[
                                  { icon: Clock, t: '10-Min Diagnostic Window', s: 'Focused clinical attention' },
                                  { icon: Video, t: 'Secure Google Meet', s: 'End-to-end encrypted connection' },
                                  { icon: ShieldCheck, t: 'Verified Digital RX', s: 'Immediate dashboard delivery' }
                                ].map((item, i) => (
                                  <div key={i} className="flex gap-4 items-start group">
                                      <div className="bg-white/5 p-2.5 rounded-xl group-hover:bg-primary/20 transition-colors shrink-0">
                                        <item.icon className="h-5 w-5 text-primary" />
                                      </div>
                                      <div>
                                        <p className="font-bold text-sm text-white">{item.t}</p>
                                        <p className="text-xs text-slate-500">{item.s}</p>
                                      </div>
                                  </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 mt-8 md:mt-12 bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                              <AlertCircle className="h-4 w-4 text-primary" />
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Patient Protocol</p>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                "Please join the session 5 minutes early with a stable connection."
                            </p>
                        </div>
                    </div>

                    {/* Right: Interaction Area */}
                    <div className="lg:col-span-8 p-6 md:p-12 space-y-8 md:space-y-12 overflow-hidden">
                        {/* 1. Date Selection */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">1. Select Consultation Date</Label>
                              {isLoadingSchedules && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                            </div>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {availableDates.length > 0 ? availableDates.map((schedule) => (
                                    <button
                                        key={schedule.id}
                                        onClick={() => {
                                          setSelectedDate(schedule.date);
                                          setSelectedSlotIndex(null);
                                        }}
                                        className={cn(
                                            "px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl border-2 transition-all font-bold text-sm flex flex-col items-center min-w-[90px] md:min-w-[110px] group",
                                            selectedDate === schedule.date 
                                                ? "border-primary bg-primary text-white shadow-xl" 
                                                : "border-slate-50 bg-slate-50 text-slate-600 hover:border-primary/20 hover:bg-white"
                                        )}
                                    >
                                        <span className={cn(
                                          "text-[9px] md:text-[10px] uppercase font-black tracking-tighter mb-1",
                                          selectedDate === schedule.date ? "text-white/70" : "text-slate-400"
                                        )}>
                                          {format(parse(schedule.date, 'yyyy-MM-dd', new Date()), 'EEE')}
                                        </span>
                                        <span className="text-base md:text-lg">{format(parse(schedule.date, 'yyyy-MM-dd', new Date()), 'dd')}</span>
                                        <span className={cn(
                                          "text-[9px] md:text-[10px] font-bold uppercase",
                                          selectedDate === schedule.date ? "text-white/80" : "text-primary"
                                        )}>
                                          {format(parse(schedule.date, 'yyyy-MM-dd', new Date()), 'MMM')}
                                        </span>
                                    </button>
                                )) : !isLoadingSchedules && (
                                  <div className="py-8 md:py-12 border-2 border-dashed border-slate-100 rounded-2xl w-full text-center bg-slate-50/50 px-4">
                                    <CalendarIcon className="h-8 w-8 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No Clinical Slots Found</p>
                                  </div>
                                )}
                            </div>
                        </div>

                        {/* 2. Slot Selection */}
                        {selectedDate && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">2. Choose Your Window</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                                    {currentSchedule?.slots?.map((slot: any, index: number) => (
                                        <button
                                            key={index}
                                            disabled={slot.isBooked}
                                            onClick={() => setSelectedSlotIndex(index)}
                                            className={cn(
                                                "p-3 md:p-4 rounded-lg md:rounded-xl border-2 font-mono text-xs md:text-sm transition-all relative overflow-hidden h-12 md:h-14 flex items-center justify-center",
                                                slot.isBooked 
                                                    ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed" 
                                                    : selectedSlotIndex === index 
                                                        ? "bg-primary/5 border-primary text-primary font-black shadow-inner" 
                                                        : "bg-white border-slate-100 text-slate-600 hover:border-primary/20 hover:shadow-sm"
                                            )}
                                        >
                                            {slot.time}
                                            {slot.isBooked && (
                                              <div className="absolute inset-0 bg-slate-100/40 flex items-center justify-center">
                                                <span className="text-[7px] md:text-[8px] uppercase font-black -rotate-12 bg-white px-1 py-0.5 rounded shadow-sm text-slate-400">Reserved</span>
                                              </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. Confirmation & Checkout */}
                        <div className="pt-6 md:pt-8 border-t border-slate-100">
                            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
                              <Button 
                                  onClick={handleBookingInitiation}
                                  size="lg" 
                                  disabled={!selectedDate || selectedSlotIndex === null || isProcessing}
                                  className="w-full sm:flex-1 h-14 md:h-16 rounded-xl md:rounded-2xl text-base md:text-lg font-black shadow-2xl shadow-primary/20 group relative overflow-hidden"
                              >
                                  {isProcessing ? (
                                    <div className="flex items-center gap-3">
                                      <Loader2 className="h-5 w-5 animate-spin" />
                                      <span className="text-sm">Contacting Gateway...</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-3">
                                      <CheckCircle2 className="h-5 w-5 transition-transform group-hover:scale-110" />
                                      <span>Secure Diagnostic Slot</span>
                                    </div>
                                  )}
                              </Button>
                              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                                  <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      <ShieldCheck className="h-4 w-4 text-emerald-500" /> Razorpay Verified 
                                  </div>
                                  <p className="text-[9px] md:text-[10px] font-bold text-slate-300 max-w-[180px] uppercase leading-tight">
                                    Instant Confirmation
                                  </p>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}