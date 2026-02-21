import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { clinicInfo } from '@/lib/placeholder-data';

export default function ContactPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <header className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            We're here to help. Reach out to us for any inquiries or to schedule an appointment.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-headline text-3xl font-semibold mb-6">Send a Message</h2>
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
          
          <div>
            <h2 className="font-headline text-3xl font-semibold mb-6">Our Information</h2>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline">Mahishadal Clinic</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-ui font-semibold">Address</p>
                      <p className="text-muted-foreground">{clinicInfo.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-ui font-semibold">Phone</p>
                      <p className="text-muted-foreground">{clinicInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-ui font-semibold">Email</p>
                      <p className="text-muted-foreground">{clinicInfo.email}</p>
                    </div>
                  </div>
                   <div className="flex items-start gap-4">
                    <Clock className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-ui font-semibold">Timings</p>
                      <p className="text-muted-foreground">{clinicInfo.timings}</p>
                    </div>
                  </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
