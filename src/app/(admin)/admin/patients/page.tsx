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
  Loader2,
  Ban,
  CheckCircle2,
  AlertCircle,
  Plus
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
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function PatientsManagementPage() {
  const db = useFirestore();
  const { toast } = useToast();
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

  const toggleBlockStatus = (patientId: string, currentStatus: boolean) => {
    if (!db) return;
    const userRef = doc(db, 'users', patientId);
    updateDocumentNonBlocking(userRef, { isActive: !currentStatus });
    toast({ 
      title: currentStatus ? 'Patient Blocked' : 'Patient Reactivated', 
      description: `Access status updated for clinical safety.`,
      variant: currentStatus ? 'destructive' : 'default'
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Patient Directory</h1>
          <p className="text-muted-foreground font-ui text-sm">Unified medical records and clinical access management.</p>
        </div>
        <Button className="h-11 rounded-xl shadow-lg shadow-primary/20 font-bold px-6">
          <UserPlus className="mr-2 h-4 w-4" /> Add New Record
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 pb-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input 
                  placeholder="Search by name, email or mobile..." 
                  className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus-visible:ring-primary/20" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex items-center gap-2 w-full md:w-auto">
                <Button variant="outline" className="flex-1 md:flex-none h-11 border-slate-200 bg-white rounded-xl">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
                <div className="h-11 px-4 flex items-center bg-white border border-slate-200 rounded-xl">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Count:</span>
                   <span className="text-sm font-black text-primary">{filteredPatients.length}</span>
                </div>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-slate-400 uppercase font-black text-[10px] tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Patient Profile</th>
                  <th className="px-6 py-4">Clinical Contact</th>
                  <th className="px-6 py-4">Access Status</th>
                  <th className="px-6 py-4">Onboarding</th>
                  <th className="px-6 py-4 text-right">Clinical Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Retrieving Directory...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                             <AvatarImage src={patient.photoURL} />
                             <AvatarFallback className="bg-primary/5 text-primary font-black text-xs">
                               {patient.fullName?.charAt(0) || 'P'}
                             </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-800 leading-none mb-1">{patient.fullName || 'Unidentified Patient'}</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">UID: {patient.id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-600">
                             <Mail className="h-3 w-3 opacity-40" />
                             <span className="text-xs font-medium">{patient.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                             <Phone className="h-3 w-3 opacity-40" />
                             <span className="text-xs font-medium">{patient.phoneNumber || 'No verified phone'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-widest",
                            patient.isActive 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-rose-50 text-destructive border-rose-100'
                          )} 
                          variant="outline"
                        >
                          {patient.isActive ? (
                            <><CheckCircle2 className="h-3 w-3 mr-1" /> Active</>
                          ) : (
                            <><Ban className="h-3 w-3 mr-1" /> Blocked</>
                          )}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-500">
                           <Calendar className="h-3 w-3 opacity-40" />
                           <span className="text-xs font-medium">{patient.createdAt ? format(new Date(patient.createdAt.seconds * 1000), 'MMM dd, yyyy') : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors">
                              <MoreVertical className="h-4 w-4 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl">
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 py-1.5">Record Mgmt</DropdownMenuLabel>
                            <DropdownMenuItem className="rounded-lg cursor-pointer py-2 px-3">
                              <FileText className="mr-2 h-4 w-4 text-primary" /> 
                              <span className="font-bold text-sm">Medical History</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg cursor-pointer py-2 px-3">
                               <Plus className="mr-2 h-4 w-4 text-accent" /> 
                               <span className="font-bold text-sm">New Prescription</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuItem 
                              className={cn(
                                "rounded-lg cursor-pointer py-2 px-3",
                                patient.isActive ? "text-destructive focus:text-destructive focus:bg-destructive/5" : "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50"
                              )}
                              onClick={() => toggleBlockStatus(patient.id, !!patient.isActive)}
                            >
                              {patient.isActive ? (
                                <><Ban className="mr-2 h-4 w-4" /> <span className="font-bold text-sm">Block Patient</span></>
                              ) : (
                                <><CheckCircle2 className="mr-2 h-4 w-4" /> <span className="font-bold text-sm">Reactivate Access</span></>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center gap-3 max-w-xs mx-auto">
                        <div className="bg-slate-50 p-4 rounded-full"><Users className="h-10 w-10 text-slate-200" /></div>
                        <p className="font-bold text-slate-400">No patients found</p>
                        <p className="text-xs text-slate-300 leading-relaxed">Adjust your search criteria or add a new patient record to the clinical database.</p>
                      </div>
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
