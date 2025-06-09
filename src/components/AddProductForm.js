import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCategories, addProductWithImages, addProductSpecifications } from '../lib/productQueries';
import { validateImageFile, compressImage, processAllProductImages } from '../lib/storageHelpers';
import './AddProductForm.css';

export default function AddProductForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image selection
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const previews = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateImageFile(file);
      
      if (validation.valid) {
        // Compress image before adding to state
        const compressedFile = await compressImage(file);
        validFiles.push(compressedFile);
        
        // Create preview
        const preview = URL.createObjectURL(compressedFile);
        previews.push(preview);
        errors.push(null);
      } else {
        errors.push(validation.error);
      }
    }

    setImageFiles(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...previews]);
    setImageErrors(prev => [...prev, ...errors]);
  };
  // Remove image
  const removeImage = (index) => {
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
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
    }    if (imageFiles.length === 0 && imageUrls.filter(url => url.trim()).length === 0) {
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
      };      // Add product with images
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
    <div className="add-product-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="add-product-form">
              <h2>Add New Product</h2>
              
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="form-section">
                  <h4>Basic Information</h4>
                  
                  <div className="form-group">
                    <label>Product Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter product title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="4"
                      placeholder="Describe your product in detail"
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Category *</label>
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
                      <div className="form-group">
                        <label>Condition *</label>
                        <select
                          name="condition"
                          value={formData.condition}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        >
                          <option value="Excellent">Excellent</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                          <option value="Poor">Poor</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="form-section">
                  <h4>Pricing</h4>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Current Price (LKR) *</label>
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
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Original Price (LKR)</label>
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
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="is_negotiable"
                        checked={formData.is_negotiable}
                        onChange={handleInputChange}
                      />
                      Price is negotiable
                    </label>
                  </div>
                </div>

                {/* Location */}
                <div className="form-section">
                  <h4>Location</h4>
                  <div className="form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter your location"
                      required
                    />
                  </div>
                </div>                {/* Images */}
                <div className="form-section">
                  <h4>Product Images *</h4>
                  <p className="form-text">Upload at least one image. The first image will be the main image.</p>
                  
                  {/* File Upload */}
                  <div className="image-upload-area">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="file-input"
                    />
                    <label htmlFor="images" className="file-input-label">
                      <div className="upload-icon">📸</div>
                      <div>Click to upload images</div>
                      <div className="upload-subtitle">JPEG, PNG, WebP, GIF (max 5MB each)</div>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="image-previews">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="image-preview">
                          <img src={preview} alt={`Preview ${index + 1}`} />
                          {index === 0 && imagePreviews.length > 0 && urlPreviews.filter(p => p).length === 0 && <span className="primary-badge">Main</span>}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="remove-image-btn"
                          >
                            ×
                          </button>
                          {imageErrors[index] && (
                            <div className="image-error">{imageErrors[index]}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* URL Upload */}
                  <div className="url-upload-section">
                    <h5>Or add images by URL</h5>
                    <p className="form-text">Paste image URLs from the web</p>
                    
                    {imageUrls.map((url, index) => (
                      <div key={index} className="url-input-group">
                        <div className="row">
                          <div className="col-md-10">
                            <input
                              type="url"
                              value={url}
                              onChange={(e) => handleUrlChange(index, e.target.value)}
                              className={`form-control ${urlErrors[index] ? 'is-invalid' : ''}`}
                              placeholder="https://example.com/image.jpg"
                            />
                            {urlErrors[index] && (
                              <div className="invalid-feedback">{urlErrors[index]}</div>
                            )}
                          </div>
                          <div className="col-md-2">
                            {imageUrls.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeUrlField(index)}
                                className="btn btn-danger btn-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addUrlField}
                      className="btn btn-secondary btn-sm"
                    >
                      Add Another URL
                    </button>

                    {/* URL Previews */}
                    {urlPreviews.some(p => p) && (
                      <div className="image-previews">
                        {urlPreviews.map((preview, index) => preview && (
                          <div key={`url-${index}`} className="image-preview">
                            <img src={preview} alt={`URL Preview ${index + 1}`} />
                            {index === 0 && imagePreviews.length === 0 && <span className="primary-badge">Main</span>}
                            <span className="url-badge">URL</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Specifications */}
                <div className="form-section">
                  <h4>Specifications (Optional)</h4>
                  <p className="form-text">Add technical details or features</p>
                  
                  {specifications.map((spec, index) => (
                    <div key={index} className="specification-row">
                      <div className="row">
                        <div className="col-md-5">
                          <input
                            type="text"
                            placeholder="Specification name (e.g., Brand, Model)"
                            value={spec.name}
                            onChange={(e) => handleSpecChange(index, 'name', e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-5">
                          <input
                            type="text"
                            placeholder="Value (e.g., Apple, iPhone 12)"
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
                              className="btn btn-danger btn-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="btn btn-secondary btn-sm"
                  >
                    Add Specification
                  </button>
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-success btn-lg"
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Adding Product...
                      </>
                    ) : (
                      'Add Product'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="btn btn-secondary btn-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
