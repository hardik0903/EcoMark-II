// src/components/SustainableRecommender.js
import React, { useState } from 'react';
import axios from 'axios';
import './SustainableRecommender.css';

function SustainableRecommender() {
  const [userInput, setUserInput] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) {
      setError('Please enter your daily routine or activity');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/sustainable-recommender', {
        userInput: userInput.trim(),
      });
      setRecommendations(response.data);
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sustainable-recommender">
      {/* Background video */}
      <video autoPlay loop muted playsInline className="video-background">
        <source
          src="https://cdn.pixabay.com/video/2022/11/11/138556-769988117_large.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="recommender-content">
        <h1 className="recommender-title">Sustainable Living Recommender 🌱</h1>
        <p className="subtitle">
          Get personalized sustainable lifestyle recommendations based on your daily routine.
        </p>

        <form onSubmit={handleSubmit} className="recommender-form">
          <div className="form-group">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe your daily routine or activities..."
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Get Recommendations'}
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>

        {recommendations && (
          <div className="recommendations-results">
            {/* Sustainable Habits */}
            <div className="habits-section">
              <h2>🌿 Sustainable Habits</h2>
              <ul className="habits-list">
                {recommendations.habits.map((habit, index) => (
                  <li key={index} className="habit-card">
                    <i className="fas fa-check-circle"></i>
                    <span>{habit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Products */}
            <div className="products-section">
              <h2>🛒 Recommended Sustainable Products</h2>
              <div className="products-grid">
                {recommendations.products.map((product, index) => (
                  <a
                    key={index}
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-card"
                  >
                    <div className="product-placeholder">
                      <i className="fas fa-leaf"></i>
                    </div>
                    <h3>{product.name}</h3>
                    <span className="shop-now">Shop Now</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SustainableRecommender;
