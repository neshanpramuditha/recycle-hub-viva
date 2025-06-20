import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getPendingManualPayments,
  approveManualPayment,
  rejectManualPayment,
  getPaymentStatistics
} from '../lib/productQueries';
import './PaymentComponents.css';

export default function AdminPaymentReview() {
  const { user } = useAuth();
  const [pendingPayments, setPendingPayments] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      const [payments, stats] = await Promise.all([
        getPendingManualPayments(),
        getPaymentStatistics()
      ]);
      setPendingPayments(payments);
      setStatistics(stats);
    } catch (err) {
      console.error('Error loading payment data:', err);
      setError('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (transactionId) => {
    try {
      setProcessing(transactionId);
      setError('');
      
      await approveManualPayment(transactionId, adminNotes);
      
      setSuccess('Payment approved successfully! Credits have been added to user account.');
      setAdminNotes('');
      setSelectedPayment(null);
      
      // Refresh data
      await loadPaymentData();
    } catch (err) {
      console.error('Error approving payment:', err);
      setError('Failed to approve payment: ' + err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectPayment = async (transactionId) => {
    try {
      setProcessing(transactionId);
      setError('');
      
      await rejectManualPayment(transactionId, rejectionReason);
      
      setSuccess('Payment rejected successfully.');
      setRejectionReason('');
      setShowRejectModal(false);
      setSelectedPayment(null);
      
      // Refresh data
      await loadPaymentData();
    } catch (err) {
      console.error('Error rejecting payment:', err);
      setError('Failed to reject payment: ' + err.message);
    } finally {
      setProcessing(null);
    }
  };

  const openReceiptInNewTab = (receiptUrl) => {
    if (receiptUrl) {
      window.open(receiptUrl, '_blank');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount) => {
    return `LKR ${amount?.toLocaleString() || '0'}`;
  };

  if (loading) {
    return (
      <div className="admin-payment-review">
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading payment reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-payment-review">
      <div className="content-header">
        <h2>Payment Review Dashboard</h2>
        <p className="text-muted">Review and approve manual payment submissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon bg-warning">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <h3>{statistics.pendingReview || 0}</h3>
              <p>Pending Review</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon bg-success">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{statistics.completed || 0}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon bg-info">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <div className="stat-content">
              <h3>{formatAmount(statistics.totalRevenue)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon bg-primary">
              <i className="fas fa-upload"></i>
            </div>
            <div className="stat-content">
              <h3>{statistics.manualPayments || 0}</h3>
              <p>Manual Payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {/* Pending Payments List */}
      <div className="card">
        <div className="card-header">
          <h5><i className="fas fa-list me-2"></i>Pending Manual Payments</h5>
        </div>
        <div className="card-body">
          {pendingPayments.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
              <h5>All caught up!</h5>
              <p className="text-muted">No pending manual payments to review.</p>
            </div>
          ) : (
            <div className="pending-payments-list">
              {pendingPayments.map((payment) => (
                <div key={payment.id} className="payment-review-item">
                  <div className="payment-info">
                    <div className="payment-header">
                      <h6>{payment.profiles?.full_name || 'Unknown User'}</h6>
                      <span className="payment-date">{formatDate(payment.created_at)}</span>
                    </div>
                    <div className="payment-details">
                      <div className="detail-item">
                        <strong>Package:</strong> {payment.package_name}
                      </div>
                      <div className="detail-item">
                        <strong>Credits:</strong> {payment.credits}
                      </div>
                      <div className="detail-item">
                        <strong>Amount:</strong> {formatAmount(payment.amount)}
                      </div>
                      <div className="detail-item">
                        <strong>Payment Method:</strong> {payment.payment_method}
                      </div>
                      <div className="detail-item">
                        <strong>Reference Number:</strong> {payment.reference_number}
                      </div>
                      {payment.notes && (
                        <div className="detail-item">
                          <strong>User Notes:</strong> {payment.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="payment-actions">
                    {payment.receipt_url && (
                      <button
                        className="btn btn-outline-info btn-sm mb-2"
                        onClick={() => openReceiptInNewTab(payment.receipt_url)}
                      >
                        <i className="fas fa-eye me-1"></i>View Receipt
                      </button>
                    )}
                    
                    <div className="admin-notes-section mb-2">
                      <label className="form-label">Admin Notes (Optional)</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="2"
                        value={selectedPayment === payment.id ? adminNotes : ''}
                        onChange={(e) => {
                          setSelectedPayment(payment.id);
                          setAdminNotes(e.target.value);
                        }}
                        placeholder="Add notes about this payment review..."
                      />
                    </div>
                    
                    <div className="action-buttons">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleApprovePayment(payment.id)}
                        disabled={processing === payment.id}
                      >
                        {processing === payment.id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                            Approving...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check me-1"></i>
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          setSelectedPayment(payment.id);
                          setShowRejectModal(true);
                        }}
                        disabled={processing === payment.id}
                      >
                        <i className="fas fa-times me-1"></i>
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Payment</h5>
                <button type="button" className="btn-close" onClick={() => setShowRejectModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Rejection Reason *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejecting this payment..."
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRejectPayment(selectedPayment)}
                  disabled={!rejectionReason.trim() || processing}
                >
                  {processing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                      Rejecting...
                    </>
                  ) : (
                    'Reject Payment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
