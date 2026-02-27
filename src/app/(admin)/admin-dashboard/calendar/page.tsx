'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminCalendarRedirect() {
  useEffect(() => {
    redirect('/admin/calendar');
  }, []);

  return null;
}
