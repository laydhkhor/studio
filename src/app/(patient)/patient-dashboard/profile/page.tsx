'use client';

import * as React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar as CalendarIcon, 
  MapPin, 
  ShieldCheck, 
  Loader2,
  Save,
  Activity
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
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function PatientProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData, isLoading } = useDoc(userDocRef);

  const [formData, setFormData] = React.useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    emergencyContact: '',
    bloodGroup: ''
  });

  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || '',
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        emergencyContact: userData.emergencyContact || '',
        bloodGroup: userData.bloodGroup || ''
      });
    }
  }, [userData]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    setIsSaving(true);
    const userRef = doc(db, 'users', user.uid);
    
    updateDocumentNonBlocking(userRef, {
      ...formData,
      updatedAt: serverTimestamp()
    });

    setTimeout(() => {
      setIsSaving(false);
      toast({ title: 'Profile Updated', description: 'Your medical record has been updated successfully.' });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-[400px] w-full rounded-[2rem]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Medical Profile</h1>
          <p className="text-muted-foreground font-ui">Maintain accurate records for better clinical diagnosis.</p>
        </div>
        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 uppercase font-black text-[10px] h-8 px-4">
          <ShieldCheck className="mr-2 h-4 w-4" /> Verified Identity
        </Badge>
      </div>

      <form onSubmit={handleSave} className="grid md:grid-cols-12 gap-8">
        {/* Main Info */}
        <Card className="md:col-span-8 border-none shadow-sm rounded-[2rem]">
          <CardHeader className="bg-slate-50/50">
            <CardTitle className="font-headline text-lg">Personal Details</CardTitle>
            <CardDescription>Core information used for clinical verification.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Legal Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    id="fullName" 
                    className="pl-10 h-12 rounded-xl"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    id="email" 
                    className="pl-10 h-12 rounded-xl bg-slate-50" 
                    value={user?.email || ''} 
                    disabled 
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic px-1">Email cannot be changed after verification.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    id="phone" 
                    className="pl-10 h-12 rounded-xl"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    id="dob" 
                    className="pl-10 h-12 rounded-xl bg-slate-50" 
                    value={userData?.dateOfBirth ? format(new Date(userData.dateOfBirth), 'PPP') : 'Not set'} 
                    disabled 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Residential Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input 
                  id="address" 
                  className="pl-10 h-12 rounded-xl"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/50 py-4">
             <Button type="submit" disabled={isSaving} className="ml-auto rounded-xl h-12 px-8 font-bold shadow-lg shadow-primary/20">
               {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
               Save Medical Profile
             </Button>
          </CardFooter>
        </Card>

        {/* Clinical Sidebar */}
        <div className="md:col-span-4 space-y-6">
           <Card className="border-none shadow-sm rounded-[2rem]">
              <CardHeader>
                <CardTitle className="font-headline text-lg">Vital Stats</CardTitle>
                <CardDescription>Critical data for emergency care.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <div className="relative">
                      <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <Input 
                        id="bloodGroup" 
                        placeholder="e.g. O+ve"
                        className="pl-10 h-11 rounded-xl"
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                      />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <Input 
                        id="emergency" 
                        placeholder="Relative's phone"
                        className="pl-10 h-11 rounded-xl"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                      />
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="pt-0">
                 <p className="text-[10px] text-muted-foreground leading-relaxed italic text-center w-full">
                   This information is strictly used for clinical purposes and shared only with your treating physician.
                 </p>
              </CardFooter>
           </Card>

           <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Privacy & Consent</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                By maintaining this profile, you consent to the storage of your medical data within our encrypted cloud infrastructure for clinical consultation purposes.
              </p>
           </div>
        </div>
      </form>
    </div>
  );
}
