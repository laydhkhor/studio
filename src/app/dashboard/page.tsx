import { redirect } from 'next/navigation';

/**
 * Redirect root /dashboard to the centralized redirector hub.
 */
export default function RootDashboardRedirect() {
  redirect('/dashboard');
}
