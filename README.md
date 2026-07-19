# Portfolio

My personal developer portfolio website — a single-page React app with a hero
section featuring an animated WebGL sphere, a projects showcase, and a
contact page.

🔗 Live site: [sasantha1.github.io/portfolio](https://sasantha1.github.io/portfolio)

## Features

- Animated, distorted-sphere hero built with **Three.js**
- Decoding/scramble text effect for the intro headline
- Scroll-reveal project cards with screenshots, tech tags, and repo links
- Client-side routing (`/` and `/contact`) via **React Router**
- Responsive layout with a mobile nav menu

## Tech Stack

- [React](https://reactjs.org/) 19
- [React Router](https://reactrouter.com/) 6
- [Three.js](https://threejs.org/) for the WebGL hero animation
- [Create React App](https://github.com/facebook/create-react-app) (react-scripts) for tooling

## Project Structure

```
public/
  images/           project screenshots
  shaders/          GLSL shaders for the hero sphere
  resume.pdf
src/
  components/
    DecoderText.js        scramble/decode text animation
    DisplacementSphere.js Three.js hero sphere
    SiteHeader.js
    SiteFooter.js
  pages/
    ContactPage.js
  App.js            main page: hero, projects, layout
  App.css
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm

### Installation

```bash
git clone https://github.com/sasantha1/portfolio.git
cd portfolio
npm install
```

### Available Scripts

| Command | Description |
|---|---|
| `npm start` | Runs the app in development mode at [http://localhost:3000](http://localhost:3000) |
| `npm test` | Launches the test runner in interactive watch mode |
| `npm run build` | Builds the app for production into the `build` folder |
| `npm run eject` | Ejects the Create React App configuration (one-way operation) |

## Deployment

The site is configured to deploy to GitHub Pages via the `homepage` field in
`package.json`. Build the production bundle with `npm run build`, then deploy
the contents of the `build` folder to the `gh-pages` branch (e.g. using the
[`gh-pages`](https://www.npmjs.com/package/gh-pages) package).

## Projects Featured

The portfolio showcases several projects, including a retail POS platform, a
vehicle auction site, a student management system, a university culture
platform, a construction contract platform, and an AI-powered farming
companion app. See the [Projects section on the live site](https://sasantha1.github.io/portfolio) for details and links.

## License

This project is for personal portfolio use. Feel free to explore the code for inspiration.
