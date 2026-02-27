'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, ShieldCheck, CheckCircle2, Clock, Loader2, Video } from 'lucide-react';
import { useFirestore, useUser, setDocumentNonBlocking, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
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
    
    const [selectedDate, setSelectedDate] = React.useState('');
    const [selectedSlotIndex, setSelectedSlotIndex] = React.useState<number | null>(null);
    const [isProcessing, setIsProcessing] = React.useState(false);

    // Fetch live schedules
    const schedulesQuery = useMemoFirebase(() => {
      if (!db) return null;
      return collection(db, 'doctor_schedules');
    }, [db]);

    const { data: rawSchedules } = useCollection(schedulesQuery);
    
    const availableDates = React.useMemo(() => {
      if (!rawSchedules) return [];
      return rawSchedules.filter(s => s.slots?.some((slot: any) => !slot.isBooked));
    }, [rawSchedules]);

    const currentSchedule = React.useMemo(() => {
      return availableDates.find(s => s.date === selectedDate);
    }, [availableDates, selectedDate]);

    const handleRazorpayPayment = async (slotTime: string) => {
      if (!user) {
        toast({ variant: 'destructive', title: 'Login Required', description: 'Please sign in to book an appointment.' });
        return;
      }

      setIsProcessing(true);

      // Payment Details
      const options = {
        key: 'rzp_test_dummykey', // This is a placeholder for demo purposes
        amount: 40000, // INR 400 in paise
        currency: 'INR',
        name: 'DocAssist Clinic',
        description: `Video Consultation - ${selectedDate} at ${slotTime}`,
        image: 'https://placehold.co/100x100/3b82f6/white?text=DA',
        handler: function (response: any) {
          confirmBooking(slotTime, response.razorpay_payment_id);
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
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (e) {
        setIsProcessing(false);
        toast({ variant: 'destructive', title: 'Payment Failed', description: 'Payment gateway could not be loaded.' });
      }
    };

    const confirmBooking = async (slotTime: string, paymentId: string) => {
      if (!db || !user || !currentSchedule || selectedSlotIndex === null) return;

      const bookingId = `BK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const meetingLink = `https://meet.google.com/doc-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`;
      const appointmentDateTime = `${selectedDate}T${slotTime}:00`;

      try {
        // 1. Update Schedule Slot (Atomic mark as booked)
        const scheduleRef = doc(db, 'doctor_schedules', selectedDate);
        const updatedSlots = [...currentSchedule.slots];
        updatedSlots[selectedSlotIndex] = {
          ...updatedSlots[selectedSlotIndex],
          isBooked: true,
          bookingId
        };
        await updateDoc(scheduleRef, { slots: updatedSlots });

        // 2. Create Patient Booking
        const bookingRef = doc(db, 'patients', user.uid, 'bookings', bookingId);
        setDocumentNonBlocking(bookingRef, {
          id: bookingId,
          patientId: user.uid,
          doctorId: 'main-doctor', // Logic for single doctor practice
          appointmentDateTime,
          type: 'Video',
          status: 'Accepted',
          meetingLink,
          paymentId,
          amount: 400,
          createdAt: new Date().toISOString()
        }, { merge: true });

        // 3. Create Notifications
        const notifRef = doc(collection(db, 'notifications'));
        setDocumentNonBlocking(notifRef, {
          userId: user.uid,
          message: `Consultation confirmed for ${selectedDate} at ${slotTime}. Link: ${meetingLink}`,
          type: 'booking_accepted',
          isRead: false,
          createdAt: new Date().toISOString()
        }, { merge: true });

        toast({
          title: 'Appointment Confirmed!',
          description: `Check your dashboard for the Google Meet link.`,
        });
        
        setSelectedDate('');
        setSelectedSlotIndex(null);
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Booking Error', description: 'Failed to finalize appointment.' });
      } finally {
        setIsProcessing(false);
      }
    };

    if (!bookingData) return null;

    return (
        <section className="bg-slate-50 py-24 md:py-32 relative overflow-hidden" id="booking">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <div className="container relative z-10">
                <div className="flex flex-col items-center gap-16">
                    <div className="mx-auto max-w-3xl text-center space-y-4">
                        <span className="font-ui font-bold text-primary tracking-widest uppercase text-sm">Direct Clinical Access</span>
                        <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground">
                            {bookingData.title}
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {bookingData.subtitle}
                        </p>
                    </div>

                    <Card className="w-full max-w-5xl shadow-2xl border-none rounded-[2.5rem] overflow-hidden bg-white">
                        <div className="grid lg:grid-cols-12">
                            {/* Left Side: Info */}
                            <div className="lg:col-span-4 bg-primary p-10 text-white space-y-8">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-headline font-bold">Consultation Info</h3>
                                    <p className="text-primary-foreground/80 text-sm">Secure video calling via Google Meet.</p>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start">
                                        <div className="bg-white/20 p-2 rounded-xl"><Clock className="h-5 w-5" /></div>
                                        <div><p className="font-bold text-sm">10 Min Session</p><p className="text-xs text-primary-foreground/70 italic">Precise clinical slots</p></div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="bg-white/20 p-2 rounded-xl"><Video className="h-5 w-5" /></div>
                                        <div><p className="font-bold text-sm">E-Prescription</p><p className="text-xs text-primary-foreground/70">Sent immediately after call</p></div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="bg-white/20 p-2 rounded-xl"><ShieldCheck className="h-5 w-5" /></div>
                                        <div><p className="font-bold text-sm">Clinical Slot</p><p className="text-xs text-primary-foreground/70">Professional consultation</p></div>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-white/10">
                                    <p className="text-xs text-primary-foreground/60 leading-relaxed italic">
                                        "By booking, you agree to our terms of clinical service and data privacy policy."
                                    </p>
                                </div>
                            </div>

                            {/* Right Side: Slot Selection */}
                            <div className="lg:col-span-8 p-10 space-y-10">
                                {/* Date Selection */}
                                <div className="space-y-4">
                                    <Label className="text-xs uppercase font-black tracking-widest text-slate-400">1. Select Consultation Date</Label>
                                    <div className="flex flex-wrap gap-3">
                                        {availableDates.length > 0 ? availableDates.map((schedule) => (
                                            <button
                                                key={schedule.id}
                                                onClick={() => {
                                                  setSelectedDate(schedule.date);
                                                  setSelectedSlotIndex(null);
                                                }}
                                                className={cn(
                                                    "px-6 py-3 rounded-2xl border-2 transition-all font-bold text-sm flex flex-col items-center",
                                                    selectedDate === schedule.date 
                                                        ? "border-primary bg-primary text-white shadow-lg scale-105" 
                                                        : "border-slate-100 bg-slate-50 text-slate-600 hover:border-primary/30"
                                                )}
                                            >
                                                <span className="text-[10px] uppercase opacity-70 mb-1">{format(parse(schedule.date, 'yyyy-MM-dd', new Date()), 'EEE')}</span>
                                                {format(parse(schedule.date, 'yyyy-MM-dd', new Date()), 'MMM dd')}
                                            </button>
                                        )) : (
                                          <div className="p-10 border-2 border-dashed border-slate-100 rounded-2xl w-full text-center">
                                            <p className="text-slate-400 text-sm">No clinical slots currently available. Please check back later.</p>
                                          </div>
                                        )}
                                    </div>
                                </div>

                                {/* Slot Selection */}
                                {selectedDate && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                        <Label className="text-xs uppercase font-black tracking-widest text-slate-400">2. Choose Your 10-Min Window</Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {currentSchedule?.slots?.map((slot: any, index: number) => (
                                                <button
                                                    key={index}
                                                    disabled={slot.isBooked}
                                                    onClick={() => setSelectedSlotIndex(index)}
                                                    className={cn(
                                                        "p-3 rounded-xl border font-mono text-sm transition-all relative overflow-hidden",
                                                        slot.isBooked 
                                                            ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed" 
                                                            : selectedSlotIndex === index 
                                                                ? "bg-primary/10 border-primary text-primary font-bold" 
                                                                : "bg-white border-slate-200 text-slate-600 hover:border-primary hover:bg-primary/5"
                                                    )}
                                                >
                                                    {slot.time}
                                                    {slot.isBooked && (
                                                      <div className="absolute top-0 right-0 h-full w-full bg-slate-100/50 flex items-center justify-center">
                                                        <span className="text-[8px] uppercase font-black -rotate-12 bg-white px-1 shadow-sm">Taken</span>
                                                      </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* CTA */}
                                <div className="pt-6">
                                    <Button 
                                        onClick={() => {
                                          const time = currentSchedule?.slots[selectedSlotIndex!]?.time;
                                          handleRazorpayPayment(time);
                                        }}
                                        size="lg" 
                                        disabled={!selectedDate || selectedSlotIndex === null || isProcessing}
                                        className="w-full h-16 rounded-3xl text-lg font-bold shadow-xl shadow-primary/20 group"
                                    >
                                        {isProcessing ? (
                                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                          <CheckCircle2 className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                                        )}
                                        {isProcessing ? 'Preparing Booking...' : 'Confirm Appointment & Proceed'}
                                    </Button>
                                    <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <ShieldCheck className="h-3 w-3" /> Secure Payment Gateway 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}
