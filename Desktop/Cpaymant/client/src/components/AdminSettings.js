import React, { useState, useEffect } from 'react';
import './AdminSettings.css';
import { FaSave, FaUpload, FaQrcode, FaIdCard } from 'react-icons/fa';

const AdminSettings = () => {
  const [upiId, setUpiId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [qrCodePreview, setQrCodePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      setUpiId(data.upiId || '');
      setQrCode(data.qrCode || '');
      if (data.qrCode) {
        setQrCodePreview(data.qrCode);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrCodeFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrCodePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('upiId', upiId);
      if (qrCodeFile) {
        formData.append('qrCode', qrCodeFile);
      }

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setQrCode(data.qrCode);
        setQrCodeFile(null);
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h2>Admin Settings</h2>
        <p>Manage UPI ID and QR Code for payments</p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="upiId">
              <FaIdCard className="label-icon" />
              UPI ID
            </label>
            <input
              type="text"
              id="upiId"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="Enter UPI ID (e.g., yourname@paytm)"
              className="form-input"
            />
            <small className="form-hint">
              Enter your UPI ID where users will send payments
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="qrCode">
              <FaQrcode className="label-icon" />
              QR Code
            </label>
            <div className="qr-code-section">
              {qrCodePreview && (
                <div className="qr-code-preview">
                  <img src={qrCodePreview} alt="QR Code" />
                  <p>Current QR Code</p>
                </div>
              )}
              <div className="file-upload-area">
                <input
                  type="file"
                  id="qrCode"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label htmlFor="qrCode" className="file-upload-label">
                  <FaUpload className="upload-icon" />
                  {qrCodeFile ? qrCodeFile.name : 'Upload QR Code Image'}
                </label>
                <small className="form-hint">
                  Upload a QR code image (JPG, PNG, GIF - Max 5MB)
                </small>
              </div>
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <button type="submit" className="save-button" disabled={loading}>
          <FaSave />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;



