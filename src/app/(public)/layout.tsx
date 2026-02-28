import PublicHeader from '@/components/blocks/PublicHeader';
import PublicFooter from '@/components/blocks/PublicFooter';
import { settingsData } from '@/lib/static-data';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = settingsData;

  return (
    <div className="flex min-h-screen flex-col w-full relative">
      <PublicHeader navLinks={settings?.navLinks} />
      <main className="flex-1 w-full">
        {children}
      </main>
      <PublicFooter navLinks={settings?.navLinks} clinicInfo={settings?.clinicInfo} />
    </div>
  );
}
