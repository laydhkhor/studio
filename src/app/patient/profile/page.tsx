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
import { Loader2, User, Phone, Mail, Calendar as CalendarIcon, HeartPulse, Camera, Check, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
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

  // Sync initial data
  React.useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || '',
        phoneNumber: userData.phoneNumber || '',
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || 'male',
      });
    }
  }, [userData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !storage || !db) return;

    setIsUploading(true);
    try {
      // 1. Optimize & Compress Image
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 400,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(file, options);

      // 2. Upload to Firebase Storage
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);
      await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(storageRef);

      // 3. Update Auth Profile
      await updateProfile(user, { photoURL: downloadURL });

      // 4. Update Firestore Doc (Non-blocking)
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

    // Simulate short delay for UX feel, but logic is non-blocking
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your health records have been synchronized.",
      });
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-4xl">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-slate-900">Medical Identity</h1>
          <p className="text-muted-foreground mt-2">Manage your core profile and clinical record details.</p>
        </div>
        <Button 
          variant={isEditing ? "default" : "outline"} 
          onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)}
          disabled={isSaving}
          className="md:w-auto w-full"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : isEditing ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Pencil className="h-4 w-4 mr-2" />
          )}
          {isEditing ? 'Save Profile' : 'Edit Information'}
        </Button>
      </header>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Profile Details Column */}
        <div className="md:col-span-8 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Personal Information
              </CardTitle>
              <CardDescription>Details used for your digital prescriptions and clinic records.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="fullName" className="text-slate-500 text-xs uppercase tracking-wider font-bold">Full Name</Label>
                {isEditing ? (
                  <Input 
                    id="fullName" 
                    value={formData.fullName} 
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 font-medium text-slate-900 flex items-center gap-3">
                    <User className="h-4 w-4 text-slate-400" /> {userData?.fullName || 'Not set'}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-500 text-xs uppercase tracking-wider font-bold">Email Address</Label>
                  <div className="p-3 bg-slate-100/50 rounded-lg border border-slate-100 text-slate-500 flex items-center gap-3 cursor-not-allowed">
                     <Mail className="h-4 w-4 text-slate-400" /> {userData?.email || 'Not set'}
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">Email cannot be changed manually.</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-slate-500 text-xs uppercase tracking-wider font-bold">Phone Number</Label>
                  {isEditing ? (
                    <Input 
                      id="phone" 
                      type="tel"
                      value={formData.phoneNumber} 
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      placeholder="+91 12345 67890"
                    />
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-900 flex items-center gap-3">
                       <Phone className="h-4 w-4 text-slate-400" /> {userData?.phoneNumber || 'Not set'}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dob" className="text-slate-500 text-xs uppercase tracking-wider font-bold">Date of Birth</Label>
                  {isEditing ? (
                    <Input 
                      id="dob" 
                      type="date"
                      value={formData.dateOfBirth} 
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    />
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-900 flex items-center gap-3">
                       <CalendarIcon className="h-4 w-4 text-slate-400" /> {userData?.dateOfBirth || 'Not set'}
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label className="text-slate-500 text-xs uppercase tracking-wider font-bold">Gender</Label>
                  {isEditing ? (
                    <RadioGroup value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})} className="flex gap-4 pt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="edit-male" />
                        <Label htmlFor="edit-male" className="font-normal">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="edit-female" />
                        <Label htmlFor="edit-female" className="font-normal">Female</Label>
                      </div>
                    </RadioGroup>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-900 flex items-center gap-3 capitalize">
                       <HeartPulse className="h-4 w-4 text-slate-400" /> {userData?.gender || 'Not set'}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Identity & Support Column */}
        <div className="md:col-span-4 space-y-6">
          <Card className="shadow-sm border-primary/10 overflow-hidden">
            <CardHeader className="bg-primary/5 text-center pb-2">
              <CardTitle className="text-xs font-headline text-primary uppercase tracking-widest">Digital Health Card</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center flex flex-col items-center">
              <div className="relative group cursor-pointer">
                <Avatar className="w-28 h-28 border-4 border-white shadow-xl">
                  <AvatarImage src={user?.photoURL || userData?.photoURL || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-3xl">
                    {userData?.fullName?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                
                <label htmlFor="dp-upload" className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-all cursor-pointer border-2 border-white">
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

              <div className="mt-4">
                <p className="font-bold text-xl text-slate-900">{userData?.fullName || 'Health Patient'}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">ID: {user?.uid.substring(0, 12).toUpperCase()}</p>
              </div>
              
              <div className="w-full mt-6 pt-6 border-t space-y-3 text-left">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-tighter">
                  <span className="text-slate-400 font-bold">Clinical Status</span>
                  <span className="font-bold text-accent px-2 py-0.5 bg-accent/10 rounded-full">Active Record</span>
                </div>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-tighter">
                  <span className="text-slate-400 font-bold">Account Verification</span>
                  <span className="font-bold text-primary">Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900 text-white overflow-hidden shadow-xl">
             <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-white/10 rounded-lg">
                      <HeartPulse className="h-5 w-5 text-primary" />
                   </div>
                   <h3 className="font-headline font-bold text-lg">Need Support?</h3>
                </div>
                <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                  For critical data corrections or insurance-related profile queries, contact our clinic support desk directly.
                </p>
                <Button asChild className="w-full h-11 font-bold bg-primary hover:bg-primary/90 text-sm">
                  <Link href="/contact">Get Clinical Help</Link>
                </Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
