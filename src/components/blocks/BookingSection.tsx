'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock } from 'lucide-react';

export default function BookingSection({ bookingData }: { bookingData: any }) {
    const { toast } = useToast();
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState('');
    const [selectedTime, setSelectedTime] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone || !selectedDate || !selectedTime) {
            toast({
                variant: 'destructive',
                title: 'Incomplete Form',
                description: 'Please fill out all fields to book your appointment.',
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
            setSelectedDate('');
            setSelectedTime('');
        }, 1500);
    };

    if (!bookingData) return null;

    return (
        <section className="bg-secondary py-20 md:py-28">
            <div className="container">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="font-headline text-3xl md:text-4xl font-bold">
                           {bookingData.title}
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                           {bookingData.subtitle}
                        </p>
                         <ul className="mt-8 space-y-4 text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <Calendar className="h-6 w-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-foreground">Flexible Scheduling</h3>
                                    <p>Pick a date and time that works best for you from the available slots.</p>
                                </div>
                            </li>
                             <li className="flex items-start gap-3">
                                <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-foreground">Confirmation Reminder</h3>
                                    <p>You'll receive an instant confirmation and a reminder before your session.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <Card className="shadow-xl">
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Appointment Date</Label>
                                        <Select value={selectedDate} onValueChange={setSelectedDate}>
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
                                        <Select value={selectedTime} onValueChange={setSelectedTime}>
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
