// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EnergyAnalyzer from './components/EnergyAnalyzer';
import SustainableBrands from './components/SustainableBrands';
import SustainableNews from './components/SustainableNews';
import SustainableRecommender from './components/SustainableRecommender';
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/energy-analyzer" element={<EnergyAnalyzer />} />
            <Route path="/sustainable-brands" element={<SustainableBrands />} />
            <Route path="/sustainable-news" element={<SustainableNews />} />
            <Route path="/sustainable-recommender" element={<SustainableRecommender />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

