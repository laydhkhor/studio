import PublicHeader from '@/components/blocks/PublicHeader';
import PublicFooter from '@/components/blocks/PublicFooter';
import { settingsData } from '@/lib/static-data';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = settingsData;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <PublicHeader navLinks={settings?.navLinks} />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter navLinks={settings?.navLinks} clinicInfo={settings?.clinicInfo} />
    </div>
  );
}