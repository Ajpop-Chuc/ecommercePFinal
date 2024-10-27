/**
 * User Registration Page
 */
 /* eslint-disable */
 import React from 'react';
 import { Grid, Button } from '@material-ui/core';
 import Input from '@material-ui/core/Input';
 import TextField from '@material-ui/core/TextField';
 import axios from 'axios';
 import { Link } from 'react-router-dom';
 import addUserImage from '../../../../assets/images/addUserBlue.png'; // Ajusta la ruta según tu estructura de carpetas

 class UserRegister extends React.Component {
    constructor(props) {
       super(props);
       this.state = {
          name: '',
          lastName: '',
          username: '',
          email: '',
          password: '',
          type: 'user',
       };
    }
 
    handleChange = (name) => (event) => {
       this.setState({
          [name]: event.target.value,
       });
    };
 
    handleSubmit = async () => {
       try {
          const { name, lastName, username, email, password, type } = this.state;
          const response = await axios.post('http://127.0.0.1:4000/api/users/register', {
             name,
             lastName,
             username,
             email,
             password,
             type,
          });
          if (response.status === 201) {
             alert('User registered successfully');
          }
       } catch (error) {
          alert('User registration failed');
       }
    };
 
    render() {
       return (
          <div className="iron-user-register-wrap pt-50 px-sm-50 px-md-0">
             <Grid container spacing={4} className="my-0">
                <Grid item xs={12} sm={12} md={10} lg={9} className="py-0 mx-auto">
                   <Grid container spacing={4} className="my-0">
                      <Grid item xs={12} sm={12} md={6} lg={6} className="py-0">
                         <div className="image-container">
                            <img
                               src={addUserImage} // Utiliza la imagen importada
                               alt="User Registration"
                               style={{ width: '100%', height: 'auto', borderRadius: '8px' }} // Ajuste del estilo
                            />
                         </div>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6} className="py-0">
                         <div className="detail-content">
                            <Link to="/admin-panel/admin/users" className="text-14 d-inline-block font-medium py-10 mb-10">Ver usuarios</Link>
                            <form className="user-values">
                               <div className="mb-10">
                                  <h6 className="text-14 mb-0 add-text">Nombres:</h6>
                                  <Input
                                     value={this.state.name}
                                     onChange={this.handleChange('name')}
                                     className="text-capitalize add-user-input"
                                     inputProps={{ 'aria-label': 'Name' }}
                                  />
                               </div>
                               <div className="mb-10">
                                  <h6 className="text-14 mb-0 add-text">Apellidos:</h6>
                                  <Input
                                     value={this.state.lastName}
                                     onChange={this.handleChange('lastName')}
                                     className="text-capitalize add-user-input"
                                     inputProps={{ 'aria-label': 'Last Name' }}
                                  />
                               </div>
                               <div className="mb-10">
                                  <h6 className="text-14 mb-0 add-text">Nombre de usuario:</h6>
                                  <Input
                                     value={this.state.username}
                                     onChange={this.handleChange('username')}
                                     className="text-capitalize add-user-input"
                                     inputProps={{ 'aria-label': 'Username' }}
                                  />
                               </div>
                               <div className="mb-10">
                                  <h6 className="text-14 mb-0 add-text">Correo:</h6>
                                  <Input
                                     type="email"
                                     value={this.state.email}
                                     onChange={this.handleChange('email')}
                                     className="text-capitalize add-user-input"
                                     inputProps={{ 'aria-label': 'Email' }}
                                  />
                               </div>
                               <div className="mb-10">
                                  <h6 className="text-14 mb-0 add-text">Contraseña:</h6>
                                  <Input
                                     type="text"
                                     value={this.state.password}
                                     onChange={this.handleChange('password')}
                                     className="text-capitalize add-user-input"
                                     inputProps={{ 'aria-label': 'Password' }}
                                  />
                               </div>
                               <div className="mb-10">
                                  <h6 className="text-14 mb-0 add-text">Tipo de usuario:</h6>
                                  <TextField
                                     select
                                     value={this.state.type}
                                     onChange={this.handleChange('type')}
                                     SelectProps={{ native: true }}
                                     className="iron-select-width2 pl-30"
                                  >
                                     <option value="user">Usuario</option>
                                     <option value="admin">Administrador</option>
                                     <option value="employee">Empleado</option>
                                  </TextField>
                               </div>
                            </form>
                            <div className="mb-sm-50 mb-20 detail-btns pl-25">
                               <Button
                                  onClick={this.handleSubmit}
                                  className="button btn-active btn-lg mr-15 mb-20 mb-sm-0"
                               >
                                  Registrar
                               </Button>
                               <Link to="/admin-panel/admin/users" style={{ textDecoration: 'none' }}>
                                    <Button className="button btn-base btn-lg mb-20 mb-sm-0">
                                      Cancelar
                                    </Button>
                                </Link>
                            </div>
                         </div>
                      </Grid>
                   </Grid>
                </Grid>
             </Grid>
          </div>
       );
    }
 }
 
 export default UserRegister;
