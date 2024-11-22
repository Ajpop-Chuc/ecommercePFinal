import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Paper, Typography } from '@material-ui/core';
import { Person as PersonIcon } from '@material-ui/icons'; // Ícono de persona
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
      await axios.post('http://localhost:4000/api/suppliers', proveedor);
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
    <div style={{
      background: 'linear-gradient(to right, #77B5FE, #3A82DC)', // Fondo degradado más suave
      minHeight: '100vh', // Aseguramos que el fondo cubra toda la pantalla
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Container maxWidth="sm">
        <Paper
          style={{
            padding: '30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: '10px',
            backgroundColor: '#fff', // Fondo blanco para el formulario
            width: '100%',
          }}
        >
          {/* Ícono de persona */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
              backgroundColor: '#3A82DC', // Mismo tono de azul más suave
              borderRadius: '50%',
              padding: '20px',
              color: '#fff',
            }}
          >
            <PersonIcon style={{ fontSize: '50px' }} />
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Typography variant="h5" align="center" style={{ marginBottom: '20px', color: '#3A82DC' }}>
              Crear Proveedor
            </Typography>

            <Grid container spacing={3}>
              {/* Campo para el nombre del proveedor */}
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Nombre"
                  value={proveedor.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  style={{ marginBottom: '20px' }}
                />
              </Grid>

              {/* Campo para el email del proveedor */}
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  value={proveedor.contactInfo.email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  type="email"
                  variant="outlined"
                  style={{ marginBottom: '20px' }}
                />
              </Grid>

              {/* Campo para el teléfono del proveedor */}
              <Grid item xs={12}>
                <TextField
                  name="phone"
                  label="Teléfono"
                  value={proveedor.contactInfo.phone}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  style={{ marginBottom: '20px' }}
                />
              </Grid>

              {/* Campo para la dirección del proveedor */}
              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Dirección"
                  value={proveedor.contactInfo.address}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  style={{ marginBottom: '20px' }}
                />
              </Grid>

              {/* Botón para enviar el formulario */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    textTransform: 'none',
                    borderRadius: '25px',
                  }}
                >
                  Crear Proveedor
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default ProveedorCrearForm;
