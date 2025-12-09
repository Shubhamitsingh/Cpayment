import React from 'react';
import './HomePage.css';
import { FaUser, FaBox, FaDollarSign, FaCalendar, FaEye, FaCheck, FaTimes, FaHashtag } from 'react-icons/fa';
import PaymentModal from './PaymentModal';

const HomePage = ({ payments, onNavigate, onStatusUpdate, onPaymentClick, selectedPayment }) => {
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
    <div className="home-page">
      <div className="home-payments-section">
        {payments.length === 0 ? (
          <div className="empty-state">
            <p>No payment requests found</p>
          </div>
        ) : (
          <div className="payments-list">
            {payments.map((payment) => {
              const statusInfo = getStatusBadge(payment.status);
              return (
                <div key={payment.id} className="payment-card-home">
                  <div className="payment-header-home">
                    <div className="payment-id-home">#{payment.id.slice(0, 8)}</div>
                    <span className={`status-badge-home ${statusInfo.class}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="payment-info-home">
                    <div className="info-row-home">
                      <div className="info-icon-wrapper">
                        <FaUser className="info-icon-home" />
                      </div>
                      <div className="info-text-wrapper">
                        <div className="info-label-home">USER ID</div>
                        <div className="info-value-home">{payment.userName || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="info-row-home">
                      <div className="info-icon-wrapper">
                        <FaBox className="info-icon-home" />
                      </div>
                      <div className="info-text-wrapper">
                        <div className="info-label-home">Package</div>
                        <div className="info-value-home">{payment.packageName || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="info-row-home">
                      <div className="info-icon-wrapper">
                        <FaDollarSign className="info-icon-home" />
                      </div>
                      <div className="info-text-wrapper">
                        <div className="info-label-home">Amount</div>
                        <div className="info-value-home">${payment.amount || '0.00'}</div>
                      </div>
                    </div>

                    <div className="info-row-home">
                      <div className="info-icon-wrapper">
                        <FaCalendar className="info-icon-home" />
                      </div>
                      <div className="info-text-wrapper">
                        <div className="info-label-home">Date</div>
                        <div className="info-value-home">{formatDate(payment.createdAt)}</div>
                      </div>
                    </div>

                    {payment.utr && (
                      <div className="info-row-home">
                        <div className="info-icon-wrapper">
                          <FaHashtag className="info-icon-home" />
                        </div>
                        <div className="info-text-wrapper">
                          <div className="info-label-home">UTR Number</div>
                          <div className="info-value-home">{payment.utr}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="payment-actions-home">
                    {payment.status === 'pending' && (
                      <>
                        <button
                          className="btn-approve-home"
                          onClick={() => onStatusUpdate(payment.id, 'approved')}
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          className="btn-reject-home"
                          onClick={() => onStatusUpdate(payment.id, 'rejected')}
                        >
                          <FaTimes /> Reject
                        </button>
                      </>
                    )}
                    {payment.status !== 'pending' && (
                      <button
                        className="btn-view-home"
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

      {selectedPayment && (
        <PaymentModal
          payment={selectedPayment}
          onClose={() => onPaymentClick(null)}
          onStatusUpdate={onStatusUpdate}
        />
      )}
    </div>
  );
};

export default HomePage;

