'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
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
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: 'Appointment Booked!',
                description: `Your video consultation is confirmed for ${selectedDate} at ${selectedTime}.`,
            });
            // Reset form
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
        <section className="bg-secondary py-20 md:py-28">
            <div className="container">
                <div className="flex flex-col items-center gap-12">
                    <div className="max-w-3xl text-center">
                        <h2 className="font-headline text-3xl font-bold md:text-4xl">
                           {bookingData.title}
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                           {bookingData.subtitle}
                        </p>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <div className="flex items-start gap-3">
                                <CalendarIcon className="h-6 w-6 shrink-0 mt-1 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-foreground">Flexible Scheduling</h3>
                                    <p className="text-muted-foreground">Pick a date and time that works best for you from the available slots.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <Clock className="h-6 w-6 shrink-0 mt-1 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-foreground">Confirmation Reminder</h3>
                                    <p className="text-muted-foreground">You'll receive an instant confirmation and a reminder before your session.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Card className="w-full max-w-3xl shadow-xl">
                        <CardHeader>
                            <CardTitle className="font-headline">Book Your Slot</CardTitle>
                             <CardDescription>Fill in your details below.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" placeholder="Pritam Pattyanayek" value={name} onChange={(e) => setName(e.target.value)} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" type="tel" placeholder="+91 12345 67890" value={phone} onChange={(e) => setPhone(e.target.value)} required/>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="dob">Date of Birth</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !dob && 'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dob ? format(dob, 'PPP') : <span>Pick a date</span>}
                                            </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
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
                                        <Label htmlFor="reason">Reason for Booking</Label>
                                        <Select value={selectedReason} onValueChange={setSelectedReason} required>
                                            <SelectTrigger id="reason">
                                                <SelectValue placeholder="Select a reason" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bookingData.reasons.map((reason: string) => (
                                                    <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Appointment Date</Label>
                                        <Select value={selectedDate} onValueChange={setSelectedDate} required>
                                            <SelectTrigger id="date">
                                                <SelectValue placeholder="Select a date" />
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
                                            <SelectTrigger id="time">
                                                <SelectValue placeholder="Select a time" />
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
                                    <Label htmlFor="details">Additional Details (Optional)</Label>
                                    <Textarea
                                        id="details"
                                        placeholder="Provide any other relevant details..."
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                </div>
                                <Button type="submit" className="w-full font-ui" disabled={isSubmitting}>
                                    {isSubmitting ? 'Booking...' : 'Book Video Session'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
