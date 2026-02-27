
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, ShieldCheck, CheckCircle2, Clock, Loader2, Video, AlertCircle } from 'lucide-react';
import { useFirestore, useUser, setDocumentNonBlocking, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, serverTimestamp, addDoc } from 'firebase/firestore';
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

    // Fetch live schedules
    const schedulesQuery = useMemoFirebase(() => {
      if (!db) return null;
      return collection(db, 'doctor_schedules');
    }, [db]);

    const { data: rawSchedules } = useCollection(schedulesQuery);
    
    const availableDates = React.useMemo(() => {
      if (!rawSchedules) return [];
      return rawSchedules
        .filter(s => s.slots?.some((slot: any) => !slot.isBooked))
        .sort((a, b) => a.date.localeCompare(b.date));
    }, [rawSchedules]);

    const currentSchedule = React.useMemo(() => {
      return availableDates.find(s => s.date === selectedDate);
    }, [availableDates, selectedDate]);

    const handleRazorpayPayment = async (slotTime: string) => {
      if (!user) {
        toast({ variant: 'destructive', title: 'Login Required', description: 'Please sign in to book an appointment.' });
        router.push(`/login?redirect=/booking`);
        return;
      }

      setIsProcessing(true);

      const options = {
        key: 'rzp_test_dummykey',
        amount: 40000,
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
        // 1. Update Schedule Slot
        const scheduleRef = doc(db, 'doctor_schedules', selectedDate);
        const updatedSlots = [...currentSchedule.slots];
        updatedSlots[selectedSlotIndex] = {
          ...updatedSlots[selectedSlotIndex],
          isBooked: true,
          bookingId
        };
        await updateDoc(scheduleRef, { slots: updatedSlots });

        // 2. Create Patient Booking in flat collection
        const bookingRef = doc(db, 'appointments', bookingId);
        setDocumentNonBlocking(bookingRef, {
          id: bookingId,
          patientId: user.uid,
          doctorId: 'main-doctor', 
          appointmentDateTime,
          type: 'Video',
          status: 'Accepted',
          meetingLink,
          paymentId,
          amount: 400,
          createdAt: serverTimestamp()
        }, { merge: true });

        // 3. Create Global Notification
        const notifCol = collection(db, 'notifications');
        addDoc(notifCol, {
          userId: user.uid,
          message: `Consultation confirmed for ${selectedDate} at ${slotTime}.`,
          type: 'booking_accepted',
          isRead: false,
          createdAt: serverTimestamp()
        });

        toast({
          title: 'Appointment Confirmed!',
          description: `Your clinical slot is secured. Redirecting to dashboard...`,
        });
        
        setTimeout(() => {
          router.push('/patients-dashboard');
        }, 1500);
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Booking Error', description: 'Failed to finalize appointment.' });
      } finally {
        setIsProcessing(false);
      }
    };

    if (!bookingData) return null;

    return (
        <section className="bg-transparent py-10" id="booking">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <div className="container">
                <div className="grid lg:grid-cols-12 gap-0 border rounded-[2rem] overflow-hidden shadow-2xl">
                    {/* Left Side: Info */}
                    <div className="lg:col-span-4 bg-primary p-8 md:p-12 text-white space-y-8 flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-headline font-bold">Consultation Package</h3>
                                <p className="text-primary-foreground/80 text-sm">Professional video diagnostic session.</p>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-white/20 p-2.5 rounded-xl"><Clock className="h-5 w-5" /></div>
                                    <div>
                                      <p className="font-bold text-sm">10-Minute Clinical Slot</p>
                                      <p className="text-xs text-primary-foreground/70">Structured diagnostic window</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="bg-white/20 p-2.5 rounded-xl"><Video className="h-5 w-5" /></div>
                                    <div>
                                      <p className="font-bold text-sm">Google Meet Access</p>
                                      <p className="text-xs text-primary-foreground/70">Secure end-to-end encryption</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="bg-white/20 p-2.5 rounded-xl"><CheckCircle2 className="h-5 w-5" /></div>
                                    <div>
                                      <p className="font-bold text-sm">Digital RX Issued</p>
                                      <p className="text-xs text-primary-foreground/70">Immediate dashboard delivery</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                              <AlertCircle className="h-4 w-4 text-white" />
                              <p className="text-xs font-bold uppercase tracking-widest">Clinical Note</p>
                            </div>
                            <p className="text-xs text-primary-foreground/80 leading-relaxed italic">
                                "Please ensure you have a stable internet connection and are in a quiet room 5 minutes before your scheduled time."
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Slot Selection */}
                    <div className="lg:col-span-8 p-8 md:p-12 space-y-10 bg-white">
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
                                            "px-6 py-4 rounded-2xl border-2 transition-all font-bold text-sm flex flex-col items-center min-w-[100px]",
                                            selectedDate === schedule.date 
                                                ? "border-primary bg-primary text-white shadow-lg scale-105" 
                                                : "border-slate-100 bg-slate-50 text-slate-600 hover:border-primary/30"
                                        )}
                                    >
                                        <span className="text-[10px] uppercase opacity-70 mb-1">{format(parse(schedule.date, 'yyyy-MM-dd', new Date()), 'EEE')}</span>
                                        {format(parse(schedule.date, 'yyyy-MM-dd', new Date()), 'MMM dd')}
                                    </button>
                                )) : (
                                  <div className="p-12 border-2 border-dashed border-slate-100 rounded-3xl w-full text-center">
                                    <CalendarIcon className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 text-sm font-medium">No clinical slots currently available.</p>
                                    <p className="text-xs text-slate-300 mt-1">Our schedules are updated daily. Please check back soon.</p>
                                  </div>
                                )}
                            </div>
                        </div>

                        {/* Slot Selection */}
                        {selectedDate && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                <Label className="text-xs uppercase font-black tracking-widest text-slate-400">2. Choose Your 10-Min Window</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {currentSchedule?.slots?.map((slot: any, index: number) => (
                                        <button
                                            key={index}
                                            disabled={slot.isBooked}
                                            onClick={() => setSelectedSlotIndex(index)}
                                            className={cn(
                                                "p-3 rounded-xl border font-mono text-sm transition-all relative overflow-hidden h-12 flex items-center justify-center",
                                                slot.isBooked 
                                                    ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed" 
                                                    : selectedSlotIndex === index 
                                                        ? "bg-primary/10 border-primary text-primary font-bold shadow-sm" 
                                                        : "bg-white border-slate-200 text-slate-600 hover:border-primary hover:bg-primary/5"
                                            )}
                                        >
                                            {slot.time}
                                            {slot.isBooked && (
                                              <div className="absolute inset-0 bg-slate-100/50 flex items-center justify-center">
                                                <span className="text-[8px] uppercase font-black -rotate-12 bg-white px-1 shadow-sm text-slate-400">Taken</span>
                                              </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="pt-6 border-t border-slate-100">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                              <Button 
                                  onClick={() => {
                                    const time = currentSchedule?.slots[selectedSlotIndex!]?.time;
                                    handleRazorpayPayment(time);
                                  }}
                                  size="lg" 
                                  disabled={!selectedDate || selectedSlotIndex === null || isProcessing}
                                  className="w-full sm:flex-1 h-16 rounded-3xl text-lg font-bold shadow-xl shadow-primary/20 group"
                              >
                                  {isProcessing ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                                  )}
                                  {isProcessing ? 'Contacting Bank...' : 'Secure Slot & Confirm'}
                              </Button>
                              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                      <ShieldCheck className="h-3 w-3 text-emerald-500" /> Razorpay Secured 
                                  </div>
                                  <p className="text-[10px] text-slate-400 max-w-[200px]">Standard clinical fee applies at checkout.</p>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
