import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health & Wellness Blog | DocAssist",
  description:
    "Explore articles on health, wellness, and medical advice from Dr. Pritam Pattyanayek. Stay informed on topics like cardiology, nutrition, and lifestyle.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
