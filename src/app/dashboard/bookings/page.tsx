
'use client';

import * as React from 'react';
import { 
  CalendarDays, 
  Search, 
  Video, 
  User, 
  MapPin, 
  MessageSquare, 
  CheckCircle2, 
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

export default function BookingsDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline text-slate-900">Manage Appointments</h1>
          <p className="text-slate-500 text-sm">Review incoming requests and manage your clinical load.</p>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="bg-white border p-1 h-11 rounded-xl">
            <TabsTrigger value="upcoming" className="px-6 rounded-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Upcoming</TabsTrigger>
            <TabsTrigger value="requests" className="px-6 rounded-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-white">New Requests</TabsTrigger>
          </TabsList>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search patient..." className="pl-10 h-11 bg-white rounded-xl" />
          </div>
        </div>

        <TabsContent value="upcoming" className="space-y-4">
          {bookingsData.map((booking) => (
            <Card key={booking.id} className="shadow-sm border-none bg-white hover:shadow-md transition-all relative overflow-hidden">
              <div className={`w-1.5 h-full absolute left-0 top-0 ${booking.status === 'Accepted' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="bg-slate-50 px-4 py-3 rounded-2xl min-w-[100px] text-center border">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{booking.date}</p>
                    <p className="text-lg font-black text-slate-900">{booking.time}</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">{booking.patient} <Badge variant="outline" className="text-[9px] ml-2">{booking.id}</Badge></h3>
                      <Badge className={`text-[10px] uppercase ${booking.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{booking.status}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">{booking.type === 'Video' ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />} {booking.type}</span>
                      <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Male, 45y</span>
                      <span className="italic text-slate-400">"{booking.concern}"</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200">Mark Ready</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end"><DropdownMenuItem>Reschedule</DropdownMenuItem></DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
