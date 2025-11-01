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
      title: 'MGNREGA Work Tracker',
      subtitle: 'Know Your Rights • Track Your Work',
      selectDistrict: '📍 Choose Your District',
      selectPlaceholder: 'Select Your District',
      householdsEmployed: 'Families Got Work',
      householdsSubtext: 'Total families working',
      personDays: 'Total Work Days',
      personDaysSubtext: 'Days of work given',
      avgDays: 'Days Per Family',
      avgDaysSubtext: 'Average work days',
      worksCompleted: 'Works Finished',
      worksCompletedSubtext: 'Projects completed',
      worksOngoing: 'Works Running',
      expenditure: 'Money Spent',
      expenditureSubtext: 'Total amount',
      trend: '📊 Work Progress (Last Year)',
      worksStatus: '🏗️ Projects Status',
      loading: '⏳ Getting your data',
      completed: 'Completed',
      ongoing: 'In Progress',
      infoTip: '💡 Select your district to see how many days of work and money your area received!',
    },
    hi: {
      title: 'मनरेगा काम ट्रैकर',
      subtitle: 'अपने अधिकार जानें • अपना काम देखें',
      selectDistrict: '📍 अपना जिला चुनें',
      selectPlaceholder: 'अपना जिला चुनें',
      householdsEmployed: 'परिवारों को मिला काम',
      householdsSubtext: 'कुल काम करने वाले परिवार',
      personDays: 'कुल काम के दिन',
      personDaysSubtext: 'दिए गए काम के दिन',
      avgDays: 'प्रति परिवार दिन',
      avgDaysSubtext: 'औसत काम के दिन',
      worksCompleted: 'पूरे हुए काम',
      worksCompletedSubtext: 'पूरी हुई परियोजनाएं',
      worksOngoing: 'चल रहे काम',
      expenditure: 'खर्च की गई राशि',
      expenditureSubtext: 'कुल खर्च',
      trend: '📊 काम की प्रगति (पिछला साल)',
      worksStatus: '🏗️ परियोजनाओं की स्थिति',
      loading: '⏳ आपका डेटा ला रहे हैं',
      completed: 'पूरे हुए',
      ongoing: 'चल रहे',
      infoTip: '💡 अपना जिला चुनें और देखें कि आपके क्षेत्र को कितने दिन का काम और कितना पैसा मिला!',
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/districts`);
      setDistricts(response.data.filter(d => d.state_name === 'UTTAR PRADESH'));
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchPerformanceData = async (districtCode) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/performance/${districtCode}`);
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

  const totalWorks = (latestData.works_completed || 0) + (latestData.works_ongoing || 0);
  const completedPercent = totalWorks > 0 ? ((latestData.works_completed || 0) / totalWorks * 100) : 0;
  const ongoingPercent = totalWorks > 0 ? ((latestData.works_ongoing || 0) / totalWorks * 100) : 0;

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
        <div className="header-flag">
          <span className="flag-icon">🇮🇳</span>
        </div>
        <h1>{text[language].title}</h1>
        <p>{text[language].subtitle}</p>
        <div className="language-toggle">
          <button 
            className={language === 'en' ? 'active' : ''} 
            onClick={() => setLanguage('en')}
          >
            English
          </button>
          <button 
            className={language === 'hi' ? 'active' : ''} 
            onClick={() => setLanguage('hi')}
          >
            हिंदी
          </button>
        </div>
      </header>

      <div className="container">
        <div className="info-tip">
          <span className="info-tip-icon">💡</span>
          <div className="info-tip-text">{text[language].infoTip}</div>
        </div>

        {/* Only District Selector for Uttar Pradesh */}
        <div className="district-selector">
          <div className="selector-header">
            <span className="selector-icon">📍</span>
            <label>{text[language].selectDistrict}</label>
          </div>
          <div className="select-wrapper">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">
                -- {text[language].selectPlaceholder} --
              </option>
              {districts.map((district) => (
                <option key={district.district_code} value={district.district_code}>
                  {district.district_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <p className="loading">{text[language].loading}</p>}

        {selectedDistrict && !loading && performanceData.length > 0 && (
          <>
            <div className="success-message">
              ✅ {language === 'en' ? 'Data Found!' : 'डेटा मिल गया!'}
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">👨‍👩‍👧‍👦</div>
                <div className="metric-value">{formatNumber(latestData.households_employed)}</div>
                <div className="metric-label">
                  {text[language].householdsEmployed}
                  <span className="metric-sublabel">{text[language].householdsSubtext}</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">📅</div>
                <div className="metric-value">{formatNumber(latestData.persondays_generated)}</div>
                <div className="metric-label">
                  {text[language].personDays}
                  <span className="metric-sublabel">{text[language].personDaysSubtext}</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">⏱️</div>
                <div className="metric-value">{Math.round(latestData.average_days_employment)}</div>
                <div className="metric-label">
                  {text[language].avgDays}
                  <span className="metric-sublabel">{text[language].avgDaysSubtext}</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">💰</div>
                <div className="metric-value">₹{formatNumber(Math.round(latestData.total_expenditure / 10000000))}Cr</div>
                <div className="metric-label">
                  {text[language].expenditure}
                  <span className="metric-sublabel">{text[language].expenditureSubtext}</span>
                </div>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span className="chart-icon">🏗️</span>
                <h3>{text[language].worksStatus}</h3>
              </div>
              
              <div className="progress-item">
                <div className="progress-label">
                  <span>✅ {text[language].completed}</span>
                  <span>{latestData.works_completed || 0}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill works-completed" 
                    style={{width: `${completedPercent}%`}}
                  >
                    {completedPercent > 10 && `${Math.round(completedPercent)}%`}
                  </div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-label">
                  <span>🔄 {text[language].ongoing}</span>
                  <span>{latestData.works_ongoing || 0}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${ongoingPercent}%`}}
                  >
                    {ongoingPercent > 10 && `${Math.round(ongoingPercent)}%`}
                  </div>
                </div>
              </div>
            </div>

            <div className="charts">
              <div className="chart-container">
                <div className="chart-header">
                  <span className="chart-icon">📈</span>
                  <h3>{text[language].trend}</h3>
                </div>
                <Line data={chartData} options={chartOptions} />
              </div>
              <div className="chart-container">
                <div className="chart-header">
                  <span className="chart-icon">📊</span>
                  <h3>{text[language].worksStatus}</h3>
                </div>
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
