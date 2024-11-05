import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { 
  SwipeableDrawer,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Badge,
  Paper,
  makeStyles
} from '@material-ui/core';
import {
   ShoppingCart as ShoppingCartIcon,
   Close as CloseIcon,
   ArrowForward,
   LocalMall as LocalMallIcon // Cambiamos ShoppingBag por LocalMall
 } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 380,
    [theme.breakpoints.down('xs')]: {
      width: '100vw',
    },
  },
  drawerPaper: {
    width: 380,
    [theme.breakpoints.down('xs')]: {
      width: '100vw',
    },
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(4, 2),
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.primary.contrastText
  },
  cartContent: {
    height: 'calc(100vh - 260px)',
    overflowY: 'auto',
    padding: theme.spacing(2)
  },
  cartItem: {
    display: 'flex',
    padding: theme.spacing(2, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: theme.shape.borderRadius,
    objectFit: 'cover',
    marginRight: theme.spacing(2)
  },
  itemInfo: {
    flex: 1
  },
  itemActions: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(2)
  },
  quantityButton: {
    padding: 4,
  },
  quantity: {
    padding: theme.spacing(0, 2),
    userSelect: 'none'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2)
  },
  totalItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 0),
    '& > span': {
      color: theme.palette.text.secondary
    }
  },
  totalAmount: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 0),
    '& > span': {
      fontSize: '1.25rem',
      fontWeight: 600
    }
  },
  checkoutButton: {
    marginTop: theme.spacing(2)
  },
  emptyCart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    height: '100%',
    textAlign: 'center',
    '& svg': {
      fontSize: 64,
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(2)
    }
  },
  cartTrigger: {
    position: 'relative'
  },
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  }
}));

const DEFAULT_PLACEHOLDER = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfvXaTBeRRlr3KgzwHb1Dq-4iwk6ic8cqvHg&s';

const ViewCartSlide = () => {
  const classes = useStyles();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const cart = useSelector(state => state.ecommerce.cart);
  const tax = useSelector(state => state.ecommerce.tax);
  const shipping = useSelector(state => state.ecommerce.shipping);
  const dispatch = useDispatch();

  const getSubTotalPrice = () => {
    return cart?.reduce((total, item) => total + item.totalPrice, 0).toFixed(2) || '0.00';
  };

  const getTotalPrice = () => {
    const subtotal = parseFloat(getSubTotalPrice());
    return (subtotal + (shipping || 0) + (tax || 0)).toFixed(2);
  };

  const getImageUrl = (imageUrl) => {
    console.log('getImageUrl - Input imageUrl:', imageUrl); // Log de la URL de entrada
  
    if (!imageUrl) {
      console.log('getImageUrl - No image URL provided, using default:', DEFAULT_PLACEHOLDER);
      return DEFAULT_PLACEHOLDER;
    }
  
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      console.log('getImageUrl - External URL detected:', imageUrl);
      return imageUrl;
    }
  
    if (imageUrl.startsWith('/')) {
      console.log('getImageUrl - Absolute path detected:', imageUrl);
      return imageUrl;
    }
  
    const finalUrl = `/images/${imageUrl}`;
    console.log('getImageUrl - Final processed URL:', finalUrl);
    return finalUrl;
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      dispatch({ type: 'REMOVE_PRODUCT_ITEM', payload: itemToDelete });
    }
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const CartItem = ({ item }) => (
    <div className={classes.cartItem}>
      <img
      src={getImageUrl(item.image)}
      alt={item.name}
      className={classes.itemImage}
      onError={(e) => {
        console.log('Image load error for:', item.name, 'Original src:', e.target.src);
        console.log('Image error details:', {
          itemId: item.id,
          itemName: item.name,
          attemptedImage: item.image
        });
        e.target.src = DEFAULT_PLACEHOLDER;
        console.log('Fallback image set to:', DEFAULT_PLACEHOLDER);
      }}
    />
      <div className={classes.itemInfo}>
        <Typography variant="subtitle1" gutterBottom>
          {item.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          ${item.price.toFixed(2)} x {item.quantity}
        </Typography>
      </div>
      <Typography variant="subtitle1" color="primary">
        ${item.totalPrice.toFixed(2)}
      </Typography>
    </div>
  );

  const EmptyCart = () => (
   <div className={classes.emptyCart}>
     <LocalMallIcon /> {/* Aquí usamos LocalMallIcon en lugar de ShoppingBag */}
     <Typography variant="h6" gutterBottom>
       Tu carrito está vacío
     </Typography>
     <Typography variant="body2" color="textSecondary" paragraph>
       ¡Agrega algunos productos para comenzar!
     </Typography>
     <Button
       variant="contained"
       color="primary"
       component={Link}
       to="/shop"
       startIcon={<ShoppingCartIcon />}
     >
       Ir a la tienda
     </Button>
   </div>
 );

  return (
    <>
      <IconButton 
        className={classes.cartTrigger}
        onClick={() => setIsOpen(true)}
        color="inherit"
      >
        <Badge 
          badgeContent={cart?.length || 0} 
          color="secondary"
          classes={{ badge: classes.badge }}
        >
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <SwipeableDrawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawer}>
          <Box className={classes.header}>
            <IconButton 
              className={classes.closeButton}
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" align="center" color="common.white">
              Carrito de Compras
            </Typography>
            <Typography variant="subtitle2" align="center">
              {cart?.length || 0} {cart?.length === 1 ? 'item' : 'items'}
            </Typography>
          </Box>

          <div className={classes.cartContent}>
            {cart && cart.length > 0 ? (
              cart.map((item, index) => (
                <CartItem key={index} item={item} />
              ))
            ) : (
              <EmptyCart />
            )}
          </div>

          {cart && cart.length > 0 && (
            <Paper elevation={4} className={classes.footer}>
              <div className={classes.totalItem}>
                <span>Subtotal</span>
                <span>${getSubTotalPrice()}</span>
              </div>
              <div className={classes.totalItem}>
                <span>Envío</span>
                <span>${shipping?.toFixed(2) || '0.00'}</span>
              </div>
              <div className={classes.totalItem}>
                <span>Impuestos</span>
                <span>${tax?.toFixed(2) || '0.00'}</span>
              </div>
              <Divider />
              <div className={classes.totalAmount}>
                <span>Total</span>
                <span>${getTotalPrice()}</span>
              </div>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.checkoutButton}
                onClick={() => {
                  setIsOpen(false);
                  history.push('/payment');
                }}
                endIcon={<ArrowForward />}
              >
                Proceder al pago
              </Button>
            </Paper>
          )}
        </div>
      </SwipeableDrawer>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Eliminar producto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este producto del carrito?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewCartSlide;