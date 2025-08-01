import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const TiltedCard = ({
  id,
  title,
  excerpt,
  author,
  date,
  tags = [],
  containerHeight = "350px",
  containerWidth = "300px",
  rotateAmplitude = 10,
  scaleOnHover = 1.05,
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); // Use current theme

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * rotateAmplitude;
    const rotateX = -((y - centerY) / centerY) * rotateAmplitude;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const handleCardClick = () => {
    navigate(`/posts/${id}`);
  };

  const transformStyle = {
    transform: `
      perspective(1000px)
      rotateX(${rotation.x}deg)
      rotateY(${rotation.y}deg)
      scale(${isHovered ? scaleOnHover : 1})
    `,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    height: containerHeight,
    width: containerWidth,
  };

  return (
    <div
      ref={cardRef}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={transformStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      {/* Glassmorphism Card Base */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
          isDarkMode
            ? 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20'
            : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-black/20 shadow-sm'
        }`}
      ></div>

      {/* Inner Glass Effect */}
      <div
        className={`absolute inset-0.5 rounded-2xl transition-all duration-300 ${
          isDarkMode
            ? 'bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm'
            : 'bg-gradient-to-br from-white/50 to-transparent backdrop-blur-sm'
        }`}
      ></div>

      {/* Card Content */}
      <div className="relative h-full flex flex-col p-6 z-10">
        {/* Header */}
        <div className="flex-1">
          <h3
            className={`text-xl font-bold mb-3 line-clamp-2 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-sm mb-4 line-clamp-3 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-900'
            }`}
          >
            {excerpt}
          </p>
        </div>

        {/* Author and Date */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-xs font-medium ${
              isDarkMode ? 'text-blue-300' : 'text-blue-600'
            }`}
          >
            {author}
          </span>
          <span
            className={`text-xs ${
              isDarkMode ? 'text-gray-300' : 'text-gray-800'
            }`}
          >
            {new Date(date).toLocaleDateString()}
          </span>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded-full border transition-all ${
                  isDarkMode
                    ? 'bg-white/15 backdrop-blur-sm border-white/20 text-gray-200'
                    : 'bg-indigo-50 border-indigo-200 text-black'
                }`}
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span
                className={`px-2 py-1 text-xs ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}
              >
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Read More Button */}
        <button
          className={`mt-auto w-full py-2 rounded-lg text-sm font-medium transition-all backdrop-blur-sm border cursor-pointer ${
            isDarkMode
              ? 'bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50'
              : 'bg-black/20 hover:bg-black/30 text-black border-black/30 hover:border-black/50'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          Read More
        </button>
      </div>

      {/* Enhanced Glow Effect on Hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${rotation.y * 2 + 50}% ${rotation.x * 2 + 50}%, ${
            isDarkMode ? 'rgba(96, 165, 250, 0.3)' : 'rgba(99, 102, 241, 0.2)'
          }, transparent 40%)`,
        }}
      ></div>

      {/* Subtle Border Glow */}
      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 ${
          isDarkMode
            ? 'shadow-[0_0_30px_rgba(96,165,250,0.1)] opacity-0 group-hover:opacity-100'
            : 'shadow-[0_0_20px_rgba(99,102,241,0.08)] opacity-0 group-hover:opacity-75'
        }`}
      ></div>
    </div>
  );
};

export default TiltedCard;