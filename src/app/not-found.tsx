import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">
            DocAssist
          </span>
        </Link>
      </div>
      <h1 className="font-headline text-8xl font-bold text-primary">404</h1>
      <h2 className="mt-4 font-headline text-3xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-lg text-muted-foreground">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Button asChild className="mt-8 font-ui">
        <Link href="/">Go back home</Link>
      </Button>
    </main>
  );
}
