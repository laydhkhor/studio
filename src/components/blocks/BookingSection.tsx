'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
        <section className="bg-secondary/30 py-24 md:py-32 relative overflow-hidden">
            <div className="container relative z-10">
                <div className="flex flex-col items-center gap-16">
                    {/* Standardized Section Header */}
                    <div className="mx-auto max-w-3xl text-center space-y-4">
                        <span className="font-ui font-bold text-primary tracking-widest uppercase text-sm">Direct Access</span>
                        <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground">
                            {bookingData.title}
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {bookingData.subtitle}
                        </p>
                        
                        <div className="pt-8 flex flex-wrap justify-center gap-8">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-accent" />
                                <span className="font-ui text-sm font-medium text-muted-foreground">Secure & Encrypted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-accent" />
                                <span className="font-ui text-sm font-medium text-muted-foreground">Digital Prescription</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-accent" />
                                <span className="font-ui text-sm font-medium text-muted-foreground">No Travel Required</span>
                            </div>
                        </div>
                    </div>

                    <Card className="w-full max-w-4xl shadow-xl border-none rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-white px-8 pt-10 text-center">
                            <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-2xl font-bold">Fill in Your Details</CardTitle>
                             <CardDescription className="text-base">Provide accurate info for your medical record.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" placeholder="Pritam Pattyanayek" className="h-12" value={name} onChange={(e) => setName(e.target.value)} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" type="tel" placeholder="+91 12345 67890" className="h-12" value={phone} onChange={(e) => setPhone(e.target.value)} required/>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="dob">Date of Birth</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                'w-full h-12 justify-start text-left font-normal bg-card',
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
                                    <div className="space-y-2">
                                        <Label htmlFor="reason">Consultation Reason</Label>
                                        <Select value={selectedReason} onValueChange={setSelectedReason} required>
                                            <SelectTrigger id="reason" className="h-12 bg-card">
                                                <SelectValue placeholder="Select primary concern" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bookingData.reasons.map((reason: string) => (
                                                    <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Appointment Date</Label>
                                        <Select value={selectedDate} onValueChange={setSelectedDate} required>
                                            <SelectTrigger id="date" className="h-12 bg-card">
                                                <SelectValue placeholder="Available dates" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bookingData.availableDates.map((date: string) => (
                                                    <SelectItem key={date} value={date}>{date}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="time">Time Slot</Label>
                                        <Select value={selectedTime} onValueChange={setSelectedTime} required>
                                            <SelectTrigger id="time" className="h-12 bg-card">
                                                <SelectValue placeholder="Available slots" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bookingData.timeSlots.map((time: string) => (
                                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="details">Medical History / Notes (Optional)</Label>
                                    <Textarea
                                        id="details"
                                        placeholder="Briefly describe your symptoms or current medications..."
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        className="min-h-[100px] bg-card"
                                    />
                                </div>

                                <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold font-ui rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" disabled={isSubmitting}>
                                    {isSubmitting ? 'Booking Consultation...' : 'Confirm Video Appointment'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
