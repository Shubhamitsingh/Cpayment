import React from 'react';
import './Statistics.css';
import { FaCheckCircle, FaClock, FaTimesCircle, FaDollarSign } from 'react-icons/fa';

const Statistics = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Payments',
      value: stats.total,
      icon: <FaDollarSign />,
      color: '#667eea',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: <FaClock />,
      color: '#f59e0b',
    },
    {
      label: 'Approved',
      value: stats.approved,
      icon: <FaCheckCircle />,
      color: '#10b981',
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      icon: <FaTimesCircle />,
      color: '#ef4444',
    },
  ];

  return (
    <div className="statistics-container">
      {statCards.map((stat, index) => (
        <div key={index} className="stat-card" style={{ borderTopColor: stat.color }}>
          <div className="stat-icon" style={{ color: stat.color }}>
            {stat.icon}
          </div>
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
      {stats.totalAmount > 0 && (
        <div className="stat-card total-amount" style={{ borderTopColor: '#764ba2' }}>
          <div className="stat-icon" style={{ color: '#764ba2' }}>
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <div className="stat-value">${stats.totalAmount.toFixed(2)}</div>
            <div className="stat-label">Total Amount</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;

