'use client';

import * as React from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar,
  FileText,
  Loader2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

export default function PatientsManagementPage() {
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = React.useState('');

  const patientsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('role', '==', 'patient'));
  }, [db]);

  const { data: patients, isLoading } = useCollection(patientsQuery);

  const filteredPatients = React.useMemo(() => {
    if (!patients) return [];
    return patients.filter(p => 
      p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phoneNumber?.includes(searchTerm)
    );
  }, [patients, searchTerm]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Patient Records</h1>
          <p className="text-muted-foreground font-ui">Manage your practice's patient list and medical histories.</p>
        </div>
        <Button className="h-11 rounded-xl shadow-lg shadow-primary/20">
          <UserPlus className="mr-2 h-4 w-4" /> Add New Patient
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="bg-slate-50/50 pb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, email or phone..." 
                  className="pl-10 h-11 bg-white border-slate-200" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex items-center gap-2 w-full md:w-auto">
                <Button variant="outline" className="flex-1 md:flex-none h-11 border-slate-200 bg-white">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
                <Badge variant="secondary" className="h-11 px-4 text-sm bg-white border border-slate-200 text-slate-600 font-medium">
                  {filteredPatients.length} Total Patients
                </Badge>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase font-black text-[10px] tracking-widest border-b">
                <tr>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Visit</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground">Loading patient directory...</p>
                    </td>
                  </tr>
                ) : filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                             <AvatarImage src={patient.photoURL} />
                             <AvatarFallback className="bg-primary/10 text-primary font-bold">
                               {patient.fullName?.charAt(0) || 'P'}
                             </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-800">{patient.fullName || 'Anonymous'}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">ID: {patient.id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-600">
                             <Mail className="h-3 w-3 opacity-50" />
                             <span className="text-xs">{patient.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                             <Phone className="h-3 w-3 opacity-50" />
                             <span className="text-xs">{patient.phoneNumber || 'No phone'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={patient.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'} variant="outline">
                          {patient.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                           <Calendar className="h-3 w-3 opacity-50" />
                           <span className="text-xs">{patient.createdAt ? format(new Date(patient.createdAt.seconds * 1000), 'MMM dd, yyyy') : 'Recently joined'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Patient Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              <FileText className="mr-2 h-4 w-4" /> View Medical History
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                               <Plus className="mr-2 h-4 w-4" /> Issue Prescription
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                              Suspend Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No patients found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
