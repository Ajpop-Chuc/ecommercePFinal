import React, { useState, useRef } from 'react';
import { Grid, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getImageUrl } from '../../../util/imageUtils';

//components
import SocialIcons from '../../widgets/SocialIcons';
import CurrencyIcon from '../../global/currency/CurrencyIcon';
import ProductReview from '../../global/review-popup/ProductReview';

// actions
import { addProductItem, showAlert, addToWishlist } from "../../../actions/action";

// helpers
import { isProductExist, productExitsInWishlist } from "../../../helpers";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  productGallery: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  galleryNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  galleryItem: {
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }
  },
  mainImage: {
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    boxShadow: theme.shadows[1],
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }
  },
  detailContent: {
    padding: theme.spacing(2),
  },
  backLink: {
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    fontSize: 14,
    marginBottom: theme.spacing(2),
    display: 'inline-block',
    '&:hover': {
      color: theme.palette.primary.main,
    }
  },
  productTitle: {
    margin: theme.spacing(2, 0),
    fontSize: '1.75rem',
    fontWeight: 600,
  },
  price: {
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
    fontWeight: 600,
    margin: theme.spacing(2, 0),
  },
  infoList: {
    listStyle: 'none',
    padding: 0,
    margin: theme.spacing(2, 0),
    '& li': {
      marginBottom: theme.spacing(1),
      fontSize: 14,
      '& .label': {
        fontWeight: 500,
        marginRight: theme.spacing(1),
      }
    }
  },
  description: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
    lineHeight: 1.6,
  },
  specifications: {
    marginBottom: theme.spacing(3),
    '& h4': {
      marginBottom: theme.spacing(2),
    },
    '& ul': {
      listStyle: 'none',
      padding: 0,
      '& li': {
        marginBottom: theme.spacing(1),
        fontSize: 14,
      }
    }
  },
  variationsForm: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    '& .MuiFormControl-root': {
      minWidth: 120,
    }
  },
  actionButtons: {
    marginBottom: theme.spacing(3),
    '& .MuiButton-root': {
      margin: theme.spacing(0, 1, 1, 0),
    }
  },
  wishlistBtn: {
    marginBottom: theme.spacing(2),
  },
  socialShare: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  }
}));

function PostDetail({ data, addProductItem, addToWishlist, showAlert }) {
   const classes = useStyles();
   const [currentImage, setCurrentImage] = useState(data.images[0]);
   const [variations, setVariations] = useState({
      color: '',
      size: '',
      quantity: 1
   });
   const reviewDialog = useRef();

   const changePreviewImage = (image) => {
      setCurrentImage(image);
   };

   const changeProductVariation = (type, e) => {
      setVariations({
         ...variations,
         [type]: e.target.value
      });
   };

   const postReviewOpen = () => {
      reviewDialog.current.open();
   };

   const addProductToWishList = (productData) => {
      addToWishlist(productData);
      setTimeout(() => {
         showAlert('Your product is successfully added to wishlist', 'success')
      }, 500);
   };

   const onAddToCart = (product) => {
      const productWithVariations = {
         ...product,
         id: product._id || product.objectID || product.id,
         image: product.images?.[0] || product.image || currentImage,
         selectedVariations: variations
      };
      console.log('Adding product to cart:', productWithVariations);
      addProductItem(productWithVariations);
      setTimeout(() => {
         showAlert('Your product is successfully added to cart', 'success')
      }, 500);
   };

   const uniqueColors = [...new Set(data.variations.map(v => v.color))];
   const uniqueSizes = [...new Set(data.variations.map(v => v.size))];

   return (
      <div className={classes.root}>
         <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
            <div className={classes.galleryNav}>
      {data.images.map((image, index) => (
         <div 
           key={index} 
           className={classes.galleryItem}
           onClick={() => changePreviewImage(image)}
         >
            <img 
              src={getImageUrl(image)} 
              alt={`product-item-${index}`}
              onError={(e) => {
                console.log('Error loading thumbnail:', image);
                e.target.src = getImageUrl(null); // usa la imagen por defecto
              }}
            />
         </div>
      ))}
   </div>
   <div className={classes.mainImage}>
      <img 
        src={getImageUrl(currentImage)} 
        alt="main-product"
        onError={(e) => {
          console.log('Error loading main image:', currentImage);
          e.target.src = getImageUrl(null);
        }}
      />
   </div>
            </Grid>

            <Grid item xs={12} md={6}>
               <div className={classes.detailContent}>
                  <Link to="/shop" className={classes.backLink}>
                     Back to shop
                  </Link>
                  
                  <h1 className={classes.productTitle}>{data.name}</h1>
                  
                  <Button 
                     onClick={postReviewOpen}
                     variant="text"
                     color="primary"
                     size="small"
                  >
                     Add a review
                  </Button>

                  <div className={classes.price}>
                     <CurrencyIcon /> {data.price}
                  </div>

                  <ul className={classes.infoList}>
                     <li>
                        <span className="label">Availability:</span>
                        <span style={{ color: data.inventory > 0 ? 'green' : 'red' }}>
                           {data.inventory > 0 ? `In Stock (${data.inventory} items)` : 'Out of Stock'}
                        </span>
                     </li>
                     <li>
                        <span className="label">Category:</span>
                        {data.category}
                     </li>
                     <li>
                        <span className="label">Tags:</span>
                        {data.tags.map((tag, index) => (
                           <span key={index} style={{ marginRight: 8 }}>{tag}</span>
                        ))}
                     </li>
                  </ul>

                  <p className={classes.description}>{data.description}</p>

                  <div className={classes.specifications}>
                     <h4>Specifications:</h4>
                     <ul>
                        {Object.entries(data.specifications).map(([key, value], index) => (
                           <li key={index}>
                              <strong>{key.replace('_', ' ')}</strong>: {value}
                           </li>
                        ))}
                     </ul>
                  </div>

                  <div className={classes.variationsForm}>
                     {data.variations && data.variations.length > 0 && (
                        <>
                           <FormControl variant="outlined">
                              <InputLabel>Color</InputLabel>
                              <Select
                                 value={variations.color}
                                 onChange={(e) => changeProductVariation('color', e)}
                                 label="Color"
                              >
                                 {uniqueColors.map((color, index) => (
                                    <MenuItem key={index} value={color}>{color}</MenuItem>
                                 ))}
                              </Select>
                           </FormControl>
                           <FormControl variant="outlined">
                              <InputLabel>Size</InputLabel>
                              <Select
                                 value={variations.size}
                                 onChange={(e) => changeProductVariation('size', e)}
                                 label="Size"
                              >
                                 {uniqueSizes.map((size, index) => (
                                    <MenuItem key={index} value={size}>{size}</MenuItem>
                                 ))}
                              </Select>
                           </FormControl>
                        </>
                     )}
                     <FormControl variant="outlined">
                        <InputLabel>Quantity</InputLabel>
                        <Select
                           value={variations.quantity}
                           onChange={(e) => changeProductVariation('quantity', e)}
                           label="Quantity"
                        >
                           {[1, 2, 3, 4, 5].map((num) => (
                              <MenuItem key={num} value={num}>{num}</MenuItem>
                           ))}
                        </Select>
                     </FormControl>
                  </div>

                  <div className={classes.wishlistBtn}>
                     {!productExitsInWishlist(data._id) ? (
                        <Button
                           onClick={() => addProductToWishList(data)}
                           variant="outlined"
                           color="primary"
                        >
                           Add To Wishlist
                        </Button>
                     ) : (
                        <Button
                           variant="outlined"
                           disabled
                        >
                           Added To Wishlist
                        </Button>
                     )}
                  </div>

                  <div className={classes.actionButtons}>
                     {!isProductExist(data._id) ? (
                        <Button
                           variant="contained"
                           color="primary"
                           size="large"
                           onClick={() => onAddToCart(data)}
                        >
                           Add to cart
                        </Button>
                     ) : (
                        <Button
                           component={Link}
                           to="/cart"
                           variant="contained"
                           color="primary"
                           size="large"
                        >
                           View cart
                        </Button>
                     )}
                     <Button 
                        component={Link}
                        to="/check-out"
                        variant="outlined"
                        color="primary"
                        size="large"
                     >
                        Buy now
                     </Button>
                  </div>

                  <div className={classes.socialShare}>
                     <span>Share Now:</span>
                     <SocialIcons />
                  </div>
               </div>
            </Grid>
         </Grid>
         <ProductReview ref={reviewDialog} />
      </div>
   );
}

const mapStateToProps = ({ ecommerce }) => {
   const { cart, wishlist } = ecommerce;
   return { cart, wishlist };
};

export default connect(mapStateToProps, {
   addProductItem,
   addToWishlist,
   showAlert
})(PostDetail);