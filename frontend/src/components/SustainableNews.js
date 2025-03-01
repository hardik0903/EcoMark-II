// src/components/SustainableNews.js
import React, { useState } from 'react';
import axios from 'axios';
import './SustainableNews.css';

function SustainableNews() {
  const [city, setCity] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/sustainable-news', {
        city: city.trim()
      });
      
      setArticles(response.data.articles);
      setHasSearched(true);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sustainable-news">
      <h1>🌍 Real-Time Climate Impact News & Alerts</h1>
      <p className="subtitle">Stay updated with the latest climate policies, sustainability efforts, and environmental news specific to your city.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city..."
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Get Climate News'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
      
      {hasSearched && (
        <div className="news-results">
          <h2>📢 Latest Climate News in {city}</h2>
          
          {articles.length > 0 ? (
            <div className="article-list">
              {articles.map((article, index) => (
                <a 
                  key={index} 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="article-card"
                >
                  <div className="article-content">
                    <h3>{article.title}</h3>
                    <div className="article-source">
                      <i className="fas fa-external-link-alt"></i> Read more
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="no-results">No city-specific news found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SustainableNews;