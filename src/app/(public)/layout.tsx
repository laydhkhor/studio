
import PublicHeader from '@/components/blocks/PublicHeader';
import PublicFooter from '@/components/blocks/PublicFooter';
import ExitPreviewButton from '@/components/ExitPreviewButton';
import { settingsData } from '@/lib/static-data';

// Note: Sanity fetching and live preview setup is commented out to use static data.
// You can re-enable this when you are ready to connect to your CMS.

// import { getClient } from '@/sanity/client';
// import { groq } from 'next-sanity';
// import { draftMode } from 'next/headers';
// import { LiveQueryProvider } from 'next-sanity/live';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { isEnabled } = draftMode();

  // const settings = await getClient(isEnabled).fetch(groq`*[_type == "settings"][0]`, {}, {
  //   next: {
  //     tags: ['settings']
  //   }
  // });

  const isEnabled = false; // Using static data, so preview is disabled.
  const settings = settingsData;

  return (
    // <LiveQueryProvider client={getClient(isEnabled)} enabled={isEnabled}>
      <div className="flex min-h-screen flex-col">
        {isEnabled && <ExitPreviewButton />}
        <PublicHeader navLinks={settings?.navLinks} />
        <main className="flex-1">
          {children}
        </main>
        <PublicFooter navLinks={settings?.navLinks} clinicInfo={settings?.clinicInfo} />
      </div>
    // </LiveQueryProvider>
  );
}
