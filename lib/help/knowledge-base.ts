/**
 * Knowledge Base for AI Help Chat
 * Provides fallback responses for common questions when the backend AI is unavailable
 */

export interface KnowledgeBaseEntry {
  keywords: string[];
  question: string;
  answer: string;
  suggestions?: string[];
  relatedLinks?: { text: string; url: string }[];
}

export const knowledgeBase: KnowledgeBaseEntry[] = [
  {
    keywords: ['start', 'project', 'create', 'begin', 'launch', 'how to start'],
    question: 'How do I start a project?',
    answer: `Starting a project on Inventagious is easy! Here's how:

1. **Sign in** with your Solana wallet using Phantom Connect SDK
2. Click **"Start a Project"** in the header or visit /projects/create
3. Fill out your project details:
   - Title and description
   - Funding goal (in SOL)
   - Category (Hardware, Software, Web3, etc.)
   - Images and videos
   - Social media links
4. Choose your project type:
   - **Crowdfunding**: Public campaign for anyone to contribute
5. Set your funding goal and deadline
6. Review and publish your project

Once published, you'll receive a unique project page where supporters can contribute using SOL. All transactions happen instantly on the Solana blockchain!

Need more help? Check out our guide at /help/start-project`,
    suggestions: [
      'What are the fees?',
      'Do I need to give up equity?',
      'How do I get paid?',
      'What payment methods are accepted?',
    ],
    relatedLinks: [
      { text: 'Start Your Project', url: '/projects/create' },
      { text: 'Detailed Guide', url: '/help/start-project' },
    ],
  },
  {
    keywords: ['cost', 'fee', 'price', 'pricing', 'how much', 'charge'],
    question: 'How much does it cost?',
    answer: `Great news! Starting a project on Inventagious is **completely free** - no upfront costs!

Here's our transparent pricing:
- **No setup fees** - Create and publish your project for free
- **No equity required** - Keep 100% ownership of your project
- **Platform fees**: Only charged on successful funding (typically 5-8% of funds raised)
- **Payment processing**: Minimal Solana transaction fees (usually less than $0.01 per transaction)

Unlike traditional platforms, we don't take equity or charge monthly fees. You only pay when you successfully raise funds, and all fees are clearly displayed before you publish.

The best part? You maintain full ownership and control of your project!`,
    suggestions: [
      'Do I need to give up equity?',
      'How do I get paid?',
      'What are the payment methods?',
      'How do I start a project?',
    ],
  },
  {
    keywords: ['equity', 'ownership', 'give up', 'share', 'stake'],
    question: 'Do I need to give up equity?',
    answer: `**No! You keep 100% ownership!** 🎉

Inventagious is the only platform where inventors and innovators can raise capital **without sacrificing ownership**. Unlike traditional crowdfunding platforms that require equity, we believe you should maintain full control of your invention.

Here's what this means:
- ✅ Keep 100% ownership of your project
- ✅ No equity dilution
- ✅ Full control over your invention
- ✅ Instant access to funds via Solana
- ✅ Transparent, milestone-based releases

You only pay platform fees on successful funding (typically 5-8%), and that's it. Your idea, your ownership, your success!`,
    suggestions: [
      'How much does it cost?',
      'How do I get paid?',
      'How do I start a project?',
      'What payment methods are accepted?',
    ],
  },
  {
    keywords: ['payment', 'pay', 'contribute', 'donate', 'support', 'fund', 'sol', 'solana', 'crypto'],
    question: 'What payment methods are accepted?',
    answer: `Inventagious uses **Solana (SOL)** cryptocurrency for all transactions. Here's how it works:

**For Supporters:**
- Connect your wallet using Phantom Connect SDK (Google, Apple, or Phantom extension)
- Contribute using SOL - transactions are instant and secure
- All contributions are recorded on the blockchain for transparency

**For Project Creators:**
- Receive funds instantly in SOL
- Cash out to fiat currency when you're ready
- Or keep it in SOL and stake to earn rewards
- Build directly on Solana if your project is Web3-related

**Why Solana?**
- ⚡ Lightning-fast transactions (65,000+ TPS)
- 💰 Low fees (usually less than $0.01 per transaction)
- 🌍 Global accessibility
- 🔒 Secure blockchain technology

You'll need a Phantom wallet to get started. Use Google/Apple sign-in (no download needed) or download the Phantom extension - it's free and easy to use!`,
    suggestions: [
      'How do I start a project?',
      'How do I get paid?',
      'Do I need to give up equity?',
      'How much does it cost?',
    ],
  },
  {
    keywords: ['get paid', 'receive', 'withdraw', 'cash out', 'funds', 'money'],
    question: 'How do I get paid?',
    answer: `Getting paid on Inventagious is fast and simple:

**Instant Receipt:**
- Funds arrive instantly in your Solana wallet when supporters contribute
- No waiting weeks or months - transactions are immediate on the Solana blockchain

**Your Options:**
1. **Keep in SOL**: Hold your SOL and stake it to earn rewards
2. **Cash Out**: Convert SOL to fiat currency through exchanges or services
3. **Build on Solana**: Use your SOL directly if you're building Web3 projects

**Milestone-Based Releases:**
- For larger campaigns, funds can be released based on milestones
- This protects both you and your supporters
- You maintain full control over your project

**Transparency:**
- All transactions are recorded on the blockchain
- Supporters can see exactly where their contributions go
- Build trust through transparent funding

Ready to start? Create your project and begin receiving funds instantly!`,
    suggestions: [
      'How do I start a project?',
      'What payment methods are accepted?',
      'How much does it cost?',
      'Do I need to give up equity?',
    ],
  },
  // COMMENTED OUT: Private Funding FAQ
  // {
  //   keywords: ['crowdfunding', 'campaign', 'public', 'private', 'deal', 'difference'],
  //   question: 'What is the difference between crowdfunding and private funding?',
  //   answer: `Great question! Inventagious offers two types of fundraising:
  //
  // **Crowdfunding (Public Campaigns):**
  // - Open to everyone - anyone can discover and contribute
  // - Perfect for consumer products, creative projects, and community-driven ideas
  // - Great for building a community around your project
  // - Public project page with updates and milestones
  // - Lower minimum contributions
  //
  // **Private Funding (Deals):**
  // - Invite-only funding with specific investors
  // - Perfect for B2B products, enterprise solutions, and high-value projects
  // - More control over who can invest
  // - Negotiable terms and conditions
  // - Higher minimum contributions typically
  //
  // **Which Should You Choose?**
  // - **Crowdfunding**: If you want to build a community and reach a wide audience
  // - **Private Funding**: If you need specific investors or want more control
  //
  // You can even run both! Start with a private deal, then open a public campaign.`,
  //   suggestions: [
  //     'How do I start a project?',
  //     'How much does it cost?',
  //     'What payment methods are accepted?',
  //     'Do I need to give up equity?',
  //   ],
  // },
  {
    keywords: ['solana', 'blockchain', 'web3', 'crypto', 'why solana'],
    question: 'Why does Inventagious use Solana?',
    answer: `We chose Solana because it's the perfect blockchain for fundraising:

**Speed & Performance:**
- ⚡ 65,000+ transactions per second
- ⏱️ Instant transaction confirmation
- No waiting for slow block confirmations

**Low Costs:**
- 💰 Transaction fees are typically less than $0.01
- No expensive gas fees like other blockchains
- Makes small contributions economically viable

**Global Reach:**
- 🌍 Accessible worldwide, 24/7
- No geographic restrictions
- Works for anyone with internet access

**Developer-Friendly:**
- 🛠️ Great tools and ecosystem for Web3 projects
- If you're building on Solana, you can use funds directly
- Strong community and support

**Transparency:**
- 🔒 All transactions are public and verifiable
- Build trust through blockchain transparency
- Supporters can verify their contributions

Solana makes fundraising faster, cheaper, and more accessible than traditional methods!`,
    suggestions: [
      'What payment methods are accepted?',
      'How do I start a project?',
      'How do I get paid?',
      // COMMENTED OUT: Private Funding
      // 'What is the difference between crowdfunding and private funding?',
    ],
  },
  {
    keywords: ['safe', 'secure', 'trust', 'guarantee', 'protection', 'scam'],
    question: 'Is Inventagious safe and secure?',
    answer: `Absolutely! Security and trust are our top priorities:

**Blockchain Security:**
- 🔒 All transactions are secured by Solana's blockchain
- Immutable transaction records
- No central point of failure

**Platform Guarantees:**
- ✅ Milestone-based fund releases protect both creators and supporters
- ✅ Transparent fee structure - no hidden costs
- ✅ Full ownership protection - you keep 100% equity
- ✅ Platform guarantee for fund protection

**Your Protection:**
- All projects are reviewed before going live
- Supporters can see project updates and milestones
- Funds are held securely until milestones are met
- Dispute resolution process available

**Best Practices:**
- Always verify project details before contributing
- Check project updates and creator activity
- Use milestone-based releases for larger contributions
- Report any suspicious activity

We're committed to making Inventagious the safest and most trustworthy fundraising platform. Learn more at /guarantee`,
    suggestions: [
      'How do I start a project?',
      'How much does it cost?',
      'What payment methods are accepted?',
      'How do I get paid?',
    ],
    relatedLinks: [
      { text: 'Platform Guarantee', url: '/guarantee' },
      { text: 'Trust & Safety', url: '/trust-safety' },
    ],
  },
  {
    keywords: ['wallet', 'phantom', 'connect', 'sign in', 'google', 'apple', 'oauth'],
    question: 'How do I connect my wallet?',
    answer: `Connecting your wallet on Inventagious is easy! We use **Phantom Connect SDK** which offers multiple connection methods:

**Option 1: Sign in with Google or Apple (Recommended for Beginners)**
- Click "Connect Wallet" on our site
- Choose "Sign in with Google" or "Sign in with Apple"
- A secure, non-custodial wallet is automatically created for you
- You control your keys - no browser extension needed!
- Perfect if you're new to crypto wallets

**Option 2: Use Phantom Browser Extension**
- Install the Phantom extension (phantom.app) for Chrome, Firefox, Brave, or Edge
- Click "Connect Wallet" and select "Phantom Extension"
- Approve the connection request
- Sign a message to authenticate

**Option 3: Connect via Phantom Mobile App**
- Have the Phantom mobile app installed
- Click "Connect Wallet" and select "Phantom Mobile"
- Scan the QR code with your phone
- Approve the connection

**After Connecting:**
- Sign a message to authenticate (proves you own the wallet)
- Your account is automatically created
- You can now create projects, contribute to campaigns, and manage your profile

**Security Tips:**
- Never share your seed phrase or private keys
- Only connect to trusted sites
- Keep your wallet software updated
- For Google/Apple wallets: Your keys are securely managed by Phantom
- For extension wallets: Use hardware wallets for large amounts

**Which Method Should I Choose?**
- **New to crypto?** → Use Google or Apple sign-in (easiest)
- **Already have Phantom?** → Use browser extension or mobile app
- **Want full control?** → Use browser extension with your own wallet

Need help? Contact help@inventagious.com or visit /help/connect-wallet`,
    suggestions: [
      'How do I start a project?',
      'What payment methods are accepted?',
      'Is Inventagious safe and secure?',
      'How do I get paid?',
    ],
    relatedLinks: [
      { text: 'Wallet Connection Guide', url: '/help/connect-wallet' },
      { text: 'Start a Project', url: '/help/start-project' },
    ],
  },
  {
    keywords: ['help', 'support', 'contact', 'question', 'issue', 'problem'],
    question: 'How can I get help?',
    answer: `We're here to help! Here are all the ways to get support:

**AI Chat (You're using it!):**
- Ask questions anytime - I'm available 24/7
- Get instant answers to common questions
- Click suggestions for quick help

**Help Center:**
- Browse our comprehensive guides at /help
- Step-by-step tutorials
- FAQ section with detailed answers

**Contact Support:**
- Email: help@inventagious.com
- Create a support ticket for complex issues
- We typically respond within 24 hours

**Resources:**
- /help/start-project - Guide to starting your project
- /help/tips - Fundraising tips and best practices
- /about - Learn more about Inventagious
- /guarantee - Platform guarantees and protections

**Community:**
- Follow us on social media for updates
- Join our community discussions
- Share your project and get feedback

What would you like help with?`,
    suggestions: [
      'How do I start a project?',
      'How much does it cost?',
      'Do I need to give up equity?',
      'What payment methods are accepted?',
    ],
    relatedLinks: [
      { text: 'Help Center', url: '/help' },
      { text: 'Contact Support', url: '/contact' },
      { text: 'Start a Project Guide', url: '/help/start-project' },
    ],
  },
];

/**
 * Finds the best matching knowledge base entry for a question
 */
export function findBestMatch(question: string): KnowledgeBaseEntry | null {
  const lowerQuestion = question.toLowerCase();
  let bestMatch: KnowledgeBaseEntry | null = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    let score = 0;
    
    // Check keyword matches
    for (const keyword of entry.keywords) {
      if (lowerQuestion.includes(keyword.toLowerCase())) {
        score += 2;
      }
    }
    
    // Check if question contains the entry's question
    if (lowerQuestion.includes(entry.question.toLowerCase())) {
      score += 5;
    }
    
    // Check for exact question match
    if (lowerQuestion === entry.question.toLowerCase()) {
      score += 10;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  // Only return a match if score is high enough
  return bestScore >= 2 ? bestMatch : null;
}

/**
 * Gets contextual suggestions based on the current question
 */
export function getContextualSuggestions(question: string): string[] {
  const match = findBestMatch(question);
  if (match?.suggestions) {
    return match.suggestions;
  }
  
  // Default suggestions
  return [
    'How do I start a project?',
    'How much does it cost?',
    'Do I need to give up equity?',
    'What payment methods are accepted?',
  ];
}

