import React, { useEffect, useState } from 'react';
import { SiteHeader } from '../components/SiteHeader';
import '../App.css';

export function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <div className="app-root contact-page-root">
      <a href="#say-hello-main" className="skip-link">
        Skip to content
      </a>
      {menuOpen ? (
        <div
          className="nav-backdrop"
          role="presentation"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      ) : null}
      <SiteHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} activeSection="" />
      <main id="say-hello-main" className="say-hello-page">
        <form
          className="say-hello-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <h1 className="say-hello-title">Say hello</h1>
          <div className="say-hello-rule" aria-hidden>
            <span className="say-hello-rule-cap" />
            <span className="say-hello-rule-line" />
          </div>

          <div className="say-field">
            <label htmlFor="say-email">Your email</label>
            <input id="say-email" name="email" type="email" autoComplete="email" />
          </div>

          <div className="say-field say-field--message">
            <label htmlFor="say-message">Message</label>
            <textarea id="say-message" name="message" rows={6} />
          </div>

          <button type="submit" className="say-submit">
            <svg
              className="say-submit-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Send message
          </button>
        </form>
      </main>
      <footer className="site-footer site-footer--contact">
        <p>© {new Date().getFullYear()} Sasantha Sanju.</p>
      </footer>
    </div>
  );
}
