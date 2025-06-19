import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAllProducts, getCategories } from "../lib/productQueries";
import "./AIChat.css";

const AIChat = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hi! I'm your AI assistant for Recycle Hub. I can help you find products, answer questions, or assist with buying and selling. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]); // Load product data when component mounts
  useEffect(() => {
    const loadProductData = async () => {
      if (!isDataLoaded) {
        try {
          const [products, cats] = await Promise.all([
            getAllProducts(),
            getCategories(),
          ]);

          // Get more comprehensive product data, but limit to prevent API overload
          const processedProducts = products.slice(0, 100).map((product) => ({
            ...product,
            // Ensure consistent data structure
            price: product.price || 0,
            category_name: product.category_name || "Uncategorized",
            condition: product.condition || "Good",
            location: product.location || "Sri Lanka",
            seller_name: product.seller_name || "Anonymous Seller",
          }));

          setProductData(processedProducts);
          setCategories(cats);
          setIsDataLoaded(true);

          console.log(
            `AI Assistant loaded ${processedProducts.length} products from ${cats.length} categories`
          );
        } catch (error) {
          console.error("Error loading product data for AI:", error);
          setIsDataLoaded(true); // Set to true even on error to prevent infinite loading
        }
      }
    };

    loadProductData();
  }, [isDataLoaded]);
  // Refresh product data when chat is opened (if data is stale)
  useEffect(() => {
    const refreshProductData = async () => {
      if (isOpen && isDataLoaded) {
        try {
          const products = await getAllProducts();
          const processedProducts = products.slice(0, 100).map((product) => ({
            ...product,
            price: product.price || 0,
            category_name: product.category_name || "Uncategorized",
            condition: product.condition || "Good",
            location: product.location || "Sri Lanka",
            seller_name: product.seller_name || "Anonymous Seller",
          }));
          setProductData(processedProducts);
        } catch (error) {
          console.error("Error refreshing product data:", error);
        }
      }
    };

    if (isOpen && productData.length > 0) {
      // Only refresh if chat is opened and we haven't refreshed in the last 5 minutes
      const lastRefresh = localStorage.getItem("aiChatLastRefresh");
      const now = Date.now();
      if (!lastRefresh || now - parseInt(lastRefresh) > 5 * 60 * 1000) {
        refreshProductData();
        localStorage.setItem("aiChatLastRefresh", now.toString());
      }
    }
  }, [isOpen, isDataLoaded]); // Enhanced product filtering and context creation
  const createProductContext = (userMessage) => {
    const message = userMessage.toLowerCase();
    let relevantProducts = [];

    // Specific product searches (iPhone, Samsung, etc.)
    if (message.includes("iphone")) {
      relevantProducts = productData.filter((p) =>
        p.title?.toLowerCase().includes("iphone")
      );
    } else if (message.includes("samsung")) {
      relevantProducts = productData.filter((p) =>
        p.title?.toLowerCase().includes("samsung")
      );
    } else if (message.includes("laptop")) {
      relevantProducts = productData.filter((p) =>
        p.title?.toLowerCase().includes("laptop")
      );
    } else if (message.includes("phone") || message.includes("mobile")) {
      relevantProducts = productData.filter(
        (p) =>
          p.title?.toLowerCase().includes("phone") ||
          p.title?.toLowerCase().includes("mobile") ||
          p.title?.toLowerCase().includes("samsung") ||
          p.title?.toLowerCase().includes("iphone") ||
          p.title?.toLowerCase().includes("oneplus") ||
          p.title?.toLowerCase().includes("xiaomi")
      );
    }
    // Category-based searches
    else if (message.includes("electronic") || message.includes("computer")) {
      relevantProducts = productData.filter((p) =>
        p.category_name?.toLowerCase().includes("electronic")
      );
    } else if (
      message.includes("furniture") ||
      message.includes("chair") ||
      message.includes("table") ||
      message.includes("sofa")
    ) {
      relevantProducts = productData.filter((p) =>
        p.category_name?.toLowerCase().includes("furniture")
      );
    } else if (
      message.includes("vehicle") ||
      message.includes("car") ||
      message.includes("bike") ||
      message.includes("auto")
    ) {
      relevantProducts = productData.filter((p) =>
        p.category_name?.toLowerCase().includes("vehicle")
      );
    } else if (message.includes("book") || message.includes("education")) {
      relevantProducts = productData.filter((p) =>
        p.category_name?.toLowerCase().includes("book")
      );
    } else if (
      message.includes("cloth") ||
      message.includes("fashion") ||
      message.includes("shoe")
    ) {
      relevantProducts = productData.filter((p) =>
        p.category_name?.toLowerCase().includes("cloth")
      );
    } else if (
      message.includes("sport") ||
      message.includes("fitness") ||
      message.includes("gym")
    ) {
      relevantProducts = productData.filter((p) =>
        p.category_name?.toLowerCase().includes("sport")
      );
    }

    // Filter by location if mentioned
    const sriLankanCities = [
      "colombo",
      "kandy",
      "galle",
      "jaffna",
      "negombo",
      "anuradhapura",
      "kurunegala",
      "ratnapura",
      "batticaloa",
      "matara",
    ];
    const mentionedCity = sriLankanCities.find((city) =>
      message.includes(city)
    );
    if (mentionedCity && relevantProducts.length === 0) {
      relevantProducts = productData.filter((p) =>
        p.location?.toLowerCase().includes(mentionedCity)
      );
    } else if (mentionedCity && relevantProducts.length > 0) {
      relevantProducts = relevantProducts.filter((p) =>
        p.location?.toLowerCase().includes(mentionedCity)
      );
    }

    // Filter by price range if mentioned
    if (message.includes("cheap") || message.includes("low price")) {
      relevantProducts =
        relevantProducts.length > 0
          ? relevantProducts.sort((a, b) => (a.price || 0) - (b.price || 0))
          : productData
              .sort((a, b) => (a.price || 0) - (b.price || 0))
              .slice(0, 10);
    } else if (message.includes("expensive") || message.includes("premium")) {
      relevantProducts =
        relevantProducts.length > 0
          ? relevantProducts.sort((a, b) => (b.price || 0) - (a.price || 0))
          : productData
              .sort((a, b) => (b.price || 0) - (a.price || 0))
              .slice(0, 10);
    }

    // If general search terms, get recent products
    if (
      relevantProducts.length === 0 &&
      (message.includes("show me") ||
        message.includes("what's available") ||
        message.includes("products") ||
        message.includes("items"))
    ) {
      relevantProducts = productData.slice(0, 10);
    }

    // Filter by condition if mentioned
    if (message.includes("excellent") || message.includes("new")) {
      relevantProducts = relevantProducts.filter(
        (p) => p.condition?.toLowerCase() === "excellent"
      );
    } else if (message.includes("good condition")) {
      relevantProducts = relevantProducts.filter(
        (p) => p.condition?.toLowerCase() === "good"
      );
    }

    return relevantProducts.slice(0, 10); // Limit to 10 most relevant products
  };

  // Enhanced statistics calculation
  const calculateProductStats = () => {
    if (productData.length === 0) return {};

    const stats = {
      totalProducts: productData.length,
      categories: [...new Set(productData.map((p) => p.category_name))].filter(
        Boolean
      ),
      locations: [...new Set(productData.map((p) => p.location))].filter(
        Boolean
      ),
      priceRange: {
        min: Math.min(
          ...productData.map((p) => p.price || 0).filter((p) => p > 0)
        ),
        max: Math.max(...productData.map((p) => p.price || 0)),
        average: Math.round(
          productData.reduce((sum, p) => sum + (p.price || 0), 0) /
            productData.length
        ),
      },
      conditionDistribution: productData.reduce((acc, p) => {
        acc[p.condition] = (acc[p.condition] || 0) + 1;
        return acc;
      }, {}),
    };

    return stats;
  };
  const sendMessageToGemini = async (message) => {
    try {
      // Analyze the user's message to determine intent
      const userMessage = message.toLowerCase();

      // Check if user is asking about specific products
      const specificProductQuery =
        userMessage.includes("iphone") ||
        userMessage.includes("samsung") ||
        userMessage.includes("laptop") ||
        userMessage.includes("phone") ||
        userMessage.includes("mobile") ||
        userMessage.includes("computer");

      const isProductQuery =
        specificProductQuery ||
        userMessage.includes("find") ||
        userMessage.includes("show") ||
        userMessage.includes("looking for") ||
        userMessage.includes("need") ||
        userMessage.includes("buy") ||
        userMessage.includes("price") ||
        userMessage.includes("available") ||
        userMessage.includes("search") ||
        userMessage.includes("what do you have") ||
        userMessage.includes("products") ||
        userMessage.includes("items");

      const isGreeting =
        userMessage.match(
          /^(hi|hello|hey|good morning|good afternoon|good evening)$/i
        ) ||
        userMessage === "hi" ||
        userMessage === "hello" ||
        userMessage === "hey";

      let contextData = "";
      let hasResults = false;

      // Only include product data if user is actually asking about products
      if (isProductQuery && !isGreeting) {
        const relevantProducts = createProductContext(message);
        const stats = calculateProductStats();

        if (relevantProducts.length > 0) {
          hasResults = true;
          contextData = `\n\nACTUAL AVAILABLE PRODUCTS (${
            relevantProducts.length
          } found):\n${relevantProducts
            .slice(0, 5)
            .map(
              (p, index) =>
                `${index + 1}. "${p.title}" - LKR ${(
                  p.price || 0
                ).toLocaleString()} | ${p.condition} | ${
                  p.location
                } | Seller: ${p.seller_name}`
            )
            .join("\n")}`;

          if (relevantProducts.length > 5) {
            contextData += `\n... and ${
              relevantProducts.length - 5
            } more similar products`;
          }
        } else {
          contextData = `\n\nSEARCH RESULT: No products found matching "${message}". We currently have ${
            stats.totalProducts
          } products in categories: ${stats.categories?.join(", ")}`;
        }

        contextData += `\n\nSTORE SUMMARY: ${
          stats.totalProducts
        } total products, Price range: LKR ${stats.priceRange?.min?.toLocaleString()} - LKR ${stats.priceRange?.max?.toLocaleString()}`;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${
          import.meta.env.VITE_GOOGLE_AI_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a helpful AI assistant for Recycle Hub, a marketplace for pre-owned items in Sri Lanka.

${contextData}

USER MESSAGE: "${message}"

IMPORTANT RULES:
- For greetings (hi/hello/hey), respond warmly and briefly without mentioning products
- For product queries, ONLY mention products if they appear in "ACTUAL AVAILABLE PRODUCTS" above
- If no products found, clearly state "Sorry, I don't see any [requested item] available right now"
- Be honest about what's actually available vs not available
- Keep responses concise and natural
- Don't make up product information
- If asked about specific items not in the list, say they're not currently available

${
  hasResults
    ? "Use the actual product data above to give specific recommendations."
    : ""
}
${isGreeting ? "This is just a greeting - keep it short and friendly." : ""}

Respond appropriately:`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.6,
              topK: 30,
              topP: 0.8,
              maxOutputTokens: 200,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid response format from Gemini API");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);

      // Provide accurate fallback response
      const userMessage = message.toLowerCase();
      if (userMessage.match(/^(hi|hello|hey)$/i)) {
        return "Hi there! Welcome to Recycle Hub. How can I help you today?";
      }

      const relevantProducts = createProductContext(message);
      if (relevantProducts.length > 0) {
        return `I found ${
          relevantProducts.length
        } products that might interest you:\n\n${relevantProducts
          .slice(0, 3)
          .map(
            (p, i) =>
              `${i + 1}. ${p.title} - LKR ${(p.price || 0).toLocaleString()} (${
                p.condition
              }) in ${p.location}`
          )
          .join(
            "\n"
          )}\n\nBrowse our website to see more details and contact sellers.`;
      }

      if (
        userMessage.includes("iphone") ||
        userMessage.includes("samsung") ||
        userMessage.includes("phone")
      ) {
        return "I don't see any phones matching your request in our current inventory. We have other electronics available though. Would you like to see what's available?";
      }

      return "I'm having trouble with my connection right now. Please browse our categories to see what's available, or try asking again.";
    }
  };
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Validate that we have product data loaded
    if (!isDataLoaded || productData.length === 0) {
      const errorMessage = {
        id: Date.now(),
        type: "ai",
        content:
          "I'm still loading product data. Please wait a moment and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToGemini(userMessage.content);

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Provide a more helpful error response
      const relevantProducts = createProductContext(userMessage.content);
      let errorResponse =
        "I'm having trouble with my AI connection, but I can still help! ";

      if (relevantProducts.length > 0) {
        errorResponse += `I found ${
          relevantProducts.length
        } relevant products:\n\n${relevantProducts
          .slice(0, 3)
          .map(
            (p, i) =>
              `${i + 1}. ${p.title} - LKR ${(p.price || 0).toLocaleString()} (${
                p.condition
              })`
          )
          .join("\n")}\n\nPlease browse the platform for more details.`;
      } else {
        errorResponse +=
          "Please try rephrasing your question or browse our categories directly.";
      }

      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: errorResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: "ai",
        content:
          "Hi! I'm your AI assistant for Recycle Hub. I can help you find products, answer questions, or assist with buying and selling. What would you like to know?",
        timestamp: new Date(),
      },
    ]);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const suggestedQuestions = [
    "Find furniture under LKR 20,000",
    "What's available in Colombo?",
    "How do I sell my items?",
    "What product do you have?",
  ];

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div
        className={`chat-fab ${isOpen ? "active" : ""}`}
        onClick={toggleChat}
      >
        <div className="fab-icon">
          {isOpen ? (
            <i className="fas fa-times"></i>
          ) : (
            <>
              <i className="fas fa-robot"></i>
              <div className="notification-dot"></div>
            </>
          )}
        </div>
        {!isOpen && (
          <div className="fab-tooltip">
            <span>AI Assistant</span>
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? "open" : "closed"}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="ai-avatar">
              <i className="fas fa-robot"></i>
            </div>{" "}
            <div className="chat-title">
              <h4>AI Shopping Assistant</h4>
              <span className="chat-status">
                <span
                  className={`status-indicator ${
                    isDataLoaded ? "online" : "loading"
                  }`}
                ></span>
                {isDataLoaded
                  ? `Online (${productData.length} products loaded)`
                  : "Loading products..."}
              </span>
            </div>
          </div>
          <div className="chat-actions">
            <button
              className="chat-action-btn"
              onClick={clearChat}
              title="Clear chat"
            >
              <i className="fas fa-eraser"></i>
            </button>
            <button
              className="chat-action-btn"
              onClick={toggleChat}
              title="Close chat"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === "ai" ? (
                  <i className="fas fa-robot"></i>
                ) : (
                  <i className="fas fa-user"></i>
                )}
              </div>
              <div className="message-content">
                <div className="message-bubble">{message.content}</div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message ai">
              <div className="message-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="message-content">
                <div className="message-bubble typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="suggested-questions">
            <p>Quick questions:</p>
            <div className="suggestions-grid">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="suggestion-btn"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="chat-input-area">
          <div className="input-container">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              rows="1"
              disabled={isLoading}
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </button>
          </div>
          <div className="powered-by">
            Powered by <span>Google AI Studio</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="chat-overlay" onClick={toggleChat}></div>}
    </>
  );
};

export default AIChat;
