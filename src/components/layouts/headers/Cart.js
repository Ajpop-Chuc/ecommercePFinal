import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import IconButton from "@material-ui/core/IconButton";
import Badge from '@material-ui/core/Badge';
import { connect } from "react-redux";
import { 
   Dialog, 
   DialogTitle, 
   DialogContent, 
   DialogActions, 
   DialogContentText 
} from '@material-ui/core';
import CurrencyIcon from '../../global/currency/CurrencyIcon';
import ConfirmationDialog from '../../global/confirmation-popup';
import { removeProductItem } from '../../../actions/action';
import ProductImage from '../../common/ProductImage';

// PayPal configuration constants
const PAYPAL_CLIENT_ID = "ARRA3T3Mmd2KujxvoCVGbtp2QrFaD1_ofYR5EU1nzSPCQ6KVpVcjIaIJGPdkXok17A7piny14eOH-rt0";
const PAYPAL_CURRENCY = "USD";

const Cart = ({ cart = [], removeProductItem }) => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showPayPalDialog, setShowPayPalDialog] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const paypalButtonsRef = useRef(null);
  const [paypalButtonsRendered, setPaypalButtonsRendered] = useState(false);
  
  const open = Boolean(anchorEl);

  // Load the PayPal script
  useEffect(() => {
    const loadPayPalScript = () => {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${PAYPAL_CURRENCY}`;
      script.async = true;
      
      script.onload = () => {
        setPaypalLoaded(true);
      };
      
      document.body.appendChild(script);
    };
    
    if (!document.querySelector('script[src*="paypal"]')) {
      loadPayPalScript();
    }
    
    return () => {
      const paypalScript = document.querySelector('script[src*="paypal"]');
      if (paypalScript) {
        document.body.removeChild(paypalScript);
      }
      setPaypalButtonsRendered(false);
    };
  }, []);

  // Render PayPal buttons
  useEffect(() => {
    if (paypalLoaded && showPayPalDialog && !paypalButtonsRendered && paypalButtonsRef.current) {
      if (window.paypal) {
        const PayPalButtons = window.paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'paypal'
          },

          createOrder: async () => {
            try {
              const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  items: cart,
                  total: calculateTotal(),
                  currency: PAYPAL_CURRENCY
                })
              });
              
              const orderData = await response.json();
              return orderData.id;
            } catch (err) {
              console.error('Error creating PayPal order:', err);
              throw err;
            }
          },

          onApprove: async (data, actions) => {
            try {
              const response = await fetch('/api/complete-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  orderId: data.orderID
                })
              });
              
              const orderDetails = await response.json();
              
              // Handle successful payment
              handleClose();
              setShowPayPalDialog(false);
              
              // Redirect to success page
              history.push('/order-success', { state: { orderDetails } });
              
            } catch (err) {
              console.error('Error completing PayPal order:', err);
              throw err;
            }
          },

          onError: (err) => {
            console.error('PayPal Error:', err);
            // Handle error state
          }
        });

        // Check if PayPal Buttons are eligible before rendering
        if (PayPalButtons.isEligible()) {
          PayPalButtons.render(paypalButtonsRef.current).then(() => {
            setPaypalButtonsRendered(true);
          });
        }
      } else {
        console.error('PayPal SDK not loaded yet.');
      }

      // Cleanup when the dialog is closed
      return () => {
        if (paypalButtonsRef.current) {
          paypalButtonsRef.current.innerHTML = '';
          setPaypalButtonsRendered(false);
        }
      };
    }
  }, [paypalLoaded, showPayPalDialog, cart, history, paypalButtonsRendered]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.totalPrice || 0), 0);
  };

  const handlePaymentClick = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setShowLoginDialog(true);
    } else {
      setPaypalButtonsRendered(false); // Reset the render state
      setShowPayPalDialog(true);
    }
  };

  const handleLoginDialogClose = () => {
    setShowLoginDialog(false);
    handleClose();
    history.push('/');
  };

  const handlePayPalDialogClose = () => {
    setShowPayPalDialog(false);
    setPaypalButtonsRendered(false);
  };

  return (
    <div className="iron-cart-wrap">
      <IconButton
        color="inherit"
        aria-owns={open ? 'simple-popper' : undefined}
        aria-haspopup="true"
        variant="contained"
        onClick={handleClick}
        className="icon-btn mr-10"
      >
        {cart.length > 0 ? (
          <Badge badgeContent={cart.length} color="secondary" overlap="rectangular">
            <i className="material-icons">shopping_cart</i>
          </Badge>
        ) : (
          <i className="material-icons">shopping_cart</i>
        )}
      </IconButton>

      <Popover
        id="simple-popper"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            width: 320,
            maxHeight: 400
          }
        }}
      >
        {cart.length > 0 ? (
          <Fragment>
            <ul className="p-0 m-0" style={{ listStyle: 'none' }}>
              {cart.map((cartItem, index) => (
                <li key={index} style={{
                  padding: '12px',
                  borderBottom: '1px solid #eee',
                  backgroundColor: 'white'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: 60,
                      height: 60,
                      marginRight: 12,
                      overflow: 'hidden',
                      borderRadius: 4,
                      backgroundColor: '#f5f5f5'
                    }}>
                      <ProductImage
                        src={cartItem.image}
                        alt={cartItem.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h6 style={{
                        margin: '0 0 4px 0',
                        fontSize: '14px',
                        fontWeight: 500
                      }}>
                        {cartItem.name}
                      </h6>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '14px' }}>
                          <CurrencyIcon /> {cartItem.totalPrice?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div style={{ padding: '12px' }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handlePaymentClick}
              >
                Proceder al pago ({PAYPAL_CURRENCY} {calculateTotal().toFixed(2)})
              </Button>
            </div>
          </Fragment>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <i className="material-icons" style={{ fontSize: 48, color: '#999', marginBottom: 12 }}>
              shopping_cart
            </i>
            <p style={{ margin: 0, color: '#666' }}>
              No hay productos en el carrito
            </p>
          </div>
        )}
      </Popover>

      {/* Login Dialog */}
      <Dialog
        open={showLoginDialog}
        onClose={handleLoginDialogClose}
      >
        <DialogTitle>Inicio de sesión requerido</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Para continuar con el pago, necesitas iniciar sesión primero.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleLoginDialogClose} 
            color="primary"
            variant="contained"
          >
            Ir a inicio de sesión
          </Button>
        </DialogActions>
      </Dialog>

      {/* PayPal Dialog */}
      <Dialog
        open={showPayPalDialog}
        onClose={handlePayPalDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Pago con PayPal</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginBottom: '20px' }}>
            Total a pagar: {PAYPAL_CURRENCY} {calculateTotal().toFixed(2)}
          </DialogContentText>
          <div id="paypal-button-container" ref={paypalButtonsRef} style={{ minHeight: '150px' }} />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handlePayPalDialogClose} 
            color="primary"
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = ({ ecommerce }) => {
  const { cart = [] } = ecommerce;
  return { cart };
};

export default connect(mapStateToProps, {
  removeProductItem
})(Cart);