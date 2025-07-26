import React, { useState, ImgHTMLAttributes } from 'react';
import { Bookmark } from 'lucide-react';

interface ImageWithFallbackProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError' | 'onLoad'> {
  src: string;
  alt: string;
  fallbackIcon?: React.ReactNode;
  fallbackText?: string;
  className?: string;
  fallbackClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackIcon = <Bookmark className="h-16 w-16 text-gray-400" />,
  fallbackText = "Gambar tidak tersedia",
  className = "",
  fallbackClassName = "flex items-center justify-center bg-gray-100 dark:bg-gray-800",
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  if (imageError || !src) {
    return (
      <div className={`${fallbackClassName} ${className}`}>
        <div className="text-center">
          {fallbackIcon}
          {fallbackText && (
            <p className="text-gray-500 text-sm mt-2">{fallbackText}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        {...props}
      />
      {!imageLoaded && (
        <div className={`absolute inset-0 ${fallbackClassName} animate-pulse`}>
          <div className="text-center">
            <div className="h-16 w-16 bg-gray-300 rounded mx-auto mb-2"></div>
            <div className="h-4 w-24 bg-gray-300 rounded mx-auto"></div>
          </div>
        </div>
      )}
    </>
  );
};
