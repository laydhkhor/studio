import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-sm shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">Forgot Password?</CardTitle>
        <CardDescription className="font-ui">
          No worries, we'll send you reset instructions.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <Button type="submit" className="w-full font-ui">
          Send Reset Link
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center text-sm font-ui">
        <Link href="/login" className="underline">
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
