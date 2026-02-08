"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "Where do the papers and patents come from?",
    answer:
      "Papers come from Semantic Scholar and OpenAlex, two of the largest open academic databases covering over 225 million papers. Patents come from USPTO (12M+ US patents) and EPO (European patent data). Results are deduplicated across sources.",
  },
  {
    question: "How does expired patent discovery work?",
    answer:
      "We index patent expiry dates from USPTO and EPO databases. You can search specifically for expired patents in your domain, which are free to commercialize. GPT-5.2 translates the patent claims and methods into plain language specs you can actually build from.",
  },
  {
    question: "How accurate is the extraction?",
    answer:
      "GPT-5.2 only extracts information that is explicitly stated in each paper or patent. It never invents costs, timelines, market sizes, or other data. If a metric is not reported by the authors or patent holders, it simply appears as \"not reported\".",
  },
  {
    question: "What exactly gets extracted?",
    answer:
      "From papers: research objective, methodology, materials, key findings, performance metrics with units, and limitations. From patents: claims, methods, materials, novelty, and expiry status. Everything traces back to the original source.",
  },
  {
    question: "How is this different from asking ChatGPT?",
    answer:
      "ChatGPT generates answers from training data and can fabricate citations, metrics, and findings. PaperToProduct searches real databases for real papers and real patents, then extracts only what each source actually says. Every data point is verifiable.",
  },
  {
    question: "Which research domains are supported?",
    answer:
      "We currently support Energy Storage, Biodegradable Plastics, Medical Devices, Advanced Materials, and Food Technology. Each domain has specialized extraction prompts tuned for that field's terminology. More domains are coming.",
  },
  {
    question: "Can I export my analysis results?",
    answer:
      "Researcher and Team plan users can export comparison tables and individual extractions as CSV or PDF. This makes it easy to share findings with colleagues or include them in reports and presentations.",
  },
  {
    question: "How is my data handled?",
    answer:
      "Your search queries and analysis results are stored securely. We do not share your data with third parties. Paper abstracts and patent data come from public databases. You can delete your search history at any time.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
            FAQ
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-t-primary tracking-tight">
            Questions and answers
          </h2>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-heading font-semibold text-t-primary hover:text-secondary transition-colors">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-t-secondary leading-relaxed pr-8">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
