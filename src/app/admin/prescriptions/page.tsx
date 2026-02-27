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
  Loader2,
  Trash2,
  User,
  PlusCircle,
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
import { useFirestore, useUser, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface MedicineItem {
  name: string;
  dosage: string;
  timing: string;
  duration: string;
  notes: string;
}

export default function AdminPrescriptionsPage() {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Form State
  const [selectedPatientId, setSelectedPatientId] = React.useState('');
  const [category, setCategory] = React.useState('General');
  const [remarks, setRemarks] = React.useState('');
  const [medicines, setMedicines] = React.useState<MedicineItem[]>([
    { name: '', dosage: '1-0-1', timing: 'After Food', duration: '5 Days', notes: '' }
  ]);

  // Fetch Patients for selection
  const patientsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'users'); // Simplification: in real app filter by role='patient'
  }, [db]);
  const { data: users } = useCollection(patientsQuery);
  const patients = users?.filter(u => u.role === 'patient') || [];

  // Fetch all prescriptions (aggregated from patients)
  // Note: Real app would need a root-level collection or cloud function for cross-patient list
  // For MVP, we'll display a placeholder list or search results
  const [prescriptions, setPrescriptions] = React.useState<any[]>([]);

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
    if (!db || !selectedPatientId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a patient.' });
      return;
    }

    if (medicines.some(m => !m.name)) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please provide names for all medicines.' });
      return;
    }

    setIsSubmitting(true);
    const rxId = `RX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    
    // Format medicines as strings for the PrescriptionCard parsing logic
    // Format: "Name | Dosage | Timing | Duration | Notes"
    const medicineItems = medicines.map(m => 
      `${m.name} | ${m.dosage} | ${m.timing} | ${m.duration} | ${m.notes}`
    );

    const prescriptionRef = doc(db, 'patients', selectedPatientId, 'prescriptions', rxId);
    
    try {
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

      toast({ title: 'Prescription Issued', description: `RX ${rxId} has been sent to the patient dashboard.` });
      
      // Reset form
      setIsDialogOpen(false);
      setSelectedPatientId('');
      setMedicines([{ name: '', dosage: '1-0-1', timing: 'After Food', duration: '5 Days', notes: '' }]);
      setRemarks('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline text-slate-900">Clinical Prescriptions</h1>
          <p className="text-slate-500 text-sm">Issue and track digital medication guides for your patients.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 rounded-xl shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> Create New RX
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline font-bold">New Clinical Prescription</DialogTitle>
              <DialogDescription>
                Assign medication and clinical guidelines to a patient record.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Patient</Label>
                  <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choose patient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.fullName || p.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Consultation Category</Label>
                  <Input 
                    placeholder="e.g., Fever, Post-Op, Diabetic" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="h-11"
                  />
                </div>
              </div>

              {/* Medicines Builder */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary">Medication Guide</Label>
                  <Button variant="outline" size="sm" onClick={handleAddMedicine} className="h-8 text-xs font-bold text-primary">
                    <PlusCircle className="mr-2 h-3.5 w-3.5" /> Add Medicine
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {medicines.map((med, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative group animate-in fade-in slide-in-from-top-1 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-4 space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">Medicine Name</Label>
                          <Input 
                            placeholder="e.g., Paracetamol 500mg" 
                            value={med.name} 
                            onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                            className="h-9 bg-white"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">Dosage</Label>
                          <Input 
                            placeholder="1-0-1" 
                            value={med.dosage} 
                            onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                            className="h-9 bg-white"
                          />
                        </div>
                        <div className="md:col-span-3 space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">Timing</Label>
                          <Select value={med.timing} onValueChange={(v) => handleMedicineChange(index, 'timing', v)}>
                            <SelectTrigger className="h-9 bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="After Food">After Food</SelectItem>
                              <SelectItem value="Before Food">Before Food</SelectItem>
                              <SelectItem value="Empty Stomach">Empty Stomach</SelectItem>
                              <SelectItem value="Bedtime">Bedtime</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">Duration</Label>
                          <Input 
                            placeholder="5 Days" 
                            value={med.duration} 
                            onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                            className="h-9 bg-white"
                          />
                        </div>
                        <div className="md:col-span-1 flex items-end justify-center pb-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveMedicine(index)} 
                            disabled={medicines.length === 1}
                            className="h-8 w-8 text-slate-400 hover:text-red-600 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Label className="text-[10px] uppercase font-bold text-slate-400">Patient Instructions (Optional)</Label>
                        <Input 
                          placeholder="e.g., Avoid cold water, take with warm milk" 
                          value={med.notes} 
                          onChange={(e) => handleMedicineChange(index, 'notes', e.target.value)}
                          className="h-8 bg-white text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label>Clinical Remarks & Diet Advice</Label>
                <Textarea 
                  placeholder="Provide general health advice or dietary restrictions..." 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>

            <DialogFooter className="bg-slate-50 -mx-6 -mb-6 p-6 border-t mt-4">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !selectedPatientId} className="min-w-[180px] font-bold shadow-lg shadow-primary/20">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                Issue Prescription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
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
              {/* Prescriptions would be fetched here. Showing placeholders for now. */}
              <TableRow className="hover:bg-slate-50 border-slate-100 transition-colors">
                <TableCell className="pl-6"><code className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded">RX-7721</code></TableCell>
                <TableCell className="font-bold text-slate-900 text-sm">Anjali Sharma</TableCell>
                <TableCell><p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium"><Calendar className="h-3 w-3 text-slate-400" /> 2024-07-20</p></TableCell>
                <TableCell><Badge variant="outline" className="text-[9px] h-5 px-2 bg-slate-50 text-slate-600 font-bold uppercase tracking-widest">Fever</Badge></TableCell>
                <TableCell><div className="flex items-center gap-1.5 text-xs font-bold text-slate-600"><Pill className="h-3.5 w-3.5 text-emerald-500" /> 3 Items</div></TableCell>
                <TableCell><Badge className="text-[9px] h-5 px-2 font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border-emerald-100">Active</Badge></TableCell>
                <TableCell className="pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Download className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-slate-200 rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
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
