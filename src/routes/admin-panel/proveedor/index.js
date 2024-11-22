import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@material-ui/core';
import axios from 'axios';

const ProveedoresTabla = ({ onEdit }) => {
  const [proveedores, setProveedores] = useState([]);

  // Cargar datos desde el backend
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/suppliers'); // Ruta de tu API
        setProveedores(response.data.suppliers); // Asumimos que el backend devuelve un array de proveedores
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
      }
    };
    fetchProveedores();
  }, []);

  // Eliminar un proveedor
  const deleteProveedor = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/suppliers/${id}`); // Ruta de eliminación
      setProveedores(proveedores.filter((proveedor) => proveedor._id !== id));
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Productos Suministrados</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {proveedores.map((proveedor) => (
            <TableRow key={proveedor._id}>
              <TableCell>{proveedor.name}</TableCell>
              <TableCell>{proveedor.contactInfo?.email || 'N/A'}</TableCell>
              <TableCell>{proveedor.contactInfo?.phone || 'N/A'}</TableCell>
              <TableCell>{proveedor.contactInfo?.address || 'N/A'}</TableCell>
              <TableCell>
                {proveedor.productsSupplied?.length > 0
                  ? proveedor.productsSupplied.join(', ')
                  : 'Sin productos'}
              </TableCell>
              <TableCell>
                <Button onClick={() => onEdit(proveedor)} color="primary">
                  Editar
                </Button>
                <Button
                  onClick={() => deleteProveedor(proveedor._id)}
                  color="secondary"
                >
                  Desactivar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProveedoresTabla;
