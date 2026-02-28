import type { Metadata } from 'next';
import { Montserrat, Open_Sans, Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  weight: ['400', '600'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DocAssist - Your Trusted Healthcare Partner',
  description:
    'Book appointments, manage prescriptions, and consult with Dr. Pritam Pattyanayek in Mahishadal, West Bengal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(
      montserrat.variable,
      openSans.variable,
      poppins.variable
    )}>
      <body className={cn('min-h-screen max-w-full overflow-x-hidden bg-background font-body antialiased')}>
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}