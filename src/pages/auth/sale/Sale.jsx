import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { MdLocationOn, MdPhone } from 'react-icons/md';
import { Link } from 'react-router-dom';
import './Sale.css';

export default function Sale() {
  // Mock data for user's listed items
  const [userItems, setUserItems] = useState([
    {
      id: 1,
      name: 'Plastic Bottles Collection',
      category: 'Plastic Items',
      price: 25,
      condition: 'Good',
      location: 'Downtown',
      contact: '+1234567890',
      image: '/src/assets/images/1.jpg',
      description: 'Clean plastic bottles, various sizes',
      datePosted: '2025-06-01',
      status: 'Active',
      views: 15,
      interested: 3
    },
    {
      id: 2,
      name: 'Glass Containers',
      category: 'Glass Items',
      price: 15,
      condition: 'Excellent',
      location: 'City Center',
      contact: '+1234567890',
      image: '/src/assets/images/2.jpg',
      description: 'Various sized glass containers',
      datePosted: '2025-05-28',
      status: 'Sold',
      views: 8,
      interested: 2
    },
    {
      id: 3,
      name: 'Old Electronics',
      category: 'Electronic Devices',
      price: 120,
      condition: 'Fair',
      location: 'Tech District',
      contact: '+1234567890',
      image: '/src/assets/images/4.jpg',
      description: 'Various electronic devices for parts',
      datePosted: '2025-06-02',
      status: 'Pending',
      views: 22,
      interested: 5
    }
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDeleteItem = (itemId) => {
    setItemToDelete(itemId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setUserItems(prev => prev.filter(item => item.id !== itemToDelete));
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Active': 'status-active',
      'Sold': 'status-sold',
      'Pending': 'status-pending'
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const totalEarnings = userItems
    .filter(item => item.status === 'Sold')
    .reduce((sum, item) => sum + item.price, 0);

  const activeItems = userItems.filter(item => item.status === 'Active').length;
  const totalViews = userItems.reduce((sum, item) => sum + item.views, 0);

  return (
    <div className="sale-page">
      <div className="container py-5">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="page-header">
              <h1 className="display-4 mb-3">My Sale Items</h1>
              <p className="lead text-muted">
                Manage your recyclable items and track sales performance
              </p>
              <Link to="/sale-add-item" className="btn btn-success btn-lg">
                <FaPlus className="me-2" />
                Add New Item
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-5">
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <div className="stat-icon active">
                <FaEye />
              </div>
              <div className="stat-info">
                <h3>{activeItems}</h3>
                <p>Active Listings</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <div className="stat-icon sold">
                <FaPlus />
              </div>
              <div className="stat-info">
                <h3>${totalEarnings}</h3>
                <p>Total Earnings</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <div className="stat-icon views">
                <FaEye />
              </div>
              <div className="stat-info">
                <h3>{totalViews}</h3>
                <p>Total Views</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <div className="stat-icon items">
                <FaEdit />
              </div>
              <div className="stat-info">
                <h3>{userItems.length}</h3>
                <p>Total Items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="row">
          <div className="col-12">
            <div className="items-section">
              <h3 className="section-title mb-4">Your Listed Items</h3>
              
              {userItems.length === 0 ? (
                <div className="empty-state">
                  <FaPlus className="empty-icon" />
                  <h4>No items listed yet</h4>
                  <p className="text-muted">Start selling your recyclable items today!</p>
                  <Link to="/sale-add-item" className="btn btn-primary">
                    Add Your First Item
                  </Link>
                </div>
              ) : (
                <div className="items-grid">
                  {userItems.map(item => (
                    <div key={item.id} className="sale-item-card">
                      <div className="item-image">
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = '/src/assets/images/1.jpg';
                          }}
                        />
                        <div className="item-status">
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                      
                      <div className="item-content">
                        <div className="item-header">
                          <h5 className="item-title">{item.name}</h5>
                          <div className="item-price">${item.price}</div>
                        </div>
                        
                        <p className="item-category">{item.category}</p>
                        <p className="item-description">{item.description}</p>
                        
                        <div className="item-meta">
                          <small className="text-muted">
                            <MdLocationOn className="me-1" />
                            {item.location}
                          </small>
                          <small className="text-muted ms-3">
                            Posted: {new Date(item.datePosted).toLocaleDateString()}
                          </small>
                        </div>
                        
                        <div className="item-stats">
                          <span className="stat-item">
                            <FaEye className="me-1" />
                            {item.views} views
                          </span>
                          <span className="stat-item">
                            <MdPhone className="me-1" />
                            {item.interested} interested
                          </span>
                        </div>
                        
                        <div className="item-actions">
                          <button className="btn btn-outline-primary btn-sm">
                            <FaEdit className="me-1" />
                            Edit
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <FaTrash className="me-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Confirm Delete</h4>
            <p>Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
