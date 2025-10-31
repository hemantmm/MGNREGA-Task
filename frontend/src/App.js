import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');

  const text = {
    en: {
      title: 'MGNREGA District Performance',
      subtitle: 'Track your district\'s employment program',
      selectDistrict: 'Select Your District',
      householdsEmployed: 'Households Employed',
      personDays: 'Person-Days Generated',
      avgDays: 'Average Days of Employment',
      worksCompleted: 'Works Completed',
      worksOngoing: 'Works Ongoing',
      expenditure: 'Total Expenditure (₹)',
      trend: 'Performance Trend (Last 12 Months)',
      loading: 'Loading data...',
    },
    hi: {
      title: 'मनरेगा जिला प्रदर्शन',
      subtitle: 'अपने जिले के रोजगार कार्यक्रम को ट्रैक करें',
      selectDistrict: 'अपना जिला चुनें',
      householdsEmployed: 'रोजगार प्राप्त परिवार',
      personDays: 'व्यक्ति-दिवस उत्पन्न',
      avgDays: 'औसत रोजगार दिवस',
      worksCompleted: 'पूर्ण कार्य',
      worksOngoing: 'चल रहे कार्य',
      expenditure: 'कुल व्यय (₹)',
      trend: 'प्रदर्शन रुझान (पिछले 12 महीने)',
      loading: 'डेटा लोड हो रहा है...',
    },
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      fetchPerformanceData(selectedDistrict);
    }
  }, [selectedDistrict]);

  const fetchDistricts = async () => {
    try {
      const response = await axios.get('/api/districts');
      setDistricts(response.data);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchPerformanceData = async (districtCode) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/performance/${districtCode}`);
      setPerformanceData(response.data.reverse());
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const latestData = performanceData[performanceData.length - 1] || {};

  const chartData = {
    labels: performanceData.map((d) => d.month),
    datasets: [
      {
        label: text[language].personDays,
        data: performanceData.map((d) => d.persondays_generated),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const barData = {
    labels: [text[language].worksCompleted, text[language].worksOngoing],
    datasets: [
      {
        label: 'Works',
        data: [latestData.works_completed || 0, latestData.works_ongoing || 0],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: window.innerWidth < 768 ? 1.5 : 2,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          },
          boxWidth: window.innerWidth < 768 ? 30 : 40
        }
      },
      tooltip: {
        enabled: true,
        titleFont: {
          size: window.innerWidth < 768 ? 12 : 14
        },
        bodyFont: {
          size: window.innerWidth < 768 ? 11 : 13
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 9 : 11
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 9 : 11
          }
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: window.innerWidth < 768 ? 1.2 : 1.5,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        titleFont: {
          size: window.innerWidth < 768 ? 12 : 14
        },
        bodyFont: {
          size: window.innerWidth < 768 ? 11 : 13
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 9 : 11
          }
        }
      }
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>{text[language].title}</h1>
        <p>{text[language].subtitle}</p>
        <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}>
          {language === 'en' ? 'हिंदी' : 'English'}
        </button>
      </header>

      <div className="container">
        <div className="district-selector">
          <label>{text[language].selectDistrict}:</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="">-- {text[language].selectDistrict} --</option>
            {districts.map((district) => (
              <option key={district.district_code} value={district.district_code}>
                {district.district_name}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="loading">{text[language].loading}</p>}

        {selectedDistrict && !loading && performanceData.length > 0 && (
          <>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">👥</div>
                <h3>{formatNumber(latestData.households_employed)}</h3>
                <p>{text[language].householdsEmployed}</p>
              </div>
              <div className="metric-card">
                <div className="metric-icon">📅</div>
                <h3>{formatNumber(latestData.persondays_generated)}</h3>
                <p>{text[language].personDays}</p>
              </div>
              <div className="metric-card">
                <div className="metric-icon">⏱️</div>
                <h3>{latestData.average_days_employment}</h3>
                <p>{text[language].avgDays}</p>
              </div>
              <div className="metric-card">
                <div className="metric-icon">💰</div>
                <h3>₹{formatNumber(latestData.total_expenditure)}</h3>
                <p>{text[language].expenditure}</p>
              </div>
            </div>

            <div className="charts">
              <div className="chart-container">
                <h3>{text[language].trend}</h3>
                <Line data={chartData} options={chartOptions} />
              </div>
              <div className="chart-container">
                <h3>Works Status</h3>
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
