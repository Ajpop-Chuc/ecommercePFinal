import React, { useState } from 'react';
import { TextField, Button, Grid } from '@material-ui/core';
import axios from 'axios';

const ProveedorCrearForm = () => {
  const [proveedor, setProveedor] = useState({
    name: '',
    contactInfo: {
      email: '',
      phone: '',
      address: '',
    },
    productsSupplied: [], // Opcional, lo dejamos como un array vacío
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Si el campo pertenece a `contactInfo`, actualizamos el objeto anidado
    if (['email', 'phone', 'address'].includes(name)) {
      setProveedor((prev) => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [name]: value },
      }));
    } else {
      setProveedor({ ...proveedor, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Petición al backend para crear un proveedor
      await axios.post('/api/suppliers', proveedor);
      // Reiniciar el formulario después de un envío exitoso
      setProveedor({
        name: '',
        contactInfo: {
          email: '',
          phone: '',
          address: '',
        },
        productsSupplied: [],
      });
      alert('Proveedor creado exitosamente');
    } catch (error) {
      console.error('Error al crear el proveedor:', error);
      alert('Ocurrió un error al intentar crear el proveedor.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Campo para el nombre del proveedor */}
        <Grid item xs={12} sm={6}>
          <TextField
            name="name"
            label="Nombre"
            value={proveedor.name}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>

        {/* Campo para el email del proveedor */}
        <Grid item xs={12} sm={6}>
          <TextField
            name="email"
            label="Email"
            value={proveedor.contactInfo.email}
            onChange={handleInputChange}
            fullWidth
            required
            type="email"
          />
        </Grid>

        {/* Campo para el teléfono del proveedor */}
        <Grid item xs={12} sm={6}>
          <TextField
            name="phone"
            label="Teléfono"
            value={proveedor.contactInfo.phone}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>

        {/* Campo para la dirección del proveedor */}
        <Grid item xs={12} sm={6}>
          <TextField
            name="address"
            label="Dirección"
            value={proveedor.contactInfo.address}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>

        {/* Botón para enviar el formulario */}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Crear Proveedor
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProveedorCrearForm;
