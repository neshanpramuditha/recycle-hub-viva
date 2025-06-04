import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import useTheme from '../../hooks/useTheme';
import './ThemeToggle.css';

const ThemeToggle = ({ className = '', size = 'default', showLabel = false }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const sizeClasses = {
    small: 'theme-toggle--small',
    default: 'theme-toggle--default',
    large: 'theme-toggle--large'
  };

  return (
    <button 
      onClick={toggleTheme}
      className={`theme-toggle ${sizeClasses[size]} ${className}`}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <span className="theme-toggle__icon">
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </span>
      {showLabel && (
        <span className="theme-toggle__label">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
