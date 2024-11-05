export const getImageUrl = (imageUrl) => {
    console.log('Processing image URL:', imageUrl);
  
    if (!imageUrl) {
      console.log('No image URL provided, using default');
      return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfvXaTBeRRlr3KgzwHb1Dq-4iwk6ic8cqvHg&s';
    }
  
    // Si es un array, toma la primera imagen
    if (Array.isArray(imageUrl)) {
      imageUrl = imageUrl[0];
    }
  
    // Si ya es una URL completa
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      console.log('Using absolute URL:', imageUrl);
      return imageUrl;
    }
  
    // Si comienza con una barra
    if (imageUrl.startsWith('/')) {
      const finalUrl = `/images${imageUrl}`;
      console.log('Using root-relative path:', finalUrl);
      return finalUrl;
    }
  
    // Para rutas relativas
    const finalUrl = `/images/${imageUrl}`;
    console.log('Using relative path:', finalUrl);
    return finalUrl;
  };