import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import IconButton from "@material-ui/core/IconButton";
import Badge from '@material-ui/core/Badge';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
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

class Cart extends React.Component {
   constructor(props) {
      super(props);
      this.confirmationDialog = React.createRef();
      this.state = {
         anchorEl: null,
         imageErrors: new Set(),
         showLoginDialog: false,
         showPayPalDialog: false
      };
   }

   loadPayPalScript = () => {
      return new Promise((resolve, reject) => {
         if (window.paypal) {
            resolve();
            return;
         }

         const script = document.createElement('script');
         script.src = `https://www.paypal.com/sdk/js?client-id=ARRA3T3Mmd2KujxvoCVGbtp2QrFaD1_ofYR5EU1nzSPCQ6KVpVcjIaIJGPdkXok17A7piny14eOH-rt0&currency=USD`;
         script.onload = () => resolve();
         script.onerror = () => reject(new Error('Error al cargar PayPal SDK'));
         document.body.appendChild(script);
      });
   };

   renderPayPalButtons = () => {
      const paypalButtonContainer = document.getElementById('paypal-button-container');
      if (!paypalButtonContainer) return;

      paypalButtonContainer.innerHTML = '';
      const { cart } = this.props;
      const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);

      window.paypal.Buttons({
         style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay'
         },

         createOrder: async (data, actions) => {
            try {
               // Correct the return value to 'id' instead of 'orderId'
               const createOrderResponse = await fetch('http://localhost:4000/create_order', {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `${localStorage.getItem('token')}`,
                  },
                  body: JSON.stringify({
                     intent: 'capture',
                     amount: total,

                  }),
               });
               const createOrderData = await createOrderResponse.json();
               return createOrderData.id; // Return the order ID as 'id'
            } catch (error) {
               console.error('Error al crear la orden:', error);
               throw error;
            }
         },

         onApprove: async (data, actions) => {
            alert(total);
            try {
               // Use the full backend URL for consistency
               const completeOrderResponse = await fetch('http://localhost:4000/complete_order', {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `${localStorage.getItem('token')}`,
                  },
                  body: JSON.stringify({
                     order_id: data.orderID,
                     intent: 'capture',
                  }),
               });
               const completeOrderData = await completeOrderResponse.json();

               console.log('Pago completado:', completeOrderData);
               alert('¡Pago completado con éxito!');
               this.setState({ showPayPalDialog: false });
               // Aquí podrías limpiar el carrito
               // this.props.clearCart(); // Necesitarías implementar esta acción
            } catch (error) {
               console.error('Error al procesar el pago:', error);
               alert('Hubo un error al procesar el pago. Por favor intenta de nuevo.');
            }
         },

         onError: (err) => {
            console.error('Error PayPal:', err);
            alert('Hubo un error con PayPal. Por favor intenta de nuevo.');
         }
      }).render('#paypal-button-container');
   };

   handlePaymentClick = () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
         this.setState({ showLoginDialog: true });
      } else {
         this.loadPayPalScript()
            .then(() => {
               this.setState({ showPayPalDialog: true });
               setTimeout(() => {
                  this.renderPayPalButtons();
               }, 0);
            })
            .catch(error => {
               console.error('Error loading PayPal:', error);
               alert('Error al cargar PayPal. Por favor intenta de nuevo.');
            });
         this.handleClose();
      }
   };

   handleClick = event => {
      this.setState({
         anchorEl: event.currentTarget,
      });
   };

   handleClose = () => {
      this.setState({
         anchorEl: null,
      });
   };

   handleLoginDialogClose = () => {
      this.setState({ showLoginDialog: false });
      this.handleClose();
      this.props.history.push('/');
   };

   onDeleteCartItem = (cartItem) => {
      this.cartItem = cartItem;
      this.confirmationDialog.current.openDialog();
   }

   deleteCartItem = (popupResponse) => {
      if (popupResponse && this.cartItem) {
         this.props.removeProductItem(this.cartItem);
         this.cartItem = null;
      }
      this.setState({
         anchorEl: null,
      });
   }

   render() {
      const { anchorEl, showLoginDialog, showPayPalDialog } = this.state;
      const { cart = [] } = this.props;
      const open = Boolean(anchorEl);

      return (
         <div className="iron-cart-wrap">
            <IconButton
               color="inherit"
               aria-owns={open ? 'simple-popper' : undefined}
               aria-haspopup="true"
               variant="contained"
               onClick={this.handleClick}
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
               onClose={this.handleClose}
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
               <div>
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
                                          <IconButton
                                             size="small"
                                             onClick={() => this.onDeleteCartItem(cartItem)}
                                             style={{ padding: 6 }}
                                          >
                                             <i className="material-icons" style={{ fontSize: 18 }}>
                                                delete_outline
                                             </i>
                                          </IconButton>
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
                              onClick={this.handlePaymentClick}
                           >
                              Proceder al pago
                           </Button>
                        </div>
                     </Fragment>
                  ) : (
                     <div style={{
                        padding: '24px',
                        textAlign: 'center'
                     }}>
                        <i className="material-icons" style={{
                           fontSize: 48,
                           color: '#999',
                           marginBottom: 12
                        }}>
                           shopping_cart
                        </i>
                        <p style={{
                           margin: 0,
                           color: '#666'
                        }}>
                           No hay productos en el carrito
                        </p>
                     </div>
                  )}
               </div>
               <ConfirmationDialog
                  ref={this.confirmationDialog}
                  onConfirm={this.deleteCartItem}
               />
            </Popover>

            <Dialog
               open={showLoginDialog}
               onClose={this.handleLoginDialogClose}
            >
               <DialogTitle>Inicio de sesión requerido</DialogTitle>
               <DialogContent>
                  <DialogContentText>
                     Para continuar con el pago, necesitas iniciar sesión primero.
                  </DialogContentText>
               </DialogContent>
               <DialogActions>
                  <Button 
                     onClick={this.handleLoginDialogClose} 
                     color="primary"
                     variant="contained"
                  >
                     Ir a inicio de sesión
                  </Button>
               </DialogActions>
            </Dialog>

            <Dialog
               open={showPayPalDialog}
               onClose={() => this.setState({ showPayPalDialog: false })}
               maxWidth="sm"
               fullWidth
            >
               <DialogTitle>Realizar Pago con PayPal</DialogTitle>
               <DialogContent>
                  <DialogContentText style={{ marginBottom: 20 }}>
                     Total a pagar: ${cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                  </DialogContentText>
                  <div id="paypal-button-container" />
               </DialogContent>
               <DialogActions>
                  <Button 
                     onClick={() => this.setState({ showPayPalDialog: false })}
                     color="primary"
                  >
                     Cancelar
                  </Button>
               </DialogActions>
            </Dialog>
         </div>
      );
   }
}

const mapStateToProps = ({ ecommerce }) => {
   const { cart = [] } = ecommerce;
   return { cart };
};

export default withRouter(
   connect(mapStateToProps, {
      removeProductItem
   })(Cart)
);