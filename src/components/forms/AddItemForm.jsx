import React, { useState } from 'react';
import { FaUpload, FaPlus, FaDollarSign } from 'react-icons/fa';
import './AddItemForm.css';

export default function AddItemForm() {
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    contact: '',
    location: '',
    description: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.itemName && formData.price && formData.contact && formData.location) {
      setIsSubmitted(true);
      setTimeout(() => {
        alert('Item posted successfully!');
        // Reset form
        setFormData({
          itemName: '',
          price: '',
          contact: '',
          location: '',
          description: ''
        });
        setSelectedImage(null);
        setIsSubmitted(false);
      }, 1000);
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <div className="add-item-form-container">
      <div className="container-fluid">
        <div className="row min-vh-100">
          <div className="col-lg-4"></div>
          
          <div className="col-lg-4">
            <div className="form-wrapper">
              <div className="form-header text-center mb-4">
                <FaPlus className="form-icon" />
                <h2>Post Your Item for Sale</h2>
                <p className="text-muted">Add your recyclable item to our marketplace</p>
              </div>

              <form onSubmit={handleSubmit} className="add-item-form">
                <div className="mb-3">
                  <label className="form-label">Item Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="itemName"
                    placeholder="Enter item name"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Price *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaDollarSign />
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      placeholder="Enter price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Contact Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="contact"
                    placeholder="Enter contact number"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="4"
                    placeholder="Describe your item's condition, features, etc."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Upload Image</label>
                  <div className="file-upload-container">
                    <input
                      type="file"
                      id="itemImage"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="itemImage" className="file-upload-label">
                      <FaUpload className="me-2" />
                      Choose Image
                    </label>
                  </div>
                  {selectedImage && (
                    <div className="image-preview mt-3">
                      <img
                        src={selectedImage}
                        alt="Item preview"
                        className="preview-img"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className={`btn btn-success w-100 ${isSubmitted ? 'loading' : ''}`}
                  disabled={isSubmitted}
                >
                  {isSubmitted ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Posting Item...
                    </>
                  ) : (
                    <>
                      <FaPlus className="me-2" />
                      Post Item for Sale
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div className="col-lg-4"></div>
        </div>
      </div>
    </div>
  );
}
