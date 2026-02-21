import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Terms & Conditions | DocAssist',
    description: "Read the terms and conditions for using the DocAssist website and services provided by Dr. Pritam Pattyanayek.",
};

export default function TermsPage() {
    const lastUpdated = "July 26, 2024";
  return (
    <div className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <header className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Terms & Conditions</h1>
          <p className="mt-4 text-lg text-muted-foreground">Last Updated: {lastUpdated}</p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8 text-justify">
            <div className="space-y-2">
                <h2 className="font-headline text-2xl font-semibold">1. Introduction</h2>
                <p className="text-muted-foreground">
                    Welcome to DocAssist. These Terms and Conditions govern your use of our website and services. By accessing or using our service, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.
                </p>
            </div>

            <div className="space-y-2">
                <h2 className="font-headline text-2xl font-semibold">2. Services</h2>
                <p className="text-muted-foreground">
                    DocAssist provides a platform for booking medical consultations (chat, video, and in-clinic) with Dr. Pritam Pattyanayek. We also provide features for managing prescriptions and accessing health-related content. The services provided are for informational purposes and are not a substitute for professional medical advice, diagnosis, or treatment.
                </p>
            </div>
          
            <div className="space-y-2">
                <h2 className="font-headline text-2xl font-semibold">3. User Accounts</h2>
                <p className="text-muted-foreground">
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service. You are responsible for safeguarding the password that you use to access the service.
                </p>
            </div>

            <div className="space-y-2">
                <h2 className="font-headline text-2xl font-semibold">4. Bookings and Payments</h2>
                <p className="text-muted-foreground">
                    All consultations are subject to availability. Payments for consultations must be made in advance through our designated payment gateway. All fees are non-refundable unless otherwise specified.
                </p>
            </div>

            <div className="space-y-2">
                <h2 className="font-headline text-2xl font-semibold">5. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                    In no event shall DocAssist, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                </p>
            </div>

            <div className="space-y-2">
                <h2 className="font-headline text-2xl font-semibold">6. Changes</h2>
                <p className="text-muted-foreground">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
            </div>
          
            <div className="space-y-2">
                <h2 className="font-headline text-2xl font-semibold">7. Contact Us</h2>
                <p className="text-muted-foreground">
                    If you have any questions about these Terms, please contact us at contact@docassist.com.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
