import React, { useEffect, useState } from 'react';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import '../App.css';

export function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!menuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !message) return;

    const accessKey = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY;
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      setStatus('error');
      setErrorMessage(
        'Web3Forms Access Key is not configured. Please add REACT_APP_WEB3FORMS_ACCESS_KEY to your .env file.'
      );
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          email: email,
          message: message,
          subject: '',
          from_name: email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'Form submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage('A network error occurred. Please check your connection and try again.');
    }
  };

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
        {status === 'success' ? (
          <div className="say-success-container">
            <h1 className="say-hello-title">Message sent!</h1>
            <div className="say-hello-rule" aria-hidden>
              <span className="say-hello-rule-cap" />
              <span className="say-hello-rule-line" />
            </div>
            <p className="say-success-message">
              Thanks for reaching out! Your message was sent successfully.
            </p>
            <button
              type="button"
              className="say-submit"
              onClick={() => setStatus('idle')}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form className="say-hello-form" onSubmit={handleSubmit}>
            <h1 className="say-hello-title">Say hello</h1>
            <div className="say-hello-rule" aria-hidden>
              <span className="say-hello-rule-cap" />
              <span className="say-hello-rule-line" />
            </div>

            {status === 'error' && (
              <div className="say-error-banner" role="alert">
                {errorMessage}
              </div>
            )}

            <div className="say-field">
              <label htmlFor="say-email">Your email</label>
              <input
                id="say-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'sending'}
              />
            </div>

            <div className="say-field say-field--message">
              <label htmlFor="say-message">Message</label>
              <textarea
                id="say-message"
                name="message"
                rows={6}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === 'sending'}
              />
            </div>

            <button type="submit" className="say-submit" disabled={status === 'sending'}>
              {status === 'sending' ? (
                <>
                  <span className="say-spinner" />
                  Sending...
                </>
              ) : (
                <>
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
                </>
              )}
            </button>
          </form>
        )}
      </main>
      <SiteFooter variant="contact" />
    </div>
  );
}
