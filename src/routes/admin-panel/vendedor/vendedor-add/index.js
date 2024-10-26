import React, { useState } from 'react';
import { TextField, Button, Grid } from '@material-ui/core';
import firebase from '../../../../firebase';

const VendedorCrearForm = () => {
  const [vendedor, setVendedor] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendedor({ ...vendedor, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const vendedoresRef = firebase.database().ref('vendedores');
    vendedoresRef.push(vendedor);
    setVendedor({ nombre: '', email: '', telefono: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="nombre"
            label="Nombre"
            value={vendedor.nombre}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="email"
            label="Email"
            value={vendedor.email}
            onChange={handleInputChange}
            fullWidth
            required
            type="email"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="telefono"
            label="Teléfono"
            value={vendedor.telefono}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Crear Vendedor
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default VendedorCrearForm;