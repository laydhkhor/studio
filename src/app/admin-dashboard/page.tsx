import { redirect } from 'next/navigation';

/**
 * Redirect legacy root-level path to the route-grouped clinical dashboard.
 */
export default function AdminDashboardRedirect() {
  redirect('/admin-dashboard');
}
