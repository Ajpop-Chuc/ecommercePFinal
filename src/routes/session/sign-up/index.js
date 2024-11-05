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

export default class SignUp extends Component {
   constructor(props) {
      super(props);
      this.state = {
         name: '',
         lastName: '',
         email: '',
         password: '',
         retypePassword: '',
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

      const { name, lastName, email, password, retypePassword } = this.state;

      if (password !== retypePassword) {
         this.setState({
            openModal: true,
            modalMessage: "Las contraseñas no coinciden",
            isSuccess: false,
         });
         return;
      }

      const data = {
         name,
         lastName,
         username: `${name}${lastName}`, // Puedes ajustar esto según cómo quieras generar el nombre de usuario
         email,
         password,
         type: 'customer', // Tipo quemado como "customer"
      };

      try {
         const token = localStorage.getItem('token');
         await axios.post('http://127.0.0.1:4000/api/users/register/', data, {
            headers: {
               'Authorization': `Bearer ${token}`, // Asegúrate de reemplazar con el token adecuado
               'Content-Type': 'application/json',
            },
         });
         this.setState({
            openModal: true,
            modalMessage: "Registro exitoso!",
            isSuccess: true,
         });
      } catch (error) {
         console.error("Error al registrar:", error.response?.data || error.message);
         this.setState({
            openModal: true,
            modalMessage: "Hubo un error al registrar",
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
         <div className="iron-sign-up-page-wrap">
            <div className="inner-container section-pad bg-base">
               <div className="container">
                  <Grid container spacing={0}>
                     <Grid item xs={12} sm={12} md={10} lg={9} className="mx-auto">
                        <Grid container spacing={0} className="d-flex justify-content-center align-items-center">
                           <Grid item xs={12} sm={12} md={6} lg={6}>
                              <div className="register-image">
                              </div>
                           </Grid>
                           <Grid item xs={12} sm={12} md={6} lg={6}>
                              <div className="iron-sign-up-form form-margin iron-shadow bg-base p-sm-25 py-20 px-15 rounded">
                                 <h4>Enter your details</h4>
                                 <form onSubmit={this.handleSubmit}>
                                    <TextField
                                       required
                                       label="First Name"
                                       name="name"
                                       className="iron-form-input-wrap"
                                       value={this.state.name}
                                       onChange={this.handleChange}
                                    />
                                    <TextField
                                       required
                                       label="Last Name"
                                       name="lastName"
                                       className="iron-form-input-wrap"
                                       value={this.state.lastName}
                                       onChange={this.handleChange}
                                    />
                                    <TextField
                                       required
                                       label="Email"
                                       name="email"
                                       className="iron-form-input-wrap"
                                       type="email"
                                       value={this.state.email}
                                       onChange={this.handleChange}
                                    />
                                    <TextField
                                       required
                                       label="Password"
                                       name="password"
                                       className="iron-form-input-wrap"
                                       type="password"
                                       value={this.state.password}
                                       onChange={this.handleChange}
                                    />
                                    <TextField
                                       required
                                       label="Retype Password"
                                       name="retypePassword"
                                       className="iron-form-input-wrap"
                                       type="password"
                                       value={this.state.retypePassword}
                                       onChange={this.handleChange}
                                    />
                                    <Button type="submit" variant="contained" className="button btn-active btn-lg mb-10">
                                       Sign Up
                                    </Button>
                                 </form>
                                 <span className="text-14 text-capitalize pt-10 d-inline-block">
                                    Already have an account? <Link to="/sign-in">Sign in</Link>
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
