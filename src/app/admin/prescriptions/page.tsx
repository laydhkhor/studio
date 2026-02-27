'use client';

import * as React from 'react';
import { 
  ClipboardPlus, 
  Search, 
  FileText, 
  Pill, 
  Download, 
  Eye, 
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  MoreHorizontal,
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
import { Badge } from '@/components/ui/badge';

const prescriptionsData = [
  { id: 'RX-7721', patient: 'Anjali Sharma', date: '2024-07-20', medicineCount: 3, status: 'Active', category: 'Fever' },
  { id: 'RX-7722', patient: 'Rajesh Kumar', date: '2024-07-18', medicineCount: 5, status: 'Active', category: 'Diabetes' },
  { id: 'RX-7723', patient: 'Priya Mondal', date: '2024-07-15', medicineCount: 2, status: 'Expired', category: 'Post-Op' },
  { id: 'RX-7724', patient: 'Amit Ghosh', date: '2024-07-10', medicineCount: 1, status: 'Active', category: 'General' },
];

export default function AdminPrescriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline text-slate-900">Clinical Prescriptions</h1>
          <p className="text-slate-500 text-sm">Issue and track digital medication guides for your patients.</p>
        </div>
        <Button className="h-10 rounded-xl shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Create New RX
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm border-none bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase font-bold text-slate-400">Total RX Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-slate-900">1,248</span>
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase font-bold text-slate-400">Active Adherence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-slate-900">84%</span>
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase font-bold text-slate-400">Monthly Avg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-slate-900">142</span>
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl border-none bg-white overflow-hidden">
        <CardHeader className="border-b bg-slate-50/30">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Find RX by ID or patient name..." 
                className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus:ring-primary/20"
              />
            </div>
            <Button variant="outline" className="h-11 rounded-xl bg-white border-slate-200 text-slate-600 font-bold">
              Sort by Date
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-bold text-slate-500 uppercase tracking-tighter text-[10px] pl-6 py-4">Prescription ID</TableHead>
                <TableHead className="font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Patient</TableHead>
                <TableHead className="font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Date Issued</TableHead>
                <TableHead className="font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Condition</TableHead>
                <TableHead className="font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Meds</TableHead>
                <TableHead className="font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Status</TableHead>
                <TableHead className="w-[150px] pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptionsData.map((rx) => (
                <TableRow key={rx.id} className="hover:bg-slate-50 border-slate-100 transition-colors">
                  <TableCell className="pl-6">
                    <code className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded">{rx.id}</code>
                  </TableCell>
                  <TableCell className="font-bold text-slate-900 text-sm">{rx.patient}</TableCell>
                  <TableCell>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <Calendar className="h-3 w-3 text-slate-400" /> {rx.date}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[9px] h-5 px-2 bg-slate-50 text-slate-600 font-bold uppercase tracking-widest">{rx.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <Pill className="h-3.5 w-3.5 text-emerald-500" /> {rx.medicineCount} Items
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-[9px] h-5 px-2 font-black uppercase tracking-widest ${
                      rx.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {rx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-slate-200 rounded-lg">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-6 bg-slate-50/30 border-t flex items-center justify-center">
            <Button variant="ghost" className="text-xs font-bold text-slate-400 hover:text-primary">Load Previous Prescriptions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
