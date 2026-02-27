'use client';

import * as React from 'react';
import { 
  ClipboardPlus, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Stethoscope, 
  Pill, 
  User,
  CheckCircle2,
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, where, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { PrescriptionCard } from '@/components/blocks/PrescriptionCard';
import { cn } from '@/lib/utils';

interface Medicine {
  name: string;
  dosage: string;
  timing: string;
  duration: string;
  notes: string;
}

export default function PrescriptionBuilderPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);

  // Form State
  const [patientId, setPatientId] = React.useState('');
  const [generalRemarks, setGeneralRemarks] = React.useState('');
  const [medicines, setMedicines] = React.useState<Medicine[]>([
    { name: '', dosage: '', timing: '', duration: '', notes: '' }
  ]);

  // Fetch patients for selection
  const patientsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('role', '==', 'patient'), where('isActive', '==', true));
  }, [db]);
  const { data: patients } = useCollection(patientsQuery);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', timing: '', duration: '', notes: '' }]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: keyof Medicine, value: string) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async () => {
    if (!db || !patientId || medicines.some(m => !m.name)) {
      toast({ variant: 'destructive', title: 'Clinical Error', description: 'Please identify the patient and medicine details.' });
      return;
    }

    setIsSubmitting(true);

    const formattedMedicines = medicines.map(m => 
      `${m.name} | ${m.dosage || 'As directed'} | ${m.timing || 'Daily'} | ${m.duration || '-'} | ${m.notes || ''}`
    );

    const prescriptionId = `RX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    // Save to top-level prescriptions collection
    const prescriptionsRef = collection(db, 'prescriptions');

    addDocumentNonBlocking(prescriptionsRef, {
      id: prescriptionId,
      patientId,
      issuedDate: new Date().toISOString(),
      medicineItems: formattedMedicines,
      generalRemarks,
      doctorId: 'main-doctor',
      createdAt: serverTimestamp()
    });

    toast({ title: 'Prescription Issued', description: `Digital RX ${prescriptionId} sent to patient hub.` });
    
    // Reset Form
    setTimeout(() => {
      setPatientId('');
      setGeneralRemarks('');
      setMedicines([{ name: '', dosage: '', timing: '', duration: '', notes: '' }]);
      setIsSubmitting(false);
      setIsPreviewMode(false);
    }, 1000);
  };

  const mockPrescriptionForPreview = {
    id: 'PREVIEW-ONLY',
    patientId: patientId || 'ID_NOT_SET',
    issuedDate: new Date().toISOString(),
    medicineItems: medicines.map(m => `${m.name || 'Medicine Name'} | ${m.dosage} | ${m.timing} | ${m.duration} | ${m.notes}`),
    generalRemarks: generalRemarks || 'No additional remarks provided.'
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Prescription Builder</h1>
          <p className="text-muted-foreground font-ui text-sm">Create high-fidelity digital prescriptions for patients.</p>
        </div>
        <div className="flex gap-3">
           <Button 
            variant="outline" 
            className="h-11 rounded-xl font-bold"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
           >
             {isPreviewMode ? <ClipboardPlus className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
             {isPreviewMode ? 'Return to Editor' : 'Clinical Preview'}
           </Button>
           {isPreviewMode && (
             <Button 
              className="h-11 rounded-xl shadow-lg shadow-primary/20 font-bold px-8"
              onClick={handleSubmit}
              disabled={isSubmitting}
             >
               {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
               Finalize & Send RX
             </Button>
           )}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start flex-1 overflow-hidden">
        <div className={cn("space-y-8 transition-all duration-500 overflow-y-auto h-full pr-2 custom-scrollbar", isPreviewMode ? "lg:col-span-5" : "lg:col-span-12")}>
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">1. Patient Identification</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Target Patient Record</Label>
                <Select value={patientId} onValueChange={setPatientId}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200">
                    <SelectValue placeholder="Select Patient from Clinical Database" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <div className="flex items-center gap-2">
                           <span className="font-bold text-slate-800">{p.fullName}</span>
                           <span className="text-[10px] text-slate-400">({p.email})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">2. Medication Guide</CardTitle>
                <CardDescription className="text-[10px]">Define dosage and clinical timing.</CardDescription>
              </div>
              <Button onClick={handleAddMedicine} variant="outline" size="sm" className="h-8 rounded-lg border-primary/20 text-primary hover:bg-primary/5">
                <Plus className="h-3 w-3 mr-1" /> Add Medicine
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {medicines.map((med, index) => (
                <div key={index} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative group animate-in slide-in-from-top-2 duration-300">
                  {medicines.length > 1 && (
                    <button 
                      onClick={() => handleRemoveMedicine(index)}
                      className="absolute top-4 right-4 text-slate-300 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-400">Medicine Name</Label>
                      <Input 
                        placeholder="e.g. Paracetamol 500mg" 
                        value={med.name}
                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                        className="h-10 rounded-xl bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-400">Clinical Dosage</Label>
                      <Input 
                        placeholder="e.g. 1 Tablet" 
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        className="h-10 rounded-xl bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-400">Frequency & Timing</Label>
                      <Input 
                        placeholder="e.g. Twice daily (After food)" 
                        value={med.timing}
                        onChange={(e) => handleMedicineChange(index, 'timing', e.target.value)}
                        className="h-10 rounded-xl bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-400">Duration</Label>
                      <Input 
                        placeholder="e.g. 5 Days" 
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        className="h-10 rounded-xl bg-white"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-400">Specific Notes (Optional)</Label>
                      <Input 
                        placeholder="Additional diet or reaction warnings..." 
                        value={med.notes}
                        onChange={(e) => handleMedicineChange(index, 'notes', e.target.value)}
                        className="h-10 rounded-xl bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">3. General Clinical Remarks</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea 
                placeholder="Diagnostic summary, lifestyle advice, or follow-up instructions..." 
                className="min-h-[120px] rounded-2xl bg-slate-50/30 border-slate-200"
                value={generalRemarks}
                onChange={(e) => setGeneralRemarks(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Live Preview Panel */}
        <div className={cn("lg:sticky lg:top-0 h-full overflow-y-auto transition-all duration-500", isPreviewMode ? "lg:col-span-7" : "hidden")}>
           <div className="space-y-4 pr-2">
              <div className="flex items-center gap-3 bg-primary/5 p-4 rounded-2xl border border-primary/10">
                 <AlertCircle className="h-5 w-5 text-primary" />
                 <p className="text-xs font-bold text-primary uppercase tracking-widest leading-none mt-0.5">Clinical Preview Mode</p>
              </div>
              <div className="bg-white p-2 rounded-[2rem] shadow-2xl border border-slate-100 scale-90 origin-top">
                 <PrescriptionCard prescription={mockPrescriptionForPreview} />
              </div>
              <p className="text-[10px] text-muted-foreground text-center italic px-10 leading-relaxed pb-8">
                "Preview matches the final PDF layout the patient will receive. Check all medicine names and dosages carefully before finalizing."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}