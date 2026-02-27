import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FaqSection({ faqs }: any) {
  if (!faqs) {
    return null;
  }
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container">
        {/* Standardized Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 space-y-4">
          <span className="font-ui font-bold text-primary tracking-widest uppercase text-sm">Support Center</span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to know about our services and digital platform.
          </p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto bg-secondary/5 p-6 md:p-10 rounded-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq: any, index: number) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-secondary/20 last:border-0">
                <AccordionTrigger className="font-ui font-semibold text-lg text-left hover:no-underline hover:text-primary py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pb-8">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
