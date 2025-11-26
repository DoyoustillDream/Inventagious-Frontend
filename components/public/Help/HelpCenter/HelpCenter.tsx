import HelpHero from './HelpHero';
import HelpGuides from './HelpGuides';
import FAQ from './FAQ';
import ContactSupport from './ContactSupport';
import AIChatWidget from './AIChatWidget';

export default function HelpCenter() {
  return (
    <>
      <section className="bg-yellow-400 halftone-bg py-16">
        <div className="container mx-auto px-4">
          <HelpHero />
        </div>
      </section>
      <HelpGuides />
      <FAQ />
      <ContactSupport />
      <AIChatWidget />
    </>
  );
}

