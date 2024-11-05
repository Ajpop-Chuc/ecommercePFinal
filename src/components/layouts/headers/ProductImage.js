import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

const ProductImage = ({ 
  product, 
  className = '',
  imgClassName = '',
  fallbackClassName = 'bg-gray-100 flex items-center justify-center p-4'
}) => {
  const [hasError, setHasError] = useState(false);
  
  // If no image URL is provided, show fallback immediately
  if (!product?.image) {
    return (
      <div className={`${className} ${fallbackClassName}`}>
        <ImageOff className="w-8 h-8 text-gray-400" />
        <p className="text-sm text-gray-500 mt-2">{product?.name || 'Product'}</p>
      </div>
    );
  }

  // If there was a previous error loading the image
  if (hasError) {
    return (
      <div className={`${className} ${fallbackClassName}`}>
        <ImageOff className="w-8 h-8 text-gray-400" />
        <p className="text-sm text-gray-500 mt-2">{product.name}</p>
      </div>
    );
  }

  // Try loading the image
  return (
    <img
      // En ProductImage.jsx, modifica la línea de src:
      src={product.image.startsWith('http') ? product.image : `/images/${product.image}`}
      alt={product.name}
      className={`${className} ${imgClassName}`}
      onError={() => {
        console.log(`Image load failed for product: ${product.name}`);
        setHasError(true);
      }}
    />
  );
};

export default ProductImage;