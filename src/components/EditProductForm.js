import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  getCategories, 
  getProductById, 
  updateProduct, 
  updateProductSpecifications
} from '../lib/productQueries';
import { validateImageFile, compressImage, uploadProductImages, saveProductImagesToDB } from '../lib/storageHelpers';
import './AddProductForm.css';

export default function EditProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [originalProduct, setOriginalProduct] = useState(null);

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
  const [existingImages, setExistingImages] = useState([]);

  // Specifications
  const [specifications, setSpecifications] = useState([
    { name: '', value: '' }
  ]);

  // Load product data and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingProduct(true);
        
        // Fetch product data and categories in parallel
        const [productData, categoriesData] = await Promise.all([
          getProductById(parseInt(id)),
          getCategories()
        ]);

        // Check if user owns this product
        if (productData.seller_id !== user?.id) {
          setError('You can only edit your own products');
          return;
        }

        setOriginalProduct(productData);
        setCategories(categoriesData || []);

        // Populate form with existing data
        setFormData({
          title: productData.title || '',
          description: productData.description || '',
          category_id: productData.category_id?.toString() || '',
          price: productData.price?.toString() || '',
          original_price: productData.original_price?.toString() || '',
          condition: productData.condition || 'Good',
          is_negotiable: productData.is_negotiable || false,
          location: productData.location || ''
        });

        // Set existing images
        if (productData.images && productData.images.length > 0) {
          setExistingImages(productData.images);
        }

        // Set existing specifications
        if (productData.specifications && productData.specifications.length > 0) {
          setSpecifications(productData.specifications.map(spec => ({
            name: spec.spec_name || '',
            value: spec.spec_value || ''
          })));
        }

      } catch (err) {
        console.error('Error fetching product data:', err);
        setError('Failed to load product data');
      } finally {
        setLoadingProduct(false);
      }
    };

    if (id && user) {
      fetchData();
    }
  }, [id, user]);

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

  // Remove new image
  const removeImage = (index) => {
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageErrors(prev => prev.filter((_, i) => i !== index));
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
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
      setError('You must be logged in to edit a product');
      return;
    }

    // Check if there are any images (existing or new)
    if (existingImages.length === 0 && imageFiles.length === 0) {
      setError('Please keep at least one image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare updated product data
      const updatedData = {
        title: formData.title,
        description: formData.description,
        category_id: parseInt(formData.category_id),
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        condition: formData.condition,
        is_negotiable: formData.is_negotiable,
        location: formData.location
      };

      // Update product data
      const updatedProduct = await updateProduct(parseInt(id), updatedData);

      // Handle new images if any
      if (imageFiles.length > 0) {
        const uploadedImages = await uploadProductImages(imageFiles, updatedProduct.id);
        
        if (uploadedImages.length > 0) {
          // Combine existing and new images
          const allImages = [
            ...existingImages.map((img, index) => ({
              url: img.image_url,
              path: img.image_url
            })),
            ...uploadedImages
          ];
          
          // Update all images in database
          await saveProductImagesToDB(updatedProduct.id, allImages);
        }
      } else if (existingImages.length !== originalProduct.images?.length) {
        // Only existing images were modified (some removed)
        const remainingImages = existingImages.map((img, index) => ({
          url: img.image_url,
          path: img.image_url
        }));
        
        await saveProductImagesToDB(updatedProduct.id, remainingImages);
      }      // Update specifications
      const validSpecs = specifications.filter(spec => spec.name && spec.value);
      await updateProductSpecifications(updatedProduct.id, validSpecs);

      setSuccess('Product updated successfully!');
      
      // Redirect to product page after short delay
      setTimeout(() => {
        navigate(`/product/${updatedProduct.id}`);
      }, 2000);

    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product data...</p>
      </div>
    );
  }

  if (error && !originalProduct) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="add-product-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="add-product-form">
              <h2>Edit Product</h2>
              
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
                </div>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="form-section">
                    <h4>Current Images</h4>
                    <p className="form-text">These are your current product images. You can remove them or add new ones.</p>
                    
                    <div className="image-previews">
                      {existingImages.map((image, index) => (
                        <div key={`existing-${index}`} className="image-preview">
                          <img 
                            src={image.image_url} 
                            alt={`Product ${index + 1}`}
                            onError={(e) => {
                              e.target.src = '/image/placeholder.svg';
                            }}
                          />
                          {index === 0 && <span className="primary-badge">Main</span>}
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="remove-image-btn"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Images */}
                <div className="form-section">
                  <h4>Add New Images</h4>
                  <p className="form-text">Upload additional images for your product.</p>
                  
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
                      <div>Click to add more images</div>
                      <div className="upload-subtitle">JPEG, PNG, WebP, GIF (max 5MB each)</div>
                    </label>
                  </div>

                  {/* New Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="image-previews">
                      {imagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="image-preview">
                          <img src={preview} alt={`Preview ${index + 1}`} />
                          <span className="new-badge">New</span>
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
                        Updating Product...
                      </>
                    ) : (
                      'Update Product'
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
