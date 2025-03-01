// src/components/SustainableBrands.js
import React, { useState } from 'react';
import axios from 'axios';
import './SustainableBrands.css';

function SustainableBrands() {
  const [brandName, setBrandName] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!brandName.trim()) {
      setError('Please enter a brand name');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/sustainable-brands', {
        brandName: brandName.trim()
      });
      
      setAnalysis(response.data);
    } catch (err) {
      console.error('Error analyzing brand:', err);
      setError('Failed to analyze brand. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderGaugeMeter = () => {
    if (!analysis) return null;
    
    const { score } = analysis;
    const angle = (score / 100) * 180;
    
    return (
      <div className="gauge-container">
        <div className="gauge">
          <div 
            className="gauge-fill" 
            style={{ 
              transform: `rotate(${angle}deg)`,
              backgroundColor: score > 50 ? '#4CAF50' : '#FF5252'
            }}
          ></div>
          <div className="gauge-cover">
            <span>{score}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="sustainable-brands">
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
      
      {analysis && (
        <div className="analysis-results">
          <h2>Sustainability Analysis for {analysis.brandName}</h2>
          
          {renderGaugeMeter()}
          
          <div className="analysis-text">
            <h3>Sustainability Report</h3>
            <div className="report-content">
              {analysis.analysis.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SustainableBrands;