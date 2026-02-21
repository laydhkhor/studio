import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { clinicInfo } from '@/lib/placeholder-data';

export default function ClinicDetailsSection() {
  const details = [
    { icon: MapPin, label: 'Address', value: clinicInfo.address },
    { icon: Phone, label: 'Phone', value: clinicInfo.phone },
    { icon: Mail, label: 'Email', value: clinicInfo.email },
    { icon: Clock, label: 'Timings', value: clinicInfo.timings },
  ];
  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Visit Our Clinic
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We are conveniently located in Mahishadal. Find us for in-person consultations.
            </p>
            <Card className="mt-8">
              <CardContent className="p-6 space-y-4">
                {details.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <item.icon className="h-6 w-6 text-primary mt-1 shrink-0" />
                        <div>
                            <p className="font-ui font-semibold">{item.label}</p>
                            <p className="text-muted-foreground">{item.value}</p>
                        </div>
                    </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="h-80 md:h-[450px] rounded-lg overflow-hidden shadow-xl">
             <div className="bg-muted w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground">Map will be loaded here</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
