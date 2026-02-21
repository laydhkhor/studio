import PublicHeader from '@/components/blocks/PublicHeader';
import PublicFooter from '@/components/blocks/PublicFooter';
import { client, previewClient } from '@/sanity/client';
import { groq } from 'next-sanity';
import { draftMode } from 'next/headers';
import ExitPreviewButton from '@/components/ExitPreviewButton';
import { LiveQueryProvider } from 'next-sanity/live'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = draftMode();

  const settings = await client.fetch(groq`*[_type == "settings"][0]`);

  const layoutContent = (
    <div className="flex min-h-screen flex-col">
       {isEnabled && <ExitPreviewButton />}
      <PublicHeader navLinks={settings?.navLinks} />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter navLinks={settings?.navLinks} clinicInfo={settings?.clinicInfo} />
    </div>
  );

  if (isEnabled) {
    return <LiveQueryProvider client={previewClient}>{layoutContent}</LiveQueryProvider>
  }

  return layoutContent;
}
