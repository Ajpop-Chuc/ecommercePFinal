import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import IconButton from "@material-ui/core/IconButton";
import Badge from '@material-ui/core/Badge';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import CurrencyIcon from '../../global/currency/CurrencyIcon';
import ConfirmationDialog from '../../global/confirmation-popup';
import { removeProductItem } from '../../../actions/action';
import ProductImage from '../../common/ProductImage'; // Importa el componente ProductImage

class Cart extends React.Component {
   constructor(props) {
      super(props);
      this.confirmationDialog = React.createRef();
      this.state = {
         anchorEl: null,
         imageErrors: new Set()
      };
   }

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
      const { anchorEl } = this.state;
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
                  <Badge badgeContent={cart.length} color="secondary">
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
                              component={Link}
                              to="/payment"
                              onClick={this.handleClose}
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
         </div>
      );
   }
}

const mapStateToProps = ({ ecommerce }) => {
   const { cart = [] } = ecommerce;
   return { cart };
}

export default connect(mapStateToProps, {
   removeProductItem
})(Cart);