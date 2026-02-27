'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFirestore, useUser, useDoc, useMemoFirebase, setDocumentNonBlocking } from "@/firebase";
import { doc, serverTimestamp } from "firebase/firestore";
import { Loader2, Plus, Trash2, Settings as SettingsIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettingsPage() {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [newCategory, setNewCategory] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  const settingsRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'app_config', 'clinical_settings');
  }, [db, user]);

  const { data: settings, isLoading } = useDoc(settingsRef);

  const categories = settings?.prescriptionCategories || ['General', 'Follow-up', 'Consultation', 'Emergency'];

  const handleAddCategory = () => {
    if (!newCategory.trim() || !settingsRef) return;
    if (categories.includes(newCategory.trim())) {
      toast({ variant: 'destructive', title: 'Duplicate', description: 'This category already exists.' });
      return;
    }

    setIsSaving(true);
    const updatedCategories = [...categories, newCategory.trim()];
    
    setDocumentNonBlocking(settingsRef, {
      prescriptionCategories: updatedCategories,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    setNewCategory('');
    setIsSaving(false);
    toast({ title: 'Category Added' });
  };

  const handleRemoveCategory = (cat: string) => {
    if (!settingsRef) return;
    const updatedCategories = categories.filter((c: string) => c !== cat);
    
    setDocumentNonBlocking(settingsRef, {
      prescriptionCategories: updatedCategories,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    
    toast({ title: 'Category Removed' });
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline text-slate-900">Clinical Settings</h1>
        <p className="text-slate-500 font-medium">Configure global clinical defaults and report categories.</p>
      </header>

      <div className="grid gap-6 max-w-4xl">
        <Card className="shadow-xl border-none overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/5">
            <CardTitle className="flex items-center gap-2 text-primary font-headline">
              <SettingsIcon className="h-5 w-5" />
              Prescription Categories
            </CardTitle>
            <CardDescription>Predefined categories for consultation reports and medication guides.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
            <div className="flex items-end gap-4 max-w-md">
              <div className="flex-1 space-y-2">
                <Label htmlFor="category" className="text-xs uppercase font-bold text-slate-400">Add New Category</Label>
                <Input 
                  id="category"
                  placeholder="e.g., Cardiology, Post-Op" 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="h-11"
                />
              </div>
              <Button onClick={handleAddCategory} className="h-11 font-bold shadow-lg shadow-primary/20" disabled={isSaving || !newCategory.trim()}>
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>

            <div className="space-y-4">
              <Label className="text-xs uppercase font-bold text-slate-400">Current Categories</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat: string) => (
                  <div key={cat} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                    <span className="text-sm font-bold text-slate-700">{cat}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveCategory(cat)}
                      className="h-8 w-8 text-slate-400 hover:text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
