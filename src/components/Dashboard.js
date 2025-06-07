import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div className="container mt-5 pt-5">
        <div className="text-center">
          <h3>Please log in to view your dashboard</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="container mt-5 pt-5">
        <div className="row">
          <div className="col-12">
            <div className="dashboard-header">
              <h2>Welcome to Your Dashboard</h2>
              <p className="text-muted">Manage your Recycle Hub account and activities</p>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card dashboard-card">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-user me-2 text-success"></i>
                  Profile Information
                </h5>
                <div className="profile-info">
                  <p><strong>Name:</strong> {user.user_metadata?.full_name || 'Not provided'}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.user_metadata?.phone_number || 'Not provided'}</p>
                  <p><strong>City:</strong> {user.user_metadata?.city || 'Not provided'}</p>
                  <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <button className="btn btn-outline-success btn-sm">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card dashboard-card">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-recycle me-2 text-success"></i>
                  Quick Actions
                </h5>
                <div className="d-grid gap-2">
                  <a href="/Sale_Add_Item" className="btn btn-success">
                    <i className="fas fa-plus me-2"></i>
                    Sell Items
                  </a>
                  <a href="/Buy" className="btn btn-outline-success">
                    <i className="fas fa-shopping-cart me-2"></i>
                    Buy Items
                  </a>
                  <a href="/Services" className="btn btn-outline-success">
                    <i className="fas fa-cogs me-2"></i>
                    Our Services
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card dashboard-card">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-chart-line me-2 text-success"></i>
                  Activity Summary
                </h5>
                <div className="activity-stats">
                  <div className="stat-item">
                    <span className="stat-number">0</span>
                    <span className="stat-label">Items Sold</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">0</span>
                    <span className="stat-label">Items Bought</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">0</span>
                    <span className="stat-label">Active Listings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="card dashboard-card">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-info-circle me-2 text-success"></i>
                  Getting Started
                </h5>
                <div className="row">
                  <div className="col-md-6">
                    <div className="getting-started-item">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      Account created and verified
                    </div>
                    <div className="getting-started-item">
                      <i className="fas fa-user-edit text-warning me-2"></i>
                      Complete your profile information
                    </div>
                    <div className="getting-started-item">
                      <i className="fas fa-plus-circle text-info me-2"></i>
                      List your first item for sale
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="getting-started-item">
                      <i className="fas fa-search text-primary me-2"></i>
                      Browse items to buy
                    </div>
                    <div className="getting-started-item">
                      <i className="fas fa-handshake text-success me-2"></i>
                      Connect with other users
                    </div>
                    <div className="getting-started-item">
                      <i className="fas fa-leaf text-success me-2"></i>
                      Start your recycling journey
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12 text-center">
            <button 
              onClick={handleLogout}
              className="btn btn-outline-danger"
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
