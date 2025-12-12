import Link from 'next/link';
import Logo from '../Logo';
import NewsletterSignup from './NewsletterSignup';

export default function Footer() {
  return (
    <footer className="border-t-4 border-white bg-black">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Logo variant="bulb" size="sm" />
              <h3 className="hand-drawn text-xl font-bold text-white">INVENTAGIOUS</h3>
            </div>
          </div>
          <div>
            <h4 className="hand-drawn mb-4 text-base font-bold text-white">Platform</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <Link href="/projects" className="text-white hover:underline">
                  Crowdfunding
                </Link>
              </li>
              {/* COMMENTED OUT: Private Funding */}
              {/* <li>
                <Link href="/private" className="text-white hover:underline">
                  Private Funding
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h4 className="hand-drawn mb-4 text-base font-bold text-white">Resources</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <Link href="/moddio" className="text-white hover:underline">
                  Moddio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-white hover:underline">
                  Help Center
                </Link>
              </li>
              <li>
                <a
                  href="https://x.com/Inventagiousapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline inline-flex items-center gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Follow on X
                </a>
              </li>
            </ul>
          </div>
          <div>
            <NewsletterSignup />
          </div>
        </div>
        <div className="mt-8 border-t-2 border-white pt-8 text-center">
          <p className="hand-drawn text-sm font-bold text-white">
            &copy; {new Date().getFullYear()} Inventagious. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
