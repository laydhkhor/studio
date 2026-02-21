import Link from 'next/link';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import { Logo } from '@/components/icons';
import { navLinks, clinicInfo } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';

export default function PublicFooter() {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ];

  return (
    <footer className="bg-card font-ui text-card-foreground border-t">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-headline text-2xl font-bold text-primary">
                DocAssist
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your trusted partner in healthcare. Providing quality consultations with Dr. Pritam Pattyanayek.
            </p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold tracking-wider text-sm uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <h3 className="font-semibold tracking-wider text-sm uppercase">Contact</h3>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>{clinicInfo.address}</p>
              <p>{clinicInfo.email}</p>
              <p>{clinicInfo.phone}</p>
            </div>
          </div>
          <div className="md:col-span-3">
             <h3 className="font-semibold tracking-wider text-sm uppercase">Follow Us</h3>
             <div className="mt-4 flex space-x-2">
              {socialLinks.map((social) => (
                <Button key={social.name} variant="ghost" size="icon" asChild>
                  <a href={social.href} aria-label={social.name}>
                    <social.icon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DocAssist. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
