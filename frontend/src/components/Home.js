// src/components/Home.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  // Renamed to toggleQuestion
  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const faqData = [
    {
      question: "What is EcoMark?",
      answer: "EcoMark is a comprehensive sustainability platform that helps users analyze energy consumption, discover eco-friendly brands, stay informed on environmental news, and receive personalized sustainable recommendations."
    },
    {
      question: "How does the EnergyAnalyzer work?",
      answer: "By inputting your monthly energy consumption and other relevant data, the EnergyAnalyzer calculates your per capita usage and provides a detailed analysis along with suggestions for reducing your carbon footprint."
    },
    {
      question: "Where does SustainableBrands get its data?",
      answer: "SustainableBrands aggregates data from official sustainability reports, third-party audits, and consumer reviews to provide transparent ratings on companies' eco-friendly practices."
    },
    {
      question: "How are the personalized recommendations generated?",
      answer: "Our SustainableRecommender uses an AI-driven algorithm that analyzes your daily routines and lifestyle inputs to suggest actionable and easy-to-adopt sustainable practices."
    },
    {
      question: "Is EcoMark free to use?",
      answer: "Yes, the basic tools and features of EcoMark are free to use. We also offer premium features for advanced analytics and personalized support."
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Analyze How Sustainable You and Your Choices Are</h1>
          <p className="hero-subtitle">Empowering you to make eco-conscious decisions for a greener future</p>
          <a href="#core-tools-section" className="cta-button">
            Get Started
          </a>
        </div>
      </section>

      {/* What Sustainability Means Section */}
      <section className="sustainability-meaning-section">
        <h2 className="section-title">What Sustainability Means For Humanity</h2>
        <div className="sustainability-cards">
          <div className="sustainability-card">
            <div className="icon-wrapper">
              <i className="icon">🌱</i>
            </div>
            <h3>Balance</h3>
            <p>Creating harmony between human needs and environmental preservation</p>
          </div>
          <div className="sustainability-card">
            <div className="icon-wrapper">
              <i className="icon">🌎</i>
            </div>
            <h3>Future</h3>
            <p>Ensuring resources for generations to come while meeting today's needs</p>
          </div>
          <div className="sustainability-card">
            <div className="icon-wrapper">
              <i className="icon">♻️</i>
            </div>
            <h3>Innovation</h3>
            <p>Developing new solutions that reduce our ecological footprint</p>
          </div>
        </div>
      </section>

      {/* Core Tools Section */}
      <section id="core-tools-section" className="core-tools-section">
        <h2 className="section-title">Our Tools for Sustainable Living</h2>
        <div className="tools-grid">
          <div className="tool-card">
            <div className="tool-icon energy-icon"></div>
            <h3>EnergyAnalyzer</h3>
            <p>
              Analyze your household or business energy consumption and receive personalized recommendations to optimize efficiency and reduce costs.
            </p>
            <Link to="/energy-analyzer" className="tool-link">Explore Tool</Link>
          </div>
          <div className="tool-card">
            <div className="tool-icon brands-icon"></div>
            <h3>SustainableBrands</h3>
            <p>
              Discover which brands truly prioritize sustainability with our comprehensive ratings system based on verified environmental practices.
            </p>
            <Link to="/sustainable-brands" className="tool-link">Explore Tool</Link>
          </div>
          <div className="tool-card">
            <div className="tool-icon news-icon"></div>
            <h3>SustainableNews</h3>
            <p>
              Stay informed with our curated content on renewable energy innovations, policy changes, and the latest trends in sustainable living.
            </p>
            <Link to="/sustainable-news" className="tool-link">Explore Tool</Link>
          </div>
          <div className="tool-card">
            <div className="tool-icon recommender-icon"></div>
            <h3>SustainableRecommender</h3>
            <p>
              Receive AI-powered, personalized eco-friendly suggestions tailored to your lifestyle and preferences for simple, actionable changes.
            </p>
            <Link to="/sustainable-recommender" className="tool-link">Explore Tool</Link>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="why-matters-section">
        <div className="why-matters-content">
          <div className="why-matters-text">
            <h2 className="section-title">Why This Matters</h2>
            <p>
              In today's rapidly changing world, our everyday choices have significant impacts on our planet's health.
              EcoMark provides the data and insights you need to understand your environmental impact and make meaningful changes.
            </p>
            <p>
              By making sustainable choices accessible and measurable, we help individuals and organizations reduce their carbon footprint
              while often saving money in the process. Small changes, when multiplied across millions of people, create transformative results.
            </p>
            <p>
              Our planet faces unprecedented challenges from climate change to resource depletion. EcoMark empowers you to be part of the solution
              through informed, data-driven decisions.
            </p>
          </div>
          <div className="why-matters-image"></div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="highlights-section">
        <h2 className="section-title">Key Features & Benefits</h2>
        <div className="highlights-container">
          <div className="highlight-column">
            <ul className="highlights-list">
              <li>Real-time energy consumption tracking and analysis</li>
              <li>Personalized sustainability recommendations</li>
              <li>Comprehensive brand sustainability ratings</li>
              <li>Cost-saving insights alongside environmental benefits</li>
              <li>Community sharing of sustainable practices</li>
            </ul>
          </div>
          <div className="highlight-column">
            <ul className="highlights-list">
              <li>Interactive visualizations of your environmental impact</li>
              <li>Progress tracking and achievement recognition</li>
              <li>Curated news on sustainability innovations</li>
              <li>Privacy-focused data handling and security</li>
              <li>Mobile and desktop optimized experience</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqData.map((faq, index) => (
            <div className="faq-item" key={index}>
              <button
                className={`faq-question ${activeQuestion === index ? 'active' : ''}`}
                onClick={() => toggleQuestion(index)}
              >
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

      {/* Footer Section */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-col">
            <h3>EcoMark</h3>
            <p>
              Empowering sustainable choices through advanced analytics and personalized recommendations. Join us in creating a greener future.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><i className="social-icon facebook"></i></a>
              <a href="#" aria-label="Twitter"><i className="social-icon twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="social-icon instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="social-icon linkedin"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h3>Navigate</h3>
            <ul>
              <li><a href="#energy-analyzer">EnergyAnalyzer</a></li>
              <li><a href="#sustainable-brands">SustainableBrands</a></li>
              <li><a href="#sustainable-news">SustainableNews</a></li>
              <li><a href="#sustainable-recommender">SustainableRecommender</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Sustainability Blog</a></li>
              <li><a href="#">Eco Calculator</a></li>
              <li><a href="#">Green Communities</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>About</h3>
            <ul>
              <li><a href="#">Our Mission</a></li>
              <li><a href="#">Team</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2025 EcoMark. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
