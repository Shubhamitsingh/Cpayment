import React, { useState, useEffect } from 'react';
import './App.css';
import PaymentDashboard from './components/PaymentDashboard';
import PaymentModal from './components/PaymentModal';
import AdminSettings from './components/AdminSettings';
import HomePage from './components/HomePage';
import { FaBars, FaTimes, FaCog, FaHome, FaDollarSign, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function App() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);


  const fetchData = async () => {
    try {
      const paymentsRes = await fetch('/api/payments');
      const paymentsData = await paymentsRes.json();
      
      setPayments(paymentsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (paymentId, newStatus) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update payment status');
    }
  };

  const handleHomeNavigate = (section) => {
    setActiveSection(section);
    setShowMobileMenu(false);
    if (section === 'settings') {
      setTimeout(() => {
        const element = document.getElementById('settings-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const goToHome = () => {
    setActiveSection('home');
    setShowMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToSettings = () => {
    setActiveSection('settings');
    setShowMobileMenu(false);
    setTimeout(() => {
      const element = document.getElementById('settings-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-top">
          <div className="header-left">
            <img 
              src="/images/Cpaymenet.png" 
              alt="Cpayment Logo" 
              className="app-logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <h1>Cpayment</h1>
          </div>
          <nav className="header-nav">
            <a 
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={goToHome}
            >
              <FaHome /> Home
            </a>
            <a 
              className={`nav-link ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={goToSettings}
            >
              <FaCog /> Settings
            </a>
            <button 
              className="mobile-menu-toggle"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <FaTimes /> : <FaBars />}
            </button>
          </nav>
        </div>
        {showMobileMenu && (
          <div className="mobile-menu">
            <a 
              className={`mobile-nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={goToHome}
            >
              <FaHome /> Home
            </a>
            <a 
              className={`mobile-nav-link ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={goToSettings}
            >
              <FaCog /> Settings
            </a>
          </div>
        )}
      </header>

      {isMobile && activeSection === 'home' && (
        <div className="mobile-stats-menu">
          <div className="stat-card-mobile" style={{ borderTopColor: '#667eea' }}>
            <div className="stat-icon-mobile" style={{ color: '#667eea' }}>
              <FaDollarSign />
            </div>
            <div className="stat-content-mobile">
              <div className="stat-value-mobile">{payments.length}</div>
              <div className="stat-label-mobile">Total Payments</div>
            </div>
          </div>
          <div className="stat-card-mobile" style={{ borderTopColor: '#f59e0b' }}>
            <div className="stat-icon-mobile" style={{ color: '#f59e0b' }}>
              <FaClock />
            </div>
            <div className="stat-content-mobile">
              <div className="stat-value-mobile">{payments.filter(p => p.status === 'pending').length}</div>
              <div className="stat-label-mobile">Pending</div>
            </div>
          </div>
          <div className="stat-card-mobile" style={{ borderTopColor: '#10b981' }}>
            <div className="stat-icon-mobile" style={{ color: '#10b981' }}>
              <FaCheckCircle />
            </div>
            <div className="stat-content-mobile">
              <div className="stat-value-mobile">{payments.filter(p => p.status === 'approved').length}</div>
              <div className="stat-label-mobile">Approved</div>
            </div>
          </div>
          <div className="stat-card-mobile" style={{ borderTopColor: '#ef4444' }}>
            <div className="stat-icon-mobile" style={{ color: '#ef4444' }}>
              <FaTimesCircle />
            </div>
            <div className="stat-content-mobile">
              <div className="stat-value-mobile">{payments.filter(p => p.status === 'rejected').length}</div>
              <div className="stat-label-mobile">Rejected</div>
            </div>
          </div>
        </div>
      )}
      
      {activeSection === 'home' && (
        <HomePage 
          payments={payments}
          loading={loading}
          onNavigate={handleHomeNavigate}
          onStatusUpdate={handleStatusUpdate}
          onPaymentClick={setSelectedPayment}
          selectedPayment={selectedPayment}
        />
      )}
      
      {activeSection === 'settings' && (
        <div className="settings-section" id="settings-section">
          <AdminSettings />
        </div>
      )}
      
      {activeSection === 'payments' && (
        <main className="app-main" id="payments-section">
          {loading ? (
            <div className="loading">Loading payments...</div>
          ) : (
            <PaymentDashboard
              payments={payments}
              onStatusUpdate={handleStatusUpdate}
              onPaymentClick={setSelectedPayment}
            />
          )}
        </main>
      )}

      {selectedPayment && (
        <PaymentModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

export default App;

