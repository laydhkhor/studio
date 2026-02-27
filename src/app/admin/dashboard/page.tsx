'use client';

import * as React from 'react';
import {
  Users,
  CalendarDays,
  ClipboardPlus,
  DollarSign,
  TrendingUp,
  Download,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

const chartData = [
  { month: "Jan", revenue: 45000, consultations: 120 },
  { month: "Feb", revenue: 52000, consultations: 145 },
  { month: "Mar", revenue: 48000, consultations: 130 },
  { month: "Apr", revenue: 61000, consultations: 160 },
  { month: "May", revenue: 55000, consultations: 155 },
  { month: "Jun", revenue: 67000, consultations: 180 },
  { month: "Jul", revenue: 72000, consultations: 195 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const upcomingEvents = [
  {
    patient: "Anjali Sharma",
    time: "10:30 AM",
    type: "Video Call",
    concern: "Fever Follow-up",
    status: "Confirmed",
  },
  {
    patient: "Rajesh Kumar",
    time: "11:15 AM",
    type: "Clinic Visit",
    concern: "Diabetic Check",
    status: "In-Transit",
  },
  {
    patient: "Priya Mondal",
    time: "02:00 PM",
    type: "Chat",
    concern: "Report Review",
    status: "Pending",
  },
];

const paymentStatuses = [
  { patient: "Amit Ghosh", amount: "₹400", date: "Today", method: "UPI", status: "Paid" },
  { patient: "Sunita Das", amount: "₹500", date: "Today", method: "Cash", status: "Due" },
  { patient: "Bikram Roy", amount: "₹400", date: "Yesterday", method: "Card", status: "Paid" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-slate-900">Practice Overview</h1>
          <p className="text-slate-500 font-medium">Monitoring your clinical performance and patient traffic.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 rounded-xl bg-white border-slate-200 text-slate-600 font-bold shadow-sm">
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Button asChild className="h-11 rounded-xl font-bold shadow-lg shadow-primary/20">
            <Link href="/admin/bookings">
              <CalendarDays className="mr-2 h-4 w-4" /> New Booking
            </Link>
          </Button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-none bg-white overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Revenue</CardTitle>
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">₹1,25,430</div>
            <div className="flex items-center mt-1 text-emerald-600 font-bold text-xs">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +20.1% <span className="text-slate-400 font-medium ml-1">vs last month</span>
            </div>
          </CardContent>
          <div className="h-1.5 w-full bg-slate-50">
            <div className="h-full bg-primary w-[70%]" />
          </div>
        </Card>

        <Card className="shadow-sm border-none bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Patient Growth</CardTitle>
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">2,543</div>
            <div className="flex items-center mt-1 text-emerald-600 font-bold text-xs">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +12% <span className="text-slate-400 font-medium ml-1">new patients</span>
            </div>
          </CardContent>
          <div className="h-1.5 w-full bg-slate-50">
            <div className="h-full bg-blue-500 w-[45%]" />
          </div>
        </Card>

        <Card className="shadow-sm border-none bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Consultations</CardTitle>
            <div className="bg-amber-500/10 p-2 rounded-lg text-amber-600">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">184</div>
            <div className="flex items-center mt-1 text-amber-600 font-bold text-xs">
              <Clock className="h-3 w-3 mr-1" /> 12 Pending <span className="text-slate-400 font-medium ml-1">today</span>
            </div>
          </CardContent>
          <div className="h-1.5 w-full bg-slate-50">
            <div className="h-full bg-amber-500 w-[80%]" />
          </div>
        </Card>

        <Card className="shadow-sm border-none bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Satisfaction</CardTitle>
            <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">98.2%</div>
            <div className="flex items-center mt-1 text-emerald-600 font-bold text-xs">
              <ShieldCheck className="h-3 w-3 mr-1" /> Verified <span className="text-slate-400 font-medium ml-1">patient ratings</span>
            </div>
          </CardContent>
          <div className="h-1.5 w-full bg-slate-50">
            <div className="h-full bg-emerald-500 w-[98%]" />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Main Analytics Tab */}
        <Card className="lg:col-span-4 shadow-xl border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline text-xl font-bold">Clinical Revenue</CardTitle>
              <CardDescription>Practice income trends over the last 7 months.</CardDescription>
            </div>
            <Tabs defaultValue="revenue" className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2 bg-slate-50 p-1 h-9">
                <TabsTrigger value="revenue" className="text-[10px] uppercase font-bold">Revenue</TabsTrigger>
                <TabsTrigger value="traffic" className="text-[10px] uppercase font-bold">Traffic</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pl-2 pt-4">
            <ChartContainer config={chartConfig} className="h-[320px] w-full">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Side Operational Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Upcoming Events */}
          <Card className="shadow-lg border-none bg-white">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="font-headline text-lg font-bold">Today's Schedule</CardTitle>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10">3 Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 px-0">
              <div className="divide-y divide-slate-50">
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
                    <div className="bg-slate-100 px-3 py-2 rounded-xl text-center min-w-[70px]">
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Time</p>
                      <p className="text-xs font-bold text-slate-900">{event.time}</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900">{event.patient}</p>
                        <p className={`text-[10px] font-bold uppercase ${
                          event.status === 'Confirmed' ? 'text-emerald-600' : 'text-amber-600'
                        }`}>{event.status}</p>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Badge variant="secondary" className="text-[9px] h-4 px-1.5">{event.type}</Badge>
                        <span className="text-[10px]">• {event.concern}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <Button 
                  asChild
                  variant="ghost" 
                  className="w-full text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground h-9 rounded-lg transition-colors"
                >
                  <Link href="/admin/bookings">
                    View Full Appointment List
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Statuses */}
          <Card className="shadow-lg border-none bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="font-headline text-lg font-bold">Payment Feed</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-4 px-6 pb-2">
                {paymentStatuses.map((pay, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${pay.status === 'Paid' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                        <DollarSign className={`h-3 w-3 ${pay.status === 'Paid' ? 'text-emerald-600' : 'text-red-600'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{pay.patient}</p>
                        <p className="text-[10px] text-slate-400">{pay.date} via {pay.method}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">{pay.amount}</p>
                      <p className={`text-[10px] font-bold ${pay.status === 'Paid' ? 'text-emerald-600' : 'text-red-600'}`}>{pay.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
