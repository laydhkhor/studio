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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '../ui/input';

export default function ClinicDetailsSection({ clinicLocations }: any) {
  const [locationFilter, setLocationFilter] = React.useState('All');
  const [pinSearch, setPinSearch] = React.useState('');

  if (!clinicLocations) {
    return null;
  }

  const locations: string[] = [
    'All',
    ...Array.from(new Set(clinicLocations.map((c: any) => c.name.replace(' Clinic', '')))) as string[],
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
  }, [locationFilter, pinSearch, clinicLocations]);

  const clearFilters = () => {
    setLocationFilter('All');
    setPinSearch('');
  };

  return (
    <section className="bg-secondary/20 py-24 md:py-32">
      <div className="container">
        {/* Standardized Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 space-y-4">
          <span className="font-ui font-bold text-primary tracking-widest uppercase text-sm">Physical Care</span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground">
            Our <span className="text-primary">Clinics</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Conveniently located practices with modern facilities and dedicated staff.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-12">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-[220px] bg-white">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by PIN code..."
                className="w-full sm:w-[240px] pl-10 bg-white"
                value={pinSearch}
                onChange={(e) => setPinSearch(e.target.value)}
              />
            </div>
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="w-full sm:w-auto text-primary hover:bg-primary/5"
          >
            Clear Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:max-w-6xl lg:mx-auto">
          {filteredClinics.length > 0 ? (
            filteredClinics.map((clinic) => {
              const fullAddress = `${clinic.address}, ${clinic.pinCode}`;
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                fullAddress
              )}`;
              return (
                <Card key={clinic.id} className="shadow-lg border-none flex flex-col bg-white overflow-hidden hover:shadow-xl transition-shadow relative">
                  {/* Thinner Top Decorative Bar */}
                  <div className="h-1 bg-primary w-full opacity-90"></div>
                  
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="font-headline text-2xl font-bold">
                      {clinic.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 space-y-5 flex-grow">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/5 p-2 rounded-lg shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Address</p>
                        <p className="text-foreground font-medium">{fullAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/5 p-2 rounded-lg shrink-0">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Contact</p>
                        <p className="text-foreground font-medium">{clinic.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/5 p-2 rounded-lg shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Timings</p>
                        <p className="text-foreground font-medium">{clinic.timings}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-0">
                    <Button asChild className="w-full h-12 font-ui" variant="outline">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Navigate on Maps <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>

                  {/* Matching Bottom Decorative Bar */}
                  <div className="h-1 bg-primary w-full opacity-20"></div>
                </Card>
              );
            })
          ) : (
            <div className="md:col-span-2 flex items-center justify-center bg-white border border-dashed border-muted-foreground/20 rounded-2xl p-16">
              <p className="text-muted-foreground text-center">
                No clinics match your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
