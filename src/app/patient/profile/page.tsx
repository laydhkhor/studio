'use client';

import * as React from 'react';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking, useStorage } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, User, Phone, Mail, Calendar as CalendarIcon, HeartPulse, Camera, Check, Pencil, ShieldCheck, Activity } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import imageCompression from 'browser-image-compression';

export default function PatientProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Form states
  const [formData, setFormData] = React.useState({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'male',
  });

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData, isLoading } = useDoc(userDocRef);

  // Sync initial data ONLY when not editing to prevent state reset while typing
  React.useEffect(() => {
    if (userData && !isEditing) {
      setFormData({
        fullName: userData.fullName || '',
        phoneNumber: userData.phoneNumber || '',
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || 'male',
      });
    }
  }, [userData, isEditing]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !storage || !db) return;

    setIsUploading(true);
    try {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 400,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(file, options);

      const storageRef = ref(storage, `profile_pictures/${user.uid}`);
      await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, { photoURL: downloadURL });

      setDocumentNonBlocking(doc(db, 'users', user.uid), {
        photoURL: downloadURL,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      toast({
        title: "Success",
        description: "Profile picture updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = () => {
    if (!user || !db) return;
    setIsSaving(true);

    const userRef = doc(db, 'users', user.uid);
    setDocumentNonBlocking(userRef, {
      ...formData,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Simulate short delay for UI feedback
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your health records have been successfully synchronized.",
      });
    }, 600);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-6xl">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-slate-900">Medical Identity</h1>
          <p className="text-muted-foreground">Manage your core profile and clinical record details for accurate diagnosis.</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && (
            <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}>
              Cancel
            </Button>
          )}
          <Button 
            variant={isEditing ? "default" : "outline"} 
            onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)}
            disabled={isSaving}
            className="min-w-[140px] shadow-sm"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : isEditing ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Pencil className="h-4 w-4 mr-2" />
            )}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Profile Details Column */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardHeader className="border-b bg-slate-50/50 py-4 px-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-headline">Personal Information</CardTitle>
              </div>
              <CardDescription>Verified details used for digital prescriptions and clinic records.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Full Name - Spans full width */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-500 text-xs uppercase tracking-wider font-bold">Full Name</Label>
                  {isEditing ? (
                    <Input 
                      id="fullName" 
                      value={formData.fullName} 
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      placeholder="e.g., Pritam Pattyanayek"
                      className="h-11"
                    />
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 font-medium text-slate-900 flex items-center gap-3 h-11">
                      <User className="h-4 w-4 text-slate-400" /> {userData?.fullName || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email - Read Only */}
                  <div className="space-y-2">
                    <Label className="text-slate-500 text-xs uppercase tracking-wider font-bold">Email Address</Label>
                    <div className="p-3 bg-slate-100/50 rounded-lg border border-slate-100 text-slate-500 flex items-center gap-3 h-11 cursor-not-allowed">
                       <Mail className="h-4 w-4 text-slate-400" /> {userData?.email || user?.email || 'Not available'}
                    </div>
                    <p className="text-[10px] text-muted-foreground italic mt-1">Contact system admin to change email.</p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-500 text-xs uppercase tracking-wider font-bold">Phone Number</Label>
                    {isEditing ? (
                      <Input 
                        id="phone" 
                        type="tel"
                        value={formData.phoneNumber} 
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        placeholder="+91 12345 67890"
                        className="h-11"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-900 flex items-center gap-3 h-11">
                         <Phone className="h-4 w-4 text-slate-400" /> {userData?.phoneNumber || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* DOB */}
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-slate-500 text-xs uppercase tracking-wider font-bold">Date of Birth</Label>
                    {isEditing ? (
                      <Input 
                        id="dob" 
                        type="date"
                        value={formData.dateOfBirth} 
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                        className="h-11"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-900 flex items-center gap-3 h-11">
                         <CalendarIcon className="h-4 w-4 text-slate-400" /> {userData?.dateOfBirth || 'Not set'}
                      </div>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label className="text-slate-500 text-xs uppercase tracking-wider font-bold">Gender</Label>
                    {isEditing ? (
                      <div className="h-11 flex items-center">
                        <RadioGroup value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})} className="flex gap-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="edit-male" />
                            <Label htmlFor="edit-male" className="font-normal cursor-pointer">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="edit-female" />
                            <Label htmlFor="edit-female" className="font-normal cursor-pointer">Female</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="edit-other" />
                            <Label htmlFor="edit-other" className="font-normal cursor-pointer">Other</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-900 flex items-center gap-3 h-11 capitalize">
                         <HeartPulse className="h-4 w-4 text-slate-400" /> {userData?.gender || 'Not specified'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Support Card */}
          <Card className="bg-slate-900 text-white overflow-hidden shadow-xl border-none">
             <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div className="space-y-4 max-w-md">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-primary/20 rounded-lg">
                          <ShieldCheck className="h-6 w-6 text-primary" />
                       </div>
                       <h3 className="font-headline font-bold text-xl">Need Clinical Assistance?</h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      For critical data corrections, insurance-related queries, or to report a medical emergency, contact our dedicated clinic support desk.
                    </p>
                    <Button asChild className="h-11 font-bold bg-primary hover:bg-primary/90 min-w-[180px]">
                      <Link href="/contact">Get Help Now</Link>
                    </Button>
                  </div>
                  <div className="hidden md:block opacity-10">
                    <HeartPulse className="h-32 w-32" />
                  </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Identity Column */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-lg border-primary/10 overflow-hidden sticky top-24">
            <CardHeader className="bg-primary/5 text-center py-4 border-b border-primary/5">
              <CardTitle className="text-[10px] font-headline text-primary uppercase tracking-[0.2em] font-black">Digital Health Identity</CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center flex flex-col items-center">
              <div className="relative group">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-2xl transition-transform group-hover:scale-[1.02]">
                    <AvatarImage src={user?.photoURL || userData?.photoURL || ''} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-4xl">
                      {userData?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <label htmlFor="dp-upload" className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer border-4 border-white">
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    <input 
                      type="file" 
                      id="dp-upload" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 space-y-1">
                <p className="font-bold text-2xl text-slate-900 leading-tight">{userData?.fullName || user?.displayName || 'Valued Patient'}</p>
                <p className="text-[10px] text-muted-foreground font-mono bg-slate-100 px-3 py-1 rounded-full inline-block">
                  ID: {user?.uid.substring(0, 14).toUpperCase()}
                </p>
              </div>
              
              <div className="w-full mt-8 pt-8 border-t space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-tighter">Clinical Status</span>
                  <span className="font-bold text-accent px-2.5 py-1 bg-accent/10 rounded-full flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    Active Record
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-tighter">Verification</span>
                  <span className="font-bold text-primary flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-tighter">Last Update</span>
                  <span className="text-slate-600 font-medium">
                    {userData?.updatedAt ? new Date(userData.updatedAt.seconds * 1000).toLocaleDateString() : 'Initial Setup'}
                  </span>
                </div>
              </div>
            </CardContent>
            <div className="bg-slate-50 p-4 border-t text-center">
               <p className="text-[10px] text-slate-400 leading-tight">
                 This identity is required for all digital consultations and clinic check-ins.
               </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
