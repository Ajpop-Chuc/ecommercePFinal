// src/components/common/ProductImage.jsx
import React, { useState } from 'react';
import { getImageUrl } from '../../util/imageUtils';

const ProductImage = ({ src, alt, className, style }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={hasError ? getImageUrl(null) : getImageUrl(src)}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        console.log('Image load error:', src);
        setHasError(true);
      }}
    />
  );
};

export default ProductImage;