import { redirect } from 'next/navigation';

/**
 * This file is kept to maintain the directory structure but redirects to the unique path
 * to avoid parallel routing conflicts with /(admin)/dashboard.
 */
export default function PatientDashboardRedirect() {
  redirect('/patients-dashboard');
}
