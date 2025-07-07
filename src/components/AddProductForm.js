import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { getCategories, addProductWithImages } from "../lib/productQueries";
import {
  validateImageFile,
  processAllProductImages,
} from "../lib/storageHelpers";
import "./AddProductForm.css";

export default function AddProductForm({ onSuccess }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    price: "",
    original_price: "",
    condition: "Good",
    is_negotiable: false,
    location: "",
  });
  // Image handling
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageErrors, setImageErrors] = useState([]);

  // Load categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image file selection
  const handleImageSelect = async (e) => {
    console.log("handleImageSelect called");
    const files = Array.from(e.target.files);
    console.log("Selected files:", files);

    if (files.length === 0) return;

    setImageErrors([]);
    const newPreviews = [];
    const newFiles = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`Processing file ${i}:`, file.name, file.type, file.size);

      // Validate file
      const validation = validateImageFile(file);
      console.log(`Validation result for ${file.name}:`, validation);
      if (!validation.valid) {
        errors[i] = validation.error;
        console.log(`Validation failed for ${file.name}:`, validation.error);
        continue;
      }

      try {
        // Create preview
        const preview = URL.createObjectURL(file);
        newPreviews[i] = preview;
        newFiles[i] = file;
        console.log(`Preview created for ${file.name}:`, preview);
      } catch (error) {
        errors[i] = "Failed to process image";
        console.error("Error processing image:", error);
      }
    }

    console.log("New previews:", newPreviews.filter(Boolean));
    console.log("New files:", newFiles.filter(Boolean));
    console.log("Errors:", errors);

    setImagePreviews((prev) => [...prev, ...newPreviews.filter(Boolean)]);
    setImageFiles((prev) => [...prev, ...newFiles.filter(Boolean)]);
    setImageErrors((prev) => [...prev, ...errors]);
  };

  // Remove image
  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImageErrors((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to add a product");
      return;
    }

    // Validate required fields
    if (!formData.title.trim()) {
      setError("Please enter a product title");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter a product description");
      return;
    }

    if (!formData.category_id) {
      setError("Please select a category");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Please enter a valid price");
      return;
    }

    if (!formData.location.trim()) {
      setError("Please enter a location");
      return;
    }

    if (imageFiles.length === 0) {
      setError("Please add at least one image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Starting product submission...");
      console.log("Form data:", formData);
      console.log("User ID:", user.id);
      console.log("Image files:", imageFiles.length);

      // Prepare product data
      const productData = {
        seller_id: user.id,
        category_id: parseInt(formData.category_id),
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        original_price: formData.original_price
          ? parseFloat(formData.original_price)
          : null,
        condition: formData.condition,
        is_negotiable: formData.is_negotiable || false,
        location: formData.location.trim(),
      };

      console.log("Product data prepared:", productData);

      // Process images
      console.log("Processing images - Files:", imageFiles.length);

      const allImages = await processAllProductImages(
        imageFiles,
        [],
        Date.now()
      );
      console.log("Images processed:", allImages.length);
      // Add product with images
      const product = await addProductWithImages(productData, allImages);
      console.log("Product added successfully:", product);

      setSuccess("Product added successfully!");

      // Call onSuccess callback if provided (from Dashboard)
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        // Redirect to product page after short delay
        setTimeout(() => {
          navigate(`/product/${product.id}`);
        }, 2000);
      }
    } catch (err) {
      console.error("Detailed error adding product:", err);
      console.error("Error message:", err.message);
      console.error("Error details:", err.details);
      console.error("Error hint:", err.hint);

      // More specific error messages
      if (err.message.includes("violates foreign key constraint")) {
        setError(
          "Invalid category selected. Please refresh the page and try again."
        );
      } else if (err.message.includes("duplicate key")) {
        setError(
          "A product with this title already exists. Please use a different title."
        );
      } else if (err.message.includes("permission")) {
        setError(
          "You do not have permission to add products. Please check your account settings."
        );
      } else if (
        err.message.includes("network") ||
        err.message.includes("fetch")
      ) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        setError(
          `Failed to add product: ${err.message || "Please try again."}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content">
      {" "}
      <div className="content-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2>Add New Product</h2>
            <p className="text-muted">
              Create a new product listing for the marketplace
            </p>
          </div>
        </div>
      </div>
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}{" "}
      {success && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          <i className="fas fa-check-circle me-2"></i>
          {success}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          ></button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
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
                        {categories.map((category) => (
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
                  Upload high-quality images. The first image will be your main
                  product photo.
                </p>{" "}
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
                    <p className="upload-subtitle">
                      or drag and drop files here
                    </p>
                    <small className="text-muted">
                      PNG, JPG, GIF up to 10MB each
                    </small>
                  </label>

                  {/* Show image errors */}
                  {imageErrors.length > 0 && (
                    <div className="mt-2">
                      {imageErrors.map(
                        (error, index) =>
                          error && (
                            <div
                              key={index}
                              className="alert alert-danger alert-sm"
                            >
                              <small>
                                File {index + 1}: {error}
                              </small>
                            </div>
                          )
                      )}
                    </div>
                  )}
                </div>
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="image-previews mb-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={`file-${index}`} className="image-preview">
                        <img src={preview} alt={`Preview ${index + 1}`} />
                        {index === 0 && (
                          <span className="primary-badge">Main</span>
                        )}
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
                  </div>
                )}
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
                  <small className="form-text text-muted">
                    Show original price to highlight savings
                  </small>
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
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
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
                    Respond quickly to inquiries
                  </li>
                </ul>{" "}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
