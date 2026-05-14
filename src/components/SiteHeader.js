import { Link, NavLink, useLocation } from 'react-router-dom';

function logoUrl() {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  return `${base}/images/logo.png`;
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
      <Link to="/" className="site-logo" onClick={() => setMenuOpen(false)} aria-label="Home">
        <img src={logoUrl()} alt="" className="site-logo-img" width={200} height={76} />
      </Link>
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
      </nav>
    </header>
  );
}
