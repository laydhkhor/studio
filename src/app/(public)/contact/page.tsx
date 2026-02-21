import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Dr. Pritam Pattyanayek | DocAssist',
  description: "Reach out to us to schedule an appointment, ask a question, or find our clinic. We're here to help with your healthcare needs.",
};

export default function ContactPage() {
  return (
    <div className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <header className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            We're here to help. Reach out to us for any inquiries or to schedule an appointment.
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
            <h2 className="font-headline text-3xl font-semibold mb-8 text-center">Send a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Pritam Pattyanayek" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="m@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Regarding my appointment" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message..." className="min-h-[150px]" />
              </div>
              <Button type="submit" className="w-full sm:w-auto font-ui">Send Message</Button>
            </form>
        </div>
      </div>
    </div>
  );
}
