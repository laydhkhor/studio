'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function BookingSection({ bookingData }: { bookingData: any }) {
    const { toast } = useToast();
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [dob, setDob] = React.useState<Date>();
    const [selectedReason, setSelectedReason] = React.useState('');
    const [details, setDetails] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState('');
    const [selectedTime, setSelectedTime] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone || !dob || !selectedReason || !selectedDate || !selectedTime) {
            toast({
                variant: 'destructive',
                title: 'Incomplete Form',
                description: 'Please fill out all required fields to book your appointment.',
            });
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: 'Appointment Booked!',
                description: `Your video consultation is confirmed for ${selectedDate} at ${selectedTime}.`,
            });
            setName('');
            setPhone('');
            setDob(undefined);
            setSelectedReason('');
            setDetails('');
            setSelectedDate('');
            setSelectedTime('');
        }, 1500);
    };

    if (!bookingData) return null;

    return (
        <section className="bg-secondary/50 py-24 md:py-32 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            
            <div className="container relative z-10">
                <div className="flex flex-col items-center gap-16">
                    <div className="max-w-3xl text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-ui uppercase tracking-widest">
                           <ShieldCheck className="h-4 w-4" />
                           Priority Booking
                        </div>
                        <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground">
                           {bookingData.title}
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                           {bookingData.subtitle}
                        </p>
                        
                        <div className="mt-8 flex flex-wrap justify-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                </div>
                                <span className="font-ui font-medium text-muted-foreground">Encrypted Sessions</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                </div>
                                <span className="font-ui font-medium text-muted-foreground">Digital Prescription</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                </div>
                                <span className="font-ui font-medium text-muted-foreground">No Wait Times</span>
                            </div>
                        </div>
                    </div>

                    <Card className="w-full max-w-4xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-t-4 border-t-primary rounded-2xl overflow-hidden">
                        <CardHeader className="bg-card px-8 pt-10">
                            <CardTitle className="font-headline text-2xl font-bold">Patient Details</CardTitle>
                             <CardDescription className="text-base">Please provide accurate information for the clinical record.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                                        <Input id="name" placeholder="Pritam Pattyanayek" className="h-12 bg-secondary/30 border-none focus-visible:ring-primary" value={name} onChange={(e) => setName(e.target.value)} required/>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="phone" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                                        <Input id="phone" type="tel" placeholder="+91 12345 67890" className="h-12 bg-secondary/30 border-none focus-visible:ring-primary" value={phone} onChange={(e) => setPhone(e.target.value)} required/>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="dob" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Date of Birth</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                'w-full h-12 justify-start text-left font-normal bg-secondary/30 border-none hover:bg-secondary/50',
                                                !dob && 'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                                                {dob ? format(dob, 'PPP') : <span>Select Birth Date</span>}
                                            </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={dob}
                                                onSelect={setDob}
                                                initialFocus
                                                captionLayout="dropdown"
                                                fromYear={1920}
                                                toYear={new Date().getFullYear()}
                                            />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="reason" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Primary Concern</Label>
                                        <Select value={selectedReason} onValueChange={setSelectedReason} required>
                                            <SelectTrigger id="reason" className="h-12 bg-secondary/30 border-none focus:ring-primary">
                                                <SelectValue placeholder="Select symptom/reason" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bookingData.reasons.map((reason: string) => (
                                                    <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed">
                                    <div className="space-y-3">
                                        <Label htmlFor="date" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Preferred Date</Label>
                                        <Select value={selectedDate} onValueChange={setSelectedDate} required>
                                            <SelectTrigger id="date" className="h-12 bg-card border-2 focus:ring-primary">
                                                <SelectValue placeholder="Available Dates" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bookingData.availableDates.map((date: string) => (
                                                    <SelectItem key={date} value={date}>{date}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="time" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Available Time Slot</Label>
                                        <Select value={selectedTime} onValueChange={setSelectedTime} required>
                                            <SelectTrigger id="time" className="h-12 bg-card border-2 focus:ring-primary">
                                                <SelectValue placeholder="Choose Time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bookingData.timeSlots.map((time: string) => (
                                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="details" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Additional Medical History (Optional)</Label>
                                    <Textarea
                                        id="details"
                                        placeholder="Describe symptoms or ongoing medications..."
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        className="min-h-[120px] bg-secondary/30 border-none focus-visible:ring-primary"
                                    />
                                </div>

                                <Button type="submit" size="lg" className="w-full h-16 text-lg font-bold font-ui rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.01]" disabled={isSubmitting}>
                                    {isSubmitting ? 'Processing Secure Booking...' : 'Confirm Video Consultation Slot'}
                                </Button>
                                
                                <p className="text-center text-xs text-muted-foreground font-ui">
                                    By booking, you agree to our terms of service and medical privacy policy.
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}