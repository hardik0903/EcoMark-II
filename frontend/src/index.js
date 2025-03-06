// index.js
// Main React Entry Point & Routing
import backgroundVideo from './background.mp4';
import React, { useState, useEffect, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './index.css';
import facts from './facts';

// Import components for each part of the site:
import EnergyAnalyzer from './components/EnergyAnalyzer';
import SustainableBrands from './components/SustainableBrands';
import SustainableNews from './components/SustainableNews';
import SustainableRecommender from './components/SustainableRecommender';

// -----------------------------------------------------------------------------
// ChartJS Setup
// -----------------------------------------------------------------------------
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// -----------------------------------------------------------------------------
// Utility Hooks & Functions
// -----------------------------------------------------------------------------
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
}

function logPerformanceMetrics() {
  console.log('Performance at:', performance.now());
}

function complexCalculation(a, b) {
  let result = 0;
  for (let i = 0; i < 1000; i++) {
    result += Math.sqrt(a * b + i);
  }
  return result;
}

// -----------------------------------------------------------------------------
// Navbar Component
// -----------------------------------------------------------------------------
function IntegratedNavbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          EcoMark
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/energy-analyzer" className="nav-links">
              Energy Analyzer
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/sustainable-brands" className="nav-links">
              Sustainable Brands
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/sustainable-news" className="nav-links">
              Climate News
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/sustainable-recommender" className="nav-links">
              Sustainable Recommender
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

// -----------------------------------------------------------------------------
// Home Component (Landing Page)
// -----------------------------------------------------------------------------
function Home() {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [factIndex, setFactIndex] = useState(0);
  const allFacts = facts || [];
  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prevIndex) => (allFacts.length > 0 ? (prevIndex + 1) % allFacts.length : 0));
    }, 10000);
    return () => clearInterval(interval);
  }, [allFacts.length]);
  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };
  return (
    <div className="home component">
      <video autoPlay loop muted playsInline className="video-background">
        <source src="https://cdn.pixabay.com/video/2020/10/03/51470-464623502_large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <IntegratedNavbar />
      <div className="facts-display">
        {allFacts.length > 0 ? allFacts[factIndex] : 'Loading facts...'}
      </div>
      <section className="hero-section component">
        <div className="hero-content">
          <h1 className="hero-title">Analyze How Sustainable You and Your Choices Are?</h1>
          <p className="hero-subtitle">
            Empowering you to make eco-conscious decisions for a greener future.
          </p>
          <button
            className="get-started-btn"
            onClick={() => {
              const toolsSection = document.getElementById('tools-section');
              if (toolsSection) {
                toolsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Get Started
          </button>
        </div>
      </section>
      <section className="sustainability-meaning-section component">
        <h2 className="section-title">What Sustainability Means For Humanity</h2>
        <div className="sustainability-cards">
          <div className="sustainability-card">
            <div className="icon-wrapper">🌱</div>
            <h3>Balance</h3>
            <p>Creating harmony between human needs and environmental preservation.</p>
          </div>
          <div className="sustainability-card">
            <div className="icon-wrapper">🌎</div>
            <h3>Future</h3>
            <p>Ensuring resources for generations to come while meeting today's needs.</p>
          </div>
          <div className="sustainability-card">
            <div className="icon-wrapper">♻️</div>
            <h3>Innovation</h3>
            <p>Developing new solutions that reduce our ecological footprint.</p>
          </div>
        </div>
      </section>
      <section id="tools-section" className="core-tools-section component">
        <h2 className="section-title">Our Tools for Sustainable Living</h2>
        <div className="tools-grid">
          <div className="tool-card">
            <h3>EnergyAnalyzer</h3>
            <p>Analyze energy use &amp; get tips.</p>
            <Link to="/energy-analyzer" className="tool-link">
              Explore Tool
            </Link>
          </div>
          <div className="tool-card">
            <h3>SustainableBrands</h3>
            <p>Discover eco-friendly brands.</p>
            <Link to="/sustainable-brands" className="tool-link">
              Explore Tool
            </Link>
          </div>
          <div className="tool-card">
            <h3>SustainableNews</h3>
            <p>Curated news on sustainability.</p>
            <Link to="/sustainable-news" className="tool-link">
              Explore Tool
            </Link>
          </div>
          <div className="tool-card">
            <h3>SustainableRecommender</h3>
            <p>Get personalized green tips.</p>
            <Link to="/sustainable-recommender" className="tool-link">
              Explore Tool
            </Link>
          </div>
        </div>
      </section>
      <section className="faq-section component">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-container">
          {[
            {
              question: 'What is EcoMark?',
              answer:
                'EcoMark is a comprehensive sustainability platform that helps users analyze energy consumption, discover eco-friendly brands, stay informed on environmental news, and receive personalized sustainable recommendations.',
            },
            {
              question: 'How does the EnergyAnalyzer work?',
              answer:
                'By inputting your monthly energy consumption and other relevant data, the EnergyAnalyzer calculates your per capita usage and provides a detailed analysis along with suggestions for reducing your carbon footprint.',
            },
            {
              question: 'Where does SustainableBrands get its data?',
              answer:
                "SustainableBrands aggregates data from official sustainability reports, third-party audits, and consumer reviews to provide transparent ratings on companies' eco-friendly practices.",
            },
            {
              question: 'How are the personalized recommendations generated?',
              answer:
                'Our SustainableRecommender uses an AI-driven algorithm that analyzes your daily routines and lifestyle inputs to suggest actionable sustainable practices.',
            },
            {
              question: 'Is EcoMark free to use?',
              answer:
                'Yes, the basic tools and features of EcoMark are free to use. We also offer premium features for advanced analytics and personalized support.',
            },
          ].map((faq, index) => (
            <div className="faq-item" key={index}>
              <button className={`faq-question ${activeQuestion === index ? 'active' : ''}`} onClick={() => toggleQuestion(index)}>
                {faq.question}
                <span className="faq-arrow">{activeQuestion === index ? '−' : '+'}</span>
              </button>
              <div className={`faq-answer ${activeQuestion === index ? 'open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <footer className="site-footer component">
        <div className="footer-content">
          <div className="footer-col">
            <h3>EcoMark</h3>
            <p>
              Empowering sustainable choices through analytics &amp; personalized recommendations. By combining data analytics with user input, EcoMark aims to empower individuals and organizations to make greener, more responsible choices.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">
                <i className="social-icon facebook"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="social-icon twitter"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="social-icon instagram"></i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="social-icon linkedin"></i>
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h3>Resources</h3>
            <ul>
              <FooterCollapsibleItem title="Sustainability Blog" content="Green ideas, updates" />
              <FooterCollapsibleItem title="Energy Guides" content="Developing" />
              <FooterCollapsibleItem title="Green Communities" content="Developing" />
              <FooterCollapsibleItem title="Help Center" content="Developing" />
            </ul>
          </div>
          <div className="footer-col">
            <h3>About</h3>
            <ul>
              <FooterCollapsibleItem title="Our Mission" content="Better tomorrow" />
              <FooterCollapsibleItem title="Team" content="CodeZ" />
              <FooterCollapsibleItem title="Careers" content="Join us now" />
              <FooterCollapsibleItem title="Contact" content="hardikpandey0903@gmail.com" />
            </ul>
          </div>
        </div>
        <div className="footer-bottom">&copy; 2025 EcoMark. All rights reserved.</div>
      </footer>
    </div>
  );
}

function FooterCollapsibleItem({ title, content }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);
  return (
    <li className="footer-collapsible-item">
      <button className="footer-collapsible-button" onClick={handleToggle}>
        {title}
        <span className="footer-arrow">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <p className="footer-collapsible-content">{content}</p>}
    </li>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <div className="container">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/energy-analyzer" element={<EnergyAnalyzer />} />
              <Route path="/sustainable-brands" element={<SustainableBrands />} />
              <Route path="/sustainable-news" element={<SustainableNews />} />
              <Route path="/sustainable-recommender" element={<SustainableRecommender />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('No root element found in public/index.html');
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
