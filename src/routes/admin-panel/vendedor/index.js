import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@material-ui/core';
import firebase from '../../../firebase';

const VendedoresTabla = ({ onEdit }) => {
  const [vendedores, setVendedores] = useState([]);

  useEffect(() => {
    const vendedoresRef = firebase.database().ref('vendedores');
    vendedoresRef.on('value', (snapshot) => {
      const vendedores = snapshot.val();
      const vendedoresList = [];
      for (let id in vendedores) {
        vendedoresList.push({ id, ...vendedores[id] });
      }
      setVendedores(vendedoresList);
    });
  }, []);

  const deleteVendedor = (id) => {
    const vendedorRef = firebase.database().ref(`vendedores/${id}`);
    vendedorRef.remove();
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vendedores.map((vendedor) => (
            <TableRow key={vendedor.id}>
              <TableCell>{vendedor.nombre}</TableCell>
              <TableCell>{vendedor.email}</TableCell>
              <TableCell>{vendedor.telefono}</TableCell>
              <TableCell>
                <Button onClick={() => onEdit(vendedor)} color="primary">
                  Editar
                </Button>
                <Button onClick={() => deleteVendedor(vendedor.id)} color="secondary">
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VendedoresTabla;