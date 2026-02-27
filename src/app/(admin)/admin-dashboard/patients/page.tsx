'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPatientsRedirect() {
  useEffect(() => {
    redirect('/admin/patients');
  }, []);

  return null;
}
