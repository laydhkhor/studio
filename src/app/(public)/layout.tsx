import PublicHeader from '@/components/blocks/PublicHeader';
import PublicFooter from '@/components/blocks/PublicFooter';
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import { draftMode } from 'next/headers';
import PreviewProvider from '@/components/PreviewProvider';
import ExitPreviewButton from '@/components/ExitPreviewButton';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = draftMode();

  const settings = await client.fetch(groq`*[_type == "settings"][0]`);

  return (
    <div className="flex min-h-screen flex-col">
       {isEnabled && <ExitPreviewButton />}
      <PublicHeader navLinks={settings.navLinks} />
      <main className="flex-1">
         {isEnabled ? (
          <PreviewProvider token={client.token!}>
            {children}
          </PreviewProvider>
        ) : (
          children
        )}
      </main>
      <PublicFooter navLinks={settings.navLinks} clinicInfo={settings.clinicInfo} />
    </div>
  );
}
