import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { DecoderText } from './components/DecoderText';
import { SiteHeader } from './components/SiteHeader';
import { ContactPage } from './pages/ContactPage';

const DisplacementSphere = lazy(() =>
  import('./components/DisplacementSphere').then((m) => ({
    default: m.DisplacementSphere,
  }))
);

const HERO_LINE1 = 'Software';
const HERO_ROLES = ['Engineer', 'Architect', 'Builder', 'Collaborator'];

function useInterval(callback, delay) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  });
  useEffect(() => {
    if (delay === null) return undefined;
    const id = window.setInterval(() => saved.current(), delay);
    return () => window.clearInterval(id);
  }, [delay]);
}

function publicAsset(path) {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function ProjectShowcase({
  index,
  headline,
  description,
  tech,
  link,
  screenImage,
  screenClass,
}) {
  const rootRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const screenStyle = screenImage
    ? { backgroundImage: `url(${publicAsset(screenImage)})` }
    : undefined;

  return (
    <li
      ref={rootRef}
      className={`project-showcase${visible ? ' is-visible' : ''}`}
    >
      <div className="project-showcase__copy">
        <div className="project-showcase__index" aria-hidden>
          <span className="project-showcase__index-bar" />
          <span className="project-showcase__index-num">{index}</span>
        </div>
        <h3 className="project-showcase__title">{headline}</h3>
        <p className="project-showcase__desc">{description}</p>
        <ul className="project-showcase__tech">
          {tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <a className="project-cta" href={link} target="_blank" rel="noopener noreferrer">
          <span className="project-cta__label">View project</span>
          <span className="project-cta__arrow" aria-hidden>
            →
          </span>
        </a>
      </div>

      <div className="project-showcase__stage" aria-hidden>
        <div className="laptop-stage">
          <div className="laptop">
            <div className="laptop-lid">
              <div className="laptop-bezel">
                <div
                  className={`laptop-screen${screenClass ? ` ${screenClass}` : ''}`}
                  style={screenStyle}
                />
              </div>
            </div>
            <div className="laptop-base" />
          </div>
        </div>
      </div>
    </li>
  );
}

function PortfolioHome() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [plusFlash, setPlusFlash] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);

  const introRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const t = window.setTimeout(() => setIntroDone(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  useInterval(() => {
    setRoleIndex((i) => (i + 1) % HERO_ROLES.length);
  }, 4200);

  const didMountRole = useRef(false);
  useEffect(() => {
    if (!didMountRole.current) {
      didMountRole.current = true;
      return undefined;
    }
    setPlusFlash(true);
    const id = window.setTimeout(() => setPlusFlash(false), 480);
    return () => window.clearTimeout(id);
  }, [roleIndex]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects'];
      const scrollPosition = window.scrollY + 120;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') return undefined;
    const id = location.hash.replace(/^#/, '');
    if (!id) return undefined;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    const el = introRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setScrollIndicatorHidden(!entry.isIntersecting),
      { rootMargin: '-100% 0px 0px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const projects = [
    {
      index: '01',
      headline: 'Next-generation retail point of sale',
      description:
        'A streamlined, high-performance retail POS platform featuring instant category filtering, real-time cart checkout, and an intuitive dark-themed UI.',
      tech: ['React', 'JavaScript', 'CSS'],
      link: 'https://github.com/sasantha1/NexPos',
      screenImage: '/images/nexpos.png',
    },
    {
      index: '02',
      headline: 'Clarity for global exchange rates',
      description:
        'Real-time currency conversion with live rates — a focused interface that stays fast and easy to scan.',
      tech: ['React', 'JavaScript', 'REST APIs'],
      link: 'https://github.com/sasantha1/Currency_Converter',
      screenClass: 'laptop-screen--finance',
    },
    {
      index: '03',
      headline: 'Retail flows, rebuilt for the web',
      description:
        'A point-of-sale experience with React, Express, and MongoDB — modern UI patterns and dependable checkout paths.',
      tech: ['React', 'Express.js', 'MongoDB'],
      link: 'https://github.com/sasantha1/Pos-System',
      screenClass: 'laptop-screen--retail',
    },
  ];

  const currentRole = HERO_ROLES[roleIndex];

  return (
    <div className="app-root">
      <a href="#main" className="skip-link">
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

      <SiteHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} activeSection={activeSection} />

      <main id="main">
        <section
          id="home"
          className="section section-intro"
          ref={introRef}
          aria-labelledby="intro-title"
        >
          <div className="intro-layout">
            <div className="intro-sphere" aria-hidden>
              <Suspense fallback={null}>
                <DisplacementSphere />
              </Suspense>
            </div>

            <div className="intro-hero-copy">
              <p className="hero-name">
                <DecoderText text="Sasantha Sanju" start={introDone} />
              </p>

              <h1 id="intro-title" className="hero-headline">
                <span className="hero-line hero-line--primary">{HERO_LINE1}</span>
                <span className="hero-line hero-line--secondary">
                  <span
                    className={`hero-plus${plusFlash ? ' is-flash' : ''}`}
                    aria-hidden
                  >
                    +
                  </span>
                  <span className="hero-role-slot" aria-live="polite">
                    <span key={currentRole} className="hero-role-word">
                      {currentRole}
                    </span>
                  </span>
                </span>
              </h1>

              <div className="hero-accent" aria-hidden>
                <span className="hero-accent-line" />
              </div>
            </div>
          </div>

          <a
            href="#projects"
            className={`scroll-mouse${scrollIndicatorHidden ? ' is-hidden' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('projects');
            }}
            aria-label="Scroll to projects"
          >
            <span className="scroll-mouse-outline" />
          </a>
        </section>

        <section id="about" className="section section-about" aria-labelledby="about-heading">
          <div className="about-grid">
            <div className="about-copy">
              <h2 id="about-heading" className="about-title">
                Hi there
              </h2>
              <div className="about-prose">
                <p>
                  I&apos;m Sasantha, based in{' '}
                  <Link to="/contact">Colombo, Sri Lanka</Link>, on the path to growing as a
                  software engineer. My work spans full-stack web apps with React, TypeScript,
                  and Node, solid APIs, and interfaces that stay clear under real use. Being comfortable
                  with code helps me prototype and iterate quickly. For things I&apos;ve built,
                  see my{' '}
                  <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>
                    featured projects
                  </a>
                  .
                </p>
                <p>
                  I stay curious about performance, accessibility, and how products feel
                  for users. I&apos;m always open to hearing about new ideas or roles — feel
                  free to reach out.
                </p>
              </div>
              <Link to="/contact" className="about-cta" onClick={() => setMenuOpen(false)}>
                <svg
                  className="about-cta-icon"
                  width="20"
                  height="20"
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
                Send me a message
              </Link>
            </div>

            <aside className="about-visual" aria-label="About portrait">
              <div className="about-label">
                <span className="about-label-mark" aria-hidden />
                <span className="about-label-text">About me</span>
              </div>
              <div className="about-photo-frame">
                <img
                  src={publicAsset('/images/1.jpg')}
                  alt="Sasantha Sanju"
                  className="about-photo"
                  loading="lazy"
                  width={480}
                  height={640}
                />
              </div>
            </aside>
          </div>
        </section>

        <section
          id="projects"
          className="section section-projects"
          aria-labelledby="projects-heading"
        >
          <div className="section-inner">
            <p className="section-label">Projects</p>
            <h2 id="projects-heading" className="section-heading">
              Selected work
            </h2>
            <ul className="project-showcase-list">
              {projects.map((project) => (
                <ProjectShowcase
                  key={project.index}
                  index={project.index}
                  headline={project.headline}
                  description={project.description}
                  tech={project.tech}
                  link={project.link}
                  screenImage={project.screenImage}
                  screenClass={project.screenClass}
                />
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Sasantha Sanju.</p>
      </footer>
    </div>
  );
}

function App() {
  const basename = (process.env.PUBLIC_URL || '').replace(/\/$/, '') || undefined;
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
