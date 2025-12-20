'use client';

import { Project } from '@/lib/api/projects';
import { FAQSchema } from '@/lib/seo';

interface ProjectFAQProps {
  project: Project;
}

export default function ProjectFAQ({ project }: ProjectFAQProps) {
  // Generate FAQ questions based on project data
  const faqQuestions = [
    {
      question: `What is ${project.title}?`,
      answer: project.description || `${project.title} is a ${project.category || 'blockchain'} project${project.type === 'crowdfunding' ? ' raising funds through transparent blockchain crowdfunding' : ' seeking private funding'} on Inventagious. ${project.fundingGoal ? `The project aims to raise ${project.fundingGoal.toLocaleString()} SOL.` : ''}`,
    },
    {
      question: `How can I contribute to ${project.title}?`,
      answer: `To contribute to ${project.title}, connect your Solana wallet (like Phantom) and click the "Contribute" button on this page. All contributions are recorded on the Solana blockchain for full transparency and security.`,
    },
    {
      question: 'Is my contribution safe?',
      answer: 'Yes! All contributions on Inventagious are processed through the Solana blockchain, providing transparent and secure transactions. Every contribution is recorded on-chain and can be verified.',
    },
    {
      question: 'What happens after I contribute?',
      answer: `After contributing to ${project.title}, your contribution is recorded on the Solana blockchain. You'll receive confirmation and can track the project's progress. ${project.deadline ? `The campaign ${project.type === 'crowdfunding' ? 'ends' : 'closes'} on ${new Date(project.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.` : ''}`,
    },
    {
      question: 'Can I get a refund?',
      answer: 'Refund policies vary by project. Please review the project terms and contact the organizer if you have questions about refunds. All transactions are transparent and recorded on the blockchain.',
    },
    ...(project.category ? [{
      question: `What category is ${project.title}?`,
      answer: `${project.title} is a ${project.category} project. You can explore more ${project.category.toLowerCase()} blockchain projects on Inventagious.`,
    }] : []),
  ];

  return (
    <>
      <FAQSchema questions={faqQuestions} />
      <div className="browser-window mb-6">
        <div className="browser-header">
          <div className="browser-controls">
            <div className="browser-dot red" />
            <div className="browser-dot yellow" />
            <div className="browser-dot green" />
          </div>
          <div className="flex-1" />
          <div className="yellow-highlight hand-drawn text-xs font-bold text-center px-4">
            FAQ
          </div>
          <div className="flex-1" />
        </div>

        <div className="p-6">
          <h2 className="hand-drawn text-2xl font-bold text-black mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqQuestions.map((faq, index) => (
              <div key={index} className="border-b-2 border-gray-200 pb-4 last:border-b-0">
                <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                  {faq.question}
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

