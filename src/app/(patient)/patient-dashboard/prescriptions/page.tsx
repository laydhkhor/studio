'use client';

import * as React from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Stethoscope,
  Loader2,
  Calendar
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
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { PrescriptionCard } from '@/components/blocks/PrescriptionCard';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function PatientPrescriptionsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = React.useState('');

  const prescriptionsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'patients', user.uid, 'prescriptions'), 
      orderBy('issuedDate', 'desc')
    );
  }, [db, user]);

  const { data: prescriptions, isLoading } = useCollection(prescriptionsQuery);

  const filteredPrescriptions = React.useMemo(() => {
    if (!prescriptions) return [];
    return prescriptions.filter(p => 
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.medicineItems && p.medicineItems.some((m: string) => m.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (p.generalRemarks && p.generalRemarks.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [prescriptions, searchTerm]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="font-headline text-3xl font-bold">Prescription Archive</h1>
          <p className="text-muted-foreground font-ui">Your complete digital history of medical recommendations.</p>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="outline" className="h-10 px-4 border-primary/20 bg-primary/5 text-primary font-bold">
              {prescriptions?.length || 0} Reports Issued
           </Badge>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by medicine or RX ID..." 
              className="pl-10 h-12 rounded-2xl bg-white border-slate-200" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <Button variant="outline" className="h-12 rounded-2xl px-6 border-slate-200 bg-white">
            <Filter className="mr-2 h-4 w-4" /> Date Filter
         </Button>
      </div>

      <div className="grid gap-8">
        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Retrieving clinical records...</p>
          </div>
        ) : filteredPrescriptions.length > 0 ? (
          filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="relative group">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors rounded-full hidden md:block" />
              <PrescriptionCard prescription={prescription} />
            </div>
          ))
        ) : (
          <Card className="border-none shadow-sm bg-slate-50/50 py-20 flex flex-col items-center justify-center text-center">
             <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                <FileText className="h-12 w-12 text-slate-200" />
             </div>
             <p className="font-headline text-xl font-bold text-slate-400">No reports found</p>
             <p className="text-sm text-slate-300 mt-2 max-w-xs mx-auto">
               Search for something else or schedule a consultation to receive your first digital prescription.
             </p>
          </Card>
        )}
      </div>
    </div>
  );
}
