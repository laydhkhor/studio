'use client';

import * as React from 'react';
import { 
  CalendarDays, 
  Search, 
  Clock, 
  Video, 
  User, 
  MapPin, 
  MessageSquare, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
} from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const bookingsData = [
  { id: 'BK-901', patient: 'Anjali Sharma', type: 'Video', time: '10:30 AM', date: 'Today', status: 'Accepted', concern: 'Severe headache and fever' },
  { id: 'BK-902', patient: 'Rajesh Kumar', type: 'Clinic', time: '11:15 AM', date: 'Today', status: 'Pending', concern: 'Bi-weekly diabetic check' },
  { id: 'BK-903', patient: 'Priya Mondal', type: 'Chat', time: '02:00 PM', date: 'Today', status: 'Accepted', concern: 'Post-op report review' },
  { id: 'BK-904', patient: 'Amit Ghosh', type: 'Video', time: '04:30 PM', date: 'Today', status: 'Rescheduled', concern: 'Hypertension monitoring' },
  { id: 'BK-905', patient: 'Sunita Das', type: 'Clinic', time: '10:00 AM', date: 'Tomorrow', status: 'Accepted', concern: 'Initial consultation' },
];

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline text-slate-900">Manage Appointments</h1>
          <p className="text-slate-500 text-sm">Review incoming requests and manage your daily clinical load.</p>
        </div>
        <Button asChild className="h-10 rounded-xl font-bold shadow-lg shadow-primary/20">
          <Link href="/admin-dashboard/calendar">
            <CalendarDays className="mr-2 h-4 w-4" /> Open Schedule
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="bg-white border border-slate-200 p-1 h-11 rounded-xl">
            <TabsTrigger value="upcoming" className="px-6 rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white">Upcoming</TabsTrigger>
            <TabsTrigger value="requests" className="px-6 rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white">New Requests</TabsTrigger>
            <TabsTrigger value="completed" className="px-6 rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white">Completed</TabsTrigger>
          </TabsList>
          
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by patient name..." 
              className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus:ring-primary/20"
            />
          </div>
        </div>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4">
            {bookingsData.map((booking) => (
              <Card key={booking.id} className="shadow-sm border-none bg-white hover:shadow-md transition-all group overflow-hidden relative">
                <div className={`w-1.5 h-full absolute left-0 top-0 ${
                  booking.status === 'Accepted' ? 'bg-emerald-500' : 
                  booking.status === 'Rescheduled' ? 'bg-amber-500' : 'bg-slate-300'
                }`} />
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center p-5 gap-6">
                    <div className="flex flex-row md:flex-col items-center justify-center bg-slate-50 px-4 py-3 rounded-2xl min-w-[100px] border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{booking.date}</p>
                      <p className="text-lg font-black text-slate-900">{booking.time}</p>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">{booking.patient}</h3>
                          <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-black uppercase tracking-tighter">
                            {booking.id}
                          </Badge>
                        </div>
                        <Badge className={`text-[10px] h-5 px-2 font-black tracking-widest uppercase ${
                          booking.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {booking.status}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          {booking.type === 'Video' ? <Video className="h-3.5 w-3.5 text-primary" /> : 
                           booking.type === 'Clinic' ? <MapPin className="h-3.5 w-3.5 text-blue-500" /> : 
                           <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />}
                          {booking.type} Consultation
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <User className="h-3.5 w-3.5 text-slate-400" /> Male, 45y
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 italic">
                          "{booking.concern}"
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg font-bold text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                        <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Mark Ready
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-slate-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-2xl">
                          <DropdownMenuItem className="rounded-lg py-2">Reschedule</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg py-2">Message Patient</DropdownMenuItem>
                          <DropdownMenuSeparator className="mx-1" />
                          <DropdownMenuItem className="rounded-lg py-2 text-red-600 focus:bg-red-50">Cancel Appointment</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
