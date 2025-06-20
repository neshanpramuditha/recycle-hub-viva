import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  getCategories, 
  addProductWithImages, 
  addProductSpecifications,
  getUserCredits,
  deductCreditsForProduct
} from '../lib/productQueries';
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
  const [profileIncomplete, setProfileIncomplete] = useState(false);  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showAiPanel, setShowAiPanel] = useState(false);
  
  // Credit system state
  const [userCredits, setUserCredits] = useState(0);
  const [creditLoading, setCreditLoading] = useState(false);
  const CREDITS_PER_PRODUCT = 5; // Cost to post one product

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

  // Load user credits
  useEffect(() => {
    const loadCredits = async () => {
      if (user) {
        try {
          setCreditLoading(true);
          const credits = await getUserCredits(user.id);
          setUserCredits(credits);
        } catch (err) {
          console.error('Error loading credits:', err);
        } finally {
          setCreditLoading(false);
        }
      }
    };
    loadCredits();
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

  // AI-powered product details enhancement
  const generateAIProductDetails = async () => {
    if (!formData.title.trim()) {
      setError('Please enter a product title first to use AI enhancement');
      return;
    }

    setAiLoading(true);
    setError('');

    try {
      const selectedCategory = categories.find(cat => cat.id === parseInt(formData.category_id));
      const categoryName = selectedCategory ? selectedCategory.name : 'General';

      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse = generateSmartSuggestions(formData.title, categoryName, formData.condition);
      setAiSuggestions(aiResponse);
      setShowAiPanel(true);

    } catch (err) {
      console.error('Error generating AI suggestions:', err);
      setError('Failed to generate AI suggestions. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };
  // Generate smart suggestions based on product title
  const generateSmartSuggestions = (title, category, condition) => {
    const lowerTitle = title.toLowerCase();
    
    // Smart description generation
    let description = `This ${title} is available for sale in ${condition.toLowerCase()} condition. `;
    
    if (lowerTitle.includes('phone') || lowerTitle.includes('mobile')) {
      description += 'All functions have been tested and are working perfectly. Battery health is good and holds charge well. Screen is clear without any cracks or damage. Perfect for daily use with all accessories included. ';
    } else if (lowerTitle.includes('laptop') || lowerTitle.includes('computer')) {
      description += 'Runs smoothly with excellent performance for work, study, or entertainment. All ports and features are fully functional. Keyboard and trackpad work perfectly. Ideal for students or professionals. ';
    } else if (lowerTitle.includes('car') || lowerTitle.includes('vehicle')) {
      description += 'Well maintained with regular servicing history. All documents are up to date and ready for immediate transfer. Engine runs smoothly with no mechanical issues. ';
    } else if (lowerTitle.includes('bike') || lowerTitle.includes('motorcycle')) {
      description += 'Excellent running condition with regular maintenance. All papers are clear and updated. Perfect for daily commuting with good fuel efficiency. ';
    } else if (lowerTitle.includes('furniture') || lowerTitle.includes('chair') || lowerTitle.includes('table')) {
      description += 'Sturdy construction with quality materials. No damages or major wear. Perfect addition to home or office space. ';
    } else {
      description += 'Well-maintained item with careful usage. All features are functional and in working order. ';
    }
    
    description += 'Serious buyers only. Price is negotiable for quick sale. Contact for more details and viewing arrangement. Cash payment preferred.';

    // Enhanced specifications based on product type
    let specs = [{ name: 'Brand', value: '' }, { name: 'Model', value: '' }];
    
    if (lowerTitle.includes('phone') || lowerTitle.includes('mobile')) {
      specs = [
        { name: 'Brand', value: 'Apple/Samsung/Xiaomi' },
        { name: 'Storage', value: '64GB/128GB/256GB' },
        { name: 'RAM', value: '4GB/6GB/8GB' },
        { name: 'Color', value: 'Black/White/Blue' },
        { name: 'Battery Health', value: '80-95%' },
        { name: 'Screen Size', value: '6.1"/6.7"' }
      ];
    } else if (lowerTitle.includes('laptop') || lowerTitle.includes('computer')) {
      specs = [
        { name: 'Brand', value: 'Dell/HP/Lenovo/Asus' },
        { name: 'Processor', value: 'Intel i5/i7 or AMD Ryzen' },
        { name: 'RAM', value: '8GB/16GB DDR4' },
        { name: 'Storage', value: '256GB/512GB SSD' },
        { name: 'Screen Size', value: '14"/15.6"/17"' },
        { name: 'Graphics', value: 'Integrated/Dedicated' }
      ];
    } else if (lowerTitle.includes('car') || lowerTitle.includes('vehicle')) {
      specs = [
        { name: 'Make', value: 'Toyota/Honda/Nissan' },
        { name: 'Model Year', value: '2015-2023' },
        { name: 'Mileage', value: '20,000-150,000 km' },
        { name: 'Fuel Type', value: 'Petrol/Diesel/Hybrid' },
        { name: 'Transmission', value: 'Manual/Automatic' },
        { name: 'Engine Size', value: '1000cc-2000cc' }
      ];
    } else if (lowerTitle.includes('bike') || lowerTitle.includes('motorcycle')) {
      specs = [
        { name: 'Brand', value: 'Honda/Yamaha/Bajaj/TVS' },
        { name: 'Engine Capacity', value: '100cc-200cc' },
        { name: 'Model Year', value: '2018-2024' },
        { name: 'Mileage', value: '5,000-50,000 km' },
        { name: 'Fuel Type', value: 'Petrol' },
        { name: 'Type', value: 'Standard/Sports/Scooter' }
      ];
    } else if (lowerTitle.includes('furniture')) {
      specs = [
        { name: 'Material', value: 'Wood/Metal/Plastic' },
        { name: 'Color', value: 'Brown/Black/White' },
        { name: 'Dimensions', value: 'Length x Width x Height' },
        { name: 'Condition', value: condition },
        { name: 'Age', value: '1-5 years' }
      ];
    }

    // More accurate price suggestions based on Sri Lankan market
    let priceRange = { min: 5000, max: 15000 };
    
    if (lowerTitle.includes('iphone')) {
      priceRange = { min: 80000, max: 300000 };
    } else if (lowerTitle.includes('samsung galaxy')) {
      priceRange = { min: 40000, max: 200000 };
    } else if (lowerTitle.includes('phone') || lowerTitle.includes('mobile')) {
      priceRange = { min: 15000, max: 100000 };
    } else if (lowerTitle.includes('macbook')) {
      priceRange = { min: 150000, max: 500000 };
    } else if (lowerTitle.includes('laptop')) {
      priceRange = { min: 60000, max: 250000 };
    } else if (lowerTitle.includes('car')) {
      priceRange = { min: 800000, max: 5000000 };
    } else if (lowerTitle.includes('bike') || lowerTitle.includes('motorcycle')) {
      priceRange = { min: 80000, max: 400000 };
    } else if (lowerTitle.includes('furniture')) {
      priceRange = { min: 10000, max: 100000 };
    }

    // Adjust by condition
    const conditionMultipliers = {
      'Excellent': 0.85,
      'Good': 0.70,
      'Fair': 0.55,
      'Poor': 0.35
    };

    const multiplier = conditionMultipliers[condition] || 0.70;
    priceRange.min = Math.round(priceRange.min * multiplier);
    priceRange.max = Math.round(priceRange.max * multiplier);

    return {
      enhanced_description: description,
      specifications: specs,
      suggested_price_range: priceRange,
      keywords: generateContextualKeywords(title, category),
      selling_points: generateContextualSellingPoints(title, condition, category)
    };
  };

  // Generate contextual keywords
  const generateContextualKeywords = (title, category) => {
    const words = title.toLowerCase().split(' ');
    const keywords = [...words, category.toLowerCase()];
    
    // Add Sri Lankan market specific keywords
    keywords.push('sri lanka', 'colombo', 'sale', 'urgent');
    
    if (title.toLowerCase().includes('phone')) {
      keywords.push('mobile', 'smartphone', 'android', 'ios', 'unlocked');
    } else if (title.toLowerCase().includes('laptop')) {
      keywords.push('computer', 'notebook', 'gaming', 'office', 'student');
    } else if (title.toLowerCase().includes('car')) {
      keywords.push('vehicle', 'auto', 'transport', 'family', 'registered');
    }

    return [...new Set(keywords)].slice(0, 10);
  };

  // Generate contextual selling points
  const generateContextualSellingPoints = (title, condition, category) => {
    const points = [
      `${condition} condition with careful usage`,
      'Quick sale preferred - price negotiable',
      'Serious buyers only - time wasters please excuse'
    ];

    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('phone')) {
      points.push('Battery health verified - no heating issues');
      points.push('Original charger and accessories included');
    } else if (lowerTitle.includes('laptop')) {
      points.push('Perfect for work/study - fast performance');
      points.push('Original charger and software included');
    } else if (lowerTitle.includes('car')) {
      points.push('Regular service maintained - no accidents');
      points.push('All documents clear - ready for transfer');
    } else if (lowerTitle.includes('bike')) {
      points.push('Excellent fuel efficiency - low maintenance');
      points.push('All papers updated - immediate transfer');
    }

    return points.slice(0, 5);
  };

  // Apply AI suggestions to form
  const applyAISuggestions = (suggestions) => {
    if (suggestions.enhanced_description) {
      setFormData(prev => ({ ...prev, description: suggestions.enhanced_description }));
    }
    
    if (suggestions.specifications && suggestions.specifications.length > 0) {
      setSpecifications(suggestions.specifications);
    }
    
    if (suggestions.suggested_price_range && !formData.price) {
      const suggestedPrice = Math.round((suggestions.suggested_price_range.min + suggestions.suggested_price_range.max) / 2);
      setFormData(prev => ({ 
        ...prev, 
        price: suggestedPrice.toString(),
        original_price: suggestions.suggested_price_range.max.toString()
      }));
    }
    
    setShowAiPanel(false);
    setSuccess('✨ AI suggestions applied successfully! Review and adjust as needed.');  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to add a product');
      return;
    }    // Check profile completeness
    if (!checkProfileCompleteness()) {
      setError('🚨 Profile Incomplete! Please complete your profile information (full name, phone number, and location) in Dashboard Settings before adding products.');
      return;
    }    // Check if user has enough credits
    if (userCredits < CREDITS_PER_PRODUCT) {
      setError(
        <div>
          <strong>❌ Insufficient Credits!</strong><br/>
          You need {CREDITS_PER_PRODUCT} credits to post a product. You currently have {userCredits} credits.<br/>
          <button 
            className="btn btn-sm btn-outline-primary mt-2"
            onClick={() => navigate('/dashboard?section=credits')}
            type="button"
          >
            <i className="fas fa-coins me-1"></i>Purchase Credits
          </button>
        </div>
      );
      return;
    }
    
    // Validate required fields
    if (!formData.title.trim()) {
      setError('Please enter a product title');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Please enter a product description');
      return;
    }
    
    if (!formData.category_id) {
      setError('Please select a category');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return;
    }
    
    if (!formData.location.trim()) {
      setError('Please enter a location');
      return;
    }
    
    if (imageFiles.length === 0 && imageUrls.filter(url => url.trim()).length === 0) {
      setError('Please add at least one image (file upload or URL)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Starting product submission...');
      console.log('Form data:', formData);
      console.log('User ID:', user.id);
      console.log('Image files:', imageFiles.length);
      console.log('Image URLs:', imageUrls.filter(url => url.trim()));

      // Prepare product data
      const productData = {
        seller_id: user.id,
        category_id: parseInt(formData.category_id),
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        condition: formData.condition,
        is_negotiable: formData.is_negotiable || false,
        location: formData.location.trim()
      };

      console.log('Product data prepared:', productData);
      
      // Process images
      const validUrls = imageUrls.filter(url => url && url.trim());
      console.log('Processing images - Files:', imageFiles.length, 'URLs:', validUrls.length);
      
      const allImages = await processAllProductImages(imageFiles, validUrls, Date.now());
      console.log('Images processed:', allImages.length);      // Add product with images
      const product = await addProductWithImages(productData, allImages);
      console.log('Product added successfully:', product);

      // Deduct credits for posting the product
      try {
        await deductCreditsForProduct(user.id, product.id, CREDITS_PER_PRODUCT);
        console.log(`${CREDITS_PER_PRODUCT} credits deducted for product posting`);
        // Update local credits state
        setUserCredits(prev => prev - CREDITS_PER_PRODUCT);
      } catch (creditError) {
        console.error('Error deducting credits:', creditError);
        // Note: We don't fail the entire operation if credit deduction fails
        // But we should log it for manual review
      }

      // Add specifications if any
      const validSpecs = specifications.filter(spec => spec.name && spec.value);
      if (validSpecs.length > 0) {
        console.log('Adding specifications:', validSpecs);
        await addProductSpecifications(product.id, validSpecs);
        console.log('Specifications added successfully');
      }

      setSuccess('Product added successfully!');
      
      // Redirect to product page after short delay
      setTimeout(() => {
        navigate(`/product/${product.id}`);
      }, 2000);

    } catch (err) {
      console.error('Detailed error adding product:', err);
      console.error('Error message:', err.message);
      console.error('Error details:', err.details);
      console.error('Error hint:', err.hint);
      
      // More specific error messages
      if (err.message.includes('violates foreign key constraint')) {
        setError('Invalid category selected. Please refresh the page and try again.');
      } else if (err.message.includes('duplicate key')) {
        setError('A product with this title already exists. Please use a different title.');
      } else if (err.message.includes('permission')) {
        setError('You do not have permission to add products. Please check your account settings.');
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(`Failed to add product: ${err.message || 'Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // AI Suggestion Handler
  const handleAiSuggest = async () => {
    setAiLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Call your AI service here
      const response = await fetch('/api/ai-suggest-product-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}` // Adjust based on your auth setup
        },
        body: JSON.stringify({
          images: imageUrls.filter(url => url.trim()),
          // Add other relevant data for AI suggestion
        })
      });
      
      if (!response.ok) {
        throw new Error('AI service responded with an error');
      }
      
      const data = await response.json();
      
      // Handle AI response data
      if (data.success) {
        setAiSuggestions(data.suggestions);
        setSuccess('AI suggestions loaded successfully!');
      } else {
        setError(data.message || 'Failed to fetch AI suggestions');
      }
      
    } catch (err) {
      console.error('Error fetching AI suggestions:', err);
      setError('Failed to fetch AI suggestions. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // Apply AI Suggestions
  const handleApplyAiSuggestions = () => {
    if (aiSuggestions) {
      setFormData(prev => ({
        ...prev,
        title: aiSuggestions.title || prev.title,
        description: aiSuggestions.description || prev.description,
        // Map other fields as necessary
      }));
      
      setSuccess('AI suggestions applied to the form');
    } else {
      setError('No AI suggestions available to apply');
    }
  };

  return (
    <div className="dashboard-content">      <div className="content-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2>Add New Product</h2>
            <p className="text-muted">Create a new product listing for the marketplace</p>
          </div>          <div className="credits-display">
            <div className={`credits-card-small ${userCredits < CREDITS_PER_PRODUCT ? 'insufficient-credits' : ''}`}>
              <div className="credits-icon">
                <i className="fas fa-coins"></i>
              </div>
              <div className="credits-info">
                <div className="credits-amount">{userCredits}</div>
                <div className="credits-label">Credits</div>
              </div>
            </div>
            <small className="text-muted d-block mt-1">
              {CREDITS_PER_PRODUCT} credits required per product
            </small>
            {userCredits < CREDITS_PER_PRODUCT && (
              <small className="text-danger d-block">
                <i className="fas fa-exclamation-triangle me-1"></i>
                Insufficient credits
              </small>
            )}
          </div>
        </div>
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
                        placeholder="Enter your city or area"                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Enhancement Card */}
            <div className="card mb-4 border-primary">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-magic me-2"></i>
                  AI Product Enhancement
                </h5>
              </div>
              <div className="card-body">
                <p className="text-muted mb-3">
                  <i className="fas fa-robot me-1"></i>
                  Let AI help you create detailed product descriptions, specifications, and pricing suggestions.
                </p>
                
                <div className="d-grid">
                  <button
                    type="button"
                    onClick={generateAIProductDetails}
                    disabled={aiLoading || !formData.title.trim()}
                    className="btn btn-primary btn-lg"
                  >
                    {aiLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        AI is analyzing your product...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sparkles me-2"></i>
                        Enhance with AI
                      </>
                    )}
                  </button>
                </div>
                
                {!formData.title.trim() && (
                  <small className="text-muted mt-2 d-block">
                    <i className="fas fa-info-circle me-1"></i>
                    Please enter a product title first to use AI enhancement
                  </small>
                )}
              </div>
            </div>

            {/* AI Suggestions Panel */}
            {showAiPanel && aiSuggestions && (
              <div className="card mb-4 border-success">
                <div className="card-header bg-success text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="fas fa-lightbulb me-2"></i>
                      AI Suggestions
                    </h5>
                    <button
                      type="button"
                      onClick={() => setShowAiPanel(false)}
                      className="btn btn-sm btn-outline-light"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <h6><i className="fas fa-file-alt me-2 text-primary"></i>Enhanced Description:</h6>
                      <div className="bg-light p-3 rounded">
                        <p className="mb-0 small">{aiSuggestions.enhanced_description}</p>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <h6><i className="fas fa-list me-2 text-primary"></i>Suggested Specifications:</h6>
                      <div className="bg-light p-3 rounded">
                        {aiSuggestions.specifications.map((spec, index) => (
                          <div key={index} className="small mb-1">
                            <strong>{spec.name}:</strong> {spec.value}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <h6><i className="fas fa-dollar-sign me-2 text-primary"></i>Price Range:</h6>
                      <div className="bg-light p-3 rounded">
                        <div className="small">
                          <strong>Suggested:</strong> Rs. {aiSuggestions.suggested_price_range.min.toLocaleString()} - Rs. {aiSuggestions.suggested_price_range.max.toLocaleString()}
                        </div>
                        <div className="small text-muted mt-1">
                          Average: Rs. {Math.round((aiSuggestions.suggested_price_range.min + aiSuggestions.suggested_price_range.max) / 2).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-12 mb-3">
                      <h6><i className="fas fa-star me-2 text-primary"></i>Key Selling Points:</h6>
                      <div className="bg-light p-3 rounded">
                        <ul className="mb-0 small">
                          {aiSuggestions.selling_points.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      onClick={() => applyAISuggestions(aiSuggestions)}
                      className="btn btn-success"
                    >
                      <i className="fas fa-check me-2"></i>
                      Apply All Suggestions
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAiPanel(false)}
                      className="btn btn-outline-secondary"
                    >
                      <i className="fas fa-times me-2"></i>
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

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
