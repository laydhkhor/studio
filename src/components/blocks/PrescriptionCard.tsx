'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, Clock, Info, Download, AlertTriangle, Stethoscope, MapPin } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { doctorDetails } from '@/lib/placeholder-data';

interface PrescriptionItem {
  name: string;
  dosage: string;
  timing: string;
  duration: string;
  notes: string;
}

export function PrescriptionCard({ prescription }: { prescription: any }) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const printRef = React.useRef<HTMLDivElement>(null);

  // Parsing helper for structured medicine strings
  // Format assumed: "Name | Dosage | Timing | Duration | Notes"
  const medicines: PrescriptionItem[] = prescription.medicineItems?.map((item: string) => {
    const parts = item.split('|').map(p => p.trim());
    return {
      name: parts[0] || item,
      dosage: parts[1] || 'As directed',
      timing: parts[2] || 'Twice daily',
      duration: parts[3] || '-',
      notes: parts[4] || ''
    };
  }) || [];

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const data = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Prescription_${prescription.id.substring(0, 8)}.pdf`);
    } catch (error) {
      console.error('PDF Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Card className="shadow-sm border-slate-200 hover:shadow-md transition-all group overflow-hidden">
        <CardHeader className="bg-slate-50/50 py-4 px-6 border-b flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Stethoscope className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold">Consultation Report</CardTitle>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                Issued: {prescription.issuedDate ? format(new Date(prescription.issuedDate), 'MMMM dd, yyyy') : 'Recently'}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs font-bold gap-2" 
            onClick={handleDownloadPDF}
            disabled={isGenerating}
          >
            <Download className="h-3.5 w-3.5" />
            {isGenerating ? 'Generating...' : 'Download RX'}
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-3 flex items-center gap-2">
                <Pill className="h-3 w-3" /> Medication Guide
              </h4>
              <div className="grid gap-3">
                {medicines.map((med, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">{med.name}</span>
                        <Badge variant="secondary" className="text-[9px] h-4 px-1.5">{med.duration}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {med.dosage}</span>
                        <span className="flex items-center gap-1.5"><Info className="h-3 w-3" /> {med.timing}</span>
                      </div>
                    </div>
                    {med.notes && (
                      <div className="md:w-1/3 flex items-start gap-2 bg-white/50 p-2 rounded-lg border border-slate-100 italic text-[11px] text-slate-600">
                        <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                        {med.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {prescription.generalRemarks && (
              <div className="pt-4 border-t border-dashed">
                <h4 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">Doctor's Remarks</h4>
                <p className="text-sm text-slate-700 leading-relaxed italic">"{prescription.generalRemarks}"</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden Print Template */}
      <div className="fixed -left-[2000px] top-0">
        <div 
          ref={printRef} 
          className="w-[210mm] p-12 bg-white text-slate-900 font-serif relative min-h-[297mm]"
        >
          {/* Header */}
          <div className="border-b-4 border-primary pb-6 mb-10 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-1 uppercase tracking-tight">{doctorDetails.name}</h1>
              <p className="text-sm font-sans font-bold text-slate-600 uppercase tracking-widest">{doctorDetails.education}</p>
              <div className="mt-4 flex items-center gap-4 text-xs font-sans text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Mahishadal & Nandakumar</span>
                <span>|</span>
                <span>WBMC Reg No: 78234-A</span>
              </div>
            </div>
            <div className="text-right font-sans">
              <div className="bg-primary text-white px-4 py-2 rounded mb-2 inline-block font-bold">PRESCRIPTION</div>
              <p className="text-xs text-slate-500">RX ID: {prescription.id.toUpperCase()}</p>
              <p className="text-xs text-slate-500">Date: {prescription.issuedDate || format(new Date(), 'dd/MM/yyyy')}</p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="grid grid-cols-2 gap-8 mb-12 bg-slate-50 p-6 rounded-lg font-sans border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Patient Details</p>
              <p className="text-lg font-bold">Patient ID: {prescription.patientId.substring(0, 12)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Clinic Center</p>
              <p className="text-sm font-bold">DocAssist Health Systems</p>
            </div>
          </div>

          {/* RX Section */}
          <div className="mb-16">
            <div className="text-4xl text-primary font-bold italic mb-6">Rx</div>
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs text-slate-400 uppercase">
                  <th className="py-3 font-bold">Medicine Details</th>
                  <th className="py-3 font-bold">Dosage</th>
                  <th className="py-3 font-bold">Instructions</th>
                  <th className="py-3 font-bold text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicines.map((med, i) => (
                  <tr key={i} className="text-sm">
                    <td className="py-5 font-bold text-slate-900">{med.name}</td>
                    <td className="py-5">{med.dosage}</td>
                    <td className="py-5 italic text-slate-600">{med.timing}</td>
                    <td className="py-5 text-right font-bold">{med.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Remarks */}
          {prescription.generalRemarks && (
            <div className="mb-20 bg-slate-50 p-6 rounded-lg font-sans">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Clinical Remarks & Diet Advice</h4>
              <p className="text-sm leading-relaxed text-slate-700">{prescription.generalRemarks}</p>
            </div>
          )}

          {/* Footer & Signature */}
          <div className="absolute bottom-16 left-12 right-12 font-sans border-t pt-10">
            <div className="flex justify-between items-end">
              <div className="text-[10px] text-slate-400 max-w-xs uppercase leading-tight">
                This is a digitally generated prescription. No handwritten signature is required for validity under Section 5 of Information Technology Act, 2000.
              </div>
              <div className="text-center">
                <div className="w-48 h-12 border-b border-slate-300 mb-2 italic text-primary text-xl font-serif">P. Pattyanayek</div>
                <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Digital Signature</p>
                <p className="text-[9px] text-slate-400">Dr. Pritam Pattyanayek</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
