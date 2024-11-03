import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class ForgetPassword extends Component {
   constructor(props) {
      super(props);
      this.state = {
         email: '',
         retypeEmail: '',
         newPassword: '',
         openModal: false,
         modalMessage: '',
         isSuccess: false,
      };
   }

   handleChange = (e) => {
      this.setState({ [e.target.name]: e.target.value });
   };

   handleSubmit = async (e) => {
      e.preventDefault();
      const { email, retypeEmail, newPassword } = this.state;

      // Validación para que los correos electrónicos coincidan
      if (email !== retypeEmail) {
         this.setState({
            openModal: true,
            modalMessage: "Los correos electrónicos no coinciden",
            isSuccess: false,
         });
         return;
      }

      const data = {
         email,
         newPassword,
      };

      try {
         const token = localStorage.getItem('token');
         await axios.post('http://127.0.0.1:4000/api/users/reset-password', data, {
            headers: {
               Authorization: `Bearer ${token}`, // Asegúrate de reemplazar con el token adecuado
               'Content-Type': 'application/json',
            },
         });
         this.setState({
            openModal: true,
            modalMessage: "¡Contraseña restablecida exitosamente!",
            isSuccess: true,
         });
      } catch (error) {
         console.error("Error al restablecer la contraseña:", error.response?.data || error.message);
         this.setState({
            openModal: true,
            modalMessage: "Hubo un error al restablecer la contraseña",
            isSuccess: false,
         });
      }
   };

   handleCloseModal = () => {
      this.setState({ openModal: false });
      if (this.state.isSuccess) {
         this.props.history.push('/');
      }
   };

   render() {
      const { openModal, modalMessage } = this.state;
      return (
         <div className="iron-forgot-pwd-page">
            <div className="inner-container section-pad bg-base">
               <div className="container">
                  <Grid container spacing={0}>
                     <Grid item xs={12} sm={12} md={10} lg={9} className="mx-auto">
                        <Grid container spacing={0} className="d-flex justify-content-center align-items-center">
                           <Grid item xs={12} sm={12} md={6} lg={6}>
                              <div className="forgot-password-image">
                              </div>
                           </Grid>
                           <Grid item xs={12} sm={12} md={6} lg={6}>
                              <div className="iron-forgot-pwd-form form-margin iron-shadow bg-base p-sm-25 py-20 px-15 rounded">
                                 <h3 className="active-color">Forgot Password?</h3>
                                 <h4 className="mb-5">No Problem</h4>
                                 <form onSubmit={this.handleSubmit}>
                                    <div className="mb-30">
                                       <TextField
                                          required
                                          label="Enter your email"
                                          name="email"
                                          className="iron-form-input-wrap"
                                          type="email"
                                          autoComplete="current-email"
                                          value={this.state.email}
                                          onChange={this.handleChange}
                                       />
                                    </div>
                                    <div className="mb-30">
                                       <TextField
                                          required
                                          label="Retype your email"
                                          name="retypeEmail"
                                          className="iron-form-input-wrap"
                                          type="email"
                                          autoComplete="current-email"
                                          value={this.state.retypeEmail}
                                          onChange={this.handleChange}
                                       />
                                    </div>
                                    <div className="mb-30">
                                       <TextField
                                          required
                                          label="New Password"
                                          name="newPassword"
                                          className="iron-form-input-wrap"
                                          type="password"
                                          value={this.state.newPassword}
                                          onChange={this.handleChange}
                                       />
                                    </div>
                                    <Button type="submit" variant="contained" className="button btn-active btn-lg mb-15">
                                       Submit
                                    </Button>
                                 </form>
                                 <span className="d-block text-14">
                                    If you have an account, then <Link to="/sign-in">Sign In</Link>
                                 </span>
                              </div>
                           </Grid>
                        </Grid>
                     </Grid>
                  </Grid>
               </div>
            </div>

            {/* Modal */}
            <Dialog open={openModal} onClose={this.handleCloseModal}>
               <DialogTitle>{this.state.isSuccess ? "Success" : "Error"}</DialogTitle>
               <DialogContent>
                  <DialogContentText>{modalMessage}</DialogContentText>
               </DialogContent>
               <DialogActions>
                  <Button onClick={this.handleCloseModal} color="primary">
                     Close
                  </Button>
               </DialogActions>
            </Dialog>
         </div>
      );
   }
}
