import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Button, 
  IconButton, 
  Card, 
  CardContent, 
  CardMedia,
  Typography,
  Container,
  Box,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { 
  Favorite, 
  FavoriteBorder, 
  ShoppingCart, 
  Visibility,
  ArrowForward 
} from '@material-ui/icons';

// Components
import RatingStar from '../../components/widgets/RatingStar';
import CurrencyIcon from '../../components/global/currency/CurrencyIcon';
import PostDetail from '../../components/templates/post-detail';
import PageTitle from '../../components/widgets/PageTitle';
import ContentLoader from '../../components/global/loaders/ContentLoader';

// Actions
import { addProductItem, showAlert, addToWishlist } from "../../actions/action";

// Helpers
import { isProductExist, productExitsInWishlist } from "../../helpers";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default
  },
  productCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4]
    }
  },
  mediaWrapper: {
    position: 'relative',
    paddingTop: '100%', // 1:1 Aspect ratio
    backgroundColor: theme.palette.grey[100],
    '&:hover $mediaOverlay': {
      opacity: 1
    }
  },
  media: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  mediaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    padding: theme.spacing(1)
  },
  favoriteButton: {
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.background.paper
    }
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2)
  },
  productName: {
    marginBottom: theme.spacing(1),
    fontWeight: 500,
    color: theme.palette.text.primary,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  priceRating: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2)
  },
  price: {
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: '1.1rem'
  },
  cartButton: {
    marginTop: 'auto',
    alignSelf: 'flex-end'
  },
  relatedSection: {
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(6, 0)
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    '& h2': {
      fontWeight: 600,
      marginBottom: theme.spacing(1)
    }
  },
  showAllButton: {
    marginTop: theme.spacing(4)
  }
}));

function ProductList({ data, onProductAddToCart, onProductAddToWhislist }) {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={6} md={6} lg={3}>
      <Card className={classes.productCard}>
        <div className={classes.mediaWrapper}>
          <Link to={`/products/${data._id}`}>
            <CardMedia
              component="img"
              className={classes.media}
              image={data.images[0]}
              title={data.name}
            />
          </Link>
          <div className={classes.mediaOverlay}>
            <IconButton 
              className={classes.favoriteButton}
              onClick={onProductAddToWhislist}
              size="small"
            >
              {productExitsInWishlist(data._id) ? 
                <Favorite color="secondary" /> : 
                <FavoriteBorder />
              }
            </IconButton>
          </div>
        </div>
        <CardContent className={classes.content}>
          <Link to={`/products/${data._id}`} className={classes.productName}>
            <Typography variant="h6" noWrap>
              {data.name}
            </Typography>
          </Link>
          <div className={classes.priceRating}>
            <Typography className={classes.price}>
              <CurrencyIcon /> {data.price}
            </Typography>
            <RatingStar />
          </div>
          <div className={classes.cartButton}>
            {!isProductExist(data._id) ? (
              <IconButton 
                color="primary" 
                onClick={onProductAddToCart}
              >
                <ShoppingCart />
              </IconButton>
            ) : (
              <IconButton 
                component={Link} 
                to='/cart' 
                color="primary"
              >
                <Visibility />
              </IconButton>
            )}
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
}

function ProductDetail({ addProductItem, showAlert, addToWishlist }) {
  const classes = useStyles();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:4000/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
      
      const relatedResponse = await fetch(
        `http://127.0.0.1:4000/api/products?category=${data.category}&limit=4`
      );
      const relatedData = await relatedResponse.json();
      setRelatedProducts(relatedData.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error fetching product:', error);
      showAlert('Error loading product details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onAddToCart = (dataItem) => {
    addProductItem(dataItem);
    showAlert('Your product is successfully added!', 'success');
  };

  const addProductToWishList = (dataItem) => {
    addToWishlist(dataItem);
    showAlert('Your product is successfully added to wishlist', 'success');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return <ContentLoader />;
  }

  return (
    <div className={classes.root}>
      <PageTitle title="Product Details" />
      
      <Container maxWidth="lg">
        <Box mb={6}>
          <PostDetail data={product} />
        </Box>
      </Container>

      <div className={classes.relatedSection}>
        <Container maxWidth="lg">
          <div className={classes.sectionTitle}>
            <Typography variant="h4" component="h2">
              You Might Also Like
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Check out these related products
            </Typography>
          </div>

          <Grid container spacing={4}>
            {relatedProducts.map((dataItem) => (
              <ProductList
                key={dataItem._id}
                data={dataItem}
                onProductAddToCart={() => onAddToCart(dataItem)}
                onProductAddToWhislist={() => addProductToWishList(dataItem)}
              />
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" className={classes.showAllButton}>
            <Button
              component={Link}
              to="/accessories"
              variant="contained"
              color="primary"
              endIcon={<ArrowForward />}
              size="large"
            >
              Ver todos los productos
            </Button>
          </Box>
        </Container>
      </div>
    </div>
  );
}

const mapStateToProps = ({ ecommerce }) => {
  const { cart } = ecommerce;
  return { cart };
};

export default connect(mapStateToProps, {
  addToWishlist,
  addProductItem,
  showAlert
})(ProductDetail);