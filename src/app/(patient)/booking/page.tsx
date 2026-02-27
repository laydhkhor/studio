
'use client';

import * as React from 'react';
import BookingSection from '@/components/blocks/BookingSection';
import { bookingData } from '@/lib/static-data';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, CalendarCheck, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function BookingPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header with Navigation Back */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link href="/" className="text-sm font-bold text-primary flex items-center gap-2 hover:underline mb-2">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-slate-900">Schedule Your Consultation</h1>
            <p className="text-muted-foreground">Select an available time slot and proceed to secure clinical booking.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border">
            <div className="bg-emerald-50 p-2 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Secure Portal</p>
              <p className="text-sm font-bold text-slate-900">Encrypted Booking</p>
            </div>
          </div>
        </div>

        {/* Booking Engine */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
          <BookingSection bookingData={bookingData} />
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <CalendarCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Instant Confirmation</p>
              <p className="text-[10px] text-slate-500">Real-time slot allocation</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">10-Min Precision</p>
              <p className="text-[10px] text-slate-500">No waiting rooms</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Verified Provider</p>
              <p className="text-[10px] text-slate-500">WBMC Registered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
