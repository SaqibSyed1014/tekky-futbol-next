"use client"

import Link from 'next/link';
import {usePathname} from "next/navigation";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const routesHidden = ['/contact']

    const pathname = usePathname();

  return (
    <footer>
        {!routesHidden.includes(pathname) && <div className="social">
            <a href="https://instagram.com/tekkyfutbol" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
            </a>
            <a href="https://x.com/jesusra41616075?s=21" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-x-twitter"></i>
            </a>
        </div>}

      <div className="legal-footer-links">
        <Link href="/privacy-and-terms">Privacy Policy &amp; Terms of Use</Link>
        <Link href="/refund">Refund Policy</Link>
        <Link href="/kit-and-branding-policy">Kit &amp; Branding Policy</Link>
      </div>

      <p>© 2025 TekkyFutbol — For Ballers Who Create</p>
      {/*<p>*/}
      {/*  <a href="mailto:tekkyfutbol@gmail.com" style={{ color: '#dfe7ff', textDecoration: 'none' }}>*/}
      {/*    tekkyfutbol@gmail.com*/}
      {/*  </a>*/}
      {/*</p>*/}
    </footer>
  );
}
