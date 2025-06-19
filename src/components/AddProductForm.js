import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getCategories, addProductWithImages, addProductSpecifications } from '../lib/productQueries';
import { validateImageFile, compressImage, processAllProductImages } from '../lib/storageHelpers';
import './AddProductForm.css';

export default function AddProductForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    price: '',
    original_price: '',
    condition: 'Good',
    is_negotiable: false,
    location: ''
  });
  // Image handling
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageErrors, setImageErrors] = useState([]);
  const [imageUrls, setImageUrls] = useState(['']);
  const [urlPreviews, setUrlPreviews] = useState([]);
  const [urlErrors, setUrlErrors] = useState([]);

  // Specifications
  const [specifications, setSpecifications] = useState([
    { name: '', value: '' }
  ]);
  // Load categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Check if user profile is complete
  const checkProfileCompleteness = () => {
    if (!user) return false;
    
    const requiredFields = [
      user?.user_metadata?.full_name,
      user?.user_metadata?.phone_number,
      user?.user_metadata?.location
    ];
    
    return requiredFields.every(field => field && field.trim() !== '');
  };

  // Check profile completeness on mount
  useEffect(() => {
    if (user) {
      const isComplete = checkProfileCompleteness();
      setProfileIncomplete(!isComplete);
        if (!isComplete) {
        setError('⚠️ Complete Your Profile First! Please add your full name, phone number, and location in Dashboard Settings before listing products.');
      }
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image file selection
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    setImageErrors([]);
    const newPreviews = [];
    const newFiles = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        errors[i] = validation.error;
        continue;
      }

      try {
        // Create preview
        const preview = URL.createObjectURL(file);
        newPreviews[i] = preview;
        newFiles[i] = file;
      } catch (error) {
        errors[i] = 'Failed to process image';
        console.error('Error processing image:', error);
      }
    }

    setImagePreviews(prev => [...prev, ...newPreviews.filter(Boolean)]);
    setImageFiles(prev => [...prev, ...newFiles.filter(Boolean)]);
    setImageErrors(prev => [...prev, ...errors]);
  };

  // Remove image
  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImageErrors(prev => prev.filter((_, i) => i !== index));
  };

  // Handle URL input changes
  const handleUrlChange = (index, value) => {
    setImageUrls(prev => prev.map((url, i) => i === index ? value : url));
    
    // Clear previous error
    setUrlErrors(prev => prev.map((error, i) => i === index ? null : error));
    
    // Validate URL and create preview
    if (value.trim()) {
      validateImageUrl(value.trim(), index);
    } else {
      setUrlPreviews(prev => prev.map((preview, i) => i === index ? null : preview));
    }
  };

  // Validate image URL
  const validateImageUrl = (url, index) => {
    // Basic URL validation
    try {
      new URL(url);
      
      // Check if it looks like an image URL
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
      const hasImageExtension = imageExtensions.some(ext => 
        url.toLowerCase().includes(ext)
      );
      
      if (!hasImageExtension && !url.includes('unsplash') && !url.includes('imgur') && !url.includes('cloudinary')) {
        setUrlErrors(prev => prev.map((error, i) => 
          i === index ? 'URL should point to an image file' : error
        ));
        return;
      }
      
      // Test if image loads
      const img = new Image();
      img.onload = () => {
        setUrlPreviews(prev => prev.map((preview, i) => i === index ? url : preview));
        setUrlErrors(prev => prev.map((error, i) => i === index ? null : error));
      };
      img.onerror = () => {
        setUrlErrors(prev => prev.map((error, i) => 
          i === index ? 'Unable to load image from this URL' : error
        ));
        setUrlPreviews(prev => prev.map((preview, i) => i === index ? null : preview));
      };
      img.src = url;
      
    } catch (e) {
      setUrlErrors(prev => prev.map((error, i) => 
        i === index ? 'Please enter a valid URL' : error
      ));
    }
  };

  // Add URL input field
  const addUrlField = () => {
    setImageUrls(prev => [...prev, '']);
    setUrlPreviews(prev => [...prev, null]);
    setUrlErrors(prev => [...prev, null]);
  };

  // Remove URL field
  const removeUrlField = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setUrlPreviews(prev => prev.filter((_, i) => i !== index));
    setUrlErrors(prev => prev.filter((_, i) => i !== index));
  };

  // Handle specification changes
  const handleSpecChange = (index, field, value) => {
    setSpecifications(prev => prev.map((spec, i) => 
      i === index ? { ...spec, [field]: value } : spec
    ));
  };

  // Add new specification field
  const addSpecification = () => {
    setSpecifications(prev => [...prev, { name: '', value: '' }]);
  };

  // Remove specification field
  const removeSpecification = (index) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index));
  };
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to add a product');
      return;
    }

    // Check profile completeness
    if (!checkProfileCompleteness()) {
      setError('🚨 Profile Incomplete! Please complete your profile information (full name, phone number, and location) in Dashboard Settings before adding products.');
      return;
    }
    
    if (imageFiles.length === 0 && imageUrls.filter(url => url.trim()).length === 0) {
      setError('Please add at least one image (file upload or URL)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare product data
      const productData = {
        ...formData,
        seller_id: user.id,
        category_id: parseInt(formData.category_id),
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null
      };      
      
      // Add product with images
      const validUrls = imageUrls.filter(url => url && url.trim());
      const allImages = await processAllProductImages(imageFiles, validUrls, Date.now());
      const product = await addProductWithImages(productData, allImages);

      // Add specifications if any
      const validSpecs = specifications.filter(spec => spec.name && spec.value);
      if (validSpecs.length > 0) {
        await addProductSpecifications(product.id, validSpecs);
      }

      setSuccess('Product added successfully!');
      
      // Redirect to product page after short delay
      setTimeout(() => {
        navigate(`/product/${product.id}`);
      }, 2000);

    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>
          Add New Product
        </h2>
        <p className="text-muted">Create a new product listing for the marketplace</p>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {profileIncomplete && (
        <div className="card mb-4 border-warning">
          <div className="card-header bg-warning text-dark">
            <h5 className="mb-0">
              <i className="fas fa-user-edit me-2"></i>
              Profile Incomplete
            </h5>
          </div>
          <div className="card-body">
            <div className="row align-items-center">              <div className="col-md-8">
                <h6 className="text-warning mb-2">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  🚨 Complete Your Profile First
                </h6>
                <p className="mb-2 fw-bold">
                  Before adding products, please complete your profile information including:
                </p>
                <ul className="mb-3 text-warning">
                  <li><strong>✓ Full Name</strong></li>
                  <li><strong>✓ Phone Number</strong></li>
                  <li><strong>✓ Location</strong></li>
                </ul>
                <p className="text-muted small mb-0">
                  This information helps buyers contact you and builds trust in the marketplace.
                </p>
              </div>
              <div className="col-md-4 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard?section=settings')}
                  className="btn btn-warning"
                >
                  <i className="fas fa-cog me-2"></i>
                  Complete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ opacity: profileIncomplete ? 0.6 : 1, pointerEvents: profileIncomplete ? 'none' : 'auto' }}>
        <div className="row">
          {/* Left Column */}
          <div className="col-lg-8">
            {/* Basic Information Card */}
            <div className="card mb-4">
              <div className="card-header">
                <h5>
                  <i className="fas fa-info-circle me-2"></i>
                  Basic Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Product Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter a descriptive product title"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Description *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="form-control"
                        rows="4"
                        placeholder="Describe your product in detail, including features, condition, and any other relevant information"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Category *</label>
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Condition *</label>
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      >
                        <option value="Excellent">Excellent - Like new</option>
                        <option value="Good">Good - Minor wear</option>
                        <option value="Fair">Fair - Noticeable wear</option>
                        <option value="Poor">Poor - Significant wear</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Location *</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter your city or area"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Images Card */}
            <div className="card mb-4">
              <div className="card-header">
                <h5>
                  <i className="fas fa-images me-2"></i>
                  Product Images *
                </h5>
              </div>
              <div className="card-body">
                <p className="text-muted mb-3">
                  <i className="fas fa-info-circle me-1"></i>
                  Upload high-quality images. The first image will be your main product photo.
                </p>
                
                {/* File Upload */}
                <div className="image-upload-area mb-4">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="file-input"
                  />
                  <label htmlFor="images" className="file-input-label">
                    <i className="fas fa-cloud-upload-alt upload-icon"></i>
                    <h6>Click to upload images</h6>
                    <p className="upload-subtitle">or drag and drop files here</p>
                    <small className="text-muted">PNG, JPG, GIF up to 10MB each</small>
                  </label>
                </div>

                {/* Image Previews */}
                {(imagePreviews.length > 0 || urlPreviews.some(preview => preview)) && (
                  <div className="image-previews mb-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={`file-${index}`} className="image-preview">
                        <img src={preview} alt={`Preview ${index + 1}`} />
                        {index === 0 && <span className="primary-badge">Main</span>}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="remove-image-btn"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {urlPreviews.map((preview, index) => preview && (
                      <div key={`url-${index}`} className="image-preview">
                        <img src={preview} alt={`URL Preview ${index + 1}`} />
                        <span className="url-badge">URL</span>
                        <button
                          type="button"
                          onClick={() => removeUrlField(index)}
                          className="remove-image-btn"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* URL Upload Section */}
                <div className="url-upload-section">
                  <h6>
                    <i className="fas fa-link me-2"></i>
                    Or add images from URL
                  </h6>
                  {imageUrls.map((url, index) => (
                    <div key={index} className="url-input-group mb-2">
                      <div className="input-group">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => handleUrlChange(index, e.target.value)}
                          className={`form-control ${urlErrors[index] ? 'is-invalid' : ''}`}
                          placeholder="https://example.com/image.jpg"
                        />
                        {imageUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeUrlField(index)}
                            className="btn btn-outline-danger"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </div>
                      {urlErrors[index] && (
                        <div className="invalid-feedback">{urlErrors[index]}</div>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addUrlField}
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="fas fa-plus me-1"></i>Add Another URL
                  </button>
                </div>
              </div>
            </div>

            {/* Specifications Card */}
            <div className="card mb-4">
              <div className="card-header">
                <h5>
                  <i className="fas fa-list-ul me-2"></i>
                  Product Specifications
                </h5>
              </div>
              <div className="card-body">
                <p className="text-muted mb-3">
                  Add specific details about your product (optional but recommended)
                </p>
                {specifications.map((spec, index) => (
                  <div key={index} className="specification-row mb-3">
                    <div className="row">
                      <div className="col-md-5">
                        <input
                          type="text"
                          placeholder="Specification (e.g., Brand, Model, Color)"
                          value={spec.name}
                          onChange={(e) => handleSpecChange(index, 'name', e.target.value)}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-5">
                        <input
                          type="text"
                          placeholder="Value (e.g., Apple, iPhone 12, Black)"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-2">
                        {specifications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSpecification(index)}
                            className="btn btn-outline-danger btn-sm w-100"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecification}
                  className="btn btn-outline-primary btn-sm"
                >
                  <i className="fas fa-plus me-1"></i>Add Specification
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-lg-4">
            {/* Pricing Card */}
            <div className="card mb-4">
              <div className="card-header">
                <h5>
                  <i className="fas fa-dollar-sign me-2"></i>
                  Pricing
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Current Price (LKR) *</label>
                  <div className="input-group">
                    <span className="input-group-text">Rs.</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Original Price (LKR)</label>
                  <div className="input-group">
                    <span className="input-group-text">Rs.</span>
                    <input
                      type="number"
                      name="original_price"
                      value={formData.original_price}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <small className="form-text text-muted">Show original price to highlight savings</small>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="is_negotiable"
                    checked={formData.is_negotiable}
                    onChange={handleInputChange}
                    className="form-check-input"
                    id="negotiable"
                  />
                  <label className="form-check-label" htmlFor="negotiable">
                    Price is negotiable
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons Card */}
            <div className="card">
              <div className="card-body">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-success btn-lg w-100 mb-3"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Publishing Product...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check me-2"></i>
                      Publish Product
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-outline-secondary w-100"
                  disabled={loading}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Cancel
                </button>
              </div>
            </div>

            {/* Tips Card */}
            <div className="card mt-4">
              <div className="card-header">
                <h6>
                  <i className="fas fa-lightbulb me-2"></i>
                  Tips for Better Listing
                </h6>
              </div>
              <div className="card-body">
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    Use clear, high-quality photos
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    Write detailed descriptions
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    Set competitive prices
                  </li>
                  <li className="mb-0">
                    <i className="fas fa-check text-success me-2"></i>
                    Add product specifications
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
