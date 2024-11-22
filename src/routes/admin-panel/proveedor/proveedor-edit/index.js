import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';  // useParams para obtener el ID de la URL
import axios from 'axios';

const ProveedorEditarForm = () => {
  const { id } = useParams();  // Obtenemos el ID del proveedor de la URL
  const [proveedor, setProveedor] = useState({
    name: '',
    contactInfo: {
      email: '',
      phone: '',
      address: '',
    },
    productsSupplied: [],  // Este campo es opcional y puede estar vacío
  });
  const history = useHistory();

  // Cargar los datos del proveedor cuando el componente se monta
  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/suppliers/${id}`);
        setProveedor(response.data);  // Cargamos los datos del proveedor
      } catch (error) {
        console.error('Error al obtener proveedor:', error);
        alert('No se pudo cargar el proveedor.');
      }
    };
    fetchProveedor();
  }, [id]);  // Solo se ejecuta cuando el ID cambia

  // Manejar los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (['email', 'phone', 'address'].includes(name)) {
      setProveedor((prev) => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [name]: value },
      }));
    } else {
      setProveedor({ ...proveedor, [name]: value });
    }
  };

  // Manejar el envío del formulario para actualizar el proveedor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/suppliers/${id}`, proveedor);
      alert('Proveedor actualizado exitosamente');
      history.push('/proveedores');  // Redirigir a la lista de proveedores
    } catch (error) {
      console.error('Error al actualizar el proveedor:', error);
      alert('Ocurrió un error al intentar actualizar el proveedor.');
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
            Actualizar Proveedor
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProveedorEditarForm;
