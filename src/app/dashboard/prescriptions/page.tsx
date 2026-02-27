
'use client';

import * as React from 'react';
import { 
  Plus,
  Search,
  FileText,
  Pill,
  Clock,
  CheckCircle2,
  Calendar,
  Eye,
  Download,
  Trash2,
  PlusCircle,
  Loader2,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useUser, useCollection, useMemoFirebase, useDoc, setDocumentNonBlocking } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface MedicineItem {
  name: string;
  dosage: string;
  timing: string;
  duration: string;
  notes: string;
}

export default function PrescriptionsDashboardPage() {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const [selectedPatientId, setSelectedPatientId] = React.useState('');
  const [category, setCategory] = React.useState('General');
  const [remarks, setRemarks] = React.useState('');
  const [medicines, setMedicines] = React.useState<MedicineItem[]>([
    { name: '', dosage: '1-0-1', timing: 'After Food', duration: '5 Days', notes: '' }
  ]);

  const patientsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'users');
  }, [db]);
  const { data: users } = useCollection(patientsQuery);
  const patients = users?.filter(u => u.role === 'patient') || [];

  const settingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'app_config', 'clinical_settings');
  }, [db]);
  const { data: settings } = useDoc(settingsRef);
  const categoriesList = settings?.prescriptionCategories || ['General', 'Follow-up', 'Consultation'];

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '1-0-1', timing: 'After Food', duration: '5 Days', notes: '' }]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: keyof MedicineItem, value: string) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async () => {
    if (!db || !selectedPatientId) return;
    setIsSubmitting(true);
    const rxId = `RX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const medicineItems = medicines.map(m => `${m.name} | ${m.dosage} | ${m.timing} | ${m.duration} | ${m.notes}`);
    const prescriptionRef = doc(db, 'patients', selectedPatientId, 'prescriptions', rxId);
    
    setDocumentNonBlocking(prescriptionRef, {
      id: rxId,
      patientId: selectedPatientId,
      doctorId: user?.uid,
      issuedDate: new Date().toISOString(),
      category,
      medicineItems,
      generalRemarks: remarks,
      createdAt: serverTimestamp(),
    }, { merge: true });

    toast({ title: 'RX Issued', description: `RX ${rxId} sent to patient.` });
    setIsDialogOpen(false);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline text-slate-900">Clinical Prescriptions</h1>
          <p className="text-slate-500 text-sm">Issue digital medication guides for your patients.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 rounded-xl shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> Create New RX
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>New Clinical Prescription</DialogTitle></DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient</Label>
                  <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.fullName || p.email}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{categoriesList.map((cat: string) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><Label>Medications</Label><Button variant="outline" size="sm" onClick={handleAddMedicine}><PlusCircle className="h-4 w-4 mr-2" /> Add</Button></div>
                {medicines.map((med, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border space-y-3">
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-5"><Input placeholder="Medicine Name" value={med.name} onChange={e => handleMedicineChange(i, 'name', e.target.value)} /></div>
                      <div className="col-span-2"><Input placeholder="1-0-1" value={med.dosage} onChange={e => handleMedicineChange(i, 'dosage', e.target.value)} /></div>
                      <div className="col-span-4"><Input placeholder="5 Days" value={med.duration} onChange={e => handleMedicineChange(i, 'duration', e.target.value)} /></div>
                      <div className="col-span-1"><Button variant="ghost" size="icon" onClick={() => handleRemoveMedicine(i)} disabled={medicines.length === 1}><Trash2 className="h-4 w-4" /></Button></div>
                    </div>
                  </div>
                ))}
              </div>
              <Textarea placeholder="Remarks..." value={remarks} onChange={e => setRemarks(e.target.value)} />
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={isSubmitting || !selectedPatientId}>{isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />} Issue Prescription</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-slate-400">Total RX Issued</CardTitle></CardHeader><CardContent><div className="text-3xl font-black">1,248</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-slate-400">Adherence Rate</CardTitle></CardHeader><CardContent><div className="text-3xl font-black">84%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-slate-400">Monthly Avg</CardTitle></CardHeader><CardContent><div className="text-3xl font-black">142</div></CardContent></Card>
      </div>

      <Card className="shadow-xl border-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>RX ID</TableHead><TableHead>Patient</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="w-[100px]"></TableHead></TableRow></TableHeader>
            <TableBody>
              <TableRow><TableCell><code className="text-xs font-bold text-primary">RX-7721</code></TableCell><TableCell>Anjali Sharma</TableCell><TableCell>2024-07-20</TableCell><TableCell><Badge className="bg-emerald-50 text-emerald-600">Active</Badge></TableCell><TableCell><div className="flex gap-2"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button></div></TableCell></TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
