import React from 'react';
import './PaymentModal.css';
import { FaTimes, FaCheck, FaUser, FaBox, FaDollarSign, FaCalendar, FaImage, FaHashtag } from 'react-icons/fa';

const PaymentModal = ({ payment, onClose, onStatusUpdate }) => {
  const [imageEnlarged, setImageEnlarged] = React.useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', label: 'Pending' },
      approved: { class: 'status-approved', label: 'Approved' },
      rejected: { class: 'status-rejected', label: 'Rejected' },
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const statusInfo = getStatusBadge(payment.status);

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-container">
        <div className="modal-header">
          <h2>Payment Details</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">
          <div className="detail-section">
            <div className="detail-header">
              <span className={`status-badge-large ${statusInfo.class}`}>
                {statusInfo.label}
              </span>
              <div className="payment-id-large">ID: {payment.id}</div>
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <FaUser className="detail-icon" />
              <div>
                <div className="detail-label">USER ID</div>
                <div className="detail-value">{payment.userName || 'N/A'}</div>
              </div>
            </div>

            <div className="detail-item">
              <FaBox className="detail-icon" />
              <div>
                <div className="detail-label">Package</div>
                <div className="detail-value">{payment.packageName || 'N/A'}</div>
              </div>
            </div>

            <div className="detail-item">
              <FaDollarSign className="detail-icon" />
              <div>
                <div className="detail-label">Amount</div>
                <div className="detail-value">${payment.amount || '0.00'}</div>
              </div>
            </div>

            <div className="detail-item">
              <FaCalendar className="detail-icon" />
              <div>
                <div className="detail-label">Submitted</div>
                <div className="detail-value">{formatDate(payment.createdAt)}</div>
              </div>
            </div>

            {payment.utr && (
              <div className="detail-item">
                <FaHashtag className="detail-icon" />
                <div>
                  <div className="detail-label">UTR Number</div>
                  <div className="detail-value">{payment.utr}</div>
                </div>
              </div>
            )}
          </div>

          {payment.screenshot && (
            <div className="screenshot-section">
              <div className="section-title">
                <FaImage /> Payment Screenshot
              </div>
              <div className="screenshot-container">
                <img
                  src={payment.screenshot}
                  alt="Payment screenshot"
                  onClick={() => setImageEnlarged(true)}
                  className="screenshot-image"
                />
                <div className="screenshot-hint">Click to enlarge</div>
              </div>
            </div>
          )}

          {payment.status === 'pending' && (
            <div className="modal-actions">
              <button
                className="btn-approve-large"
                onClick={() => {
                  onStatusUpdate(payment.id, 'approved');
                  onClose();
                }}
              >
                <FaCheck /> Approve Payment
              </button>
              <button
                className="btn-reject-large"
                onClick={() => {
                  onStatusUpdate(payment.id, 'rejected');
                  onClose();
                }}
              >
                <FaTimes /> Reject Payment
              </button>
            </div>
          )}
        </div>
      </div>

      {imageEnlarged && payment.screenshot && (
        <div className="image-enlarged-overlay" onClick={() => setImageEnlarged(false)}>
          <div className="image-enlarged-container" onClick={(e) => e.stopPropagation()}>
            <button className="close-enlarged-btn" onClick={() => setImageEnlarged(false)}>
              <FaTimes />
            </button>
            <img src={payment.screenshot} alt="Payment screenshot enlarged" />
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentModal;

