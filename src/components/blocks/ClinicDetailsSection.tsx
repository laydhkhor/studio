'use client';

import * as React from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { clinicLocations } from '@/lib/placeholder-data';

export default function ClinicDetailsSection() {
  const [pinFilter, setPinFilter] = React.useState('');
  const [filteredClinics, setFilteredClinics] = React.useState(clinicLocations);

  const handleFilter = () => {
    if (pinFilter.trim() === '') {
      setFilteredClinics(clinicLocations);
    } else {
      setFilteredClinics(clinicLocations.filter(c => c.pinCode.includes(pinFilter.trim())));
    }
  };

  const clearFilter = () => {
    setPinFilter('');
    setFilteredClinics(clinicLocations);
  };

  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Visit Our Clinics
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Find the nearest clinic for your consultation. Enter your PIN code to find the closest location.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="Enter PIN Code (e.g., 721628)"
                value={pinFilter}
                onChange={(e) => setPinFilter(e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={handleFilter}>Search</Button>
              <Button variant="outline" onClick={clearFilter}>View All</Button>
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredClinics.length > 0 ? (
              filteredClinics.map((clinic) => {
                const fullAddress = `${clinic.address}, ${clinic.pinCode}`;
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
                return (
                <Card key={clinic.id} className="shadow-lg flex flex-col">
                  <CardHeader>
                    <CardTitle className="font-headline">{clinic.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-grow">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="font-ui font-semibold">Address</p>
                        <p className="text-muted-foreground">{fullAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="font-ui font-semibold">Phone</p>
                        <p className="text-muted-foreground">{clinic.phone}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="font-ui font-semibold">Email</p>
                        <p className="text-muted-foreground">{clinic.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock className="h-5 w-5 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="font-ui font-semibold">Timings</p>
                        <p className="text-muted-foreground">{clinic.timings}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full font-ui">
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                        Get Directions <ExternalLink className="ml-2" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              )})
            ) : (
              <div className="md:col-span-2 flex items-center justify-center bg-muted/50 rounded-lg p-8">
                <p className="text-muted-foreground text-center">No clinics found for the specified PIN code. Try another one or view all clinics.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
