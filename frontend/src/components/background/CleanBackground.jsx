// src/components/background/CleanBackground.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * CleanBackground Component
 * A minimal, professional background that respects dark/light mode.
 * Uses bg-zinc-900 for dark mode and bg-stone-50 for light mode.
 */
const CleanBackground = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`fixed inset-0 transition-colors duration-300 ${
        isDarkMode ? 'bg-zinc-900' : 'bg-neutral-200'
      }`}
      aria-hidden="true"
    />
  );
};

export default CleanBackground;