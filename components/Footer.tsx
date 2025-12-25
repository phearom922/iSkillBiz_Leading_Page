import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100/50 dark:bg-gray-900/50 border-t border-gray-200/60 dark:border-gray-800/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img
              src="/images/iSkillBiz_logo_Officia.png"
              alt="iskillsbiz Logo"
              className="h-12 w-auto mb-4"
              style={{ maxWidth: "160px" }}
            />
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-4">
              All-in-One Chatbot Broadcasting Platform. Reach thousands of
              customers instantly through chat apps.
            </p>
            <a
              href="https://t.me/iskillsbiz"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link-primary inline-flex items-center text-primary-600 dark:text-primary-400 font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.169 1.858-.896 6.375-1.269 8.45-.149.825-.442 1.1-.726 1.127-.619.05-1.088-.409-1.687-.802-.933-.64-1.463-1.038-2.37-1.663-1.003-.656-.353-1.017.219-1.606.15-.15 2.706-2.488 2.757-2.7.006-.022.011-.105-.041-.156-.052-.05-.129-.033-.185-.02-.079.017-1.331.847-3.758 2.487-.356.207-.679.308-.968.303-.32-.006-.936-.18-1.393-.329-.562-.183-.96-.279-.924-.59.021-.18.27-.365.744-.553 2.926-1.225 4.878-2.033 5.857-2.438 2.762-1.123 3.336-1.32 3.712-1.338.084-.004.27-.02.391.118.1.112.065.27.048.379z" />
              </svg>
              Connect on Telegram
            </a>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="footer-link">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="footer-link">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="footer-link">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="footer-link">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200/60 dark:border-gray-800/60">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} iskillbiz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

