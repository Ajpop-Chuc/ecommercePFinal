import React, { Fragment } from 'react';
import { Accordion, AccordionSummary, AccordionDetails   } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link } from 'react-router-dom';

//connect to store
import { connect } from 'react-redux';

//component
import AddressForm from './components/AddressForm';
import PaymentTabs from './components/PaymentTabs';
import OffersCode from './components/OffersCode';

import PageTitle from '../../../components/widgets/PageTitle';
import ViewCartSlide from '../../../components/widgets/ViewCartSlide';

class PaymentOptions extends React.Component {

   state = {
      expanded: 'panel1',
      stepOneFormValid: false
   };

   //define function for toggle accordion 
   handleChange = panel => (event, expanded) => {
      this.setState({
         expanded: expanded ? panel : false,
      });
   };

   //define function for submit form and open disable accordion 
   handleSubmitFirstForm() {
      this.setState({
         expanded: 'panel2',
         stepOneFormValid: true
      });
   }

   openPanel() {
      this.setState({
         expanded: 'panel3',
         stepOneFormValid: true
      });
   }

   render() {
      const { expanded } = this.state;
      const { cart } = this.props;
      return (
         <div className="payment-option-wrapper">
            <PageTitle
               title="payment information"
            />
            {(cart && cart.length > 0) ?
               (
                  <Fragment>
                     <div className="inner-container section-pad">
                        <div className="container">
                           <div className="view-cart text-right mb-50">
                              <ViewCartSlide />
                           </div>
                           <Accordion
                              className="iron-payment-accordion"
                              expanded={expanded === 'panel1'}
                              onChange={this.handleChange('panel1')}
                           >
                              <AccordionSummary
                                 expandIcon={<ExpandMoreIcon />}
                                 className="payment-title"
                              >
                                 <h4 className="mb-0">enter your shipping address</h4>
                              </AccordionSummary>
                              <AccordionDetails className="payment-detail">
                                 <div className="py-15 w-100">
                                    <AddressForm onSubmit={this.handleSubmitFirstForm.bind(this)} />
                                 </div>
                              </AccordionDetails>
                           </Accordion>
                           <Accordion
                              disabled={!this.state.stepOneFormValid}
                              className="iron-payment-accordion"
                              expanded={expanded === 'panel2'}
                              onChange={this.handleChange('panel2')}
                           >
                              <AccordionSummary
                                 expandIcon={<ExpandMoreIcon />}
                                 className="payment-title"
                              >
                                 <h4 className="mb-0">Unlock Offers or Apply PromoCodes</h4>
                              </AccordionSummary>
                              <AccordionDetails className="d-block payment-detail">
                                 <div className="mb-20">
                                    <OffersCode open={() => this.openPanel()} />
                                 </div>
                              </AccordionDetails>
                           </Accordion>
                           <Accordion
                              disabled={!this.state.stepOneFormValid}
                              className="iron-payment-accordion"
                              expanded={expanded === 'panel3'}
                              onChange={this.handleChange('panel3')}
                           >
                              <AccordionSummary
                                 expandIcon={<ExpandMoreIcon />}
                                 className="payment-title"
                              >
                                 <h4 className="mb-0">Payment Options</h4>
                              </AccordionSummary>
                              <AccordionDetails className="d-block payment-detail">
                                 <div className="mb-20">
                                    <PaymentTabs />
                                 </div>
                              </AccordionDetails>
                           </Accordion>
                        </div>
                     </div>
                  </Fragment>
               )
               :
               (
                  <div className="section-pad text-center">
                     <div className="mb-30">
                        <img src={require("../../../assets/images/empty-cart.png").default} alt="shop-cart" />
                     </div>
                     <h4>Your Shopping Bag is empty.</h4>
                     <Link to='/shop' className="text-capitalize">go for shopping</Link>
                  </div>
               )
            }
         </div>
      )
   }
}

const mapStateToProps = ({ ecommerce }) => {
   const { cart } = ecommerce;
   return { cart };
}

export default connect(mapStateToProps)(PaymentOptions);