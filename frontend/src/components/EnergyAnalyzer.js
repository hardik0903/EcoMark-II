// src/components/EnergyAnalyzer.js
import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './EnergyAnalyzer.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function EnergyAnalyzer() {
  const [monthlyConsumption, setMonthlyConsumption] = useState(500);
  const [householdSize, setHouseholdSize] = useState(2);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/energy-analyzer', {
        monthlyConsumption: parseFloat(monthlyConsumption),
        householdSize: parseInt(householdSize)
      });
      
      setResults(response.data);
    } catch (error) {
      console.error('Error analyzing energy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBellCurve = () => {
    if (!results) return null;

    const { bellCurveData } = results;

    // Create datasets for bell curve
    const data = {
      labels: bellCurveData.x,
      datasets: [
        {
          label: 'Energy Usage Distribution',
          data: bellCurveData.y.map((y, i) => ({ x: bellCurveData.x[i], y })),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Your Usage',
          data: [{ x: bellCurveData.usage, y: bellCurveData.usage_y }],
          backgroundColor: 'rgba(255, 99, 132, 1)',
          borderColor: 'rgba(255, 99, 132, 1)',
          pointRadius: 8,
          pointHoverRadius: 10,
          showLine: false,
        }
      ]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Per Capita Monthly Energy Usage Distribution',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const datasetLabel = context.dataset.label || '';
              if (context.datasetIndex === 1) {
                return `${datasetLabel}: ${bellCurveData.usage.toFixed(2)} kWh/month`;
              }
              return datasetLabel;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Energy Usage (kWh/month per capita)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Density'
          }
        }
      }
    };

    return <Line data={data} options={options} />;
  };

  const renderSustainabilityScore = () => {
    if (!results) return null;
    
    const { sustainabilityScore } = results;
    const angle = (sustainabilityScore / 100) * 180;
    
    return (
      <div className="sustainability-score">
        <h2>Your Sustainability Score 🍃</h2>
        <div className="gauge-container">
          <div className="gauge">
            <div 
              className="gauge-fill" 
              style={{ 
                transform: `rotate(${angle}deg)`,
                backgroundColor: sustainabilityScore > 50 ? '#4CAF50' : '#FF5252'
              }}
            ></div>
            <div className="gauge-cover">
              <span>{sustainabilityScore.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="energy-analyzer">
      <h1>⚡ Sustainable Energy Consumption Analyzer</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Total Monthly Household Energy Consumption (kWh)
            <input 
              type="number" 
              min="0"
              value={monthlyConsumption} 
              onChange={(e) => setMonthlyConsumption(e.target.value)}
              required
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Number of People in Your Household
            <input 
              type="number" 
              min="1"
              value={householdSize} 
              onChange={(e) => setHouseholdSize(e.target.value)}
              required
            />
          </label>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Energy Usage'}
        </button>
      </form>
      
      {results && (
        <div className="results">
          <div className="chart-container">
            {renderBellCurve()}
          </div>
          
          {renderSustainabilityScore()}
          
          <div className="recommendations">
            <h2>Personalized Recommendations</h2>
            <ul>
              {results.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnergyAnalyzer;