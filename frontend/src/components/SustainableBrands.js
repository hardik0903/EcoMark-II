// src/components/SustainableBrands.js
import React, { useState } from 'react';
import './SustainableBrands.css';

function SustainableBrands() {
  const [brandName, setBrandName] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!brandName.trim()) {
      setError('Please enter a brand name');
      return;
    }
    setLoading(true);
    try {
      // Call the backend API for sustainable brands
      const res = await fetch('http://localhost:5000/api/sustainable-brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandName })
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setAnalysisData(data);
    } catch (err) {
      console.error('Error analyzing brand:', err);
      setError('Failed to analyze brand. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sustainable-brands">
      <video autoPlay loop muted playsInline className="bg-video">
        <source
          src="https://cdn.pixabay.com/video/2017/01/12/7241-199190972_large.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay"></div>

      <h1>Is Your Favorite Brand Sustainable-friendly?</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Enter brand name..."
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Brand'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>

      {analysisData && (
        <div className="analysis-results">
          <h2>Sustainability Analysis for {analysisData.brandName}</h2>
          <h3>Sustainable Score: {analysisData.score}%</h3>
          <div className="report-content">
            <p>{analysisData.analysis}</p>
            <p>
              <strong>Context:</strong> {analysisData.context}
            </p>
          </div>
          <div className="news-section">
            <h3>Reports for {analysisData.brandName}</h3>
            <ul>
              {analysisData.articles.map((article, index) => (
                <li key={index}>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Optional debugging: display raw Gemini score response */}
          {analysisData.raw_score_response && (
            <div className="raw-score">
              <p>Raw Gemini Score Response: {analysisData.raw_score_response}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SustainableBrands;
