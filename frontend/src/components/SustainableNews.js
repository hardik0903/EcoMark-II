// src/components/SustainableNews.js
import React, { useState } from 'react';
import axios from 'axios';
import './SustainableNews.css';

function SustainableNews() {
  const [brand, setBrand] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!brand.trim()) {
      setError('Please enter a brand name');
      return;
    }
    setLoading(true);

    try {
      // Make sure your Flask backend is running on port 5000
      const response = await axios.post('http://localhost:5000/api/sustainable-news', {
        brand: brand.trim()
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
      {/* Background Video */}
      <video autoPlay loop muted playsInline className="bg-video">
        <source
          src="https://cdn.pixabay.com/video/2021/08/19/85590-590014592_tiny.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay"></div>

      <h1>Real-Time Climate Impact News &amp; Alerts</h1>
      <p className="subtitle">
        Stay updated with the latest climate policies, sustainability efforts, and environmental
        news specific to your City.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Enter city name..."
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
          <h2>Latest Climate News for {brand}</h2>
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
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="no-results">No news found for this brand.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SustainableNews;
