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
import { Checkbox } from '@/components/ui/checkbox';
import { GoogleIcon } from '@/components/icons';
import { Facebook } from 'lucide-react';

export default function SignupPage() {
  return (
    <Card className="w-full max-w-sm shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
        <CardDescription className="font-ui">
          Choose your preferred sign-up method.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline">
            <GoogleIcon className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline">
            <Facebook className="mr-2 h-4 w-4 fill-current" />
            Facebook
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input id="confirm-password" type="password" required />
        </div>
        <div className="flex items-center space-x-2">
            <Checkbox id="terms" required/>
            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                I agree to the <Link href="/terms" className='underline'>Terms & Conditions</Link>
            </Label>
        </div>
        <Button type="submit" className="w-full font-ui">
          Create Account
        </Button>
      </CardContent>
      <CardFooter className="text-center text-sm font-ui">
        Already have an account?{' '}
        <Link href="/login" className="underline ml-1">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
