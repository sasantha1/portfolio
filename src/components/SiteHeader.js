import { Link, NavLink, useLocation } from 'react-router-dom';

const GITHUB_URL = 'https://github.com/sasantha1';
const LINKEDIN_URL = 'https://www.linkedin.com/in/sasantha-sanju';

function publicPath(path) {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

const NAV = [
  ['home', 'Home'],
  ['about', 'About'],
  ['projects', 'Projects'],
];

export function SiteHeader({ menuOpen, setMenuOpen, activeSection }) {
  const location = useLocation();

  return (
    <header className="site-header">
      <button
        type="button"
        className={`nav-toggle${menuOpen ? ' is-open' : ''}`}
        aria-expanded={menuOpen}
        aria-controls="site-nav"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMenuOpen((o) => !o)}
      />
      <nav id="site-nav" className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label="Primary">
        {NAV.map(([id, label]) => (
          <Link
            key={id}
            to={{ pathname: '/', hash: id }}
            className={location.pathname === '/' && activeSection === id ? 'is-active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? 'is-active' : '')}
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </NavLink>

        <div className="site-nav__actions">
          <a
            className="nav-github-link"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            onClick={() => setMenuOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.73 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
            </svg>
            <span className="sr-only">GitHub</span>
          </a>

          <a
            className="nav-linkedin-link"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            onClick={() => setMenuOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
            </svg>
            <span className="sr-only">LinkedIn</span>
          </a>

          <a
            className="nav-cv-link"
            href={publicPath('/resume.pdf')}
            download="Sasantha-Sanju-CV.pdf"
            onClick={() => setMenuOpen(false)}
          >
            Download CV
          </a>
        </div>
      </nav>
    </header>
  );
}
