import React, { useState } from 'react';
import './PaymentDashboard.css';
import { FaCheck, FaTimes, FaEye, FaUser, FaBox, FaCalendar, FaDollarSign, FaHashtag } from 'react-icons/fa';

const PaymentDashboard = ({ payments, onStatusUpdate, onPaymentClick }) => {
  const [filter, setFilter] = useState('all');

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', label: 'Pending' },
      approved: { class: 'status-approved', label: 'Approved' },
      rejected: { class: 'status-rejected', label: 'Rejected' },
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="payment-dashboard">
      <div className="dashboard-header">
        <h2>Payment Requests</h2>
        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({payments.length})
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending ({payments.filter(p => p.status === 'pending').length})
          </button>
          <button
            className={filter === 'approved' ? 'active' : ''}
            onClick={() => setFilter('approved')}
          >
            Approved ({payments.filter(p => p.status === 'approved').length})
          </button>
          <button
            className={filter === 'rejected' ? 'active' : ''}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({payments.filter(p => p.status === 'rejected').length})
          </button>
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="empty-state">
          <p>No payments found</p>
        </div>
      ) : (
        <div className="payments-grid">
          {filteredPayments.map((payment) => {
            const statusInfo = getStatusBadge(payment.status);
            return (
              <div key={payment.id} className="payment-card">
                <div className="payment-header">
                  <div className="payment-id">#{payment.id.slice(0, 8)}</div>
                  <span className={`status-badge ${statusInfo.class}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <div className="payment-info">
                  <div className="info-row">
                    <FaUser className="info-icon" />
                    <div>
                      <div className="info-label">USER ID</div>
                      <div className="info-value">{payment.userName || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="info-row">
                    <FaBox className="info-icon" />
                    <div>
                      <div className="info-label">Package</div>
                      <div className="info-value">{payment.packageName || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="info-row">
                    <FaDollarSign className="info-icon" />
                    <div>
                      <div className="info-label">Amount</div>
                      <div className="info-value">${payment.amount || '0.00'}</div>
                    </div>
                  </div>

                  <div className="info-row">
                    <FaCalendar className="info-icon" />
                    <div>
                      <div className="info-label">Date</div>
                      <div className="info-value">{formatDate(payment.createdAt)}</div>
                    </div>
                  </div>

                  {payment.utr && (
                    <div className="info-row">
                      <FaHashtag className="info-icon" />
                      <div>
                        <div className="info-label">UTR Number</div>
                        <div className="info-value">{payment.utr}</div>
                      </div>
                    </div>
                  )}
                </div>

                {payment.screenshot && (
                  <div className="screenshot-preview">
                    <img
                      src={payment.screenshot}
                      alt="Payment screenshot"
                      onClick={() => onPaymentClick(payment)}
                    />
                    <button
                      className="view-full-btn"
                      onClick={() => onPaymentClick(payment)}
                    >
                      <FaEye /> View Full
                    </button>
                  </div>
                )}

                <div className="payment-actions">
                  {payment.status === 'pending' && (
                    <>
                      <button
                        className="btn-approve"
                        onClick={() => onStatusUpdate(payment.id, 'approved')}
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => onStatusUpdate(payment.id, 'rejected')}
                      >
                        <FaTimes /> Reject
                      </button>
                    </>
                  )}
                  {payment.status !== 'pending' && (
                    <button
                      className="btn-view"
                      onClick={() => onPaymentClick(payment)}
                    >
                      <FaEye /> View Details
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentDashboard;

