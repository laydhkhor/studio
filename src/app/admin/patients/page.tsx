'use client';

import * as React from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const patientsData = [
  { id: 'PT-1024', name: 'Anjali Sharma', email: 'anjali@example.com', phone: '+91 98765 43210', lastVisit: '2024-07-20', status: 'Active', age: 28, gender: 'Female' },
  { id: 'PT-1025', name: 'Rajesh Kumar', email: 'rajesh.k@example.com', phone: '+91 98765 43211', lastVisit: '2024-07-18', status: 'Follow-up', age: 45, gender: 'Male' },
  { id: 'PT-1026', name: 'Priya Mondal', email: 'priya.m@example.com', phone: '+91 98765 43212', lastVisit: '2024-07-15', status: 'Active', age: 32, gender: 'Female' },
  { id: 'PT-1027', name: 'Amit Ghosh', email: 'ghosh.amit@example.com', phone: '+91 98765 43213', lastVisit: '2024-07-10', status: 'Inactive', age: 50, gender: 'Male' },
  { id: 'PT-1028', name: 'Sunita Das', email: 'sunita.das@example.com', phone: '+91 98765 43214', lastVisit: '2024-07-05', status: 'Active', age: 38, gender: 'Female' },
];

export default function PatientsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline text-slate-900">Patient Records</h1>
          <p className="text-slate-500 text-sm">Manage centralized clinical histories and profile details.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-xl bg-white">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button className="h-10 rounded-xl shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> Add New Patient
          </Button>
        </div>
      </div>

      <Card className="shadow-xl border-none bg-white">
        <CardHeader className="pb-0 pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by name, ID, or phone..." 
                className="pl-10 h-11 bg-slate-50 border-none rounded-xl focus:bg-white transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-11 rounded-xl border-slate-200">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="w-[300px] font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Patient Identity</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Clinical ID</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Contact Info</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Last Consultation</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientsData.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-slate-50/50 border-slate-100 group transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-none">{patient.name}</p>
                          <p className="text-xs text-slate-400 mt-1">{patient.age}Y • {patient.gender}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{patient.id}</code>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-xs flex items-center gap-1.5 text-slate-600">
                          <Mail className="h-3 w-3 text-slate-400" /> {patient.email}
                        </p>
                        <p className="text-xs flex items-center gap-1.5 text-slate-600 font-medium">
                          <Phone className="h-3 w-3 text-slate-400" /> {patient.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-slate-400" /> {patient.lastVisit}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`text-[10px] h-5 px-2 font-bold uppercase tracking-widest ${
                          patient.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          patient.status === 'Follow-up' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-200 rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-2xl">
                          <DropdownMenuLabel className="text-xs text-slate-400 font-bold uppercase px-3">Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="rounded-lg cursor-pointer py-2">View History</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg cursor-pointer py-2">Create Prescription</DropdownMenuItem>
                          <DropdownMenuSeparator className="mx-1" />
                          <DropdownMenuItem className="rounded-lg cursor-pointer py-2 text-red-600 focus:bg-red-50 focus:text-red-600">Deactivate Record</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-6">
            <p className="text-xs text-slate-400 font-medium italic">Showing 5 of 2,543 registered patients</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="h-8 rounded-lg px-4 text-xs font-bold">Previous</Button>
              <Button variant="outline" size="sm" className="h-8 rounded-lg px-4 text-xs font-bold border-primary text-primary hover:bg-primary/5">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
