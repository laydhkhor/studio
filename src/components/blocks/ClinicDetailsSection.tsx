'use client';

import * as React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Search,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { clinicLocations } from '@/lib/placeholder-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '../ui/input';

export default function ClinicDetailsSection() {
  const [locationFilter, setLocationFilter] = React.useState('All');
  const [pinSearch, setPinSearch] = React.useState('');

  const locations = [
    'All',
    ...Array.from(new Set(clinicLocations.map((c) => c.name.replace(' Clinic', '')))),
  ];

  const filteredClinics = React.useMemo(() => {
    let items = [...clinicLocations];

    if (locationFilter !== 'All') {
      items = items.filter((clinic) => clinic.name.includes(locationFilter));
    }

    if (pinSearch.trim() !== '') {
      items = items.filter((clinic) =>
        clinic.pinCode.includes(pinSearch.trim())
      );
    }

    return items;
  }, [locationFilter, pinSearch]);

  const clearFilters = () => {
    setLocationFilter('All');
    setPinSearch('');
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
              Find the nearest clinic for your consultation. Use the filters to
              select by location or search by PIN code.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-full sm:w-auto">
                    <SelectValue placeholder="Filter by Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by PIN..."
                    className="w-full rounded-lg bg-background pl-8"
                    value={pinSearch}
                    onChange={(e) => setPinSearch(e.target.value)}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full sm:w-auto"
              >
                View All
              </Button>
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredClinics.length > 0 ? (
              filteredClinics.map((clinic) => {
                const fullAddress = `${clinic.address}, ${clinic.pinCode}`;
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  fullAddress
                )}`;
                return (
                  <Card key={clinic.id} className="shadow-lg flex flex-col">
                    <CardHeader>
                      <CardTitle className="font-headline">
                        {clinic.name}
                      </CardTitle>
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
                          <p className="text-muted-foreground">
                            {clinic.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Mail className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div>
                          <p className="font-ui font-semibold">Email</p>
                          <p className="text-muted-foreground">
                            {clinic.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Clock className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div>
                          <p className="font-ui font-semibold">Timings</p>
                          <p className="text-muted-foreground">
                            {clinic.timings}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full font-ui">
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Get Directions <ExternalLink className="ml-2" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <div className="md:col-span-2 flex items-center justify-center bg-muted/50 rounded-lg p-8">
                <p className="text-muted-foreground text-center">
                  No clinics found for the selected filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
