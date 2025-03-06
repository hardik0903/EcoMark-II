import React, { useState } from 'react';
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
import './EnergyAnalyzer.css';

/* Register ChartJS components */
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function EnergyAnalyzer() {
  const [monthlyConsumption, setMonthlyConsumption] = useState(500);
  const [householdSize, setHouseholdSize] = useState(2);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  /* Handle Form Submission */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/energy-analyzer', {
        monthlyConsumption: parseFloat(monthlyConsumption),
        householdSize: parseInt(householdSize),
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error analyzing energy data:', error);
    } finally {
      setLoading(false);
    }
  };

  /* Render the Bell Curve Chart with translucent white grid, no axes */
  const renderBellCurve = () => {
    if (!results) return null;

    const { bellCurveData } = results;

    const data = {
      labels: bellCurveData.x,
      datasets: [
        {
          label: 'Energy Usage Distribution',
          data: bellCurveData.y.map((val, i) => ({ x: bellCurveData.x[i], y: val })),
          borderColor: '#ffffff',          // White line
          backgroundColor: 'rgba(255, 255, 255, 0.2)', // Translucent white fill
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Your Usage',
          data: [
            {
              x: bellCurveData.usage,
              y: bellCurveData.usage_y,
            },
          ],
          backgroundColor: '#ffffff',  // White point
          borderColor: '#ffffff',
          pointRadius: 8,
          pointHoverRadius: 10,
          showLine: false,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#fff', // White text for legend
          },
        },
        title: {
          display: true,
          text: 'Per Capita Monthly Energy Usage Distribution',
          color: '#fff', // White text for title
          font: {
            family: 'Poppins',
            weight: '700',
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const datasetLabel = context.dataset.label || '';
              if (context.datasetIndex === 1) {
                const usageVal = parseFloat(bellCurveData.usage).toFixed(1);
                return `${datasetLabel}: ${usageVal} kWh/month`;
              }
              return datasetLabel;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.3)', // Translucent white grid
          },
          ticks: {
            display: false, // No x-axis labels
          },
          border: { display: false },
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.3)', // Translucent white grid
          },
          ticks: {
            display: false, // No y-axis labels
          },
          border: { display: false },
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  return (
    <div className="energy-analyzer">
      {/* Updated background video */}
      <video autoPlay loop muted playsInline className="energy-bg-video">
        <source
          src="https://cdn.pixabay.com/video/2022/06/21/121429-724697304_large.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="energy-analyzer-content">
        <h1>⚡Sustainable Energy Consumption Analyzer</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="energy-form">
          <div className="form-group">
            <label>Total Monthly Household Energy Consumption (kWh)</label>
            <input
              type="number"
              min="0"
              value={monthlyConsumption}
              onChange={(e) => setMonthlyConsumption(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Number of People in Your Household</label>
            <input
              type="number"
              min="1"
              value={householdSize}
              onChange={(e) => setHouseholdSize(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {results && (
          <div className="results">
            <div className="chart-container">{renderBellCurve()}</div>

            {/* Just display the sustainability score as text */}
            <div className="score-section">
              <h2>Your Sustainability Score 🍃</h2>
              <p>{results.sustainabilityScore.toFixed(2)}%</p>
            </div>

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
    </div>
  );
}

export default EnergyAnalyzer;
