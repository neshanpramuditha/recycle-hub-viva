import React, { useState } from "react";
import { FaShoppingCart, FaPlus, FaTag } from "react-icons/fa";
import "./SaleAddItem.css";

export default function SaleAddItem() {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    price: "",
    contact: "",
    location: "",
    description: "",
    condition: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    "Plastic Items",
    "Glass Items",
    "Electronic Devices",
    "Metal/Iron",
    "Books/Paper",
    "Tyres",
    "Other",
  ];

  const conditions = ["Excellent", "Good", "Fair", "Poor", "For Parts Only"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    if (
      formData.itemName &&
      formData.category &&
      formData.price &&
      formData.contact &&
      formData.location
    ) {
      setIsSubmitted(true);
      setTimeout(() => {
        alert("Item added to sale successfully!");
        // Reset form
        setFormData({
          itemName: "",
          category: "",
          price: "",
          contact: "",
          location: "",
          description: "",
          condition: "",
        });
        setSelectedImage(null);
        setIsSubmitted(false);
      }, 1000);
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <div className="add-item-form-container">
      <div className="container-fluid">
        <div className="row min-vh-100">
          <div className="col-lg-3"></div>

          <div className="col-lg-6">
            <div className="form-wrapper">
              <div className="form-header text-center mb-4">
                <FaShoppingCart className="form-icon" />
                <h2>Add Item to Sale</h2>
                <p className="text-muted">
                  List your recyclable item in our marketplace
                </p>
              </div>

              <form onSubmit={handleSubmit} className="add-item-form">
                <div className="row">
                  <div className="col-md-6">
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
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-control"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Price *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaTag />
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
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Condition</label>
                      <select
                        className="form-control"
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                      >
                        <option value="">Select condition</option>
                        {conditions.map((condition, index) => (
                          <option key={index} value={condition}>
                            {condition}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
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
                  </div>

                  <div className="col-md-6">
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
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="4"
                    placeholder="Describe your item in detail - dimensions, weight, quantity, etc."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Upload Images</label>
                  <div className="file-upload-container">
                    <input
                      type="file"
                      id="itemImages"
                      className="form-control"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                    <label htmlFor="itemImages" className="file-upload-label">
                      <FaPlus className="me-2" />
                      Add Images
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
                  className={`btn btn-success w-100 ${
                    isSubmitted ? "loading" : ""
                  }`}
                  disabled={isSubmitted}
                >
                  {isSubmitted ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Adding to Sale...
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="me-2" />
                      Add to Sale
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-3"></div>
        </div>
      </div>
    </div>
  );
}
